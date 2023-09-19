class MBC1 {
  constructor(rom, ramSize) {
    this.rom = rom;
    this.ram = new Uint8Array(ramSize);
    this.wram = new Uint8Array(0x8000); // WRAM bank 0 + Echo RAM
    this.vram = new Uint8Array(0x2000); // VRAM
    this.zram = new Uint8Array(0x80); // Zero-page RAM

    this.ramEnabled = false;
    this.romBank = 1;
    this.ramBank = 0;
    this.mode = 0;
    this.oam = new Uint8Array(0xA0); // OAM (Object Attribute Memory)
    this.ioRegisters = new Uint8Array(0x80); // I/O Registers
    this.interruptEnabled = 0; // Interrupt Enabled Register
  }

  readByte(address) {
    
    //console.log("READ: ADDRESS: ",address.toString(16));
    if (address <= 0x3FFF) {
      return this.rom[address];
    } else if (address >= 0x4000 && address <= 0x7FFF) {
      const bankOffset = (this.mode === 0) ? 0x4000 : ((this.romBank - 1) & 0x1F) * 0x4000;
      return this.rom[bankOffset + (address - 0x4000)];
    } else if (address >= 0xA000 && address <= 0xBFFF) {
      if (this.ramEnabled) {
        return this.ram[this.ramBank * 0x2000 + (address - 0xA000)];
      } else {
        return 0xFF;
      }
    } else if (address === 0xFF44) {
      return 0x90;
    } else if (address >= 0xC000 && address <= 0xDFFF) {
      return this.wram[address - 0xC000]; // Read from WRAM bank 0 + Echo RAM
    } else if (address >= 0xE000 && address <= 0xFDFF) {
      return this.wram[address - 0xE000]; // Read from Echo RAM
    } else if (address >= 0xFE00 && address <= 0xFE9F) {
      return this.oam[address - 0xFE00]; // Read from OAM
    } else if (address >= 0x9800 && address <= 0x9BFF) {
      return this.vram[address - 0x9800];
    } else if (address >= 0xFF00 && address <= 0xFF7F) {
      return this.ioRegisters[address - 0xFF00]; // Read from I/O Registers
    } else if (address >= 0xFF80 && address <= 0xFFFE) {
      return this.zram[address - 0xFF80]; // Read from Zero-page RAM
    } else if (address === 0xFFFF) {
      return this.interruptEnabled; // Read from Interrupt Enabled Register
    } else {
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }
  }

  writeByte(address, value) {
    //console.log("WRITE: ADDRESS: ",address.toString(16),"; VALUE: ",value.toString(16));
    if (address <= 0x1FFF) {
      this.ramEnabled = (value & 0x0F) === 0x0A;
    } else if (address >= 0x2000 && address <= 0x3FFF) {
      this.romBank = (this.romBank & 0x60) | (value & 0x1F);
      if (this.romBank === 0x00 || this.romBank === 0x20 || this.romBank === 0x40 || this.romBank === 0x60) {
        this.romBank++;
      }
    } else if (address >= 0x4000 && address <= 0x5FFF) {
      if (this.mode === 0) {
        this.ramBank = value & 0x03;
      } else {
        this.romBank = (this.romBank & 0x1F) | ((value & 0x03) << 5);
      }
    } else if (address >= 0x6000 && address <= 0x7FFF) {
      this.mode = value & 0x01;
    } else if (address >= 0xA000 && address <= 0xBFFF && this.ramEnabled) {
      this.ram[this.ramBank * 0x2000 + (address - 0xA000)] = value;
    } else if (address >= 0xC000 && address <= 0xDFFF) {
      this.wram[address - 0xC000] = value; // Write to WRAM bank 0 + Echo RAM
    } else if (address >= 0xE000 && address <= 0xFDFF) {
      this.wram[address - 0xE000] = value; // Write to Echo RAM
    } else if (address >= 0xFE00 && address <= 0xFE9F) {
      this.oam[address - 0xFE00] = value; // Write to OAM
    } else if (address >= 0x9800 && address <= 0x9BFF) {
      this.vram[address - 0x9800] = value;
    } else if (address >= 0xFF00 && address <= 0xFF7F) {
      this.ioRegisters[address - 0xFF00] = value; // Write to I/O Registers
    } else if (address >= 0xFF80 && address <= 0xFFFE) {
      this.zram[address - 0xFF80] = value; // Write to Zero-page RAM
    } else if (address === 0xFFFF) {
      this.interruptEnabled = value; // Write to Interrupt Enabled Register
    } else {
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }
  }
}