/* The `CPU` class represents a CPU with registers, flags, timers, and methods for executing
instructions in a GameBoy Color emulator. */
class CPU {
  constructor() {
    //Registers
    this.BC = 0; //16 bit register
    this.DE = 0; //16 bit register
    this.HL = 0; //16 bit register
    this.SP = 0; //16 bit register - Stack Pointer
    this.PC = 0; //16 bit register - Program Counter
    this.i = 0;
    this.AF = 0; //Accumulator 8 bit and Flags 8 bit = 16 bit register
    this.log = "";
    this.cbModeActive = false; //To indicate if the next fetched opcode is from CB prefix
    //Flags
    // 7 6 5 4 3 2 1 0
    // Z N H C 0 0 0 0

    // Zero Flag (Z):
    // This bit is set when the result of a math operation
    // is zero or two values match when using the CP
    // instruction.

    // Subtract Flag (N):
    // This bit is set if a subtraction was performed in the
    // last math instruction.

    // Half Carry Flag (H):
    // This bit is set if a carry occurred from the lower
    // nibble in the last math operation.

    // Carry Flag (C):
    // This bit is set if a carry occurred from the last
    // math operation or if register A is the smaller value
    // when executing the CP instruction.

    //Initialize all available Instructions to a Map
    InstructionSet.prepareInstructions();

    //Timers
    this.startTime = 0;
    this.currentTime = 0;
    this.elapsedTime = 0;
    this.frameCount = 0;
    this.fpsTitle = document.querySelector(".fps");

    //Cycle which is 8 since 1 Machine cycle represents 8 cycle in GameBoy Color
    this.cycle = 0;

    //Interrupt handling ( To do )
    this.ime = 0;
    this.imeScheduled = 0;

    //DUMMY DATAS
    this.memory = null;
  }
  start() {
    document.getElementById("start").onclick = () => {
      console.log("START");
      const file = document.getElementById("rom").files[0]; // get the selected file
      const reader = new FileReader(); // create a new FileReader object

      reader.onload = (e) => {
        // define the onload event handler
        const arrayBuffer = e.target.result; // get the contents of the file as an ArrayBuffer
        const rom = new Uint8Array(arrayBuffer); // create a new Uint8Array from the ArrayBuffer
        this.memory = new MBC1(rom, 0x8000);
        // this.memory = new NoMBC(rom, 0x8000);
        this.setTitle();
        this.setManufacturerCode();
        this.setCGBFlag();
        this.setNewLicenseeCode();
        this.setSGBflag();
        this.setCartridgeType();
        this.setRomSize();
        this.setRamSize();
        this.setDestinationCode();
        this.setOldLicenseeCode();
        this.setMaskROMVersionNumber();
        this.setHeaderChecksum();

        // this.startTime = window.performance.now();
        // this.raf = requestAnimationFrame(() => this.loop());
        this.loop();
      };
      reader.readAsArrayBuffer(file); // read the file as an ArrayBuffer
      this.reset();
    };

    document.getElementById("pause").onclick = () => {
      console.log("PAUSE");
      this.stopLoop();
    };

    document.getElementById("resume").onclick = () => {
      console.log("RESUME");
      // this.startTime = window.performance.now();
      // this.raf = requestAnimationFrame(() => this.loop());
    };

    document.getElementById("export-log").onclick = () => {
      console.log("EXPORT LOG");
      fetch("http://localhost:3000/logs", {
        method: "POST",
        body: JSON.stringify({
          message: this.log,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
  }
  reset() {
    // this.setPC(0x0208);
    // this.setAF(0x0010)
    // this.setBC(0x0108);
    // this.setDE(0xC818);
    // this.setHL(0x4819);
    // this.setSP(0xFFFE);

    this.setAF(0x01b0); // A=0x01, F=B0
    this.setBC(0x0013); // Test-ROM erwartet B=0?
    this.setDE(0x00d8);
    this.setHL(0x014d);
    this.setPC(0x0100);
    this.setSP(0xfffe);

    // this.setZFlag(1);
    // this.setHFlag(1);
    // this.setCFlag(1);
  }
  //@TODO cycleCount implementierung ( machine cycle und cycle ..)
  loop() {
    while (true) {
      this.frameCount++;
      this.currentTime = window.performance.now();
      this.elapsedTime = this.currentTime - this.startTime;

      this.wait();
      this.log +=
        "A:" +
        this.getA().toString(16).padStart(2, "0").toUpperCase() +
        " F:" +
        this.getF().toString(16).padStart(2, "0").toUpperCase() +
        " B:" +
        this.getB().toString(16).padStart(2, "0").toUpperCase() +
        " C:" +
        this.getC().toString(16).padStart(2, "0").toUpperCase() +
        " D:" +
        this.getD().toString(16).padStart(2, "0").toUpperCase() +
        " E:" +
        this.getE().toString(16).padStart(2, "0").toUpperCase() +
        " H:" +
        this.getH().toString(16).padStart(2, "0").toUpperCase() +
        " L:" +
        this.getL().toString(16).padStart(2, "0").toUpperCase() +
        " SP:" +
        this.getSP().toString(16).padStart(4, "0").toUpperCase() +
        " PC:" +
        this.getPC().toString(16).padStart(4, "0").toUpperCase() +
        " PCMEM:" +
        this.memory
          .readByte(this.getPC())
          ?.toString(16)
          .padStart(2, "0")
          .toUpperCase() +
        "," +
        this.memory
          .readByte(this.getPC() + 1)
          ?.toString(16)
          .padStart(2, "0")
          .toUpperCase() +
        "," +
        this.memory
          .readByte(this.getPC() + 2)
          ?.toString(16)
          .padStart(2, "0")
          .toUpperCase() +
        "," +
        this.memory
          .readByte(this.getPC() + 3)
          ?.toString(16)
          .padStart(2, "0")
          .toUpperCase() +
        "\n";
      const opcode = this.fetch();
      const instruction = this.decode(opcode);

      this.i += 1;
      
      this.execute(instruction);
      if (!instruction.getHandlesPC()) {
        this.increasePC(instruction.getLen());
      }
      //Additional visual helpers
      // this.fpsTitle.textContent = `FPS: ${Math.floor(
      //   (this.frameCount / this.elapsedTime) * 1000
      // )}`;
      this.frameCount = 0;
    }

    //this.raf = requestAnimationFrame(() => this.loop());
  }
  stopLoop() {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = undefined;
    }
  }
  //The instruction cycle consists of four phases: fetching an instruction from memory and
  fetch() {
    // Every instruction needs one machine cycle for the fetch stage, and
    //at least one machine cycle for the decode/execute stage.  1 machine cycle = 8 cycles
    this.cycle += 8;
    let currentMemoryData = this.memory.readByte(this.PC);
    // For Blargs CPU test ( without ppu )
    if (this.memory.readByte(0xff02) === 0x81) {
      let c = this.memory.readByte(0xff01);
      const outputEl = document.getElementById("serialOutput");
      outputEl.textContent += String.fromCharCode(c); // oder += c;
      this.memory.writeByte(0xff02, 0x0);
    }

    if (currentMemoryData === 0xcb) {
      this.increasePC(1);
      this.cbModeActive = true;
      currentMemoryData = this.memory.readByte(this.PC);
    } else {
      this.cbModeActive = false;
    }

    return currentMemoryData;
  }
  //decoding the fetched instruction, reading the address from memory...
  decode(opcode) {
    this.increaseCPUCycle(8);

    if (this.cbModeActive) {
      this.cbModeActive = false;
      return InstructionSet.getCBInstruction(opcode);
    }

    return InstructionSet.getInstruction(opcode);
  }
  //and finally, instruction execution.
  execute(instruction) {
    this.increaseCPUCycle(8);
    InstructionSet.executeInstruction(this, instruction);
  }
  wait() {
    // let currentCPUCycle = this.getCPUCycle();
    while (this.getCPUCycle() * 1000 > 0) {
      this.decreaseCPUCycle(1);
    }
  }

  //Meta-Data settings:
  setTitle() {
    for (let i = 0x134; i <= 0x13e; i++) {
      document.getElementById("Title").textContent += String.fromCharCode(
        this.memory.readByte(i)
      );
    }
  }
  setManufacturerCode() {
    for (let i = 0x13f; i <= 0x142; i++) {
      document.getElementById("ManufacturerCode").textContent +=
        String.fromCharCode(this.memory.readByte(i));
    }
  }
  setCGBFlag() {
    const byte = this.memory.readByte(0x143);
    if (byte === 0x80) {
      document.getElementById("CGBFlag").textContent =
        "The game supports CGB enhancements, but is backwards compatible with monochrome Game Boys";
    } else if (byte === 0xc0) {
      document.getElementById("CGBFlag").textContent =
        "The game works on CGB only (the hardware ignores bit 6, so this really functions the same as $80)";
    }
  }
  setNewLicenseeCode() {
    for (let i = 0x144; i <= 0x145; i++) {
      document.getElementById("NewLicenseeCode").textContent +=
        String.fromCharCode(this.memory.readByte(i));
    }
  }
  setSGBflag() {
    document.getElementById("SGBFlag").textContent =
      this.memory.readByte(0x146);
  }
  setCartridgeType() {
    const byte = this.memory.readByte(0x147);
    let cartridgeType = "";

    switch (byte) {
      case 0x00: {
        cartridgeType = "ROM ONLY";
        break;
      }
      case 0x01: {
        cartridgeType = "MBC1";
        break;
      }
      case 0x02: {
        cartridgeType = "MBC1+RAM";
        break;
      }
      case 0x03: {
        cartridgeType = "MBC1+RAM+BATTERY";
        break;
      }
      case 0x05: {
        cartridgeType = "MBC2";
        break;
      }
      case 0x06: {
        cartridgeType = "MBC2+BATTERY";
        break;
      }
      case 0x08: {
        cartridgeType = "ROM+RAM 1";
        break;
      }
      case 0x09: {
        cartridgeType = "ROM+RAM+BATTERY 1";
        break;
      }
      case 0x0b: {
        cartridgeType = "MMM01";
        break;
      }
      case 0x0c: {
        cartridgeType = "MMM01+RAM";
        break;
      }
      case 0x0d: {
        cartridgeType = "MMM01+RAM+BATTERY";
        break;
      }
      case 0x0f: {
        cartridgeType = "MBC3+TIMER+BATTERY";
        break;
      }
      case 0x10: {
        cartridgeType = "MBC3+TIMER+RAM+BATTERY 2";
        break;
      }
      case 0x11: {
        cartridgeType = "MBC3";
        break;
      }
      case 0x12: {
        cartridgeType = "MBC3+RAM 2";
        break;
      }
      case 0x13: {
        cartridgeType = "MBC3+RAM+BATTERY 2";
        break;
      }
      case 0x19: {
        cartridgeType = "MBC5";
        break;
      }
      case 0x1a: {
        cartridgeType = "MBC5+RAM";
        break;
      }
      case 0x1b: {
        cartridgeType = "MBC5+RAM+BATTERY";
        break;
      }
      case 0x1c: {
        cartridgeType = "MBC5+RUMBLE";
        break;
      }
      case 0x1d: {
        cartridgeType = "MBC5+RUMBLE+RAM";
        break;
      }
      case 0x1e: {
        cartridgeType = "MBC5+RUMBLE+RAM+BATTERY";
        break;
      }
      case 0x20: {
        cartridgeType = "MBC6";
        break;
      }
      case 0x22: {
        cartridgeType = "MBC7+SENSOR+RUMBLE+RAM+BATTERY";
        break;
      }
      case 0xfc: {
        cartridgeType = "POCKET CAMERA";
        break;
      }
      case 0xfd: {
        cartridgeType = "BANDAI TAMA5";
        break;
      }
      case 0xfe: {
        cartridgeType = "HuC3";
        break;
      }
      case 0xff: {
        cartridgeType = "HuC1+RAM+BATTERY";
        break;
      }
      default: {
        cartridgeType = "Unknown Cartridge Type";
      }
    }

    document.getElementById("CartridgeType").textContent = cartridgeType;
  }

  setRomSize() {
    const romSizeByte = this.memory.readByte(0x148);
    let romSize = 0;

    switch (romSizeByte) {
      case 0x00: {
        romSize = "32 KiB";
        break;
      }
      case 0x01: {
        romSize = "64 KiB";
        break;
      }
      case 0x02: {
        romSize = "128 KiB";
        break;
      }
      case 0x03: {
        romSize = "256 KiB";
        break;
      }
      case 0x04: {
        romSize = "512 KiB";
        break;
      }
      case 0x05: {
        romSize = "1 MiB";
        break;
      }
      case 0x06: {
        romSize = "2 MiB";
        break;
      }
      case 0x07: {
        romSize = "4 MiB";
        break;
      }
      case 0x08: {
        romSize = "8 MiB";
        break;
      }
      case 0x52: {
        romSize = "1.1 MiB";
        break;
      }
      case 0x53: {
        romSize = "1.2 MiB";
        break;
      }
      case 0x54: {
        romSize = "1.5 MiB";
        break;
      }
      default: {
        romSize = "Unknown ROM Size";
      }
    }

    document.getElementById("RomSize").textContent = romSize;
  }
  setRamSize() {
    const sramSizeByte = this.memory.readByte(0x149);
    let sramSize = "";

    switch (sramSizeByte) {
      case 0x00: {
        sramSize = "0";
        break;
      }
      case 0x02: {
        sramSize = "8 KiB (1 bank)";
        break;
      }
      case 0x03: {
        sramSize = "32 KiB (4 banks of 8 KiB each)";
        break;
      }
      case 0x04: {
        sramSize = "128 KiB (16 banks of 8 KiB each)";
        break;
      }
      case 0x05: {
        sramSize = "64 KiB (8 banks of 8 KiB each)";
        break;
      }
      default: {
        sramSize = "Unknown SRAM Size";
      }
    }
    document.getElementById("RamSize").textContent = sramSize;
  }
  setDestinationCode() {
    const byte = this.memory.readByte(0x14a);
    if (byte === 0x00) {
      document.getElementById("DestinationCode").textContent =
        "Japan (and possibly overseas)";
    } else if (byte === 0x01) {
      document.getElementById("DestinationCode").textContent = "Overseas only";
    }
  }
  setOldLicenseeCode() {
    const byte = this.memory.readByte(0x14b);
    let licenseeCode = "";

    switch (byte) {
      case 0x00: {
        licenseeCode = "None";
        break;
      }
      case 0x01: {
        licenseeCode = "Nintendo";
        break;
      }
      case 0x08: {
        licenseeCode = "Capcom";
        break;
      }
      case 0x09: {
        licenseeCode = "Hot-B";
        break;
      }
      case 0x0a: {
        licenseeCode = "Jaleco";
        break;
      }
      case 0x0b: {
        licenseeCode = "Coconuts Japan";
        break;
      }
      case 0x0c: {
        licenseeCode = "Elite Systems";
        break;
      }
      case 0x13: {
        licenseeCode = "EA (Electronic Arts)";
        break;
      }
      case 0x18: {
        licenseeCode = "Hudsonsoft";
        break;
      }
      case 0x19: {
        licenseeCode = "ITC Entertainment";
        break;
      }
      case 0x1a: {
        licenseeCode = "Yanoman";
        break;
      }
      case 0x1d: {
        licenseeCode = "Japan Clary";
        break;
      }
      case 0x1f: {
        licenseeCode = "Virgin Interactive";
        break;
      }
      case 0x24: {
        licenseeCode = "PCM Complete";
        break;
      }
      case 0x25: {
        licenseeCode = "San-X";
        break;
      }
      case 0x28: {
        licenseeCode = "Kotobuki Systems";
        break;
      }
      case 0x29: {
        licenseeCode = "Seta";
        break;
      }
      case 0x30: {
        licenseeCode = "Infogrames";
        break;
      }
      case 0x31: {
        licenseeCode = "Nintendo";
        break;
      }
      case 0x32: {
        licenseeCode = "Bandai";
        break;
      }
      case 0x33: {
        licenseeCode = "New Licensee Code";
        break;
      }
      case 0x34: {
        licenseeCode = "Konami";
        break;
      }
      case 0x35: {
        licenseeCode = "HectorSoft";
        break;
      }
      case 0x38: {
        licenseeCode = "Capcom";
        break;
      }
      case 0x39: {
        licenseeCode = "Banpresto";
        break;
      }
      case 0x3c: {
        licenseeCode = "Entertainment i";
        break;
      }
      case 0x3e: {
        licenseeCode = "Gremlin";
        break;
      }
      case 0x41: {
        licenseeCode = "Ubisoft";
        break;
      }
      case 0x42: {
        licenseeCode = "Atlus";
        break;
      }
      case 0x44: {
        licenseeCode = "Malibu";
        break;
      }
      case 0x46: {
        licenseeCode = "Angel";
        break;
      }
      case 0x47: {
        licenseeCode = "Spectrum Holoby";
        break;
      }
      case 0x49: {
        licenseeCode = "Irem";
        break;
      }
      case 0x4a: {
        licenseeCode = "Virgin Interactive";
        break;
      }
      case 0x4d: {
        licenseeCode = "Malibu";
        break;
      }
      case 0x4f: {
        licenseeCode = "U.S. Gold";
        break;
      }
      case 0x50: {
        licenseeCode = "Absolute";
        break;
      }
      case 0x51: {
        licenseeCode = "Acclaim";
        break;
      }
      case 0x52: {
        licenseeCode = "Activision";
        break;
      }
      case 0x53: {
        licenseeCode = "American Sammy";
        break;
      }
      case 0x54: {
        licenseeCode = "GameTek";
        break;
      }
      case 0x55: {
        licenseeCode = "Park Place";
        break;
      }
      case 0x56: {
        licenseeCode = "LJN";
        break;
      }
      case 0x57: {
        licenseeCode = "Matchbox";
        break;
      }
      case 0x59: {
        licenseeCode = "Milton Bradley";
        break;
      }
      case 0x5a: {
        licenseeCode = "Mindscape";
        break;
      }
      case 0x5b: {
        licenseeCode = "Romstar";
        break;
      }
      case 0x5c: {
        licenseeCode = "Naxat Soft";
        break;
      }
      case 0x5d: {
        licenseeCode = "Tradewest";
        break;
      }
      case 0x60: {
        licenseeCode = "Titus";
        break;
      }
      case 0x61: {
        licenseeCode = "Virgin Interactive";
        break;
      }
      case 0x67: {
        licenseeCode = "Ocean Interactive";
        break;
      }
      case 0x69: {
        licenseeCode = "EA (Electronic Arts)";
        break;
      }
      case 0x6e: {
        licenseeCode = "Elite Systems";
        break;
      }
      case 0x6f: {
        licenseeCode = "Electro Brain";
        break;
      }
      case 0x70: {
        licenseeCode = "Infogrames";
        break;
      }
      case 0x71: {
        licenseeCode = "Interplay";
        break;
      }
      case 0x72: {
        licenseeCode = "Broderbund";
        break;
      }
      case 0x73: {
        licenseeCode = "Sculptered Soft";
        break;
      }
      case 0x75: {
        licenseeCode = "The Sales Curve";
        break;
      }
      case 0x78: {
        licenseeCode = "t.hq";
        break;
      }
      case 0x79: {
        licenseeCode = "Accolade";
        break;
      }
      case 0x7a: {
        licenseeCode = "Triffix Entertainment";
        break;
      }
      case 0x7c: {
        licenseeCode = "Microprose";
        break;
      }
      case 0x7f: {
        licenseeCode = "Kemco";
        break;
      }
      case 0x80: {
        licenseeCode = "Misawa Entertainment";
        break;
      }
      case 0x83: {
        licenseeCode = "Lozc";
        break;
      }
      case 0x86: {
        licenseeCode = "Tokuma Shoten Intermedia";
        break;
      }
      case 0x8b: {
        licenseeCode = "Bullet-Proof Software";
        break;
      }
      case 0x8c: {
        licenseeCode = "Vic Tokai";
        break;
      }
      case 0x8e: {
        licenseeCode = "Ape";
        break;
      }
      case 0x8f: {
        licenseeCode = "I’Max";
        break;
      }
      case 0x91: {
        licenseeCode = "Chunsoft Co.";
        break;
      }
      case 0x92: {
        licenseeCode = "Video System";
        break;
      }
      case 0x93: {
        licenseeCode = "Tsubaraya Productions Co.";
        break;
      }
      case 0x95: {
        licenseeCode = "Varie Corporation";
        break;
      }
      case 0x96: {
        licenseeCode = "Yonezawa/S’Pal";
        break;
      }
      case 0x97: {
        licenseeCode = "Kaneko";
        break;
      }
      case 0x99: {
        licenseeCode = "Arc";
        break;
      }
      case 0x9a: {
        licenseeCode = "Nihon Bussan";
        break;
      }
      case 0x9b: {
        licenseeCode = "Tecmo";
        break;
      }
      case 0x9c: {
        licenseeCode = "Imagineer";
        break;
      }
      case 0x9d: {
        licenseeCode = "Banpresto";
        break;
      }
      case 0x9f: {
        licenseeCode = "Nova";
        break;
      }
      case 0xa1: {
        licenseeCode = "Hori Electric";
        break;
      }
      case 0xa2: {
        licenseeCode = "Bandai";
        break;
      }
      case 0xa4: {
        licenseeCode = "Konami";
        break;
      }
      case 0xa6: {
        licenseeCode = "Kawada";
        break;
      }
      case 0xa7: {
        licenseeCode = "Takara";
        break;
      }
      case 0xa9: {
        licenseeCode = "Technos Japan";
        break;
      }
      case 0xaa: {
        licenseeCode = "Broderbund";
        break;
      }
      case 0xac: {
        licenseeCode = "Toei Animation";
        break;
      }
      case 0xad: {
        licenseeCode = "Toho";
        break;
      }
      case 0xaf: {
        licenseeCode = "Namco";
        break;
      }
      case 0xb0: {
        licenseeCode = "acclaim";
        break;
      }
      case 0xb1: {
        licenseeCode = "ASCII or Nexsoft";
        break;
      }
      case 0xb2: {
        licenseeCode = "Bandai";
        break;
      }
      case 0xb4: {
        licenseeCode = "Square Enix";
        break;
      }
      case 0xb6: {
        licenseeCode = "HAL Laboratory";
        break;
      }
      case 0xb7: {
        licenseeCode = "SNK";
        break;
      }
      case 0xb9: {
        licenseeCode = "Pony Canyon";
        break;
      }
      case 0xba: {
        licenseeCode = "Culture Brain";
        break;
      }
      case 0xbb: {
        licenseeCode = "Sunsoft";
        break;
      }
      case 0xbd: {
        licenseeCode = "Sony Imagesoft";
        break;
      }
      case 0xbf: {
        licenseeCode = "Sammy";
        break;
      }
      case 0xc0: {
        licenseeCode = "Taito";
        break;
      }
      case 0xc2: {
        licenseeCode = "Kemco";
        break;
      }
      case 0xc3: {
        licenseeCode = "Squaresoft";
        break;
      }
      case 0xc4: {
        licenseeCode = "Tokuma Shoten Intermedia";
        break;
      }
      case 0xc5: {
        licenseeCode = "Data East";
        break;
      }
      case 0xc6: {
        licenseeCode = "Tonkinhouse";
        break;
      }
      case 0xc8: {
        licenseeCode = "Koei";
        break;
      }
      case 0xc9: {
        licenseeCode = "UFL";
        break;
      }
      case 0xca: {
        licenseeCode = "Ultra";
        break;
      }
      case 0xcb: {
        licenseeCode = "Vap";
        break;
      }
      case 0xcc: {
        licenseeCode = "Use Corporation";
        break;
      }
      case 0xcd: {
        licenseeCode = "Meldac";
        break;
      }
      case 0xce: {
        licenseeCode = "Pony Canyon";
        break;
      }
      case 0xcf: {
        licenseeCode = "Angel";
        break;
      }
      case 0xd0: {
        licenseeCode = "Taito";
        break;
      }
      case 0xd1: {
        licenseeCode = "Sofel";
        break;
      }
      case 0xd2: {
        licenseeCode = "Quest";
        break;
      }
      case 0xd3: {
        licenseeCode = "Sigma Enterprises";
        break;
      }
      case 0xd4: {
        licenseeCode = "ASK Kodansha Co.";
        break;
      }
      case 0xd6: {
        licenseeCode = "Naxat Soft";
        break;
      }
      case 0xd7: {
        licenseeCode = "Copya System";
        break;
      }
      case 0xd9: {
        licenseeCode = "Banpresto";
        break;
      }
      case 0xda: {
        licenseeCode = "Tomy";
        break;
      }
      case 0xdb: {
        licenseeCode = "LJN";
        break;
      }
      case 0xdd: {
        licenseeCode = "NCS";
        break;
      }
      case 0xde: {
        licenseeCode = "Human";
        break;
      }
      case 0xdf: {
        licenseeCode = "Altron";
        break;
      }
      case 0xe0: {
        licenseeCode = "Jaleco";
        break;
      }
      case 0xe1: {
        licenseeCode = "Towa Chiki";
        break;
      }
      case 0xe2: {
        licenseeCode = "Yutaka";
        break;
      }
      case 0xe3: {
        licenseeCode = "Varie";
        break;
      }
      case 0xe5: {
        licenseeCode = "Epcoh";
        break;
      }
      case 0xe7: {
        licenseeCode = "Athena";
        break;
      }
      case 0xe8: {
        licenseeCode = "Asmik ACE Entertainment";
        break;
      }
      case 0xe9: {
        licenseeCode = "Natsume";
        break;
      }
      case 0xea: {
        licenseeCode = "King Records";
        break;
      }
      case 0xeb: {
        licenseeCode = "Atlus";
        break;
      }
      case 0xec: {
        licenseeCode = "Epic/Sony Records";
        break;
      }
      case 0xee: {
        licenseeCode = "IGS";
        break;
      }
      case 0xf0: {
        licenseeCode = "A Wave";
        break;
      }
      case 0xf3: {
        licenseeCode = "Extreme Entertainment";
        break;
      }
      case 0xff: {
        licenseeCode = "LJN";
        break;
      }
      default: {
        licenseeCode = "Unknown Licensee Code";
      }
    }

    document.getElementById("OldLicenseeCode").textContent = licenseeCode;
  }

  setMaskROMVersionNumber() {
    document.getElementById("MaskROMVersionNumber").textContent =
      this.memory.readByte(0x14c);
  }
  setHeaderChecksum() {
    let checksum = 0;

    for (let i = 0x134; i <= 0x14c; i++) {
      checksum = checksum - this.memory.readByte(i) - 1;
    }

    const headerChecksumByte = this.memory.readByte(0x14d);
    const calculatedChecksum = checksum & 0xff;

    const checksumMatches = headerChecksumByte === calculatedChecksum;

    document.getElementById(
      "HeaderChecksum"
    ).textContent = `${headerChecksumByte} (Header) vs. ${calculatedChecksum} (Calculated) - ${
      checksumMatches ? "Checksum matches." : "Checksum does not match!"
    }`;
  }

  //Interrupts
  setIme(value) {
    this.ime = value;
  }
  setImeScheduled(value) {
    this.imeScheduled = value;
  }
  //Cycle
  setCPUCycle(value) {
    this.cycle = value;
  }
  getCPUCycle() {
    return this.cycle;
  }
  decreaseCPUCycle(value) {
    this.cycle = this.cycle - value;
  }
  increaseCPUCycle(value) {
    this.cycle = this.cycle + value;
  }
  //Stack Pointer and Program Counter
  setPC(value) {
    this.PC = value;
  }
  getPC() {
    return this.PC;
  }
  decreasePC(value) {
    this.PC = this.PC - value;
  }
  increasePC(value) {
    this.PC = this.PC + value;
  }
  setSP(value) {
    this.SP = value;
  }
  getSP() {
    return this.SP;
  }
  decreaseSP(value) {
     this.SP = (this.SP - value) & 0xFFFF; 
  }
  increaseSP(value) {
      this.SP = (this.SP + value) & 0xFFFF; 
  }
  //Accumulator
  setAF(value) {
    this.AF = value;
  }
  getAF() {
    return this.AF;
  }
  /**
   * Set the A register to the value passed in, but keep the F register the same.
   * @param {value} value - The value to set the register to.
   */
  setA(value) {
    this.AF = (this.AF & 0xff) | ((value & 0xff) << 8);
  }
  /**
   * It returns the value of the A register, shifted right by 8 bits
   * @returns The value of the A register as 0x00FF which comes from 0xFF00.
   */
  getA() {
    return (this.AF & 0xff00) >> 8;
  }
  /**
   * Set the lower 8 bits of the AF register to the lower 8 bits of the value parameter.
   * @param {number} value - The value to set the register to.
   */
  setF(value) {
    this.AF = (this.AF & 0xff00) | (value & 0xf0); // nur obere 4 Bits
  }
  /**
   * This function returns the value of the F register.
   * @returns The lower 8 bits of the AF register as 0x00FF.
   */
  getF() {
    return this.AF & 0xff;
  }

  //Flags
  setZFlag(value) {
    if (value !== 0) {
      // Set Z flag to 1 by setting the 7th bit of F
      this.setF(this.getF() | 0x80);
    } else {
      // Clear Z flag to 0 by clearing the 7th bit of F
      this.setF(this.getF() & 0x7f);
    }
  }

  getZFlag() {
    return (this.getF() & 0x80) >> 7;
  }

  setNFlag(value) {
    if (value !== 0) {
      // Set N flag to 1 by setting the 6th bit of F
      this.setF(this.getF() | 0x40);
    } else {
      // Clear N flag to 0 by clearing the 6th bit of F
      this.setF(this.getF() & 0xbf);
    }
  }

  getNFlag() {
    return (this.getF() & 0x40) >> 6;
  }

  setHFlag(value) {
    if (value !== 0) {
      // Set H flag to 1 by setting the 5th bit of F
      this.setF(this.getF() | 0x20);
    } else {
      // Clear H flag to 0 by clearing the 5th bit of F
      this.setF(this.getF() & 0xdf);
    }
  }

  getHFlag() {
    return (this.getF() & 0x20) >> 5;
  }

  setCFlag(value) {
    if (value !== 0) {
      // Set C flag to 1 by setting the 4th bit of F
      this.setF(this.getF() | 0x10);
    } else {
      // Clear C flag to 0 by clearing the 4th bit of F
      this.setF(this.getF() & 0xef);
    }
  }

  getCFlag() {
    return (this.getF() & 0x10) >> 4;
  }

  //Register  BC, DE and HL
  setBC(value) {
    this.BC = value & 0xffff; // nur die unteren 16 Bit setzen
  }
  setB(value) {
    this.BC = ((value & 0xff) << 8) | (this.BC & 0x00ff);
  }
  setC(value) {
    this.BC = (this.BC & 0xff00) | (value & 0xff);
  }
  getBC() {
    return this.BC & 0xffff;
  }
  getB() {
    return (this.BC >> 8) & 0xff;
  }

  getC() {
    return this.BC & 0xff;
  }
  setDE(value) {
    this.DE = value;
  }
  getDE() {
    return this.DE;
  }
  getE() {
    return this.DE & 0xff; // Extract E register value
  }
  getD() {
    return (this.DE >> 8) & 0xff; // Extract D register value
  }
  setE(value) {
    this.DE = (this.DE & 0xff00) | (value & 0xff);
  }
  setD(value) {
    this.DE = ((value & 0xff) << 8) | (this.DE & 0x00ff);
  }
  setHL(value) {
    this.HL = value;
  }
  getL() {
    return this.HL & 0xff; // Extract E register value
  }
  setL(value) {
    this.HL = (this.HL & 0xff00) | (value & 0xff);
  }
  setH(value) {
    this.HL = ((value & 0xff) << 8) | (this.HL & 0xff);
  }
  getH() {
    return (this.HL >> 8) & 0xff; // Extract H register value
  }
  getHL() {
    return this.HL & 0xffff;
  }
  adc(a, value, carry) {
    const result = a + value + carry;

    // Flags
    const z = (result & 0xff) === 0 ? 1 : 0;
    const n = 0;
    const h = (a & 0xf) + (value & 0xf) + carry > 0xf ? 1 : 0;
    const c = result > 0xff ? 1 : 0;

    return {
      result: result & 0xff,
      z,
      n,
      h,
      c,
    };
  }
  // Hilfsfunktion für DEC eines 8-Bit-Registers
  dec8bit(getReg, setReg) {
    const val = getReg();
    const result = (val - 1) & 0xff;

    setReg(result);

    this.setZFlag(result === 0 ? 1 : 0);
    this.setNFlag(1);
    this.setHFlag((val & 0x0f) === 0 ? 1 : 0);
  }

  // Hilfsfunktion für DEC eines 16-Bit-Registers
  dec16bit(getReg, setReg) {
    const result = (getReg() - 1) & 0xffff;
    setReg(result);
    // Z und H bleiben unverändert
  }
  toUnsigned16Bit(LSBValue, MSBValue) {
    return (MSBValue << 8) | LSBValue;
  }
  toSigned16Bit(lsb, msb) {
    // 16-Bit-Wert zusammenbauen
    const value = (msb << 8) | lsb;

    // In signed 16 Bit umwandeln
    return (value << 16) >> 16;
  }
  toSigned8Bit(value) {
    // Sicherstellen, dass nur 8 Bit verwendet werden
    value &= 0xff;

    // Signed-Konvertierung
    return (value << 24) >> 24;
  }
}

// console.log(
//   "INDEX: " + this.i +
//   "A:" + this.getA().toString(16).padStart(2, "0").toUpperCase() +
//   " F:" + this.getF().toString(16).padStart(2, "0").toUpperCase() +
//   " B:" + this.getB().toString(16).padStart(2, "0").toUpperCase() +
//   " C:" + this.getC().toString(16).padStart(2, "0").toUpperCase() +
//   " D:" + this.getD().toString(16).padStart(2, "0").toUpperCase() +
//   " E:" + this.getE().toString(16).padStart(2, "0").toUpperCase() +
//   " H:" + ((this.getHL() >> 8) & 0xFF).toString(16).padStart(2, "0").toUpperCase() +
//   " L:" + this.getL().toString(16).padStart(2, "0").toUpperCase() +
//   " SP:" + this.getSP().toString(16).padStart(4, "0").toUpperCase() +
//   " PC:" + this.getPC().toString(16).padStart(4, "0").toUpperCase() +
//   " PCMEM:" + this.memory.readByte(this.getPC()).toString(16).padStart(2, "0").toUpperCase() +
//   "," + this.memory.readByte(this.getPC() + 1)?.toString(16).padStart(2, "0").toUpperCase() +
//   "," + this.memory.readByte(this.getPC() + 2)?.toString(16).padStart(2, "0").toUpperCase() +
//   "," + this.memory.readByte(this.getPC() + 3)?.toString(16).padStart(2, "0").toUpperCase()
// );
