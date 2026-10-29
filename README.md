# HW10 — PostgreSQL

IS 545, Jean-Pierre Tas. Tutorial 13: Produkte mit CSV-Import und -Export.
Tutorial 14: vollständige Bücherverwaltung mit PostgreSQL.

1. Im eigenen Neon-Konto eine Datenbank erstellen (Tutorial 12).
2. In `tut13/.env` und `tut14/.env` die eigene `DATABASE_URL` eintragen.
   `.env.example` dient als Vorlage. `.env` bleibt von Git ausgeschlossen.
3. In beiden Verzeichnissen `npm ci` ausführen.
4. `tut13/setup.sql` einmal im Neon SQL Editor ausführen; das Skript setzt
   die PRODUCT-Tabelle auf die zehn Originalprodukte zurück.
5. In `tut14/` einmal `npm run db:setup` ausführen.
6. Im gewünschten Anwendungsordner `npm start` ausführen und
   http://localhost:3000/ öffnen.

Beide Anwendungen verwenden standardmäßig Port 3000; für den gleichzeitigen
Start unterschiedliche `PORT`-Werte setzen.

Render: zwei Web Services mit Root Directory `tut13` bzw. `tut14`, Build
`npm ci`, Start `npm start` und eigener `DATABASE_URL` als Umgebungsvariable.
Die tatsächlichen Render-URLs werden nach der Veröffentlichung ergänzt.
Repository: https://github.com/jp-tas/HW10.git

`database/pgscript.sql` enthält das TESTTABLE-Beispiel aus Tutorial 12.
Die lokale PostgreSQL-/Browserprüfung ist abgeschlossen. Eine echte Neon-
Verbindung und ein Render-Deployment sind noch nicht bestätigt.
Die Abgabe-ZIPs liegen im IS545-Projekt unter `HW/HW10/` und enthalten `.env`;
nach Eintragen der echten Datenbankkonfiguration müssen sie neu gepackt werden.
