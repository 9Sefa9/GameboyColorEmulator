class MBC1 {
    constructor(rom, ramSize) {
        this.rom = rom;
        this.ram = new Uint8Array(ramSize);
    }

    readByte(address) {
        return this.rom[address];

    }

    writeByte(address, value) {
        this.ram[address] = value;
    }
}