class MBC1 {
    constructor(rom, ramSize) {
        this.rom = rom;
        this.ram = new Uint8Array(ramSize);
        this.ramEnabled = false;
        this.mode = 0;
        this.romBankNumber = 1;
        this.ramBankNumber = 0;
    }

    readByte(address) {
        if (address < 0x4000) {
            // ROM bank 0
            return this.rom[address];
        } else if (address < 0x8000) {
            // ROM bank n
            const romBankOffset = (this.romBankNumber - 1) * 0x4000;
            const adjustedAddress = address - 0x4000;
            return this.rom[romBankOffset + adjustedAddress];
        } else if (address >= 0xA000 && address < 0xC000) {
            // RAM bank n
            if (this.ramEnabled) {
                const ramBankOffset = this.ramBankNumber * 0x2000;
                const adjustedAddress = address - 0xA000;
                return this.ram[ramBankOffset + adjustedAddress];
            } else {
                return 0xFF;
            }
        } else {
            return this.rom[address];
           // throw new Error(`Invalid read address: 0x${address.toString(16)}`);
        }
    }

    writeByte(address, value) {
        if (address < 0x2000) {
            // RAM enable/disable
            this.ramEnabled = ((value & 0x0F) === 0x0A);
        } else if (address < 0x4000) {
            // ROM bank number (lower 5 bits)
            const bank = value & 0x1F;
            this.romBankNumber = (this.romBankNumber & 0x60) | bank;
            if (this.romBankNumber === 0x00 || this.romBankNumber === 0x20 || this.romBankNumber === 0x40 || this.romBankNumber === 0x60) {
                this.romBankNumber++;
            }
        } else if (address < 0x6000) {
            if (this.mode === 0) {
                // ROM bank number (upper 2 bits)
                this.romBankNumber = (this.romBankNumber & 0x1F) | ((value & 0x03) << 5);
            } else {
                // RAM bank number
                this.ramBankNumber = value & 0x03;
            }
        } else if (address < 0x8000) {
            // memory model select
            this.mode = value & 0x01;
        } else if (address >= 0xA000 && address < 0xC000) {
            // RAM bank n
            if (this.ramEnabled) {
                const ramBankOffset = this.ramBankNumber * 0x2000;
                const adjustedAddress = address - 0xA000;
                this.ram[ramBankOffset + adjustedAddress] = value;
            }
        } else {
            this.ram[address] = value;
            //throw new Error(`Invalid write address: 0x${address.toString(16)}`);
        }
    }
}