# Veox Edits – Content-Studio

Projekt von **Veox Edits** (Mailo Heller). Enthält zwei eigenständige Web-Apps
plus das ursprüngliche Prototyp-Spiel – alles über GitHub Pages ausgeliefert.

> Hinweis: Der GitHub-Repo-Name bleibt `kingdome-wolde-v3`, weil davon die
> Live-Adressen (GitHub Pages URLs) abhängen. Der „richtige" Projektname ist
> **Veox Edits** (siehe `package.json`).

## Bestandteile

| Teil | Pfad | Live-Adresse |
|------|------|--------------|
| 💡 **Ideen-App** (Ideen, Übersicht, Rechnungen, Aufträge, Mediathek, Lernen) | `public/ideen/` | `…github.io/kingdome-wolde-v3/ideen/` |
| 🌐 **Studio-Website** | `public/website/` | `…github.io/kingdome-wolde-v3/website/` |
| 🎮 Prototyp-Spiel (React + Vite) | `src/` | `…github.io/kingdome-wolde-v3/` |

Website-Kontakt/Impressum ändert man in `public/website/config.js`.

## Spiel starten (Entwicklung)

## Starten

```
npm install
npm run dev
```

Dann die angezeigte lokale Adresse (z.B. http://localhost:5173) im Browser öffnen.

## Ideen-App (Content & Cut)

Eigenständige PWA zum Ideen sammeln, planen und bis zum fertigen Cut verfolgen.
Liegt unter `public/ideen/` und wird über GitHub Pages mit ausgeliefert:

- **Live:** `https://<dein-user>.github.io/kingdome-wolde-v3/ideen/`
- Läuft ohne Build direkt aus `public/ideen/index.html`.
- Speichert Ideen lokal (localStorage) und kann optional über einen
  **privaten GitHub-Gist** zwischen mehreren Geräten synchronisieren
  (Einstellungen ⚙️ → GitHub-Token mit Scope `gist`).
- Auf dem Handy per „Zum Home-Bildschirm hinzufügen" als App installierbar.
