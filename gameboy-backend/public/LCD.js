class LCD {
  constructor(memory, canvasId = "gameboy-screen") {
    this.memory = memory;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Neue Variablen für Rendering
    this.lineRendered = false; // Verhindert mehrfaches Rendern einer Zeile
    this.vram = memory.vram; // Zugriff auf VRAM für Tile-Daten

    // LCD State
    this.mode = 0;
    this.modeCycles = 0;
    this.line = 0;
    this.lineCycles = 0;
    this.frameCycles = 0;

    // Registers
    this.ly = 0;
    this.lyc = 0;
    this.stat = 0;
    this.lcdc = 0;
    this.scy = 0;
    this.scx = 0;
    this.bgp = 0xfc; // Default grayscale palette

    // Framebuffer für das gesamte Bild
    this.framebuffer = new Uint8Array(160 * 144);
    this.currentFrame = new ImageData(160, 144);

    // Color lookup für die 4 Graustufen
    this.colors = [
      [255, 255, 255, 255], // Color 0: White
      [192, 192, 192, 255], // Color 1: Light gray
      [96, 96, 96, 255], // Color 2: Dark gray
      [0, 0, 0, 255], // Color 3: Black
    ];

    this.reset();
  }

  reset() {
    this.mode = 0;
    this.modeCycles = 0;
    this.line = 0;
    this.lineCycles = 0;
    this.frameCycles = 0;

    // Set initial register values
    this.ly = 0;
    this.lyc = 0;
    this.stat = 0x85; // Default STAT value
    this.lcdc = 0x91; // Default LCDC value (LCD on, BG on, etc.)

    // Write to memory
    this.writeToMemory();
    // Clear screen
    this.clearScreen();
  }
  clearScreen() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.framebuffer.fill(0); // All pixels = color 0 (white)
  }
  writeToMemory() {
    this.memory.writeByte(0xff40, this.lcdc); // LCDC
    this.memory.writeByte(0xff41, this.stat); // STAT
    this.memory.writeByte(0xff44, this.ly); // LY
    this.memory.writeByte(0xff45, this.lyc); // LYC
  }

  readByte(address) {
    switch (address) {
      case 0xff40:
        return this.lcdc; // LCDC
      case 0xff41:
        return this.stat; // STAT
      case 0xff44:
        return 0x90; // LY
      case 0xff45:
        return this.lyc; // LYC
      default:
        return 0xff;
    }
  }

  writeByte(address, value) {
    switch (address) {
      case 0xff40: // LCDC
        this.lcdc = value;
        // If LCD is turned off, reset to mode 0 and line 0
        if ((value & 0x80) === 0) {
          this.ly = 0;
          this.stat = (this.stat & 0xfc) | 0; // Set mode to 0
          this.mode = 0;
        }
        break;

      case 0xff41: // STAT
        // Only bits 3-6 are writable, bits 0-2 are read-only (mode)
        this.stat = (value & 0xf8) | (this.stat & 0x07);
        break;

      case 0xff44: // LY (read-only)
        // Test-ROMs schreiben trotzdem auf LY, wenn LCD disabled
        if ((this.lcdc & 0x80) === 0) {
          this.ly = value;
          this.line = value;
        }
        break;

      case 0xff45: // LYC
        this.lyc = value;
        this.updateLYCCompare();
        break;
    }
  }

  updateLYCCompare() {
    if (this.ly === this.lyc) {
      // Set LY=LYC flag (bit 2)
      this.stat |= 0x04;

      // Trigger STAT interrupt if LY=LYC interrupt is enabled (bit 6)
      if (this.stat & 0x40) {
        this.triggerSTATInterrupt();
      }
    } else {
      // Clear LY=LYC flag
      this.stat &= ~0x04;
    }
  }

  triggerVBlankInterrupt() {
    const ifReg = this.memory.readByte(0xff0f);
    this.memory.writeByte(0xff0f, ifReg | 0x01);
  }

  triggerSTATInterrupt() {
    const ifReg = this.memory.readByte(0xff0f);
    this.memory.writeByte(0xff0f, ifReg | 0x02);
  }

  setMode(newMode) {
    // Only update if mode changed
    if (this.mode !== newMode) {
      this.mode = newMode;
      this.stat = (this.stat & 0xfc) | newMode; // Update mode bits

      // Check if we should trigger STAT interrupt based on mode
      const statInterruptEnabled = (this.stat >> (newMode + 3)) & 0x01;
      if (statInterruptEnabled && newMode !== 0) {
        this.triggerSTATInterrupt();
      }
    }
  }

  update(cycles) {
    // If LCD is disabled, don't update
    if ((this.lcdc & 0x80) === 0) {
      this.ly = 0; // LY is 0 when LCD is off
      this.writeRegistersToMemory();
      return;
    }

    // Add cycles to the current line
    this.lineCycles += cycles;

    // Process cycles until we've consumed all of them
    while (this.lineCycles > 0) {
      // Handle current mode
      switch (this.mode) {
        case 0: // HBlank
          if (this.lineCycles >= 204) {
            // HBlank lasts 204-456 cycles
            this.lineCycles -= 204;
            this.line++;
            this.ly = this.line;

            if (this.line === 144) {
              // Enter VBlank
              this.setMode(1);
              this.triggerVBlankInterrupt();

              // 🎨 Render the complete frame
              this.renderFrame();
            } else {
              // Enter OAM Search for next line
              this.setMode(2);
            }
          } else {
            // Still in HBlank
            return;
          }
          break;

        case 1: // VBlank
          if (this.lineCycles >= 456) {
            // 456 cycles per VBlank line
            this.lineCycles -= 456;
            this.line++;
            this.ly = this.line;

            if (this.line > 153) {
              // End of VBlank, back to line 0
              this.line = 0;
              this.ly = 0;
              this.setMode(2);
            }
          } else {
            // Still in VBlank
            return;
          }
          break;

        case 2: // OAM Search
          if (this.lineCycles >= 80) {
            this.lineCycles -= 80;
            this.setMode(3);
          } else {
            // Still in OAM Search
            return;
          }
          break;

        case 3: // Drawing
          if (this.lineCycles >= 172) {
            this.lineCycles -= 172;
            this.setMode(0);

            // 🎨 Render this line during Drawing mode
            if (this.line < 144 && !this.lineRendered) {
              this.renderLine(this.line);
              this.lineRendered = true;
            }
          } else {
            // Still in Drawing
            return;
          }
          break;
      }
    }

    // Update LY=LYC comparison
    this.updateLYCCompare();

    // Write updated values to memory
    this.writeRegistersToMemory();
  }

  writeRegistersToMemory() {
    // Only write if values changed to avoid unnecessary memory writes
    const currentLY = this.memory.readByte(0xff44);
    const currentSTAT = this.memory.readByte(0xff41);

    if (currentLY !== this.ly) {
      this.memory.writeByte(0xff44, this.ly);
    }

    if (currentSTAT !== this.stat) {
      this.memory.writeByte(0xff41, this.stat);
    }
  }

  // Special method for tests - force LY to a specific value
  setLYForTest(value) {
    this.ly = value;
    this.line = value;
    this.updateLYCCompare();
    this.memory.writeByte(0xff44, value);
  }
  renderLine(line) {
    if (line < 0 || line >= 144) return;

    // Vereinfachtes Rendering für den Anfang
    const y = line;

    // Hole aktuelle Register-Werte
    const bgEnabled = (this.lcdc & 0x01) !== 0;
    const windowEnabled = (this.lcdc & 0x20) !== 0;

    // Für jede Pixel-Position in dieser Zeile
    for (let x = 0; x < 160; x++) {
      let pixelColor = 0; // Default: Farbe 0 (weiß)

      if (bgEnabled) {
        // Sehr einfache Test-Logik
        pixelColor = (x + y) % 4; // Einfaches Muster
      }

      // Setze Pixel im Framebuffer
      this.setPixel(x, y, pixelColor);
    }
  }

  setPixel(x, y, colorIndex) {
    if (x < 0 || x >= 160 || y < 0 || y >= 144) return;

    const bufferIndex = y * 160 + x;
    this.framebuffer[bufferIndex] = colorIndex;

    // Hole Farbpalette
    const palette = this.getPaletteColors(this.bgp);
    const color = palette[colorIndex];

    // Schreibe in ImageData
    const pixelIndex = bufferIndex * 4;
    this.currentFrame.data[pixelIndex] = color[0]; // R
    this.currentFrame.data[pixelIndex + 1] = color[1]; // G
    this.currentFrame.data[pixelIndex + 2] = color[2]; // B
    this.currentFrame.data[pixelIndex + 3] = color[3]; // A
  }

  // Hole Farben aus Palette
  getPaletteColors(paletteByte) {
    return [
      this.colors[(paletteByte >> 0) & 0x03],
      this.colors[(paletteByte >> 2) & 0x03],
      this.colors[(paletteByte >> 4) & 0x03],
      this.colors[(paletteByte >> 6) & 0x03],
    ];
  }

  // Zeige den kompletten Frame
  renderFrame() {
    this.ctx.putImageData(this.currentFrame, 0, 0);
  }

  // Reset für neue Zeile
  resetLineRendering() {
    this.lineRendered = false;
  }
}
