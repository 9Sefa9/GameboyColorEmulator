class MBC1 {
  constructor(rom, ramSize) {
    this.rom = rom;
    this.ram = new Uint8Array(ramSize);
    this.wram = new Uint8Array(0x8000); // WRAM bank 0 + Echo RAM

    this.ramEnabled = false;
    this.romBank = 1;
    this.ramBank = 0;
    this.mode = 0;
    this.oam = new Uint8Array(0xA0); // OAM (Object Attribute Memory)
    this.ioRegisters = new Uint8Array(0x80); // I/O Registers
    this.interruptEnabled = 0; // Interrupt Enabled Register
  }

  readByte(address) {
    if (address <= 0x3FFF) {
      return this.rom[address];
    } else if (address >= 0x4000 && address <= 0x7FFF) {
      const bankOffset = (this.mode === 0) ? 0x4000 : (this.romBank - 1) * 0x4000;
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
    }
    else if (address >= 0xFF00 && address <= 0xFF7F) {
      return this.ioRegisters[address - 0xFF00]; // Read from I/O Registers
    }
    else if (address >= 0xFF80 && address <= 0xFFFE) {
      return this.ram[address]; // High RAM Area
    }
    else if (address === 0xFFFF) {
      return this.interruptEnabled; // Read from Interrupt Enabled Register
    }
    else {
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }
  }

  writeByte(address, value) {
    if (address <= 0x1FFF) {
      this.ramEnabled = (value & 0x0F) === 0x0A;
    } else if (address >= 0x2000 && address <= 0x3FFF) {
      this.romBank = (this.romBank & 0x60) | (value & 0x1F);
      if ([0x00, 0x20, 0x40, 0x60].includes(this.romBank)) {
        this.romBank++;
      }
    } else if (address >= 0x4000 && address <= 0x5FFF) {
      if (this.mode === 0) {
        this.ramBank = value & 0x03;
      } else {
        this.romBank = (value & 0x03) << 5 | (this.romBank & 0x1F);
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
    }
    else if (address >= 0xFEA0 && address <= 0xFEFF) {
      return; // Unused
    }
    else if (address >= 0xFF00 && address <= 0xFF7F) {
      this.ioRegisters[address - 0xFF00] = value; // Write to I/O Registers
    }
    else if (address >= 0xFF80 && address <= 0xFFFE) {
      this.ram[address] = value; // High RAM Area
    }
    else if (address === 0xFFFF) {
      this.interruptEnabled = value; // Write to Interrupt Enabled Register
    }
    else {
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }
  }
}