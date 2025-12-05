class MBC1 {
  constructor(rom, ramSize = 0x8000) {
    this.rom = rom;
    this.ramSize = ramSize;
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

    // Initialize I/O registers with their Game Boy power-on values
    this.initializeIORegisters();

    // Reference to CPU for LCD access
    this.cpu = null;
  }

  setCPU(cpu) {
    this.cpu = cpu;
  }

  initializeIORegisters() {
    // Set default/reset values for I/O registers
    // Reference: https://gbdev.io/pandocs/Power_Up_Sequence.html

    // 0xFF00 - P1/JOYP (Joypad)
    this.ioRegisters[0x00] = 0xcf;

    // 0xFF01 - SB (Serial Data)
    this.ioRegisters[0x01] = 0x00;

    // 0xFF02 - SC (Serial Control)
    this.ioRegisters[0x02] = 0x7e;

    // 0xFF04 - DIV (Divider Register)
    this.ioRegisters[0x04] = 0x00;

    // 0xFF05 - TIMA (Timer Counter)
    this.ioRegisters[0x05] = 0x00;

    // 0xFF06 - TMA (Timer Modulo)
    this.ioRegisters[0x06] = 0x00;

    // 0xFF07 - TAC (Timer Control)
    this.ioRegisters[0x07] = 0x00;

    // 0xFF0F - IF (Interrupt Flag)
    this.ioRegisters[0x0f] = 0xe1; // Bits 5-7 set to 1

    // 0xFF10 - NR10 (Sound Channel 1 Sweep)
    this.ioRegisters[0x10] = 0x80;

    // 0xFF11 - NR11 (Sound Channel 1 Length timer & duty cycle)
    this.ioRegisters[0x11] = 0xbf;

    // 0xFF12 - NR12 (Sound Channel 1 Volume & envelope)
    this.ioRegisters[0x12] = 0xf3;

    // 0xFF14 - NR14 (Sound Channel 1 Frequency hi)
    this.ioRegisters[0x14] = 0xbf;

    // 0xFF16 - NR21 (Sound Channel 2 Length timer & duty cycle)
    this.ioRegisters[0x16] = 0x3f;

    // 0xFF17 - NR22 (Sound Channel 2 Volume & envelope)
    this.ioRegisters[0x17] = 0x00;

    // 0xFF19 - NR24 (Sound Channel 2 Frequency hi)
    this.ioRegisters[0x19] = 0xbf;

    // 0xFF1A - NR30 (Sound Channel 3 DAC enable)
    this.ioRegisters[0x1a] = 0x7f;

    // 0xFF1B - NR31 (Sound Channel 3 Length timer)
    this.ioRegisters[0x1b] = 0xff;

    // 0xFF1C - NR32 (Sound Channel 3 Output level)
    this.ioRegisters[0x1c] = 0x9f;

    // 0xFF1E - NR34 (Sound Channel 3 Frequency hi)
    this.ioRegisters[0x1e] = 0xbf;

    // 0xFF20 - NR41 (Sound Channel 4 Length timer)
    this.ioRegisters[0x20] = 0xff;

    // 0xFF21 - NR42 (Sound Channel 4 Volume & envelope)
    this.ioRegisters[0x21] = 0x00;

    // 0xFF22 - NR43 (Sound Channel 4 Polynomial counter)
    this.ioRegisters[0x22] = 0x00;

    // 0xFF23 - NR44 (Sound Channel 4 Counter/consecutive; initial)
    this.ioRegisters[0x23] = 0xbf;

    // 0xFF24 - NR50 (Channel control / ON-OFF / Volume)
    this.ioRegisters[0x24] = 0x77;

    // 0xFF25 - NR51 (Selection of Sound output terminal)
    this.ioRegisters[0x25] = 0xf3;

    // 0xFF26 - NR52 (Sound on/off)
    this.ioRegisters[0x26] = 0xf1; // Bit 7 = 1, others as per GB

    // 0xFF40 - LCDC (LCD Control)
    this.ioRegisters[0x40] = 0x91; // LCD on, BG on, etc.

    // 0xFF41 - STAT (LCD Status)
    this.ioRegisters[0x41] = 0x85; // Default STAT value

    // 0xFF42 - SCY (Scroll Y)
    this.ioRegisters[0x42] = 0x00;

    // 0xFF43 - SCX (Scroll X)
    this.ioRegisters[0x43] = 0x00;

    // 0xFF44 - LY (LCD Y-Coordinate) - READ ONLY, wird von LCD Klasse aktualisiert
    this.ioRegisters[0x44] = 0x00;

    // 0xFF45 - LYC (LY Compare)
    this.ioRegisters[0x45] = 0x00;

    // 0xFF46 - DMA (DMA Transfer)
    this.ioRegisters[0x46] = 0xff;

    // 0xFF47 - BGP (BG Palette Data)
    this.ioRegisters[0x47] = 0xfc;

    // 0xFF48 - OBP0 (Object Palette 0 Data)
    this.ioRegisters[0x48] = 0xff;

    // 0xFF49 - OBP1 (Object Palette 1 Data)
    this.ioRegisters[0x49] = 0xff;

    // 0xFF4A - WY (Window Y Position)
    this.ioRegisters[0x4a] = 0x00;

    // 0xFF4B - WX (Window X Position)
    this.ioRegisters[0x4b] = 0x00;

    // 0xFF4D - KEY1 (Speed Switch) - GBC only
    this.ioRegisters[0x4d] = 0x7e;

    // 0xFF4F - VBK (VRAM Bank) - GBC only
    this.ioRegisters[0x4f] = 0xfe;

    // 0xFF51-0xFF55 - HDMA (GBC)
    this.ioRegisters[0x51] = 0xff;
    this.ioRegisters[0x52] = 0xff;
    this.ioRegisters[0x53] = 0xff;
    this.ioRegisters[0x54] = 0xff;
    this.ioRegisters[0x55] = 0xff;

    // 0xFF68-0xFF6B - Background Palette (GBC)
    this.ioRegisters[0x68] = 0x00;
    this.ioRegisters[0x69] = 0x00;
    this.ioRegisters[0x6a] = 0x00;
    this.ioRegisters[0x6b] = 0x00;

    // 0xFF70 - SVBK (WRAM Bank) - GBC only
    this.ioRegisters[0x70] = 0x01;
  }

  readByte(address, cpu = null) {
    if (address > 0xffff) {
      console.error(
        `MBC1 READ out of range: 0x${address.toString(16)} PC: ${
          cpu ? cpu.getPC().toString(16) : "unknown"
        }`
      );
      return 0xff;
    }

    let value;

    // ROM Bank 0 (0000-3FFF)
    if (address <= 0x3fff) {
      // Bank 0 is always bank 0 in MBC1, regardless of mode
      value = this.rom[address];
    }
    // ROM Bank 1-N (4000-7FFF)
    else if (address <= 0x7fff) {
      let bank = this.romBank & 0x7f;

      // Handle bank 0, 0x20, 0x40, 0x60 special cases
      if (bank === 0x00 || bank === 0x20 || bank === 0x40 || bank === 0x60) {
        bank++;
      }

      // Ensure bank is within ROM bounds
      const maxBanks = Math.floor(this.rom.length / 0x4000);
      if (bank >= maxBanks) {
        bank = bank % maxBanks;
      }

      const romAddress = bank * 0x4000 + (address - 0x4000);
      if (romAddress < this.rom.length) {
        value = this.rom[romAddress];
      } else {
        value = 0xff;
      }
    }
    // VRAM (8000-9FFF)
    else if (address <= 0x9fff) {
      value = this.vram[address - 0x8000];
    }
    // External RAM (A000-BFFF)
    else if (address <= 0xbfff) {
      if (!this.ramEnabled || this.ram.length === 0) {
        value = 0xff;
      } else {
        const bank = this.mode === 0 ? 0 : this.ramBank & 3;
        const ramAddress = bank * 0x2000 + (address - 0xa000);
        if (ramAddress < this.ram.length) {
          value = this.ram[ramAddress];
        } else {
          value = 0xff;
        }
      }
    }
    // Work RAM (C000-DFFF)
    else if (address <= 0xdfff) {
      const offset = address - 0xc000;
      if (address < 0xd000) {
        // 0xC000-0xCFFF: Fixed WRAM Bank 0
        value = this.wram[offset];
      } else {
        // 0xD000-0xDFFF: Switchable WRAM Bank 1-7 (GBC)
        let bank = this.ioRegisters[0x70] & 0x07;
        if (bank === 0) bank = 1; // Bank 0 not allowed, becomes bank 1
        const wramAddress = bank * 0x1000 + (offset - 0x1000);
        if (wramAddress < this.wram.length) {
          value = this.wram[wramAddress];
        } else {
          value = 0xff;
        }
      }
    }
    // Echo RAM (E000-FDFF) - mirrors C000-DDFF
    else if (address >= 0xe000 && address <= 0xfdff) {
      value = this.readByte(address - 0x2000, cpu);
    }
    // OAM (FE00-FE9F)
    else if (address <= 0xfe9f) {
      value = this.oam[address - 0xfe00];
    }
    // I/O Registers (FF00-FF7F)
    else if (address <= 0xff7f) {
      const idx = address - 0xff00;
      if (idx < 0x80) {
        // 🚨 WICHTIG: LCD Register werden von LCD Klasse gehandled
        if (this.cpu && this.cpu.lcd) {
          if (
            address === 0xff40 ||
            address === 0xff41 ||
            address === 0xff44 ||
            address === 0xff45
          ) {
            return this.cpu.lcd.readByte(address);
          }
        }

        // Special handling for certain I/O registers
        switch (address) {
          case 0xff00: // P1/JOYP
            // TODO: Implement proper joypad reading
            value = this.ioRegisters[idx] | 0xcf;
            break;

          case 0xff04: // DIV
            // DIV increments at 16384Hz = every 256 CPU cycles
            // For now, return the stored value
            value = this.ioRegisters[idx];
            break;

          case 0xff0f: // IF
            // Bits 5-7 are always 1
            value = this.ioRegisters[idx] | 0xe0;
            break;

          case 0xff44: // LY register
            // Always return the current LY from the LCD controller
            if (this.cpu && this.cpu.lcd) {
              return this.cpu.lcd.readByte(address);
            }
            value = this.ioRegisters[idx];
            break;

          default:
            value = this.ioRegisters[idx];
        }
      } else {
        value = 0xff;
      }
    }
    // High RAM (FF80-FFFE)
    else if (address <= 0xfffe) {
      const idx = address - 0xff80;
      if (idx < 0x7f) {
        value = this.zram[idx];
      } else {
        value = 0xff;
      }
    }
    // Interrupt Enable Register (FFFF)
    else if (address === 0xffff) {
      value = this.interruptEnabled;
    }
    // Invalid address
    else {
      console.error(`MBC1 READ invalid address: 0x${address.toString(16)}`);
      value = 0xff;
    }

    // Debug logging for WRAM access
    // if (cpu && address >= 0xdd00 && address <= 0xddff) {
    //   console.log(
    //     `MBC1 READ WRAM: 0x${address.toString(16)} => 0x${value.toString(
    //       16
    //     )} bank:${this.ioRegisters[0x70] & 0x07} PC: 0x${cpu
    //       .getPC()
    //       .toString(16)}`
    //   );
    // }

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
      return;
    }

    // ROM Banking Control
    if (address <= 0x1fff) {
      // RAM Enable (0000-1FFF)
      this.ramEnabled = (value & 0x0f) === 0x0a;
    } else if (address <= 0x3fff) {
      // ROM Bank Number - lower 5 bits (2000-3FFF)
      let bank = value & 0x1f;
      if (bank === 0) bank = 1; // Bank 0 is not allowed, becomes bank 1
      this.romBank = (this.romBank & 0x60) | bank;
    } else if (address <= 0x5fff) {
      // RAM Bank Number or Upper Bits of ROM Bank Number (4000-5FFF)
      if (this.mode === 1) {
        // RAM Banking Mode
        this.ramBank = value & 0x03;
      } else {
        // ROM Banking Mode - upper 2 bits of ROM bank
        this.romBank = (this.romBank & 0x1f) | ((value & 0x03) << 5);
      }
    } else if (address <= 0x7fff) {
      // Banking Mode Select (6000-7FFF)
      this.mode = value & 0x01;
    }
    // VRAM (8000-9FFF)
    else if (address <= 0x9fff) {
      this.vram[address - 0x8000] = value;
    }
    // External RAM (A000-BFFF)
    else if (address <= 0xbfff) {
      if (this.ramEnabled && this.ram.length > 0) {
        const bank = this.mode === 0 ? 0 : this.ramBank & 3;
        const ramAddress = bank * 0x2000 + (address - 0xa000);
        if (ramAddress < this.ram.length) {
          this.ram[ramAddress] = value;
        }
      }
    }
    // Work RAM (C000-DFFF)
    else if (address <= 0xdfff) {
      const offset = address - 0xc000;
      if (address < 0xd000) {
        // 0xC000-0xCFFF: Fixed WRAM Bank 0
        this.wram[offset] = value;
      } else {
        // 0xD000-0xDFFF: Switchable WRAM Bank 1-7 (GBC)
        let bank = this.ioRegisters[0x70] & 0x07;
        if (bank === 0) bank = 1; // Bank 0 not allowed, becomes bank 1
        const wramAddress = bank * 0x1000 + (offset - 0x1000);
        if (wramAddress < this.wram.length) {
          this.wram[wramAddress] = value;
        }
      }
    }
    // Echo RAM (E000-FDFF) - mirrors C000-DDFF
    else if (address >= 0xe000 && address <= 0xfdff) {
      this.writeByte(address - 0x2000, value, cpu);
    }
    // OAM (FE00-FE9F)
    else if (address <= 0xfe9f) {
      this.oam[address - 0xfe00] = value;
    }
    // I/O Registers (FF00-FF7F)
    else if (address <= 0xff7f) {
      const idx = address - 0xff00;
      if (idx < 0x80) {
        // 🚨 WICHTIG: LCD Register werden von LCD Klasse gehandled
        if (this.cpu && this.cpu.lcd) {
          if (
            address === 0xff40 ||
            address === 0xff41 ||
            address === 0xff44 ||
            address === 0xff45
          ) {
            this.cpu.lcd.writeByte(address, value);
            return;
          }
        }

        // Special handling for certain I/O registers
        switch (address) {
          case 0xff00: // P1/JOYP
            // Only bits 4-6 are writable
            this.ioRegisters[idx] =
              (value & 0x30) | (this.ioRegisters[idx] & 0xcf);
            break;

          case 0xff04: // DIV
            // Writing any value resets DIV to 0
            this.ioRegisters[idx] = 0;
            break;

          case 0xff44: // LY
            // Read-only register, ignore writes
            break;

          case 0xff0f: // IF
            // Only bits 0-4 are writable
            this.ioRegisters[idx] =
              (value & 0x1f) | (this.ioRegisters[idx] & 0xe0);
            break;

          case 0xff41: // STAT
            // Only bits 3-6 are writable
            this.ioRegisters[idx] =
              (value & 0x78) | (this.ioRegisters[idx] & 0x87);
            break;

          case 0xff46: // DMA
            // DMA transfer
            this.ioRegisters[idx] = value;
            this.handleDMA(value);
            break;

          default:
            this.ioRegisters[idx] = value;
        }
      }
    }
    // High RAM (FF80-FFFE)
    else if (address <= 0xfffe) {
      const idx = address - 0xff80;
      if (idx < 0x7f) {
        this.zram[idx] = value;
      }
    }
    // Interrupt Enable Register (FFFF)
    else if (address === 0xffff) {
      this.interruptEnabled = value;
    }
    // Invalid address
    else {
      console.error(
        `MBC1 WRITE invalid address: 0x${address.toString(
          16
        )}, value: 0x${value.toString(16)}`
      );
    }

    // // Debug logging for WRAM access
    // if (cpu && address >= 0xdd00 && address <= 0xddff) {
    //   console.log(
    //     `MBC1 WRITE WRAM: 0x${address.toString(16)} <= 0x${value.toString(
    //       16
    //     )} bank:${this.ioRegisters[0x70] & 0x07} PC: 0x${cpu
    //       .getPC()
    //       .toString(16)}`
    //   );
    // }
  }

  handleDMA(value) {
    // Perform DMA transfer from XX00-XX9F to FE00-FE9F
    const sourceStart = value * 0x100;
    for (let i = 0; i < 0xa0; i++) {
      const sourceAddr = sourceStart + i;
      const destAddr = 0xfe00 + i;

      // Read from source (could be ROM, RAM, etc.)
      const byteValue = this.readByte(sourceAddr);

      // Write to OAM
      this.oam[destAddr - 0xfe00] = byteValue;
    }
  }
}
