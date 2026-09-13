# kingdome-wolde-v3

Prototyp-Spiel (React + Vite).

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
