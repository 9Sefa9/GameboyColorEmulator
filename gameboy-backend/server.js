const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const LOG_FILE = 'V:\\code\\gameboy-color-emulator\\gameboy-doctor-master\\log6.txt';

// Middleware
app.use(cors());               // CORS erlauben
app.use(express.json());       // JSON Body parsen
app.use(express.static(path.join(__dirname, 'public'))); // CSS/JS & andere statische Dateien

// GET / → index.html ausliefern
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /logs
app.post('/logs', (req, res) => {
    const message = req.body.message;
    if (!message) return res.status(400).send('Keine Nachricht angegeben');

    try {
        if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);  // Alte Datei löschen
        fs.writeFileSync(LOG_FILE, message, 'utf8');          // Neue Nachricht schreiben
        console.log('Nachricht erfolgreich geschrieben.');
        res.status(200).send('OK');
    } catch (err) {
        console.error(err);
        res.status(500).send('Fehler beim Schreiben');
    }
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
