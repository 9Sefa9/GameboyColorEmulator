const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();
const PORT = 3000;
const LOG_FILE =
  "V:\\code\\gameboy-color-emulator\\gameboy-backend\\gameboy-doctor-master\\log6.txt";

// Middleware
app.use(cors()); // CORS erlauben
app.use(express.json({ limit: "5000mb" }));
app.use(express.static(path.join(__dirname, "public"))); // CSS/JS & andere statische Dateien

// GET / → index.html ausliefern
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST /logs
app.post("/logs", (req, res) => {
  const message = req.body.message;
  const instrNumber = req.body.instrNumber;
  if (!message) return res.status(400).send("Keine Nachricht angegeben");

  try {
    const logDir = path.dirname(LOG_FILE);

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.writeFileSync(LOG_FILE, message, "utf8");
    console.log("Nachricht erfolgreich geschrieben.");

    // --- HIER WIRD GAMEBOY-DOCTOR AUTOMATISCH AUSGEFÜHRT ---
    const cmd = `cd "${logDir}" && python gameboy-doctor log6.txt cpu_instrs ${instrNumber}`;

    exec(cmd, (error, stdout, stderr) => {
      console.log("---- GAMEBOY-DOCTOR STDOUT ----");
      console.log(stdout);

      console.log("---- GAMEBOY-DOCTOR STDERR ----");
      console.log(stderr ? "not successful" : "successful");

      if (error) {
        console.error("EXIT ERROR");
        return;
      }
    });
    // -------------------------------------------------------

    res.status(200).send("OK");
  } catch (err) {
    console.error("Fehler beim Schreiben:", err);
    res.status(500).send("Fehler beim Schreiben");
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
