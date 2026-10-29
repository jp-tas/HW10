# HW10 — PostgreSQL

IS 545, Jean-Pierre Tas. Tutorial 13: Produkte mit CSV-Import und -Export.
Tutorial 14: Bücher anlegen, anzeigen, bearbeiten und löschen.

Die vorhandene Neon-Datenbank ist eingerichtet und mit beiden Anwendungen
verbunden. PostgreSQL enthält die zehn Originalprodukte und drei Originalbücher.
Projekt: icy-voice-97780123, Branch: production (Projektname in Neon: HW9).

Lokaler Start:

```sh
npm ci --prefix tut13
npm ci --prefix tut14
npm run build
npm start --prefix tut13
```

Für Tutorial 14 stattdessen `npm start --prefix tut14` verwenden.
Lokal: http://localhost:3000/. Für gleichzeitigen Start unterschiedliche PORT-Werte setzen.
Die lokalen .env-Dateien sind bereits konfiguriert und bleiben von Git ausgeschlossen.
.env.example enthält ausschließlich leere Vorlagen.

Neon:

- neon.ts deklariert ausschließlich PostgreSQL.
- .neon und .env.local enthalten den lokalen Kontext bzw. Umgebungswerte und sind ignoriert.
- Für die Neon-CLI wird eine aktuelle Node-22-Laufzeit benötigt.
- neon deploy war erfolgreich und hat die Datenbankvariablen abgerufen.
- database/setup-neon.sql dokumentiert die ausgeführte Einrichtung ohne Tabellen zu löschen.
- Die Datenbank muss für einen normalen Start nicht erneut initialisiert werden.
- tut13/setup.sql ist das originale Tutoriumsskript und setzt PRODUCT ausdrücklich zurück.
- tut14: npm run db:setup verwendet die direkte DATABASE_URL_UNPOOLED und erhält bestehende Zeilen.

Render: zwei Web Services mit Root Directory tut13 bzw. tut14, Build
`npm ci && npm run build`, Start `npm start` und der DATABASE_URL aus der
jeweiligen lokalen .env als Render-Umgebungsvariable.
Die tatsächlichen Render-URLs stehen noch aus.
Repository: https://github.com/jp-tas/HW10.git

Prüfung: Build beider Apps erfolgreich; 39 echte Neon-/HTTP-Prüfungen bestanden,
einschließlich Dateiimport, Export und Bücher-CRUD. Eigene Testdaten wurden entfernt.
PDF und aktualisierte Abgabe-ZIPs liegen im IS545-Projekt unter HW/HW10/.
Die ZIPs enthalten gemäß Aufgabe .env und bleiben ebenso wie .env vom Git-Tracking ausgeschlossen.
