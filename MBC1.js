class MBC1 {
  constructor(rom, ramSize = 0x8000) {
    this.rom = rom;
    this.ram = new Uint8Array(ramSize); // external RAM
    this.wram = new Uint8Array(0x8000); // 8 Banks à 4KB = 32KB total WRAM
    this.vram = new Uint8Array(0x2000); // VRAM
    this.oam = new Uint8Array(0xa0); // OAM
    this.ioRegisters = new Uint8Array(0x80); // FF00–FF7F
    this.zram = new Uint8Array(0x7f); // FF80–FFFE
    this.interruptEnabled = 0;

    this.romBank = 1;
    this.ramBank = 0;
    this.mode = 0;
    this.ramEnabled = false;

    // GBC: SVBK Register initialisieren (WRAM Bank Control)
    this.ioRegisters[0x70] = 0x01; // Start with bank 1
  }

  readByte(address, cpu = null) {
    if (address > 0xffff) {
      console.error(
        `MBC1 READ out of range: 0x${address.toString(16)} PC: ${
          cpu ? cpu.getPC().toString(16) : "unknown"
        }`
      );
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }

    if (address === 0xff44) return 0x90; // TEMP workaround

    let value;
    if (address <= 0x3fff) {
      const bank0 = this.mode === 0 ? 0 : (this.romBank & 0x60) >> 5;
      value = this.rom[bank0 * 0x4000 + address];
    } else if (address <= 0x7fff) {
      let bank = this.romBank & 0x7f;
      if ((bank & 0x1f) === 0) bank |= 1;
      bank %= this.rom.length / 0x4000;
      value = this.rom[bank * 0x4000 + (address - 0x4000)];
    } else if (address <= 0x9fff) {
      value = this.vram[address - 0x8000];
    } else if (address <= 0xbfff) {
      if (!this.ramEnabled || this.ram.length === 0) value = 0xff;
      else {
        const bank = this.mode === 0 ? 0 : this.ramBank & 3;
        value = this.ram[bank * 0x2000 + (address - 0xa000)];
      }
    } else if (address <= 0xdfff) {
      const offset = address - 0xc000;
      if (address < 0xd000) {
        // 0xC000-0xCFFF: Fixed WRAM Bank 0
        value = this.wram[offset];
      } else {
        // 0xD000-0xDFFF: Switchable WRAM Bank 1-7 (GBC)
        let bank = this.ioRegisters[0x70] & 0x07;
        if (bank === 0) bank = 1; // Bank 0 not allowed, becomes bank 1
        value = this.wram[bank * 0x1000 + (offset - 0x1000)];
      }
    } else if (address >= 0xe000 && address <= 0xfdff) {
      value = this.readByte(address - 0x2000, cpu);
    } else if (address <= 0xfe9f) {
      value = this.oam[address - 0xfe00];
    } else if (address <= 0xff7f) {
      const idx = address - 0xff00;
      value = idx >= 0x80 ? 0xff : this.ioRegisters[idx];
    } else if (address <= 0xfffe) {
      const idx = address - 0xff80;
      value = idx >= 0x7f ? 0xff : this.zram[idx];
    } else if (address === 0xffff) {
      value = this.interruptEnabled;
    } else {
      console.error(`MBC1 READ invalid address: 0x${address.toString(16)}`);
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }

    if (cpu && address >= 0xDD00 && address <= 0xDDFF) {
      console.log(
        `MBC1 READ WRAM: 0x${address.toString(16)} => 0x${value.toString(
          16
        )} bank:${this.ioRegisters[0x70] & 0x07} PC: 0x${cpu.getPC().toString(16)}`
      );
    }
    return value;
  }

  writeByte(address, value, cpu = null) {
    if (address > 0xffff) {
      console.error(
        `MBC1 WRITE out of range: 0x${address.toString(
          16
        )} value: 0x${value.toString(16)} PC: ${
          cpu ? cpu.getPC().toString(16) : "unknown"
        }`
      );
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }

    if (address <= 0x1fff) {
      this.ramEnabled = (value & 0x0f) === 0x0a;
    } else if (address <= 0x3fff) {
      let lower5 = value & 0x1f;
      if (lower5 === 0) lower5 = 1;
      this.romBank = (this.romBank & 0x60) | lower5;
    } else if (address <= 0x5fff) {
      const upper2 = value & 3;
      if (this.mode === 0) this.romBank = (this.romBank & 0x1f) | (upper2 << 5);
      else this.ramBank = upper2;
    } else if (address <= 0x7fff) {
      this.mode = value & 1;
    } else if (address <= 0x9fff) {
      this.vram[address - 0x8000] = value;
    } else if (address <= 0xbfff && this.ramEnabled) {
      const bank = this.mode === 0 ? 0 : this.ramBank & 3;
      this.ram[bank * 0x2000 + (address - 0xa000)] = value;
    } else if (address <= 0xdfff) {
      const offset = address - 0xc000;
      if (address < 0xd000) {
        // 0xC000-0xCFFF: Fixed WRAM Bank 0
        this.wram[offset] = value;
      } else {
        // 0xD000-0xDFFF: Switchable WRAM Bank 1-7 (GBC)
        let bank = this.ioRegisters[0x70] & 0x07;
        if (bank === 0) bank = 1; // Bank 0 not allowed, becomes bank 1
        this.wram[bank * 0x1000 + (offset - 0x1000)] = value;
      }
    } else if (address >= 0xe000 && address <= 0xfdff) {
      this.writeByte(address - 0x2000, value, cpu);
    } else if (address <= 0xfe9f) {
      this.oam[address - 0xfe00] = value;
    } else if (address <= 0xff7f) {
      const idx = address - 0xff00;
      if (idx < 0x80) {
        // Special handling for SVBK register (0xFF70)
        if (idx === 0x70) {
          // SVBK - WRAM Bank Control (only bits 0-2 are used)
          this.ioRegisters[idx] = value & 0x07;
        } else {
          this.ioRegisters[idx] = value;
        }
      }
    } else if (address <= 0xfffe) {
      const idx = address - 0xff80;
      if (idx < 0x7f) this.zram[idx] = value;
    } else if (address === 0xffff) {
      this.interruptEnabled = value;
    } else {
      console.error(`MBC1 WRITE invalid address: 0x${address.toString(16)}`);
      throw new Error(`Address out of range: 0x${address.toString(16)}`);
    }

    if (cpu && address >= 0xDD00 && address <= 0xDDFF) {
      console.log(
        `MBC1 WRITE WRAM: 0x${address.toString(16)} <= 0x${value.toString(
          16
        )} bank:${this.ioRegisters[0x70] & 0x07} PC: 0x${cpu.getPC().toString(16)}`
      );
    }
  }
}