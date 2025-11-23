const http = require('http');
const fs = require('fs');
const cors = require('cors');

const app = http.createServer((req, res) => {
    // Erlaube Anfragen von allen Ursprüngen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        // Antwort auf die OPTIONS-Anfrage für die CORS-Überprüfung
        res.writeHead(200);
        res.end();
    } else if (req.method === 'POST' && req.url === '/logs') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const message = JSON.parse(body).message;
            const filePath = 'V:\\code\\gameboy-color-emulator\\gameboy-doctor-master\\log6.txt';

            // Überprüfen, ob die Datei existiert
            if (fs.existsSync(filePath)) {
                // Datei löschen, bevor sie neu erstellt wird
                fs.unlinkSync(filePath);
            }

            // Die Datei neu erstellen und die Nachricht hinzufügen
            fs.writeFileSync(filePath, message, 'utf8');

            console.log('Nachricht erfolgreich geschrieben.');
            res.statusCode = 200;
            res.end('OK');
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
