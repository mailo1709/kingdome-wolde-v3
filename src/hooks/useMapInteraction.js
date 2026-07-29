import { useEffect, useMemo, useRef, useState } from "react";
import { COLS, ROWS, clamp, isoToRC } from "../gameData";

// Owns pan/zoom state plus all pointer/wheel/pinch handling for the map, and
// derives the visible tile range so only on-screen tiles get rendered. Used
// exclusively by GameMap, which is why this lives next to it rather than in
// App.jsx — nothing outside the map needs pan/zoom.
export function useMapInteraction({ perfMode }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 56 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const mapContainerRef = useRef(null);
  const dragRef = useRef({ down: false, dragging: false, sx: 0, sy: 0, px: 0, py: 0 });
  const pointersRef = useRef(new Map());
  const pinchRef = useRef(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setContainerSize({ w: box.width, h: box.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Only the tiles that could actually be visible under the current pan/zoom
  // are rendered — the full grid is far more DOM nodes (each with its own
  // animations/box-shadows) than a phone can push at 60fps.
  const visibleRange = useMemo(() => {
    if (!containerSize.w || !containerSize.h) return { rMin: 0, rMax: ROWS - 1, cMin: 0, cMax: COLS - 1 };
    const margin = perfMode ? 2 : 4;
    const left = -pan.x / zoom, top = -pan.y / zoom;
    const right = (containerSize.w - pan.x) / zoom, bottom = (containerSize.h - pan.y) / zoom;
    // The screen viewport is an axis-aligned rectangle, but isoToRC maps it to
    // a rotated region in row/col space — check all 4 corners, not just 2.
    const corners = [
      isoToRC(left, top), isoToRC(right, top),
      isoToRC(left, bottom), isoToRC(right, bottom),
    ];
    const rVals = corners.map((p) => p.r), cVals = corners.map((p) => p.c);
    return {
      rMin: clamp(Math.floor(Math.min(...rVals)) - margin, 0, ROWS - 1),
      rMax: clamp(Math.ceil(Math.max(...rVals)) + margin, 0, ROWS - 1),
      cMin: clamp(Math.floor(Math.min(...cVals)) - margin, 0, COLS - 1),
      cMax: clamp(Math.ceil(Math.max(...cVals)) + margin, 0, COLS - 1),
    };
  }, [pan.x, pan.y, zoom, containerSize.w, containerSize.h, perfMode]);

  function containerPoint(e) {
    const rect = mapContainerRef.current?.getBoundingClientRect();
    return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
  }
  function pinchGeometry() {
    const pts = [...pointersRef.current.values()].slice(0, 2);
    const dist = Math.max(Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), 1);
    const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    return { dist, mid };
  }
  function onPointerDown(e) {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, containerPoint(e));
    if (pointersRef.current.size === 2) {
      dragRef.current.down = false;
      const { dist, mid } = pinchGeometry();
      pinchRef.current = { startDist: dist, startZoom: zoom, anchorX: (mid.x - pan.x) / zoom, anchorY: (mid.y - pan.y) / zoom };
    } else if (pointersRef.current.size === 1) {
      const p = containerPoint(e);
      dragRef.current = { down: true, dragging: false, sx: p.x, sy: p.y, px: pan.x, py: pan.y };
    }
  }
  function onPointerMove(e) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, containerPoint(e));

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const { dist, mid } = pinchGeometry();
      const newZoom = clamp(pinchRef.current.startZoom * (dist / pinchRef.current.startDist), 0.5, 2.2);
      setZoom(newZoom);
      setPan({ x: mid.x - pinchRef.current.anchorX * newZoom, y: mid.y - pinchRef.current.anchorY * newZoom });
      suppressClickRef.current = true;
      return;
    }

    const d = dragRef.current;
    if (!d.down) return;
    const p = containerPoint(e);
    const dx = p.x - d.sx, dy = p.y - d.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.dragging = true;
    if (d.dragging) setPan({ x: d.px + dx, y: d.py + dy });
  }
  function onPointerUp(e) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (dragRef.current.dragging) suppressClickRef.current = true;
    dragRef.current.down = false; dragRef.current.dragging = false;
    if (pointersRef.current.size === 1) {
      const [remaining] = pointersRef.current.values();
      dragRef.current = { down: true, dragging: true, sx: remaining.x, sy: remaining.y, px: pan.x, py: pan.y };
    }
  }
  function onWheel(e) { e.preventDefault(); setZoom((z) => Math.min(2.2, Math.max(0.5, z - e.deltaY * 0.001))); }
  function resetView() { setZoom(1); setPan({ x: 0, y: 56 }); }

  return {
    zoom, setZoom, pan, mapContainerRef, visibleRange, suppressClickRef,
    onPointerDown, onPointerMove, onPointerUp, onWheel, resetView,
  };
}
