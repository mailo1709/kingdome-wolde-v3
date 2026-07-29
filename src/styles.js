// ---------------------------------------------------------------------------
// Shared design tokens (colors, spacing, small reusable style objects) used
// across App.jsx and the components/ folder. Centralized so the same panel/
// button/modal look stays consistent instead of being redefined per file.
// Voxel/Minecraft look (fonts, palette) is unchanged from the original
// inline styles — this only collects the repeated values in one place.
// ---------------------------------------------------------------------------

export const COLORS = {
  bgGradient: "linear-gradient(160deg, #BFE3D6 0%, #8FBFA8 45%, #4C8C6B 100%)",
  panel: "#F3F7EE",
  panelSoft: "rgba(243,247,238,0.7)",
  panelSofter: "rgba(255,255,255,0.55)",
  ink: "#1F3B2C",
  inkMuted: "#5C6B5A",
  body: "#3A3630",
  green: "#254433",
  greenSoft: "rgba(37,68,51,0.18)",
  greenSofter: "rgba(37,68,51,0.12)",
  accent: "#3E6B4A",
  danger: "#7A2E2E",
  dangerSoft: "rgba(122,46,46,0.15)",
  alert: "#E8524A",
  alertText: "#FCEAEA",
  overlay: "rgba(20,30,24,0.65)",
};

export const SPACING = { xs: "4px", sm: "6px", md: "10px", lg: "16px", xl: "22px" };

export const FONT_HEADING = "Cinzel, serif";
export const FONT_BODY = "Inter, sans-serif";

export const zoomBtnStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "8px",
  border: "none",
  background: "rgba(31,59,44,0.85)",
  color: COLORS.panel,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export const menuBtnStyle = {
  padding: "12px 14px",
  minHeight: "44px",
  borderRadius: "8px",
  border: "none",
  background: COLORS.greenSofter,
  color: COLORS.ink,
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
  boxSizing: "border-box",
};

export const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #CBD5C9",
  fontSize: "13px",
  boxSizing: "border-box",
};

export const modalOverlayStyle = (zIndex) => ({
  position: "fixed",
  inset: 0,
  background: COLORS.overlay,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex,
});

export const modalCardStyle = (width) => ({
  background: COLORS.panel,
  borderRadius: "16px",
  padding: "20px",
  width,
  textAlign: "center",
  boxSizing: "border-box",
});

export const modalTitleStyle = {
  fontFamily: FONT_HEADING,
  fontSize: "16px",
  fontWeight: 700,
  color: COLORS.ink,
  marginBottom: "8px",
};
