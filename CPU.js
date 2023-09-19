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
    this.fpsTitle = document.querySelector('.fps');

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

      reader.onload = (e) => { // define the onload event handler
        const arrayBuffer = e.target.result; // get the contents of the file as an ArrayBuffer
        const rom = new Uint8Array(arrayBuffer); // create a new Uint8Array from the ArrayBuffer
        this.memory = new MBC1(rom, 0xFFFF);

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

        this.startTime = window.performance.now();
        this.raf = requestAnimationFrame(() => this.loop());
      };
      reader.readAsArrayBuffer(file); // read the file as an ArrayBuffer
      this.reset();
    };

    document.getElementById("pause").onclick = () => {
      console.log("PAUSE");
      this.stopLoop()
    };

    document.getElementById("resume").onclick = () => {
      console.log("RESUME");
      this.startTime = window.performance.now();
      this.raf = requestAnimationFrame(() => this.loop());
    };

    document.getElementById("export-log").onclick = () => {
      console.log("EXPORT LOG");
      fetch('http://localhost:3000/logs', {
        method: 'POST',
        body: JSON.stringify({
          message: this.log
        }),
        headers: {
          'Content-Type': 'application/json'
        }
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

    this.setPC(0x0100);
    this.setA(0x01);
    this.setBC(0x0013);
    this.setDE(0x00D8);
    this.setHL(0x014D);
    this.setSP(0xFFFE);

    this.setZFlag(1);
    this.setHFlag(1);
    this.setCFlag(1);



  }
  //@TODO cycleCount implementierung ( machine cycle und cycle ..)
  loop() {

    this.frameCount++;
    this.currentTime = window.performance.now();
    this.elapsedTime = this.currentTime - this.startTime;

    if (this.elapsedTime >= 11.72) {
      this.stopLoop();
      this.startTime = this.currentTime;
      //this.wait();
      const opcode = this.fetch();
      const instruction = this.decode(opcode);

      this.log += (
        "A:" + this.getA().toString(16).padStart(2, "0").toUpperCase() +
        " F:" + this.getF().toString(16).padStart(2, "0").toUpperCase() +
        " B:" + this.getB().toString(16).padStart(2, "0").toUpperCase() +
        " C:" + this.getC().toString(16).padStart(2, "0").toUpperCase() +
        " D:" + this.getD().toString(16).padStart(2, "0").toUpperCase() +
        " E:" + this.getE().toString(16).padStart(2, "0").toUpperCase() +
        " H:" + ((this.getHL() >> 8) & 0xFF).toString(16).padStart(2, "0").toUpperCase() +
        " L:" + this.getL().toString(16).padStart(2, "0").toUpperCase() +
        " SP:" + this.getSP().toString(16).padStart(4, "0").toUpperCase() +
        " PC:" + this.getPC().toString(16).padStart(4, "0").toUpperCase() +
        " PCMEM:" + this.memory.readByte(this.getPC()).toString(16).padStart(2, "0").toUpperCase() +
        "," + this.memory.readByte(this.getPC() + 1)?.toString(16).padStart(2, "0").toUpperCase() +
        "," + this.memory.readByte(this.getPC() + 2)?.toString(16).padStart(2, "0").toUpperCase() +
        "," + this.memory.readByte(this.getPC() + 3)?.toString(16).padStart(2, "0").toUpperCase()
      ) + "\n";
       this.i+=1;
       if(this.i === 31000){
        console.log("I",this.i);
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
      this.PC += 1;
      this.execute(instruction);


      //Additional visual helpers
      this.fpsTitle.textContent = `FPS: ${Math.floor((this.frameCount / this.elapsedTime) * 1000)}`;
      this.frameCount = 0;

    }

    this.raf = requestAnimationFrame(() => this.loop());
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
    if (this.memory.readByte(0xFF02) === 0x81) {
      let c = this.memory.readByte(0xFF01);
      console.log("RESULTS-----------------------------------------------------------------------------------------------:");
      console.log(c);
      this.memory.writeByte(0xFF02, 0x0);
    }

    if (currentMemoryData === 0xCB) {
      this.PC += 1;
      currentMemoryData = (currentMemoryData & 0xFF00) | (this.memory.readByte(this.getPC()) & 0xFF);
    }

    return currentMemoryData;
  }
  //decoding the fetched instruction, reading the address from memory...
  decode(opcode) {

    this.increaseCPUCycle(8);
    return InstructionSet.getInstruction(opcode);

  }
  //and finally, instruction execution. 
  execute(instruction) {
    this.increaseCPUCycle(8);
    InstructionSet.executeInstruction(this, instruction);
  }
  wait() {
    // let currentCPUCycle = this.getCPUCycle();
    while (this.getCPUCycle() > 0) {
      this.decreaseCPUCycle(1);
    }
  }

  //Meta-Data settings:
  setTitle() {
    for (let i = 0x134; i <= 0x13E; i++) {
      document.getElementById("Title").textContent += String.fromCharCode(this.memory.readByte(i));
    }
  }
  setManufacturerCode() {
    for (let i = 0x13F; i <= 0x142; i++) {
      document.getElementById("ManufacturerCode").textContent += String.fromCharCode(this.memory.readByte(i));
    }
  }
  setCGBFlag() {
    const byte = this.memory.readByte(0x143);
    if (byte === 0x80) {

      document.getElementById("CGBFlag").textContent = "The game supports CGB enhancements, but is backwards compatible with monochrome Game Boys"
    }
    else if (byte === 0xC0) {
      document.getElementById("CGBFlag").textContent = "The game works on CGB only (the hardware ignores bit 6, so this really functions the same as $80)"
    }
  }
  setNewLicenseeCode() {
    for (let i = 0x144; i <= 0x145; i++) {
      document.getElementById("NewLicenseeCode").textContent += String.fromCharCode(this.memory.readByte(i));
    }
  }
  setSGBflag() {
    document.getElementById("SGBFlag").textContent = this.memory.readByte(0x146);
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
      case 0x0B: {
        cartridgeType = "MMM01";
        break;
      }
      case 0x0C: {
        cartridgeType = "MMM01+RAM";
        break;
      }
      case 0x0D: {
        cartridgeType = "MMM01+RAM+BATTERY";
        break;
      }
      case 0x0F: {
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
      case 0x1A: {
        cartridgeType = "MBC5+RAM";
        break;
      }
      case 0x1B: {
        cartridgeType = "MBC5+RAM+BATTERY";
        break;
      }
      case 0x1C: {
        cartridgeType = "MBC5+RUMBLE";
        break;
      }
      case 0x1D: {
        cartridgeType = "MBC5+RUMBLE+RAM";
        break;
      }
      case 0x1E: {
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
      case 0xFC: {
        cartridgeType = "POCKET CAMERA";
        break;
      }
      case 0xFD: {
        cartridgeType = "BANDAI TAMA5";
        break;
      }
      case 0xFE: {
        cartridgeType = "HuC3";
        break;
      }
      case 0xFF: {
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
    const byte = this.memory.readByte(0x14A);
    if (byte === 0x00) {
      document.getElementById("DestinationCode").textContent = "Japan (and possibly overseas)"
    }
    else if (byte === 0x01) {
      document.getElementById("DestinationCode").textContent = "Overseas only"
    }
  }
  setOldLicenseeCode() {
    const byte = this.memory.readByte(0x14B);
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
      case 0x0A: {
        licenseeCode = "Jaleco";
        break;
      }
      case 0x0B: {
        licenseeCode = "Coconuts Japan";
        break;
      }
      case 0x0C: {
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
      case 0x1A: {
        licenseeCode = "Yanoman";
        break;
      }
      case 0x1D: {
        licenseeCode = "Japan Clary";
        break;
      }
      case 0x1F: {
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
      case 0x3C: {
        licenseeCode = "Entertainment i";
        break;
      }
      case 0x3E: {
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
      case 0x4A: {
        licenseeCode = "Virgin Interactive";
        break;
      }
      case 0x4D: {
        licenseeCode = "Malibu";
        break;
      }
      case 0x4F: {
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
      case 0x5A: {
        licenseeCode = "Mindscape";
        break;
      }
      case 0x5B: {
        licenseeCode = "Romstar";
        break;
      }
      case 0x5C: {
        licenseeCode = "Naxat Soft";
        break;
      }
      case 0x5D: {
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
      case 0x6E: {
        licenseeCode = "Elite Systems";
        break;
      }
      case 0x6F: {
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
      case 0x7A: {
        licenseeCode = "Triffix Entertainment";
        break;
      }
      case 0x7C: {
        licenseeCode = "Microprose";
        break;
      }
      case 0x7F: {
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
      case 0x8B: {
        licenseeCode = "Bullet-Proof Software";
        break;
      }
      case 0x8C: {
        licenseeCode = "Vic Tokai";
        break;
      }
      case 0x8E: {
        licenseeCode = "Ape";
        break;
      }
      case 0x8F: {
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
      case 0x9A: {
        licenseeCode = "Nihon Bussan";
        break;
      }
      case 0x9B: {
        licenseeCode = "Tecmo";
        break;
      }
      case 0x9C: {
        licenseeCode = "Imagineer";
        break;
      }
      case 0x9D: {
        licenseeCode = "Banpresto";
        break;
      }
      case 0x9F: {
        licenseeCode = "Nova";
        break;
      }
      case 0xA1: {
        licenseeCode = "Hori Electric";
        break;
      }
      case 0xA2: {
        licenseeCode = "Bandai";
        break;
      }
      case 0xA4: {
        licenseeCode = "Konami";
        break;
      }
      case 0xA6: {
        licenseeCode = "Kawada";
        break;
      }
      case 0xA7: {
        licenseeCode = "Takara";
        break;
      }
      case 0xA9: {
        licenseeCode = "Technos Japan";
        break;
      }
      case 0xAA: {
        licenseeCode = "Broderbund";
        break;
      }
      case 0xAC: {
        licenseeCode = "Toei Animation";
        break;
      }
      case 0xAD: {
        licenseeCode = "Toho";
        break;
      }
      case 0xAF: {
        licenseeCode = "Namco";
        break;
      }
      case 0xB0: {
        licenseeCode = "acclaim";
        break;
      }
      case 0xB1: {
        licenseeCode = "ASCII or Nexsoft";
        break;
      }
      case 0xB2: {
        licenseeCode = "Bandai";
        break;
      }
      case 0xB4: {
        licenseeCode = "Square Enix";
        break;
      }
      case 0xB6: {
        licenseeCode = "HAL Laboratory";
        break;
      }
      case 0xB7: {
        licenseeCode = "SNK";
        break;
      }
      case 0xB9: {
        licenseeCode = "Pony Canyon";
        break;
      }
      case 0xBA: {
        licenseeCode = "Culture Brain";
        break;
      }
      case 0xBB: {
        licenseeCode = "Sunsoft";
        break;
      }
      case 0xBD: {
        licenseeCode = "Sony Imagesoft";
        break;
      }
      case 0xBF: {
        licenseeCode = "Sammy";
        break;
      }
      case 0xC0: {
        licenseeCode = "Taito";
        break;
      }
      case 0xC2: {
        licenseeCode = "Kemco";
        break;
      }
      case 0xC3: {
        licenseeCode = "Squaresoft";
        break;
      }
      case 0xC4: {
        licenseeCode = "Tokuma Shoten Intermedia";
        break;
      }
      case 0xC5: {
        licenseeCode = "Data East";
        break;
      }
      case 0xC6: {
        licenseeCode = "Tonkinhouse";
        break;
      }
      case 0xC8: {
        licenseeCode = "Koei";
        break;
      }
      case 0xC9: {
        licenseeCode = "UFL";
        break;
      }
      case 0xCA: {
        licenseeCode = "Ultra";
        break;
      }
      case 0xCB: {
        licenseeCode = "Vap";
        break;
      }
      case 0xCC: {
        licenseeCode = "Use Corporation";
        break;
      }
      case 0xCD: {
        licenseeCode = "Meldac";
        break;
      }
      case 0xCE: {
        licenseeCode = "Pony Canyon";
        break;
      }
      case 0xCF: {
        licenseeCode = "Angel";
        break;
      }
      case 0xD0: {
        licenseeCode = "Taito";
        break;
      }
      case 0xD1: {
        licenseeCode = "Sofel";
        break;
      }
      case 0xD2: {
        licenseeCode = "Quest";
        break;
      }
      case 0xD3: {
        licenseeCode = "Sigma Enterprises";
        break;
      }
      case 0xD4: {
        licenseeCode = "ASK Kodansha Co.";
        break;
      }
      case 0xD6: {
        licenseeCode = "Naxat Soft";
        break;
      }
      case 0xD7: {
        licenseeCode = "Copya System";
        break;
      }
      case 0xD9: {
        licenseeCode = "Banpresto";
        break;
      }
      case 0xDA: {
        licenseeCode = "Tomy";
        break;
      }
      case 0xDB: {
        licenseeCode = "LJN";
        break;
      }
      case 0xDD: {
        licenseeCode = "NCS";
        break;
      }
      case 0xDE: {
        licenseeCode = "Human";
        break;
      }
      case 0xDF: {
        licenseeCode = "Altron";
        break;
      }
      case 0xE0: {
        licenseeCode = "Jaleco";
        break;
      }
      case 0xE1: {
        licenseeCode = "Towa Chiki";
        break;
      }
      case 0xE2: {
        licenseeCode = "Yutaka";
        break;
      }
      case 0xE3: {
        licenseeCode = "Varie";
        break;
      }
      case 0xE5: {
        licenseeCode = "Epcoh";
        break;
      }
      case 0xE7: {
        licenseeCode = "Athena";
        break;
      }
      case 0xE8: {
        licenseeCode = "Asmik ACE Entertainment";
        break;
      }
      case 0xE9: {
        licenseeCode = "Natsume";
        break;
      }
      case 0xEA: {
        licenseeCode = "King Records";
        break;
      }
      case 0xEB: {
        licenseeCode = "Atlus";
        break;
      }
      case 0xEC: {
        licenseeCode = "Epic/Sony Records";
        break;
      }
      case 0xEE: {
        licenseeCode = "IGS";
        break;
      }
      case 0xF0: {
        licenseeCode = "A Wave";
        break;
      }
      case 0xF3: {
        licenseeCode = "Extreme Entertainment";
        break;
      }
      case 0xFF: {
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
    document.getElementById("MaskROMVersionNumber").textContent = this.memory.readByte(0x14C);
  }
  setHeaderChecksum() {
    let checksum = 0;

    for (let i = 0x134; i <= 0x14C; i++) {
      checksum = checksum - this.memory.readByte(i) - 1;
    }

    const headerChecksumByte = this.memory.readByte(0x14D);
    const calculatedChecksum = checksum & 0xFF;

    const checksumMatches = headerChecksumByte === calculatedChecksum;

    document.getElementById("HeaderChecksum").textContent = `${headerChecksumByte} (Header) vs. ${calculatedChecksum} (Calculated) - ${checksumMatches ? "Checksum matches." : "Checksum does not match!"
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
    this.SP = this.SP - value;
  }
  increaseSP(value) {
    this.SP = this.SP + value;
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
    this.AF = (this.AF & 0xFF) | ((value & 0xFF) << 8);
  }
  /**
   * It returns the value of the A register, shifted right by 8 bits
   * @returns The value of the A register as 0x00FF which comes from 0xFF00.
   */
  getA() {
    return (this.AF & 0xFF00) >> 8;
  }
  /**
   * Set the lower 8 bits of the AF register to the lower 8 bits of the value parameter.
   * @param {number} value - The value to set the register to.
   */
  setF(value) {
    this.AF = (this.AF & 0xFF00) | (value & 0xFF);
  }
  /**
   * This function returns the value of the F register.
   * @returns The lower 8 bits of the AF register as 0x00FF.
   */
  getF() {
    return (this.AF & 0xFF);
  }

  //Flags
  setZFlag(value) {
    if (value !== 0) {
      // Set Z flag to 1 by setting the 7th bit of F
      this.setF(this.getF() | 0x80);
    } else {
      // Clear Z flag to 0 by clearing the 7th bit of F
      this.setF(this.getF() & 0x7F);
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
      this.setF(this.getF() & 0xBF);
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
      this.setF(this.getF() & 0xDF);
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
      this.setF(this.getF() & 0xEF);
    }
  }

  getCFlag() {
    return (this.getF() & 0x10) >> 4;
  }

  //Register  BC, DE and HL
  setBC(value) {
    this.BC = value;
  }
  setB(value) {
    this.BC = (this.BC & 0xFF) | ((value & 0xFF) << 8);
  }
  setC(value) {
    // Clear the lower 8 bits (LSB) of the BC register and set them to the new C value
    this.setBC((this.getBC() & 0xFF00) | (value & 0xFF));
  }
  getBC() {
    return this.BC;
  }
  getB() {
    return (this.getBC() >> 8) & 0xFF; // Extract B register value
  }

  getC() {
    // Return the lower 8 bits (LSB) of the BC register, which represent the C register
    return this.getBC() & 0xFF;
  }
  setDE(value) {
    this.DE = value;
  }
  getDE() {
    return this.DE;
  }
  getE() {
    return this.DE & 0xFF; // Extract E register value
  }
  getD() {
    return (this.DE >> 8) & 0xFF; // Extract D register value
  }
  setE(value) {
    this.DE = (this.DE & 0xFF00) | (value & 0xFF);
  }
  setD(value) {
    this.DE = (this.DE & 0xFF) | ((value & 0xFF) << 8);
  }
  setHL(value) {
    this.HL = value;
  }
  getL() {
    return this.HL & 0xFF; // Extract E register value
  }
  setL(value) {
    this.HL = (this.HL & 0xFF00) | (value & 0xFF);
  }
  setH(value) {
    this.HL = (this.HL & 0xFF) | ((value & 0xFF) << 8);
  }
  getH() {
    return (this.HL >> 8) & 0xFF; // Extract H register value
  }
  getHL() {
    return this.HL;
  }
  toUnsigned16Bit(LSBValue, MSBValue) {
    return (MSBValue << 8) | LSBValue;
  }
}