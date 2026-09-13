/* Inhalte für die Ideen-App: App-Guides, Glossar, Assets.
   Reine Daten – werden von index.html gerendert. Auf Deutsch. */
window.APP_CONTENT = (function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // APP-GUIDES (CapCut, DaVinci Resolve, Premiere Pro)
  // Jede Anleitung: { t: Titel, steps: [Schritte], tip: Profi-Tipp }
  // ---------------------------------------------------------------------------
  const GUIDES = [
    {
      key: "capcut",
      name: "CapCut",
      icon: "📱",
      subtitle: "Kostenlos · Handy, iPad & PC · ideal für Reels, Shorts & TikTok",
      items: [
        {
          t: "Neues Projekt & Videos importieren",
          steps: [
            "App öffnen und auf „Neues Projekt“ tippen.",
            "Clips und Fotos aus der Galerie auswählen (Reihenfolge = Antipp-Reihenfolge).",
            "Unten rechts auf „Hinzufügen“ – die Clips landen auf der Timeline (die Spur unten).",
          ],
          tip: "Seitenverhältnis zuerst festlegen: „Verhältnis“ → 9:16 für Reels/Shorts/TikTok, 16:9 für YouTube, 1:1 für Feed-Posts.",
        },
        {
          t: "Clip schneiden, trennen & löschen",
          steps: [
            "Clip auf der Timeline antippen (er bekommt einen weißen Rahmen).",
            "Den Abspielkopf (die senkrechte weiße Linie) an die gewünschte Stelle schieben.",
            "Unten auf „Teilen“ tippen (Symbol ✂️) – der Clip wird in zwei Teile geschnitten.",
            "Ungewollten Teil antippen → „Löschen“ (Mülleimer 🗑️).",
          ],
          tip: "Ränder kürzen ohne Schneiden: Clip antippen und am linken/rechten weißen Rand nach innen ziehen (Trimmen).",
        },
        {
          t: "Tempo, Zeitlupe & Speed Ramp",
          steps: [
            "Clip auswählen → unten „Tempo“.",
            "„Normal“: gleichmäßig schneller/langsamer (Regler ziehen).",
            "„Kurve“: Speed Ramp – wähle z.B. „Montage“ oder „Held“ für den typischen langsam→schnell-Effekt.",
          ],
          tip: "„Smooth Slow-Mo“ (optische Flussinterpolation) einschalten macht starke Zeitlupen weicher.",
        },
        {
          t: "Übergänge zwischen Clips",
          steps: [
            "Auf das kleine weiße Kästchen ▯ zwischen zwei Clips tippen.",
            "Übergang wählen (z.B. „Auflösen“, „Wischen“).",
            "Dauer unten mit dem Regler einstellen.",
          ],
          tip: "Weniger ist mehr: 1 dezenter Übergang wirkt professioneller als 10 wilde. „Auflösen“ (Crossfade) passt fast immer.",
        },
        {
          t: "Text & automatische Untertitel",
          steps: [
            "Unten „Text“ → „Text hinzufügen“, tippen und Schrift/Farbe/Animation wählen.",
            "Für Untertitel: „Text“ → „Auto-Untertitel“ → Sprache wählen → CapCut schreibt automatisch mit.",
            "Text-Balken auf der Timeline verschieben/verlängern, damit er zur Stelle passt.",
          ],
          tip: "Untertitel erhöhen die Watch-Time massiv – viele schauen ohne Ton. Große, gut lesbare Schrift mit Kontur nutzen.",
        },
        {
          t: "Musik, Sounds & Beat-Sync",
          steps: [
            "Unten „Audio“ → „Sounds“ (CapCut-Bibliothek), „Extrahiert“ (Ton aus einem Video) oder „Von Gerät“.",
            "Lautstärke: Audioclip antippen → „Lautstärke“.",
            "Beat-Sync: Audioclip → „Beat“ → Beats automatisch markieren, dann Cuts auf die Punkte legen.",
          ],
          tip: "Achtung Musikrechte auf anderen Plattformen: Für YouTube lieber lizenzfreie Musik nehmen (siehe Tab „Assets“).",
        },
        {
          t: "Filter, Farbe & Anpassen",
          steps: [
            "Clip wählen → „Filter“ für fertige Looks (Presets).",
            "Oder „Anpassen“ für manuelle Kontrolle: Helligkeit, Kontrast, Sättigung, Temperatur, Schärfe.",
            "Stärke jeweils mit dem Regler dosieren.",
          ],
          tip: "Zuerst „Anpassen“ (korrekte Belichtung/Weißabgleich), dann erst „Filter“ als Stil obendrauf.",
        },
        {
          t: "Effekte & Overlays (Bild-in-Bild)",
          steps: [
            "„Effekte“ → „Video-Effekte“ oder „Body-Effekte“ für Partikel, Glitch usw.",
            "„Overlay“ → „Overlay hinzufügen“ legt ein zweites Video/Bild über das Hauptvideo (PiP).",
            "Overlay mit zwei Fingern skalieren/verschieben.",
          ],
          tip: "Overlays eignen sich für Reaction-Videos, Logos oder eingeblendete Screenshots.",
        },
        {
          t: "Green Screen / Chroma Key",
          steps: [
            "Grünes Video als „Overlay“ hinzufügen.",
            "Overlay antippen → „Chroma Key“.",
            "Farbwähler auf das Grün setzen → „Intensität“ und „Schatten“ anpassen, bis der Hintergrund verschwindet.",
          ],
          tip: "Gleichmäßig ausgeleuchtetes Grün ohne Falten liefert die saubersten Kanten.",
        },
        {
          t: "Keyframes (Bewegung & Zoom)",
          steps: [
            "Clip wählen, Abspielkopf an den Start setzen → Raute-Symbol ◆ „Keyframe hinzufügen“.",
            "Abspielkopf weiterschieben und Größe/Position ändern → zweiter Keyframe entsteht automatisch.",
            "CapCut animiert die Bewegung zwischen beiden Punkten (z.B. langsamer Zoom).",
          ],
          tip: "Ein sanfter Zoom (Ken-Burns-Effekt) macht selbst Standbilder lebendig.",
        },
        {
          t: "Exportieren (richtig für jede Plattform)",
          steps: [
            "Oben rechts auf „Export“ tippen.",
            "Auflösung 1080p (oder 4K), Bildrate 30 fps (60 fps für flüssige Action).",
            "Exportieren – das Video landet in deiner Galerie und kann direkt gepostet werden.",
          ],
          tip: "Reels/TikTok/Shorts: 1080p, 9:16, 30 fps reicht. Höhere Bitrate = bessere Qualität, größere Datei.",
        },
        {
          t: "Symbole in CapCut – kurz erklärt",
          steps: [
            "✂️ Teilen – Clip am Abspielkopf trennen.",
            "🗑️ Löschen – markiertes Element entfernen.",
            "◆ Keyframe – Animationspunkt setzen.",
            "🔊 Lautstärke – Ton lauter/leiser.",
            "▯ (Kästchen zwischen Clips) – Übergang.",
            "↺ / ↻ – Rückgängig / Wiederholen.",
            "⧉ Duplizieren · 🔒 Sperren · ✿ Animation.",
          ],
          tip: "Wenn du ein Symbol nicht findest: Clip antippen – die Werkzeugleiste unten ändert sich je nach ausgewähltem Element.",
        },
      ],
    },

    {
      key: "resolve",
      name: "DaVinci Resolve",
      icon: "🎛️",
      subtitle: "Kostenlose Profi-Software (PC/Mac) · stark in Farbe & Audio",
      items: [
        {
          t: "Die 7 Seiten (Pages) verstehen",
          steps: [
            "Unten in der Leiste wechselst du zwischen den Arbeitsbereichen:",
            "Media = Importieren/Sichten · Cut = schneller Schnitt · Edit = klassischer Schnitt.",
            "Fusion = Effekte/Motion Graphics · Color = Farbe · Fairlight = Audio · Deliver = Export.",
          ],
          tip: "Für den Einstieg reichen Edit, Color und Deliver. Der Rest kommt später.",
        },
        {
          t: "Projekt anlegen & Material importieren",
          steps: [
            "Projekt-Manager → „New Project“ → Namen vergeben.",
            "Media-Page: Dateien aus dem Ordner links in den „Media Pool“ ziehen.",
            "Clip in die Timeline ziehen – beim ersten Mal wird die Sequenz automatisch erstellt.",
          ],
          tip: "Projekteinstellungen (Zahnrad unten rechts) → Auflösung & Framerate zum Material passend setzen (z.B. 1920×1080, 30 fps).",
        },
        {
          t: "Schneiden (Edit-Page)",
          steps: [
            "Abspielkopf positionieren.",
            "Taste „B“ = Blade (Rasierklinge) → auf den Clip klicken, um zu trennen. Oder Strg/Cmd + \\ am Abspielkopf.",
            "Taste „A“ = Auswahl-Werkzeug. Clip anklicken und mit Entf löschen.",
          ],
          tip: "„Ripple Delete“ (Shift+Entf) löscht den Clip UND schließt die Lücke automatisch.",
        },
        {
          t: "Übergänge",
          steps: [
            "Effects-Library → „Video Transitions“ → gewünschten Übergang auf die Clip-Grenze ziehen.",
            "Standard-Crossfade schnell: Clip-Ecke markieren → Strg/Cmd + T.",
            "Dauer durch Ziehen der Übergangsränder anpassen.",
          ],
          tip: "„Cross Dissolve“ ist der klassische weiche Übergang – dezent einsetzen.",
        },
        {
          t: "Text & Titel",
          steps: [
            "Effects → „Titles“ → „Text“ (einfach) oder „Text+“ (mehr Kontrolle) in die Timeline ziehen.",
            "Titel anklicken → im „Inspector“ (rechts) Schrift, Größe, Farbe, Position ändern.",
          ],
          tip: "Für animierte Untertitel/Kanäle-Look ist „Text+“ mächtiger, aber komplexer.",
        },
        {
          t: "Farbkorrektur (Color-Page)",
          steps: [
            "Unten „Color“ wählen, Clip oben in der Filmstrip-Leiste anklicken.",
            "„Primaries“ / Color Wheels: Lift (dunkel), Gamma (Mitten), Gain (hell) einstellen.",
            "„Curves“ für feine Kontrolle. LUT: Rechtsklick auf Clip → LUT auswählen.",
          ],
          tip: "Resolve arbeitet mit „Nodes“ (Knoten): jede Korrektur ein Node – so bleibt alles änderbar. Weißabgleich zuerst.",
        },
        {
          t: "Audio (Fairlight)",
          steps: [
            "Fairlight-Page öffnen.",
            "Lautstärke pro Spur mit den Fadern; Clip-Lautstärke über die Linie im Clip.",
            "Rauschen entfernen: Effekt „Noise Reduction“; Musik unter Sprache absenken (Ducking).",
          ],
          tip: "Ziel-Lautstärke für Web ca. −14 LUFS. Dialog klar über die Musik legen.",
        },
        {
          t: "Geschwindigkeit & Retime (Speed Ramp)",
          steps: [
            "Rechtsklick auf Clip → „Change Clip Speed“ für gleichmäßig schnell/langsam.",
            "Oder „Retime Controls“ → mit Speed Points Bereiche unterschiedlich schnell machen (Speed Ramp).",
          ],
          tip: "„Optical Flow“ (in Retime-Optionen) macht Zeitlupen flüssiger.",
        },
        {
          t: "Keyframes (Animation)",
          steps: [
            "Clip wählen → Inspector rechts.",
            "Neben einer Eigenschaft (z.B. Zoom/Position) auf das Raute-Symbol klicken = Keyframe setzen.",
            "Abspielkopf bewegen, Wert ändern → nächster Keyframe. Feinschliff im Keyframe-Editor.",
          ],
          tip: "Zoom + Position-Keyframes ergeben einen sauberen „Reframe“ für Hochformat aus Querformat.",
        },
        {
          t: "Exportieren (Deliver-Page)",
          steps: [
            "„Deliver“ wählen → oben ein Preset (z.B. „YouTube 1080p“ oder „H.264“).",
            "Zielordner und Dateinamen festlegen.",
            "„Add to Render Queue“ → rechts „Render All“.",
          ],
          tip: "H.264 (oder H.265) ist der Standard fürs Web. Für maximale Qualität die Bitrate erhöhen.",
        },
      ],
    },

    {
      key: "premiere",
      name: "Premiere Pro",
      icon: "🎬",
      subtitle: "Adobe · Branchenstandard, den viele YouTuber nutzen (Abo)",
      items: [
        {
          t: "Projekt & Import",
          steps: [
            "„New Project“ → Namen und Speicherort wählen.",
            "Material importieren: Doppelklick ins „Project“-Panel, oder Datei → Importieren, oder Media Browser.",
            "Tipp: Dateien am besten vorher in einen Projektordner sortieren.",
          ],
          tip: "Alles an einem Ort speichern (Projekt + Medien), dann geht später nichts verloren.",
        },
        {
          t: "Sequenz (Timeline) erstellen",
          steps: [
            "Clip auf das „New Item“-Symbol ziehen → Sequenz passt sich automatisch an den Clip an.",
            "Oder eigene Sequenz: Datei → Neu → Sequenz → Einstellungen (z.B. 1080×1920 für Hochformat) selbst wählen.",
          ],
          tip: "Für Reels/Shorts eine 1080×1920-Sequenz (9:16), 30 fps anlegen.",
        },
        {
          t: "Schneiden",
          steps: [
            "Werkzeug „Rasierklinge“ (Taste C) → auf den Clip klicken zum Trennen.",
            "Oder Abspielkopf setzen und Strg/Cmd + K (Schnitt am Abspielkopf).",
            "Auswahl-Werkzeug (Taste V) zum Verschieben. Löschen: Entf; „Ripple Delete“ (Shift+Entf) schließt die Lücke.",
          ],
          tip: "Tastenkürzel lernen (C, V, K) beschleunigt den Schnitt enorm.",
        },
        {
          t: "Übergänge",
          steps: [
            "Effects-Panel → Video Transitions → „Cross Dissolve“ auf die Schnittstelle ziehen.",
            "Standard-Übergang schnell einfügen: Schnittstelle markieren → Strg/Cmd + D.",
            "Dauer im Effekteinstellungen-Panel anpassen.",
          ],
          tip: "„Cross Dissolve“ (Bild) und „Constant Power“ (Ton) sind die zuverlässigen Klassiker.",
        },
        {
          t: "Text & Auto-Untertitel",
          steps: [
            "Text-Werkzeug (Taste T) → in den Programmmonitor klicken und tippen.",
            "Im „Essential Graphics“-Panel Schrift, Farbe, Position, Hintergrund stylen.",
            "Untertitel automatisch: Fenster → Text → Reiter „Bildunterschriften“ → „Transkribieren“.",
          ],
          tip: "Als Vorlage (Motion Graphics Template) speichern, dann nutzt du deinen Look in jedem Video wieder.",
        },
        {
          t: "Audio (Essential Sound)",
          steps: [
            "Audioclip wählen → Panel „Essential Sound“ → Typ zuweisen (Dialog / Musik / SFX / Ambiente).",
            "„Dialog“: Lautstärke automatisch, Rauschen reduzieren.",
            "„Musik“: Häkchen „Ducking“ → Musik senkt sich automatisch unter der Stimme ab.",
          ],
          tip: "Lautstärke fein animieren: Stift-Werkzeug (Pen) auf die Lautstärkelinie der Audiospur = Keyframes.",
        },
        {
          t: "Farbe (Lumetri Color)",
          steps: [
            "Panel „Lumetri Color“ öffnen (Fenster → Lumetri Color).",
            "„Basiskorrektur“: Belichtung, Kontrast, Weißabgleich, Sättigung.",
            "„Kreativ“ für LUTs/Looks; „Kurven“ und „HSL Sekundär“ für Feinheiten.",
          ],
          tip: "Erst technisch korrigieren (Basiskorrektur), dann kreativ graden (Look). Nicht übertreiben.",
        },
        {
          t: "Geschwindigkeit & Speed Ramp",
          steps: [
            "Rechtsklick auf Clip → „Geschwindigkeit/Dauer“ für gleichmäßiges Tempo.",
            "Speed Ramp: „Time Remapping“ – im Clip die Geschwindigkeits-Gummiband-Linie mit Keyframes ziehen.",
          ],
          tip: "Beim Rampen die Keyframes „aufziehen“ (Ease), dann wird der Tempowechsel weich.",
        },
        {
          t: "Keyframes (Animation)",
          steps: [
            "Clip wählen → Panel „Effekteinstellungen“.",
            "Neben einer Eigenschaft (Position, Skalierung, Deckkraft) auf die Stoppuhr ⏱ klicken = Keyframes aktiv.",
            "Abspielkopf bewegen, Werte ändern → Bewegung entsteht.",
          ],
          tip: "Rechtsklick auf einen Keyframe → „Ease In/Out“ für professionell weiche Bewegungen.",
        },
        {
          t: "Exportieren",
          steps: [
            "Datei → Exportieren → Medien (Strg/Cmd + M).",
            "Format „H.264“, ein Preset wie „YouTube 1080p Full HD“ oder „Match Source – High bitrate“.",
            "„Exportieren“ (oder an Media Encoder senden für die Warteschlange).",
          ],
          tip: "„Match Source“ übernimmt die Einstellungen deiner Sequenz – bequem und meist ideal fürs Web.",
        },
      ],
    },
  ];

  // ---------------------------------------------------------------------------
  // GLOSSAR – Begriffe & Symbole zum Nachschlagen
  // { term, def (2–3 Zeilen), where (wo in den Apps) }
  // ---------------------------------------------------------------------------
  const GLOSSARY = [
    { term: "Timeline (Zeitleiste)", def: "Die Spur unten im Editor, auf der deine Clips, Musik und Text der Reihe nach liegen. Hier passiert der eigentliche Schnitt.", where: "In jeder App der große Bereich unten." },
    { term: "Clip", def: "Ein einzelnes Video-, Foto- oder Audiostück auf der Timeline.", where: "" },
    { term: "Abspielkopf / Playhead", def: "Die senkrechte Linie, die zeigt, an welcher Stelle du gerade bist. Schnitte passieren meist genau dort.", where: "CapCut: weiße Linie · Premiere/Resolve: blaue Linie." },
    { term: "Spur / Track", def: "Eine Ebene auf der Timeline. Video über Video (Overlay) oder mehrere Tonspuren liegen übereinander.", where: "" },
    { term: "Schnitt / Cut", def: "Der harte Übergang von einem Clip zum nächsten – der Grundbaustein jedes Videos.", where: "" },
    { term: "Trimmen", def: "Anfang oder Ende eines Clips kürzen, ohne ihn zu zerschneiden – einfach den Rand nach innen ziehen.", where: "Clip am Rand greifen und ziehen." },
    { term: "J-Cut", def: "Der Ton der nächsten Szene startet SCHON, bevor das Bild wechselt. Wirkt flüssig und professionell.", where: "Audiospur des nächsten Clips früher ziehen." },
    { term: "L-Cut", def: "Der Ton des aktuellen Clips läuft NACH dem Bildwechsel noch weiter. Häufig in Interviews/Dialogen.", where: "Audio des Clips über den Bildschnitt hinaus verlängern." },
    { term: "Jump Cut", def: "Sichtbarer Sprung im selben Bildausschnitt – Pausen rausschneiden. Bringt Tempo, typisch für Talking-Head-Videos.", where: "Einfach Pausen wegschneiden." },
    { term: "Match Cut", def: "Zwei Szenen werden über eine ähnliche Form oder Bewegung nahtlos verbunden. Sieht magisch aus.", where: "Bewegung des einen Clips am Anfang des nächsten fortsetzen." },
    { term: "B-Roll", def: "Zusätzliches Bildmaterial, das zeigt, wovon geredet wird (z.B. Hände, Objekte, Orte). Deckt Schnitte ab, macht lebendig.", where: "Als Overlay/zweite Videospur." },
    { term: "Übergang / Transition", def: "Animierter Wechsel zwischen zwei Clips (z.B. Auflösen/Crossfade, Wischen). Sparsam einsetzen!", where: "CapCut: ▯ zwischen Clips · Premiere/Resolve: Effects → Transitions." },
    { term: "Crossfade / Auflösen", def: "Weicher Überblendungs-Übergang: Bild oder Ton geht sanft ineinander über.", where: "" },
    { term: "Keyframe", def: "Ein Merkpunkt für einen Wert (Position, Größe, Lautstärke) zu einer bestimmten Zeit. Zwei verschiedene Keyframes = Animation dazwischen.", where: "CapCut: Raute ◆ · Premiere: Stoppuhr ⏱ · Resolve: Raute im Inspector." },
    { term: "Speed Ramp", def: "Fließender Tempowechsel innerhalb eines Clips (z.B. langsam → plötzlich schnell). Sehr beliebt für dynamische Cuts.", where: "CapCut: Tempo → Kurve · Premiere: Time Remapping · Resolve: Retime." },
    { term: "Zeitlupe / Slow Motion", def: "Verlangsamtes Video. Am besten mit hoher Bildrate (60/120 fps) gedreht, damit es flüssig bleibt.", where: "Geschwindigkeit < 100 %." },
    { term: "Zeitraffer / Timelapse", def: "Stark beschleunigtes Video – lange Vorgänge in Sekunden (z.B. Sonnenuntergang).", where: "Geschwindigkeit deutlich > 100 %." },
    { term: "fps / Bildrate", def: "Bilder pro Sekunde. 24/25/30 = normal, 60 = flüssig/Action, 120+ = für Zeitlupe.", where: "Projekt-/Export-Einstellungen." },
    { term: "Auflösung", def: "Bildgröße in Pixeln: 1080p (Full HD) reicht meist, 4K ist schärfer und größer. Höher = mehr Details, mehr Speicher.", where: "Export-Einstellungen." },
    { term: "Seitenverhältnis / Aspect Ratio", def: "Bildform: 9:16 (hoch, Reels/Shorts/TikTok), 16:9 (breit, YouTube), 1:1 (quadratisch, Feed).", where: "CapCut: „Verhältnis“ · sonst Sequenz-/Projekteinstellungen." },
    { term: "Farbkorrektur", def: "Technisches Angleichen: Belichtung, Weißabgleich, Kontrast – damit das Bild „richtig“ aussieht.", where: "CapCut: Anpassen · Premiere: Lumetri · Resolve: Color-Page." },
    { term: "Color Grading", def: "Kreativer Look/Stimmung obendrauf (z.B. warm, kühl, filmisch). Kommt NACH der Farbkorrektur.", where: "Filter/LUTs oder Color Wheels." },
    { term: "LUT", def: "Look-Up-Table – eine Farb-Vorlage, die per Klick einen fertigen Look aufs Bild legt.", where: "CapCut: teils in Filtern · Premiere: Lumetri → Kreativ · Resolve: Rechtsklick → LUT." },
    { term: "Weißabgleich", def: "Stellt ein, was „weiß“ ist, damit Farben natürlich wirken (kein Blau- oder Gelbstich).", where: "Temperatur/Tint-Regler." },
    { term: "Kontrast", def: "Unterschied zwischen hell und dunkel. Mehr Kontrast = knackiger, weniger = flacher/weicher.", where: "Anpassen/Basiskorrektur." },
    { term: "Sättigung", def: "Farbintensität. Hoch = kräftige Farben, niedrig = blass, 0 = Schwarz-Weiß.", where: "Anpassen/Basiskorrektur." },
    { term: "Belichtung", def: "Grundhelligkeit des Bildes. Zu hell = ausgefressen, zu dunkel = absaufen.", where: "" },
    { term: "Codec", def: "Das „Komprimierungsverfahren“ der Videodatei. H.264 = Standard fürs Web, H.265 = kleiner bei gleicher Qualität.", where: "Export-Format." },
    { term: "Bitrate", def: "Datenmenge pro Sekunde. Höher = bessere Qualität, größere Datei. Für YouTube ruhig hoch wählen.", where: "Export-Einstellungen." },
    { term: "Render / Export", def: "Das Berechnen und Speichern des fertigen Videos als eine Datei zum Hochladen.", where: "CapCut: Export · Premiere: Exportieren · Resolve: Deliver." },
    { term: "Proxy", def: "Eine kleine, leichte Kopie des Materials für ruckelfreies Schneiden am schwachen Rechner. Export nutzt trotzdem das Original.", where: "Premiere/Resolve." },
    { term: "Chroma Key / Green Screen", def: "Eine Farbe (meist Grün) wird durchsichtig gemacht, um den Hintergrund auszutauschen.", where: "CapCut: Overlay → Chroma Key · Premiere: Ultra Key · Resolve: Fusion/Qualifier." },
    { term: "Maske / Mask", def: "Begrenzt einen Effekt auf einen Bildbereich (z.B. nur Gesicht weichzeichnen).", where: "Effekteinstellungen/Inspector." },
    { term: "Overlay / PiP", def: "Bild-im-Bild: ein zweites Video/Bild liegt über dem Hauptvideo (z.B. Reaction, Logo).", where: "Zweite Videospur." },
    { term: "Deckkraft / Opacity", def: "Wie durchsichtig ein Clip ist. 100 % = voll sichtbar, 0 % = unsichtbar.", where: "Effekteinstellungen." },
    { term: "Waveform", def: "Die Wellenform des Tons. Zeigt laute (hohe Ausschläge) und leise Stellen – gut zum Schneiden auf den Beat.", where: "Auf der Audiospur." },
    { term: "Ducking", def: "Musik senkt sich automatisch ab, sobald jemand spricht, und danach wieder hoch.", where: "Premiere: Essential Sound → Ducking · Resolve: Fairlight." },
    { term: "dB / LUFS", def: "Lautstärke-Einheiten. dB = Pegel, LUFS = wahrgenommene Lautheit. Ziel fürs Web ca. −14 LUFS.", where: "Audio-Anzeigen." },
    { term: "Fade", def: "Sanftes Ein-/Ausblenden – beim Bild (schwarz) oder beim Ton (leise werden).", where: "" },
    { term: "Stabilisierung", def: "Rechnet Verwacklungen aus wackeligen Aufnahmen heraus.", where: "CapCut: Stabilisieren · Premiere: Warp Stabilizer · Resolve: Stabilizer." },
    { term: "Hook", def: "Die ersten ~3 Sekunden. Muss sofort neugierig machen, sonst wird weitergescrollt. Wichtigster Teil fürs Reichweite!", where: "Ganz am Anfang deines Videos." },
    { term: "CTA (Call to Action)", def: "Handlungsaufforderung: „Folgen“, „Speichern“, „Kommentier X“. Steigert Interaktion.", where: "Am Ende oder eingeblendet." },
    { term: "Retention / Watch-Time", def: "Wie lange Leute dranbleiben. Hohe Retention = der Algorithmus zeigt dein Video mehr Leuten.", where: "Plattform-Statistiken." },
    { term: "Untertitel / Captions (SRT)", def: "Eingeblendeter Text des Gesprochenen. Viele schauen ohne Ton – Untertitel sind fast Pflicht. SRT ist das Dateiformat.", where: "CapCut: Auto-Untertitel · Premiere: Bildunterschriften." },
    { term: "◆ Raute-Symbol", def: "Symbol zum Setzen eines Keyframes (Animationspunkt).", where: "CapCut & Resolve." },
    { term: "⏱ Stoppuhr-Symbol", def: "Aktiviert Keyframe-Animation für eine Eigenschaft.", where: "Premiere (Effekteinstellungen)." },
    { term: "✂️ Scheren-Symbol", def: "Schneidet/teilt den Clip am Abspielkopf.", where: "CapCut („Teilen“) / Rasierklinge in Premiere & Resolve." },
  ];

  // ---------------------------------------------------------------------------
  // MEDIATHEK – kostenlose Musik, Sounds, Bilder, Videos, Erklärvideos
  // Hinweis: Echte Dateien dürfen aus Urheberrecht-/Größengründen nicht
  // eingebettet werden. Jede Kachel öffnet eine kuratierte Suche in einer
  // legal & gratis nutzbaren Bibliothek (zusammen zehntausende Treffer).
  // ---------------------------------------------------------------------------
  const pxMusic = (q) => 'https://pixabay.com/music/search/' + encodeURIComponent(q) + '/';
  const pxSfx   = (q) => 'https://pixabay.com/sound-effects/search/' + encodeURIComponent(q) + '/';
  const pxVideo = (q) => 'https://pixabay.com/videos/search/' + encodeURIComponent(q) + '/';
  const pexV    = (q) => 'https://www.pexels.com/search/videos/' + encodeURIComponent(q) + '/';
  const pexP    = (q) => 'https://www.pexels.com/search/' + encodeURIComponent(q) + '/';
  const yt      = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

  // Musik nach Stimmung/Genre (Pixabay Music, keine Namensnennung nötig)
  const MUSIC_MOODS = [
    ['Cinematic / Filmisch','cinematic'],['Epic / Trailer','epic'],['Chill / Lofi','lofi'],
    ['Hip-Hop / Beats','hip hop'],['Vlog / Happy','vlog'],['Corporate / Clean','corporate'],
    ['Emotional / Sad','sad emotional'],['Spannung / Suspense','suspense'],['EDM / Electronic','edm'],
    ['Rock','rock'],['Ambient / Chill','ambient'],['Motivierend','motivational'],
    ['Lustig / Quirky','funny'],['Phonk (Trend)','phonk'],['Jazz','jazz'],['Acoustic','acoustic'],
    ['Pop','pop'],['Drum & Bass','drum and bass'],['Synthwave / Retro','synthwave'],
    ['Gaming','gaming'],['Feiertage / Christmas','christmas'],['Meditation / Entspannung','meditation'],
  ];
  // Soundeffekte nach Typ (Pixabay SFX)
  const SFX_TYPES = [
    ['Whoosh / Übergang','whoosh'],['Transition','transition'],['Klick / UI','click'],
    ['Impact / Boom','impact'],['Riser / Sweep','riser'],['Pop','pop'],['Notification','notification'],
    ['Applaus / Crowd','applause'],['Glitch','glitch'],['Ding / Bell','bell'],['Error / Buzzer','error'],
    ['Coin / Game','coin'],['Kamera-Auslöser','camera shutter'],['Tastatur','keyboard'],
    ['Schritte / Foley','footsteps'],['Regen','rain'],['Wind','wind'],['Feuer','fire'],
    ['Meme / Funny','meme'],['Swoosh','swoosh'],
  ];
  // Video / B-Roll Kategorien (Pexels Videos, gratis, keine Namensnennung)
  const VIDEO_CATS = [
    ['Natur','nature'],['Stadt / City','city'],['Technik','technology'],['Essen / Food','food'],
    ['Fitness / Sport','fitness'],['Reisen','travel'],['Business / Office','business'],
    ['Abstrakt / Hintergrund','abstract background'],['Lifestyle','lifestyle'],['Tiere','animals'],
    ['Weltraum','space'],['Autos','car'],['Menschen','people'],['Meer / Ozean','ocean'],
    ['Berge','mountains'],['Wald','forest'],['Himmel / Wolken','clouds'],['Nacht / Neon','neon night'],
    ['Kaffee','coffee'],['Geld / Finance','money'],['Gaming','gaming'],['Mode / Fashion','fashion'],
    ['Drohne / Luftaufnahme','drone aerial'],['Zeitlupe','slow motion'],['Musik / Konzert','concert'],
  ];
  // Overlays & Effekte (Pixabay Videos)
  const OVERLAY_TYPES = [
    ['Light Leaks','light leak'],['Staub / Dust','dust overlay'],['Bokeh','bokeh'],['Rauch / Smoke','smoke'],
    ['Film Grain','film grain'],['Glitch','glitch overlay'],['Regen','rain overlay'],['Schnee','snow overlay'],
    ['Lens Flare','lens flare'],['Partikel','particles'],['Konfetti','confetti'],['Feuer','fire overlay'],
  ];
  // Erklär-/Tutorial-Themen (YouTube)
  const TUTORIAL_TOPICS = [
    ['CapCut Grundlagen','capcut tutorial deutsch anfänger'],['Premiere Pro Grundlagen','premiere pro tutorial deutsch anfänger'],
    ['DaVinci Resolve Grundlagen','davinci resolve tutorial deutsch anfänger'],['After Effects Basics','after effects tutorial deutsch anfänger'],
    ['Farbkorrektur / Color Grading','color grading tutorial deutsch'],['Speed Ramp','speed ramp tutorial deutsch'],
    ['Keyframes / Animation','keyframe animation tutorial deutsch'],['Übergänge / Transitions','transition tutorial capcut deutsch'],
    ['Der perfekte Hook','video hook erste sekunden deutsch'],['Thumbnails erstellen','youtube thumbnail tutorial deutsch'],
    ['Storytelling','storytelling video tutorial deutsch'],['Green Screen','green screen tutorial deutsch'],
    ['Untertitel / Captions','auto untertitel capcut tutorial'],['Sounddesign','sounddesign video tutorial deutsch'],
    ['Motion Graphics','motion graphics tutorial deutsch'],['Foto-Bearbeitung / Lightroom','lightroom tutorial deutsch anfänger'],
    ['Kamera-Einstellungen','kamera einstellungen video tutorial deutsch'],['Beleuchtung / Licht','video beleuchtung tutorial deutsch'],
    ['Mikrofon / guter Ton','video ton mikrofon tutorial deutsch'],['YouTube-Algorithmus','youtube algorithmus erklärt deutsch'],
    ['TikTok wachsen','tiktok wachstum tipps deutsch'],['Instagram Reels Strategie','instagram reels strategie deutsch'],
    ['Monetarisierung / Geld verdienen','als content creator geld verdienen deutsch'],['Skript schreiben','video skript schreiben tutorial deutsch'],
    ['Retention halten','video retention tipps deutsch'],
  ];
  // Bilder / Fotos Kategorien (Pexels)
  const PHOTO_CATS = [
    ['Natur','nature'],['Stadt','city'],['Technik','technology'],['Essen','food'],['Business','business'],
    ['Menschen','people'],['Lifestyle','lifestyle'],['Reisen','travel'],['Fitness','fitness'],
    ['Hintergründe','abstract background'],['Tiere','animals'],['Mode','fashion'],['Auto','car'],['Geld','money'],
  ];

  const mkItems = (arr, urlFn, tail) => arr.map(([name,q]) => ({name, desc: q + (tail||''), url: urlFn(q)}));

  const ASSETS = [
    {
      cat: '⭐ Die besten Gratis-Quellen',
      note: 'Startpunkte – hier findest du (fast) alles. Lizenz pro Datei prüfen; vieles ohne Namensnennung.',
      items: [
        { name: 'Pixabay', desc: 'Musik, SFX, Fotos & Videos – gratis, keine Namensnennung nötig.', url: 'https://pixabay.com/' },
        { name: 'Pexels', desc: 'Top Fotos & Videos, gratis, keine Namensnennung.', url: 'https://www.pexels.com/' },
        { name: 'Mixkit', desc: 'Kuratierte Musik, SFX, Video-Clips & Templates.', url: 'https://mixkit.co/' },
        { name: 'YouTube Audio Library', desc: 'Musik & SFX direkt im YouTube-Studio (Copyright-sicher).', url: 'https://www.youtube.com/audiolibrary' },
        { name: 'Uppbeat', desc: 'YouTube-freundliche Musik, gratis Plan mit Credits.', url: 'https://uppbeat.io/' },
      ],
    },
    { cat: '🎵 Musik nach Stimmung', note: 'Öffnet Pixabay-Music-Suche (1000+ Tracks pro Kategorie, gratis, ohne Namensnennung).',
      items: mkItems(MUSIC_MOODS, pxMusic, ' – Tracks auf Pixabay') },
    { cat: '🔊 Soundeffekte (SFX)', note: 'Whooshes, Klicks, Impacts & mehr – Pixabay Sound-Effects (gratis).',
      items: mkItems(SFX_TYPES, pxSfx, ' – Effekte auf Pixabay') },
    { cat: '🎞️ Videos / B-Roll für Edits', note: 'Fertige Clips für Zwischenschnitte & Hintergründe – Pexels Videos (gratis, keine Namensnennung).',
      items: mkItems(VIDEO_CATS, pexV, ' – Clips auf Pexels') },
    { cat: '✨ Overlays & Effekte', note: 'Light Leaks, Staub, Rauch, Glitch … als Overlay über deinen Clip legen – Pixabay Videos.',
      items: mkItems(OVERLAY_TYPES, pxVideo, ' – Overlays auf Pixabay') },
    { cat: '📚 Erklärvideos / Tutorials', note: 'Öffnet die YouTube-Suche zum Thema (tausende Erklärvideos, laufend aktuell).',
      items: mkItems(TUTORIAL_TOPICS, yt, ' – auf YouTube') },
    { cat: '🖼️ Bilder / Fotos', note: 'Hochwertige Stock-Fotos – Pexels (gratis, keine Namensnennung).',
      items: mkItems(PHOTO_CATS, pexP, ' – Fotos auf Pexels') },
    { cat: '🔤 Schriften (Fonts)', note: 'Für Titel & Untertitel. Kommerzielle Nutzung pro Schrift prüfen.',
      items: [
        { name: 'Google Fonts', desc: 'Riesige, komplett kostenlose Bibliothek, auch kommerziell.', url: 'https://fonts.google.com/' },
        { name: 'Fontshare', desc: 'Hochwertige Schriften, gratis auch für kommerziell.', url: 'https://www.fontshare.com/' },
        { name: 'DaFont', desc: 'Sehr viele Stil-Schriften (Lizenz je Schrift beachten).', url: 'https://www.dafont.com/' },
      ] },
  ];

  // ---------------------------------------------------------------------------
  // STUDIO – Beschreibung „was wir machen" (für App & Website)
  // ---------------------------------------------------------------------------
  const STUDIO = {
    name: 'Dein Video-Studio',
    slogan: 'Content, der den Daumen stoppt.',
    about: 'Wir helfen Creators, Selbstständigen und kleinen Marken dabei, mit Videos aufzufallen – von der ersten Idee über den Dreh bis zum fertigen Schnitt. Ob Reels, Shorts, TikTok oder YouTube: schneller, sauberer Schnitt mit Hook, Untertiteln, Musik und dem richtigen Rhythmus, damit die Leute dranbleiben.',
    services: [
      { icon: '🎬', title: 'Kurzvideos', text: 'Reels, Shorts & TikToks mit starkem Hook, Untertiteln und Beat-Sync-Schnitt.' },
      { icon: '📺', title: 'YouTube-Schnitt', text: 'Langform-Videos mit sauberem Storytelling, B-Roll, Grafik und Sounddesign.' },
      { icon: '🎥', title: 'Dreh & Produktion', text: 'Halbe oder ganze Drehtage – Kamera, Licht, Ton. Wir kommen vorbei oder ihr schickt Material.' },
      { icon: '🖼️', title: 'Extras', text: 'Thumbnails, Farbkorrektur, Untertitel, Express-Lieferung – flexibel dazubuchbar.' },
    ],
    steps: [
      ['1 · Anfrage', 'Kurz sagen, was du brauchst – Ziel, Plattform, Stil.'],
      ['2 · Angebot', 'Du bekommst ein passendes Paket mit Festpreis.'],
      ['3 · Material / Dreh', 'Du schickst dein Rohmaterial oder wir drehen zusammen.'],
      ['4 · Schnitt', 'Wir schneiden – Hook, Untertitel, Musik, Feinschliff.'],
      ['5 · Feedback', 'Du bekommst den Entwurf, wir bauen deine Korrekturen ein.'],
      ['6 · Fertig', 'Du erhältst die fertigen Videos, bereit zum Posten.'],
    ],
  };

  // ---------------------------------------------------------------------------
  // PACKAGES – Beispiel-Preise (frei anpassbar). Für App & Website.
  // ---------------------------------------------------------------------------
  const PACKAGES = [
    { group: '🎬 Kurzvideos (Reels · Shorts · TikTok)', items: [
      { name: 'Starter', price: 89, unit: '3 Videos', popular: false, desc: '3 Kurzvideos, professioneller Schnitt (~30 €/Video)',
        features: ['3 Videos (bis 60 Sek.)', 'Schnitt + passende Musik', 'Untertitel', '1 Korrekturschleife'] },
      { name: 'Creator', price: 179, unit: '7 Videos', popular: true, desc: '7 Kurzvideos – bestes Preis-Leistungs-Verhältnis (~26 €/Video)',
        features: ['7 Videos', 'Hook-Optimierung', 'Untertitel + Effekte', '2 Korrekturschleifen'] },
      { name: 'Pro', price: 290, unit: '/ Monat', popular: false, desc: '12 Kurzvideos im Monat für regelmäßigen Content (~24 €/Video)',
        features: ['12 Videos / Monat', 'Alles aus Creator', 'Thumbnails inklusive', 'Priorität & schnelle Lieferung'] },
    ]},
    { group: '📺 YouTube (Langform)', items: [
      { name: 'Single', price: 69, unit: '/ Video', popular: false, desc: '1 YouTube-Video, kompletter Schnitt',
        features: ['bis ~10 Min. fertige Länge', 'Schnitt + B-Roll', 'Musik & Sounddesign', '1 Korrekturschleife'] },
      { name: 'Bundle', price: 239, unit: '4 Videos', popular: true, desc: '4 YouTube-Videos im Paket (du sparst ggü. Einzelpreis)',
        features: ['4 Videos', 'Intro/Outro-Vorlage', 'einfache Grafiken', '2 Korrekturschleifen'] },
      { name: 'Power', price: 399, unit: '7 Videos', popular: false, desc: '7 YouTube-Videos – für aktive Kanäle',
        features: ['7 Videos', 'Thumbnails inklusive', 'Priorität', 'monatliche Abstimmung'] },
    ]},
    { group: '🎥 Drehtage', items: [
      { name: 'Halbtag', price: 99, unit: 'bis 3 Std.', popular: false, desc: 'Kurzer Dreh vor Ort',
        features: ['bis 3 Stunden', 'iPhone / Canon EOS / Action-Cam', 'Material digital übergeben'] },
      { name: 'Drehtag', price: 179, unit: 'bis 6 Std.', popular: true, desc: 'Klassischer Drehtag',
        features: ['bis 6 Stunden', 'iPhone / Canon EOS / Action-Cam', 'kurze Location-Wechsel', 'gesichtetes Material'] },
      { name: 'Full-Day', price: 279, unit: 'bis 10 Std.', popular: false, desc: 'Ganzer Produktionstag',
        features: ['bis 10 Stunden', 'komplettes Equipment', 'mehrere Setups/Locations', 'Vorsortierung des Materials'] },
    ]},
    { group: '➕ Zusatzleistungen', items: [
      { name: 'Thumbnail-Design', price: 15, unit: '/ Stück', popular: false, desc: 'Klickstarkes Vorschaubild', features: [] },
      { name: 'Untertitel', price: 9, unit: '/ Video', popular: false, desc: 'Saubere, animierte Untertitel', features: [] },
      { name: 'Farbkorrektur / Grading', price: 19, unit: '/ Video', popular: false, desc: 'Filmischer, einheitlicher Look', features: [] },
      { name: 'Express (24 Std.)', price: 0, unit: '+50 %', popular: false, desc: 'Lieferung innerhalb von 24 Stunden', features: [] },
      { name: 'Extra Korrekturschleife', price: 12, unit: '/ Runde', popular: false, desc: 'Zusätzliche Änderungsrunde', features: [] },
    ]},
  ];

  return { GUIDES, GLOSSARY, ASSETS, STUDIO, PACKAGES };
})();
