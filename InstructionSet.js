class InstructionSet extends CPU {
  static opcodeList = new Map();
  static cbOpcodeList = new Map();

  static prepareInstructions() {
    this.opcodeList.set(
      0x76,
      new Opcode("HALT", "", 0x76, 8, 1, false, (cpu) => {
        // Power down CPU until an interrupt occurs. Use this
        //when ever possible to reduce energy consumption
        console.log("HALT");
      })
    );
    this.opcodeList.set(
      0x10,
      new Opcode("STOP", "", 0x10, 8, 1, false, (cpu) => {
        // Power down CPU until an interrupt occurs. Use this
        //when ever possible to reduce energy consumption
        console.log("STOP not implemented");
      })
    );
    this.opcodeList.set(
      0x00,
      new Opcode("NOP", "", 0x00, 8, 1, false, (cpu) => {
        // Does nothing
      })
    );

    //8-bit operations
    this.opcodeList.set(
      0x7f,
      new Opcode("LD", "A,A", 0x7f, 8, 1, false, (cpu) => {
        cpu.setA(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x77,
      new Opcode("LD", "(HL),A", 0x77, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getA());
      })
    );
    this.opcodeList.set(
      0x78,
      new Opcode("LD", "A,B", 0x78, 8, 1, false, (cpu) => {
        const value = (cpu.getBC() & 0xff00) >> 8;
        cpu.setA(value);
      })
    );
    this.opcodeList.set(
      0x79,
      new Opcode("LD", "A,C", 0x79, 8, 1, false, (cpu) => {
        cpu.setA(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x7a,
      new Opcode("LD", "A,D", 0x7a, 8, 1, false, (cpu) => {
        cpu.setA(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x7b,
      new Opcode("LD", "A,E", 0x7b, 8, 1, false, (cpu) => {
        cpu.setA(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x7c,
      new Opcode("LD", "A,H", 0x7c, 8, 1, false, (cpu) => {
        cpu.setA(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x7d,
      new Opcode("LD", "A,L", 0x7d, 8, 1, false, (cpu) => {
        cpu.setA(cpu.getL());
      })
    );

    this.opcodeList.set(
      0x0a,
      new Opcode("LD", "A,(BC)", 0x0a, 8, 1, false, (cpu) => {
        cpu.setA(cpu.memory.readByte(cpu.getBC()));
      })
    );
    this.opcodeList.set(
      0x1a,
      new Opcode("LD", "A,(DE)", 0x1a, 8, 1, false, (cpu) => {
        cpu.setA(cpu.memory.readByte(cpu.getDE()));
      })
    );

    this.opcodeList.set(
      0x7e,
      new Opcode("LD", "A,(HL)", 0x7e, 8, 1, false, (cpu) => {
        cpu.setA(cpu.memory.readByte(cpu.getHL()));
      })
    );

    this.opcodeList.set(
      0xfa,
      new Opcode("LD", "A,(nn)", 0xfa, 32, 3, false, (cpu) => {
        // Korrekte Adressberechnung: Bytes bei PC+1 und PC+2
        const lsb = cpu.memory.readByte(cpu.getPC() + 1);
        const msb = cpu.memory.readByte(cpu.getPC() + 2);

        const address = cpu.toUnsigned16Bit(lsb, msb);
        cpu.setA(cpu.memory.readByte(address));
      })
    );
    this.opcodeList.set(
      0x3e,
      new Opcode("LD", "A,#", 0x3e, 8, 2, false, (cpu) => {
        const value = cpu.memory.readByte(cpu.getPC() + 1);
        cpu.setA(value);
      })
    );
    this.opcodeList.set(
      0x47,
      new Opcode("LD", "B,A", 0x47, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x4f,
      new Opcode("LD", "C,A", 0x4f, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x40,
      new Opcode("LD", "B,B", 0x40, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x41,
      new Opcode("LD", "B,C", 0x41, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x42,
      new Opcode("LD", "B,D", 0x42, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x43,
      new Opcode("LD", "B,E", 0x43, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x44,
      new Opcode("LD", "B,H", 0x44, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x45,
      new Opcode("LD", "B,L", 0x45, 16, 1, false, (cpu) => {
        cpu.setB(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x46,
      new Opcode("LD", "B,(HL)", 0x46, 16, 1, false, (cpu) => {
        console.log("call");
        const value = cpu.memory.readByte(cpu.getHL());
        cpu.setB(value);
      })
    );

    this.opcodeList.set(
      0x48,
      new Opcode("LD", "C,B", 0x48, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x49,
      new Opcode("LD", "C,C", 0x49, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x4a,
      new Opcode("LD", "C,D", 0x4a, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x4b,
      new Opcode("LD", "C,E", 0x4b, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x4c,
      new Opcode("LD", "C,H", 0x4c, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x4d,
      new Opcode("LD", "C,L", 0x4d, 16, 1, false, (cpu) => {
        cpu.setC(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x4e,
      new Opcode("LD", "C,(HL)", 0x4e, 16, 1, false, (cpu) => {
        cpu.setC(cpu.memory.readByte(cpu.getHL()));
      })
    );

    this.opcodeList.set(
      0x50,
      new Opcode("LD", "D,B", 0x50, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x51,
      new Opcode("LD", "D,C", 0x51, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x52,
      new Opcode("LD", "D,D", 0x52, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x53,
      new Opcode("LD", "D,E", 0x53, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x54,
      new Opcode("LD", "D,H", 0x54, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x55,
      new Opcode("LD", "D,L", 0x55, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x56,
      new Opcode("LD", "D,(HL)", 0x56, 16, 1, false, (cpu) => {
        cpu.setD(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x57,
      new Opcode("LD", "D,A", 0x57, 16, 1, false, (cpu) => {
        cpu.setD(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x58,
      new Opcode("LD", "E,B", 0x58, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getB());
      })
    );

    this.opcodeList.set(
      0x59,
      new Opcode("LD", "E,C", 0x59, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getC());
      })
    );

    this.opcodeList.set(
      0x5a,
      new Opcode("LD", "E,D", 0x5a, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getD());
      })
    );

    this.opcodeList.set(
      0x5b,
      new Opcode("LD", "E,E", 0x5b, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getE());
      })
    );

    this.opcodeList.set(
      0x5c,
      new Opcode("LD", "E,H", 0x5c, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getH());
      })
    );

    this.opcodeList.set(
      0x5d,
      new Opcode("LD", "E,L", 0x5d, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getL());
      })
    );

    this.opcodeList.set(
      0x5e,
      new Opcode("LD", "E,(HL)", 0x5e, 16, 1, false, (cpu) => {
        cpu.setE(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x5f,
      new Opcode("LD", "E,A", 0x5f, 16, 1, false, (cpu) => {
        cpu.setE(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x60,
      new Opcode("LD", "H,B", 0x60, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getB());
      })
    );

    this.opcodeList.set(
      0x61,
      new Opcode("LD", "H,C", 0x61, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getC());
      })
    );

    this.opcodeList.set(
      0x62,
      new Opcode("LD", "H,D", 0x62, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x63,
      new Opcode("LD", "H,E", 0x63, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x64,
      new Opcode("LD", "H,H", 0x64, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x65,
      new Opcode("LD", "H,L", 0x65, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x66,
      new Opcode("LD", "H,(HL)", 0x66, 16, 1, false, (cpu) => {
        cpu.setH(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x67,
      new Opcode("LD", "H,A", 0x67, 16, 1, false, (cpu) => {
        cpu.setH(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x68,
      new Opcode("LD", "L,B", 0x68, 16, 1, false, (cpu) => {
        cpu.setL(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x69,
      new Opcode("LD", "L,C", 0x69, 16, 1, false, (cpu) => {
        cpu.setL(cpu.getC());
      })
    );

    this.opcodeList.set(
      0x6a,
      new Opcode("LD", "L,D", 0x6a, 16, 1, false, (cpu) => {
        cpu.setL(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x6b,
      new Opcode("LD", "L,E", 0x6b, 16, 1, false, (cpu) => {
        cpu.setL(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x6c,
      new Opcode("LD", "L,H", 0x6c, 16, 1, false, (cpu) => {
        cpu.setL(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x6d,
      new Opcode("LD", "L,L", 0x6d, 16, 1, false, (cpu) => {
        cpu.setL(cpu.getL()); // Copy the value of register L to itself
      })
    );
    this.opcodeList.set(
      0x6e,
      new Opcode("LD", "L,(HL)", 0x6e, 16, 1, false, (cpu) => {
        cpu.setL(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x6f,
      new Opcode("LD", "L,A", 0x6f, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getA());
      })
    );
    //CONTNIUEEE
    this.opcodeList.set(
      0x70,
      new Opcode("LD", "(HL),B", 0x70, 16, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getB());
      })
    );
    this.opcodeList.set(
      0x71,
      new Opcode("LD", "(HL),C", 0x71, 16, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getC());
      })
    );
    this.opcodeList.set(
      0x72,
      new Opcode("LD", "(HL),D", 0x72, 16, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getD());
      })
    );
    this.opcodeList.set(
      0x73,
      new Opcode("LD", "(HL),E", 0x73, 16, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getE());
      })
    );
    this.opcodeList.set(
      0x74,
      new Opcode("LD", "(HL),H", 0x74, 16, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getH());
      })
    );
    this.opcodeList.set(
      0x75,
      new Opcode("LD", "(HL),L", 0x75, 16, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getL());
      })
    );
    this.opcodeList.set(
      0x36,
      new Opcode("LD", "(HL),n", 0x36, 12, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        cpu.memory.writeByte(cpu.getHL(), n);
      })
    );

    this.opcodeList.set(
      0x06,
      new Opcode("LD", "B,n", 0x06, 16, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        // Set the high byte of BC directly using the setB function
        cpu.setB(n);
      })
    );
    this.opcodeList.set(
      0x0e,
      new Opcode("LD", "C,n", 0x0e, 16, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        cpu.setC(n);
      })
    );
    this.opcodeList.set(
      0x16,
      new Opcode("LD", "D,n", 0x16, 16, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        cpu.setD(n);
      })
    );
    this.opcodeList.set(
      0x1e,
      new Opcode("LD", "E,n", 0x1e, 16, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        cpu.setE(n);
      })
    );
    this.opcodeList.set(
      0x26,
      new Opcode("LD", "H,n", 0x26, 16, 2, false, (cpu) => {
        const pc = cpu.getPC() + 1;
        const n = cpu.memory.readByte(pc); // Immediate

        cpu.setH(n);
      })
    );
    this.opcodeList.set(
      0x2e,
      new Opcode("LD", "L,n", 0x2e, 16, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        cpu.setL(n);
      })
    );
    this.opcodeList.set(
      0x02,
      new Opcode("LD", "(BC),A", 0x02, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getBC(), cpu.getA());
      })
    );
    this.opcodeList.set(
      0x12,
      new Opcode("LD", "(DE),A", 0x12, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getDE(), cpu.getA());
      })
    );
    this.opcodeList.set(
      0xea,
      new Opcode("LD", "(nn),A", 0xea, 32, 3, false, (cpu) => {
        // Lese LSB vom aktuellen PC
        const lsb = cpu.memory.readByte(cpu.getPC() + 1);

        // Lese MSB vom aktuellen PC
        const msb = cpu.memory.readByte(cpu.getPC() + 2);

        // Adresse zusammensetzen (Little-Endian)
        const addr = cpu.toUnsigned16Bit(lsb, msb);

        // A in Speicher schreiben
        cpu.memory.writeByte(addr, cpu.getA());
      })
    );

    this.opcodeList.set(
      0xf2,
      new Opcode("LDH", "A,(C)", 0xf2, 16, 1, false, (cpu) => {
        // :A = read(unsigned_16(lsb=C, msb=0xFF))
        const c = cpu.getC();
        const address = 0xff00 + c;
        const value = cpu.memory.readByte(address);
        cpu.setA(value);
      })
    );
    this.opcodeList.set(
      0xe2,
      new Opcode("LDH", "(C),A", 0xe2, 16, 1, false, (cpu) => {
        // write(unsigned_16(lsb=C, msb=0xFF), A)
        const c = cpu.getC();
        const address = 0xff00 + c;
        const value = cpu.getA();
        cpu.memory.writeByte(address, value);
      })
    );
    this.opcodeList.set(
      0xf0,
      new Opcode("LDH", "A,(a8)", 0xf0, 12, 2, false, (cpu) => {
        const offset = cpu.memory.readByte(cpu.getPC() + 1); // Offset nach Opcode
        const address = 0xff00 + offset;
        const value = cpu.memory.readByte(address);
        cpu.setA(value);
      })
    );
    this.opcodeList.set(
      0xe0,
      new Opcode("LDH", "(n), A", 0xe0, 24, 2, false, (cpu) => {
        const offset = cpu.memory.readByte(cpu.getPC() + 1);
        const address = 0xff00 + offset;
        const value = cpu.getA();
        cpu.memory.writeByte(address, value);
      })
    );
    this.opcodeList.set(
      0x3a,
      new Opcode("LD", "A,(HL-)", 0x3a, 16, 1, false, (cpu) => {
        const address = cpu.getHL(); // Get the value from HL register
        const value = cpu.memory.readByte(address); // Read the value from memory
        cpu.setA(value); // Set the value to register A
        cpu.setHL(address - 1); // Decrement HL register
      })
    );
    this.opcodeList.set(
      0x32,
      new Opcode("LD", "(HL-),A", 0x32, 16, 1, false, (cpu) => {
        const hlValue = cpu.getHL(); // Get the value of the HL register
        cpu.memory.writeByte(hlValue, cpu.getA()); // Write the value of A to the memory location pointed by HL
        cpu.setHL(hlValue - 1); // Decrement the HL register
      })
    );
    this.opcodeList.set(
      0x2a,
      new Opcode("LD", "A,(HL+)", 0x2a, 16, 1, false, (cpu) => {
        const memoryValueHL = cpu.memory.readByte(cpu.getHL());
        cpu.setHL(cpu.getHL() + 1);
        cpu.setA(memoryValueHL);
      })
    );
    this.opcodeList.set(
      0x22,
      new Opcode("LD", "(HL+),A", 0x22, 16, 1, false, (cpu) => {
        const addr = cpu.getHL();
        cpu.memory.writeByte(addr, cpu.getA());

        cpu.setHL((addr + 1) & 0xffff);
      })
    );
    this.opcodeList.set(
      0x01,
      new Opcode("LD", "BC,nn", 0x01, 24, 3, false, (cpu) => {
        // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
        // BC = nn

        const pc = cpu.getPC();
        const lsb = cpu.memory.readByte(pc + 1);
        const msb = cpu.memory.readByte(pc + 2);

        const nn = cpu.toUnsigned16Bit(lsb, msb);

        cpu.setBC(nn);
      })
    );
    this.opcodeList.set(
      0x11,
      new Opcode("LD", "DE,nn", 0x11, 24, 3, false, (cpu) => {
        // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
        // BC = nn

        const pc = cpu.getPC();
        const lsb = cpu.memory.readByte(pc + 1);
        const msb = cpu.memory.readByte(pc + 2);

        const nn = cpu.toUnsigned16Bit(lsb, msb);

        cpu.setDE(nn);
      })
    );
    this.opcodeList.set(
      0x21,
      new Opcode("LD", "HL,nn", 0x21, 24, 3, false, (cpu) => {
        // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
        // BC = nn

        const pc = cpu.getPC();
        const lsb = cpu.memory.readByte(pc + 1);
        const msb = cpu.memory.readByte(pc + 2);
        const nn = cpu.toUnsigned16Bit(lsb, msb);

        cpu.setHL(nn);
      })
    );
    this.opcodeList.set(
      0x31,
      new Opcode("LD", "SP,nn", 0x31, 24, 3, false, (cpu) => {
        const pc = cpu.getPC();
        const lsb = cpu.memory.readByte(pc + 1);
        const msb = cpu.memory.readByte(pc + 2);

        const nn = cpu.toUnsigned16Bit(lsb, msb);
        cpu.setSP(nn);
      })
    );
    this.opcodeList.set(
      0x08,
      new Opcode("LD", "(nn),SP", 0x08, 40, 3, false, (cpu) => {
        // Zwei Bytes auslesen, um die Zieladresse nn zu bestimmen (Little Endian)
        const lsb = cpu.memory.readByte(cpu.getPC() + 1);
        const msb = cpu.memory.readByte(cpu.getPC() + 2);
        const address = cpu.toUnsigned16Bit(lsb, msb);

        const sp = cpu.getSP();
        cpu.memory.writeByte(address, sp & 0xff);
        cpu.memory.writeByte(address + 1, sp >> 8);
      })
    );
    this.opcodeList.set(
      0xf9,
      new Opcode("LD", "SP,HL", 0xf9, 16, 1, false, (cpu) => {
        /*
              SP = HL
            */
        cpu.setSP(cpu.getHL());
      })
    );
    this.opcodeList.set(
      0xf8,
      new Opcode("LDHL", "SP,n", 0xf8, 12, 2, false, (cpu) => {
        /*
        HL = SP + e
    */
        const e = cpu.memory.readByte(cpu.getPC() + 1); // KORRIGIERT: PC+1

        // KORRIGIERT: Einfache Signed-Konvertierung
        const signedE = e & 0x80 ? e - 256 : e;
        const result = cpu.getSP() + signedE;
        cpu.setHL(result & 0xffff);

        // Set flags
        cpu.setZFlag(0);
        cpu.setNFlag(0);
        cpu.setHFlag((cpu.getSP() & 0x0f) + (signedE & 0x0f) > 0x0f ? 1 : 0);
        cpu.setCFlag((cpu.getSP() & 0xff) + (signedE & 0xff) > 0xff ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0xf5,
      new Opcode("PUSH", "AF", 0xf5, 32, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getA());
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getF());
      })
    );
    this.opcodeList.set(
      0xd5,
      new Opcode("PUSH", "DE", 0xd5, 32, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getDE() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getDE() & 0xff);
      })
    );
    this.opcodeList.set(
      0xc5,
      new Opcode("PUSH", "BC", 0xc5, 32, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getB());
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getC());
      })
    );
    this.opcodeList.set(
      0xe5,
      new Opcode("PUSH", "HL", 0xe5, 32, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getHL() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getHL() & 0xff);
      })
    );
    this.opcodeList.set(
      0xf1,
      new Opcode("POP", "AF", 0xf1, 24, 1, false, (cpu) => {
        /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
         */
        const lsbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const msbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        cpu.setAF(finalValue);
      })
    );
    this.opcodeList.set(
      0xc1,
      new Opcode("POP", "BC", 0xc1, 24, 1, false, (cpu) => {
        /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
         */
        const lsbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const msbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        cpu.setBC(finalValue);
      })
    );
    this.opcodeList.set(
      0xd1,
      new Opcode("POP", "DE", 0xd1, 24, 1, false, (cpu) => {
        /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
         */
        const lsbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const msbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        cpu.setDE(finalValue);
      })
    );
    this.opcodeList.set(
      0xe1,
      new Opcode("POP", "HL", 0xe1, 24, 1, false, (cpu) => {
        /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
         */
        const lsbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const msbValue = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        cpu.setHL(finalValue);
      })
    );
    // 8-bit arithmetic and logical instructions
    this.opcodeList.set(
      0x87,
      new Opcode("ADD", "A,A", 0x87, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + cpu.getA();
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x80,
      new Opcode("ADD", "A,B", 0x80, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + ((cpu.getBC() & 0xff00) >> 8);
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x81,
      new Opcode("ADD", "A,C", 0x81, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + (cpu.getBC() & 0xff);
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x82,
      new Opcode("ADD", "A,D", 0x82, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + ((cpu.getDE() & 0xff00) >> 8);
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x83,
      new Opcode("ADD", "A,E", 0x83, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + (cpu.getDE() & 0xff);
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x84,
      new Opcode("ADD", "A,H", 0x84, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + ((cpu.getHL() & 0xff00) >> 8);
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x85,
      new Opcode("ADD", "A,L", 0x85, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getA() + (cpu.getHL() & 0xff);
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x86,
      new Opcode("ADD", "(HL)", 0x86, 16, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const data = cpu.memory.readByte(cpu.getHL());
        const result = cpu.getA() + data;
        const carryPerBit = cpu.getA() + data;
        cpu.setA(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((carryPerBit & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (carryPerBit > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0xc6,
      new Opcode("ADD", "A, n", 0xc6, 16, 2, false, (cpu) => {
        const imm8 = cpu.memory.readByte(cpu.getPC() + 1); // Read the immediate 8-bit value
        const A = cpu.getA();
        const result = A + imm8;

        // Set the Zero Flag (ZF) if the result is zero
        cpu.setZFlag((result & 0xff) === 0 ? 1 : 0);

        // Clear the Negative Flag (NF)
        cpu.setNFlag(0);

        // Calculate the Half-Carry Flag (HF)
        const halfCarry = (A ^ imm8 ^ result) & 0x10;
        cpu.setHFlag(halfCarry ? 1 : 0);

        // Set the Carry Flag (CF) if the result is greater than 255 (0xFF)
        cpu.setCFlag(result > 0xff ? 1 : 0);

        // Update the accumulator (A) with the result
        cpu.setA(result);
      })
    );

    // 16-bit arithmetic operations
    this.opcodeList.set(
      0x09,
      new Opcode("ADD", "HL,BC", 0x09, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getHL() + cpu.getBC();
        cpu.setHL(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x19,
      new Opcode("ADD", "HL,DE", 0x19, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const result = cpu.getHL() + cpu.getDE();
        cpu.setHL(result);

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((result & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (result > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x29,
      new Opcode("ADD", "HL,HL", 0x29, 8, 1, false, (cpu) => {
        const hl = cpu.getHL();
        const result = hl + hl;

        cpu.setHL(result & 0xffff);

        cpu.setNFlag(0);

        // H-Flag: Übertrag von Bit 11
        cpu.setHFlag((hl & 0x0fff) + (hl & 0x0fff) > 0x0fff ? 1 : 0);

        // C-Flag: Übertrag von Bit 15
        cpu.setCFlag(result > 0xffff ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x39,
      new Opcode("ADD", "HL,SP", 0x39, 8, 1, false, (cpu) => {
        const hl = cpu.getHL();
        const sp = cpu.getSP();
        const result = hl + sp;

        cpu.setHL(result & 0xffff);

        cpu.setNFlag(0);
        // H-Flag: Übertrag von Bit 11
        cpu.setHFlag((hl & 0x0fff) + (sp & 0x0fff) > 0x0fff ? 1 : 0);
        // C-Flag: Übertrag von Bit 15
        cpu.setCFlag(result > 0xffff ? 1 : 0);
        // Z-Flag bleibt unverändert
      })
    );
    this.opcodeList.set(
      0xe8,
      new Opcode("ADD", "SP,n", 0xe8, 16, 2, false, (cpu) => {
        const e = cpu.memory.readByte(cpu.getPC() + 1); // KORRIGIERT: PC+1

        // KORRIGIERT: Einfache Signed-Konvertierung
        const signedE = e & 0x80 ? e - 256 : e;
        const sp = cpu.getSP();
        const result = sp + signedE;

        cpu.setSP(result & 0xffff);

        cpu.setZFlag(0);
        cpu.setNFlag(0);
        cpu.setHFlag((sp & 0x0f) + (signedE & 0x0f) > 0x0f ? 1 : 0);
        cpu.setCFlag((sp & 0xff) + (signedE & 0xff) > 0xff ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x8f,
      new Opcode("ADC", "A,A", 0x8f, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, a, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x88,
      new Opcode("ADC", "A,B", 0x88, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const b = cpu.getB();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, b, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x89,
      new Opcode("ADC", "A,C", 0x89, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const cReg = cpu.getC();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, cReg, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x8a,
      new Opcode("ADC", "A,D", 0x8a, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const d = cpu.getD();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, d, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x8b,
      new Opcode("ADC", "A,E", 0x8b, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const e = cpu.getE();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, e, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x8c,
      new Opcode("ADC", "A,H", 0x8c, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const hVal = cpu.getH();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, hVal, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x8d,
      new Opcode("ADC", "A,L", 0x8d, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const l = cpu.getL();
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, l, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0x8e,
      new Opcode("ADC", "A,(HL)", 0x8e, 16, 1, false, (cpu) => {
        const a = cpu.getA();
        const data = cpu.memory.readByte(cpu.getHL());
        const carry = cpu.getCFlag();
        const { result, z, n, h, c } = cpu.adc(a, data, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(n);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );
    this.opcodeList.set(
      0xce,
      new Opcode("ADC", "A,n", 0xce, 16, 2, false, (cpu) => {
        const a = cpu.getA();
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        const carry = cpu.getCFlag();

        const { result, z, n: nf, h, c } = cpu.adc(a, n, carry);

        cpu.setA(result);
        cpu.setZFlag(z);
        cpu.setNFlag(nf);
        cpu.setHFlag(h);
        cpu.setCFlag(c);
      })
    );

    this.opcodeList.set(
      0x97,
      new Opcode("SUB", "A", 0x97, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getA();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x90,
      new Opcode("SUB", "B", 0x90, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getB();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x91,
      new Opcode("SUB", "C", 0x91, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getC();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x92,
      new Opcode("SUB", "D", 0x92, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getD();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x93,
      new Opcode("SUB", "E", 0x93, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getE();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x94,
      new Opcode("SUB", "H", 0x94, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getH();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x95,
      new Opcode("SUB", "L", 0x95, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getL();
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x96,
      new Opcode("SUB", "(HL)", 0x96, 16, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getHL());
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xd6,
      new Opcode("SUB", "A,n", 0xd6, 8, 2, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getPC() + 1);
        const result = (A - value) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x9f,
      new Opcode("SBC", "A", 0x9f, 8, 1, false, (cpu) => {
        /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
        const a = cpu.getA();
        const carry = cpu.getCFlag();

        const result = a - a - carry;

        cpu.setZFlag((result & 0xff) === 0);
        cpu.setNFlag(1);
        cpu.setHFlag((a & 0x0f) - (a & 0x0f) - carry < 0);
        cpu.setCFlag(result < 0);

        cpu.setA(result & 0xff);
      })
    );
    this.opcodeList.set(
      0x98,
      new Opcode("SBC", "B", 0x98, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getB();
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x99,
      new Opcode("SBC", "C", 0x99, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getC();
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x9a,
      new Opcode("SBC", "D", 0x9a, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getD();
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x9b,
      new Opcode("SBC", "E", 0x9b, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getE();
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x9c,
      new Opcode("SBC", "H", 0x9c, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getH();
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x9d,
      new Opcode("SBC", "L", 0x9d, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getL();
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x9e,
      new Opcode("SBC", "(HL)", 0x9e, 16, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getHL());
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0xde,
      new Opcode("SBC", "A,n", 0xde, 16, 2, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getPC() + 1);
        cpu.increasePC(1);
        const carry = cpu.getCFlag();
        const result = (A - value - carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) - (value & 0x0f) - carry < 0 ? 1 : 0);
        cpu.setCFlag(A < value + carry ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0xbf,
      new Opcode("CP", "A", 0xbf, 8, 1, false, (cpu) => {
        /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
        const result = cpu.getA() - cpu.getA();
        const carryPerBit = cpu.getA() - cpu.getA();

        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(1);

        if ((carryPerBit & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        if (carryPerBit > 0xff) {
          cpu.setCFlag(1);
        } else {
          cpu.setCFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0xb8,
      new Opcode("CP", "B", 0xb8, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getB();
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xb9,
      new Opcode("CP", "C", 0xb9, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getC();
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xba,
      new Opcode("CP", "D", 0xba, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getD();
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xbb,
      new Opcode("CP", "E", 0xbb, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getE();
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0xbc,
      new Opcode("CP", "H", 0xbc, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getH();
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xbd,
      new Opcode("CP", "L", 0xbd, 8, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.getL();
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xbe,
      new Opcode("CP", "(HL)", 0xbe, 16, 1, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getHL());
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0xfe,
      new Opcode("CP", "n", 0xfe, 8, 2, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getPC() + 1);
        const result = (A - value) & 0xff;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((A & 0x0f) < (value & 0x0f) ? 1 : 0);
        cpu.setCFlag(A < value ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0x3c,
      new Opcode("INC", "A", 0x3c, 8, 1, false, (cpu) => {
        const AF = cpu.getAF();
        const A = ((AF >> 8) & 0xff) + 1;
        const carryPerBit = AF + 0x100;
        const newAF = (A << 8) | (AF & 0xff);
        cpu.setAF(newAF);

        if (A === 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((carryPerBit & 0x0f00) > 0x0f00) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x04,
      new Opcode("INC", "B", 0x04, 8, 1, false, (cpu) => {
        const BC = cpu.getBC();
        const B = ((BC >> 8) & 0xff) + 1;
        const carryPerBit = BC + 0x100;
        const newBC = (B << 8) | (BC & 0xff);
        cpu.setBC(newBC);

        if (B === 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((carryPerBit & 0x0f00) > 0x0f00) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x0c,
      new Opcode("INC", "C", 0x0c, 8, 1, false, (cpu) => {
        const BC = cpu.getBC();
        const C = (BC & 0xff) + 1;
        const carryPerBit = BC + 1;
        const newBC = (BC & 0xff00) | (C & 0xff);
        cpu.setBC(newBC);

        if (C === 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((carryPerBit & 0x0f) > 0x0f) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x14,
      new Opcode("INC", "D", 0x14, 8, 1, false, (cpu) => {
        const D = cpu.getD() + 1;
        const carryPerBit = (cpu.getD() & 0x0f) + 1; // Halbcarry prüfen

        if (D === 0x100) {
          cpu.setZFlag(1); // Setze Z-Flag, wenn das Ergebnis gleich 0 ist.
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if (carryPerBit & 0x10) {
          // Prüfe auf Halbcarry
          cpu.setHFlag(1); // Setze H-Flag, wenn ein Halbcarry auftritt.
        } else {
          cpu.setHFlag(0);
        }

        const newD = D & 0xff; // Nur die unteren 8 Bits behalten

        cpu.setD(newD); // Setze den neuen Wert von D.
      })
    );
    this.opcodeList.set(
      0x1c,
      new Opcode("INC", "E", 0x1c, 8, 1, false, (cpu) => {
        const E = cpu.getE(); // Lade den aktuellen Wert von E.
        const result = (E + 1) & 0xff; // Inkrementiere E um 1 und sorge dafür, dass es im Bereich von 0x00 bis 0xFF bleibt.

        if (result === 0) {
          cpu.setZFlag(1); // Setze Z-Flag, wenn das Ergebnis gleich 0 ist.
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0); // Setze N-Flag auf 0.

        if ((E & 0x0f) === 0x0f) {
          cpu.setHFlag(1); // Setze H-Flag entsprechend der Bedingung.
        } else {
          cpu.setHFlag(0);
        }

        cpu.setE(result); // Setze den neuen Wert von E.
      })
    );
    this.opcodeList.set(
      0x24,
      new Opcode("INC", "H", 0x24, 8, 1, false, (cpu) => {
        const HL = cpu.getHL();
        const H = ((HL >> 8) & 0xff) + 1;
        const carryPerBit = HL + 0x100;
        const newHL = (H << 8) | (HL & 0xff);
        cpu.setHL(newHL);

        if (H === 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if ((carryPerBit & 0x0f00) > 0x0f00) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }
      })
    );

    this.opcodeList.set(
      0x2c,
      new Opcode("INC", "L", 0x2c, 8, 1, false, (cpu) => {
        const L = cpu.getL() + 1;
        const carryPerBit = (cpu.getL() & 0x0f) + 1;

        if (L === 0x100) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if (carryPerBit & 0x10) {
          cpu.setHFlag(1);
        } else {
          cpu.setHFlag(0);
        }

        const newL = L & 0xff;

        cpu.setL(newL);
      })
    );
    this.opcodeList.set(
      0x34,
      new Opcode("INC", "(HL)", 0x34, 12, 1, false, (cpu) => {
        const HL = cpu.getHL();
        const memValue = cpu.memory.readByte(HL);
        const newHL = memValue + 1;
        const carryPerBit = memValue + 1;
        cpu.memory.writeByte(HL, newHL);

        if (newHL === 0x100) {
          cpu.setZFlag(1); // Setze Z-Flag, wenn das Ergebnis gleich 0 ist.
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);

        if (carryPerBit & 0x10) {
          // Prüfe auf Halbcarry
          cpu.setHFlag(1); // Setze H-Flag, wenn ein Halbcarry auftritt.
        } else {
          cpu.setHFlag(0);
        }
      })
    );
    this.opcodeList.set(
      0x03,
      new Opcode("INC", "BC", 0x03, 8, 1, false, (cpu) => {
        cpu.setBC(cpu.getBC() + 1);
      })
    );
    this.opcodeList.set(
      0x13,
      new Opcode("INC", "DE", 0x13, 8, 1, false, (cpu) => {
        cpu.setDE(cpu.getDE() + 1);
      })
    );
    this.opcodeList.set(
      0x23,
      new Opcode("INC", "HL", 0x23, 8, 1, false, (cpu) => {
        cpu.setHL(cpu.getHL() + 1);
      })
    );
    this.opcodeList.set(
      0x33,
      new Opcode("INC", "SP", 0x33, 8, 1, false, (cpu) => {
         cpu.setSP((cpu.getSP() + 1) & 0xFFFF);
      })
    );

    this.opcodeList.set(
      0x3d,
      new Opcode("DEC", "A", 0x3d, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getA(),
          (val) => cpu.setA(val)
        )
      )
    );
    // 8-Bit Register DEC
    this.opcodeList.set(
      0x05,
      new Opcode("DEC", "B", 0x05, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getB(),
          (val) => cpu.setB(val)
        )
      )
    );
    this.opcodeList.set(
      0x0d,
      new Opcode("DEC", "C", 0x0d, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getC(),
          (val) => cpu.setC(val)
        )
      )
    );
    this.opcodeList.set(
      0x15,
      new Opcode("DEC", "D", 0x15, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getDE() >> 8,
          (val) => cpu.setDE((val << 8) | (cpu.getDE() & 0x00ff))
        )
      )
    );
    this.opcodeList.set(
      0x1d,
      new Opcode("DEC", "E", 0x1d, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getDE() & 0x00ff,
          (val) => cpu.setDE((cpu.getDE() & 0xff00) | val)
        )
      )
    );
    this.opcodeList.set(
      0x25,
      new Opcode("DEC", "H", 0x25, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getHL() >> 8,
          (val) => cpu.setHL((val << 8) | (cpu.getHL() & 0x00ff))
        )
      )
    );
    this.opcodeList.set(
      0x2d,
      new Opcode("DEC", "L", 0x2d, 8, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getHL() & 0x00ff,
          (val) => cpu.setHL((cpu.getHL() & 0xff00) | val)
        )
      )
    );
    this.opcodeList.set(
      0x35,
      new Opcode("DEC", "(HL)", 0x35, 24, 1, false, (cpu) => {
        const data = cpu.memory.readByte(cpu.getHL());
        const result = (data - 1) & 0xff;
        cpu.memory.writeByte(cpu.getHL(), result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((data & 0x0f) === 0 ? 1 : 0);
      })
    );

    // 16-Bit Register DEC
    this.opcodeList.set(
      0x0b,
      new Opcode("DEC", "BC", 0x0b, 8, 1, false, (cpu) =>
        cpu.dec16bit(
          () => cpu.getBC(),
          (val) => cpu.setBC(val)
        )
      )
    );
    this.opcodeList.set(
      0x1b,
      new Opcode("DEC", "DE", 0x1b, 8, 1, false, (cpu) =>
        cpu.dec16bit(
          () => cpu.getDE(),
          (val) => cpu.setDE(val)
        )
      )
    );
    this.opcodeList.set(
      0x2b,
      new Opcode("DEC", "HL", 0x2b, 8, 1, false, (cpu) =>
        cpu.dec16bit(
          () => cpu.getHL(),
          (val) => cpu.setHL(val)
        )
      )
    );
    this.opcodeList.set(
      0x3b,
      new Opcode("DEC", "SP", 0x3b, 8, 1, false, (cpu) =>
        cpu.dec16bit(
          () => cpu.getSP(),
          (val) => cpu.setSP(val)
        )
      )
    );

    this.opcodeList.set(
      0xa7,
      new Opcode("AND", "A", 0xa7, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
            */
        const result = cpu.getA() & cpu.getA();
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa0,
      new Opcode("AND", "B", 0xa0, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
            */
        const result = cpu.getA() & ((cpu.getBC() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa1,
      new Opcode("AND", "C", 0xa1, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
        const result = cpu.getA() & (cpu.getBC() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa2,
      new Opcode("AND", "D", 0xa2, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
        const result = cpu.getA() & ((cpu.getDE() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa3,
      new Opcode("AND", "E", 0xa3, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
        const result = cpu.getA() & (cpu.getDE() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa4,
      new Opcode("AND", "H", 0xa4, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
        const result = cpu.getA() & ((cpu.getHL() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa5,
      new Opcode("AND", "L", 0xa5, 8, 1, false, (cpu) => {
        /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
        const result = cpu.getA() & (cpu.getHL() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa6,
      new Opcode("AND", "(HL)", 0xa6, 16, 1, false, (cpu) => {
        /* data = read(HL)
                result = A & data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
        const data = cpu.memory.readByte(cpu.getHL());
        const result = cpu.getA() & data;
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xe6,
      new Opcode("AND", "n", 0xe6, 16, 2, false, (cpu) => {
        /* n = read(PC++)
                result = A & n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
        const n = cpu.memory.readByte(cpu.getPC());

        const result = cpu.getA() & n;
        cpu.setA(result);
        //  const carryPerBit = data - 1;
        // const B = (result << 8) | (cpu.getBC() & 0x00FF);
        // cpu.setBC(B);
        // cpu.memory.readByte(cpu.getHL(),result;
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb7,
      new Opcode("OR", "A", 0xb7, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
            */
        const result = cpu.getA() | cpu.getA();
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb0,
      new Opcode("OR", "B", 0xb0, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
            */
        const result = cpu.getA() | ((cpu.getBC() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb1,
      new Opcode("OR", "C", 0xb1, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
        const result = cpu.getA() | (cpu.getBC() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb2,
      new Opcode("OR", "D", 0xb2, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
        const result = cpu.getA() | ((cpu.getDE() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb3,
      new Opcode("OR", "E", 0xb3, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
        const result = cpu.getA() | (cpu.getDE() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb4,
      new Opcode("OR", "H", 0xb4, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
        const result = cpu.getA() | ((cpu.getHL() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb5,
      new Opcode("OR", "L", 0xb5, 8, 1, false, (cpu) => {
        /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
        const result = cpu.getA() | (cpu.getHL() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb6,
      new Opcode("OR", "(HL)", 0xb6, 16, 1, false, (cpu) => {
        /* data = read(HL)
                result = A | data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0

            */
        const data = cpu.memory.readByte(cpu.getHL());
        const result = cpu.getA() | data;
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xf6,
      new Opcode("OR", "n", 0xf6, 16, 2, false, (cpu) => {
        /* n = read(PC++)
                result = A & n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
        const n = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const result = cpu.getA() | n;
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xaf,
      new Opcode("XOR", "A", 0xaf, 8, 1, false, (cpu) => {
        /* result = A ^ A
               A = result
               flags.Z = 1 if result == 0 else 0
               flags.N = 0
               flags.H = 0
               flags.C = 0
            */
        const result = cpu.getA() ^ cpu.getA();
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa8,
      new Opcode("XOR", "B", 0xa8, 8, 1, false, (cpu) => {
        /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
        const result = cpu.getA() ^ ((cpu.getBC() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xa9,
      new Opcode("XOR", "C", 0xa9, 8, 1, false, (cpu) => {
        const result = cpu.getA() ^ cpu.getC();
        cpu.setA(result);
        if (cpu.getA() == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xaa,
      new Opcode("XOR", "D", 0xaa, 8, 1, false, (cpu) => {
        /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
        const result = cpu.getA() ^ ((cpu.getDE() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xab,
      new Opcode("XOR", "E", 0xab, 8, 1, false, (cpu) => {
        /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
        const result = cpu.getA() ^ (cpu.getDE() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xac,
      new Opcode("XOR", "H", 0xac, 8, 1, false, (cpu) => {
        /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
        const result = cpu.getA() ^ ((cpu.getHL() & 0xff00) >> 8);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xad,
      new Opcode("XOR", "L", 0xad, 8, 1, false, (cpu) => {
        /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
        const result = cpu.getA() ^ (cpu.getHL() & 0xff);
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xae,
      new Opcode("XOR", "(HL)", 0xae, 16, 1, false, (cpu) => {
        /* data = read(HL)
                result = A & data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
        const data = cpu.memory.readByte(cpu.getHL());
        const result = cpu.getA() ^ data;
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xee,
      new Opcode("XOR", "n", 0xee, 16, 2, false, (cpu) => {
        /* n = read(PC++)
                result = A & n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        const result = cpu.getA() ^ n;
        cpu.setA(result);
        if (result == 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }

        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0x3f,
      new Opcode("CCF", "", 0x3f, 8, 1, false, (cpu) => {
        /* flags.N = 0
            flags.H = 0
            flags.C = ~flags.C
        */
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        // KORRIGIERT: XOR mit 1 statt bitweise NOT
        cpu.setCFlag(cpu.getCFlag() ^ 1);
      })
    );

    this.cbOpcodeList.set(
      0x30,
      new Opcode("SWAP", "B", 0x30, 8, 0, false, (cpu) => {
        let value = cpu.getB();
        let result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setB(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.opcodeList.set(
      0x27,
      new Opcode("DAA", "", 0x27, 8, 1, false, (cpu) => {
        let a = cpu.getA();
        let adjust = 0;
        let carry = cpu.getCFlag();

        if (!cpu.getNFlag()) {
          if (cpu.getHFlag() || (a & 0x0f) > 9) adjust |= 0x06;
          if (carry || a > 0x99) {
            adjust |= 0x60;
            carry = 1;
          }
          a = (a + adjust) & 0xff;
        } else {
          if (cpu.getHFlag()) adjust |= 0x06;
          if (carry) adjust |= 0x60;
          a = (a - adjust) & 0xff;
        }

        cpu.setA(a);
        cpu.setZFlag(a === 0);
        cpu.setHFlag(0);
        cpu.setCFlag(carry);
      })
    );
    this.opcodeList.set(
      0x2f,
      new Opcode("CPL", "", 0x2f, 8, 1, false, (cpu) => {
        cpu.setA(~cpu.getA() & 0xff);
        cpu.setNFlag(1);
        cpu.setHFlag(1);
      })
    );
    this.opcodeList.set(
      0xc3,
      new Opcode("JP", "nn", 0xc3, 16, 3, true, (cpu) => {
        const lo = cpu.memory.readByte(cpu.getPC() + 1);
        const hi = cpu.memory.readByte(cpu.getPC() + 2);
        cpu.setPC((hi << 8) | lo);
      })
    );
    this.opcodeList.set(
      0xe9,
      new Opcode("JP", "HL", 0xe9, 8, 1, true, (cpu) => {
        cpu.setPC(cpu.getHL());
      })
    );
    this.opcodeList.set(
      0xc2,
      new Opcode("JP", "nz,nn", 0xc2, 12, 3, true, (cpu) => {
        const lo = cpu.memory.readByte(cpu.getPC() + 1);
        const hi = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (hi << 8) | lo;

        if (!cpu.getZFlag()) {
          cpu.setPC(addr);
        } else {
          cpu.increasePC(3);
        }
      })
    );
    this.opcodeList.set(
      0xca,
      new Opcode("JP", "z,nn", 0xca, 12, 3, true, (cpu) => {
        const lo = cpu.memory.readByte(cpu.getPC() + 1);
        const hi = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (hi << 8) | lo;

        if (cpu.getZFlag()) {
          cpu.setPC(addr);
        } else {
          cpu.increasePC(3);
        }
      })
    );
    this.opcodeList.set(
      0xd2,
      new Opcode("JP", "nc,nn", 0xd2, 12, 3, true, (cpu) => {
        const lo = cpu.memory.readByte(cpu.getPC() + 1);
        const hi = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (hi << 8) | lo;

        if (!cpu.getCFlag()) {
          cpu.setPC(addr);
        } else {
          cpu.increasePC(3);
        }
      })
    );
    this.opcodeList.set(
      0xda,
      new Opcode("JP", "c,nn", 0xda, 12, 3, true, (cpu) => {
        const lo = cpu.memory.readByte(cpu.getPC() + 1);
        const hi = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (hi << 8) | lo;

        if (cpu.getCFlag()) {
          cpu.setPC(addr);
        } else {
          cpu.increasePC(3);
        }
      })
    );
    this.opcodeList.set(
      0x18,
      new Opcode("JR", "e", 0x18, 12, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));
        cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
      })
    );
    this.opcodeList.set(
      0x20,
      new Opcode("JR", "nz,e", 0x20, 8, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));

        if (!cpu.getZFlag()) {
          // KORRIGIERT: Relative Adressierung
          cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
        } else {
          cpu.increasePC(2);
        }
      })
    );
    this.opcodeList.set(
      0x28,
      new Opcode("JR", "z,e", 0x28, 8, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));

        if (cpu.getZFlag()) {
          // KORRIGIERT: Relative Adressierung
          cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
        } else {
          cpu.increasePC(2);
        }
      })
    );
    this.opcodeList.set(
      0x37,
      new Opcode("SCF", "", 0x37, 4, 1, false, (cpu) => {
        cpu.setCFlag(1);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
      })
    );
    this.opcodeList.set(
      0x30,
      new Opcode("JR", "nc,e", 0x30, 8, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));
        if (!cpu.getCFlag()) cpu.increasePC(2 + e);
        else cpu.increasePC(2);
      })
    );
    this.opcodeList.set(
      0x38,
      new Opcode("JR", "c,e", 0x38, 8, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));
        if (cpu.getCFlag()) cpu.increasePC(2 + e);
        else cpu.increasePC(2);
      })
    );

    this.opcodeList.set(
      0xcd,
      new Opcode("CALL", "nn", 0xcd, 24, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;

        const returnAddr = cpu.getPC() + 3;

        // SP-- then write HIGH
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

        // SP-- then write LOW
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

        cpu.setPC(addr);
      })
    );
    this.opcodeList.set(
      0xc4,
      new Opcode("CALL", "NZ,nn", 0xc4, 12, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;

        if (cpu.getZFlag() === 0) {
          // Extra cycles
          cpu.setCPUCycle(cpu.getCPUCycle() + 12); // total 24

          const returnAddr = cpu.getPC() + 3;

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

          cpu.setPC(addr);
        } else {
          cpu.increasePC(3);
        }
      })
    );

    this.opcodeList.set(
      0xcc,
      new Opcode("CALL", "z,nn", 0xcc, 24, 1, true, (cpu) => {
        const lsbValue = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const msbValue = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        if (cpu.getZFlag() === 1) {
          cpu.setCPUCycle(cpu.getCPUCycle() + 48);
          cpu.decreaseSP(1);

          cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);

          cpu.setPC(finalValue);
        }
      })
    );
    this.opcodeList.set(
      0xd4,
      new Opcode("CALL", "nc,nn", 0xd4, 24, 1, true, (cpu) => {
        /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
              if F.check_condition(cc):
                  SP--
                  write(SP--, msb(PC))
                  write(SP, lsb(PC))
                  PC = nn
          */
        const lsbValue = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const msbValue = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        if (cpu.getC() === 0) {
          cpu.setCPUCycle(cpu.getCPUCycle() + 48);
          cpu.decreaseSP(1);

          cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);

          cpu.setPC(finalValue);
        }
      })
    );
    this.opcodeList.set(
      0xdc,
      new Opcode("CALL", "c, nn", 0xdc, 24, 1, true, (cpu) => {
        /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
              if F.check_condition(cc):
                  SP--
                  write(SP--, msb(PC))
                  write(SP, lsb(PC))
                  PC = nn
          */
        const lsbValue = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const msbValue = cpu.memory.readByte(cpu.getPC());
        cpu.increasePC(1);

        const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
        if (cpu.getC() === 1) {
          cpu.setCPUCycle(cpu.getCPUCycle() + 48);
          cpu.decreaseSP(1);

          cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);

          cpu.setPC(finalValue);
        }
      })
    );
    // ---------- RETI ----------
    this.opcodeList.set(
      0xd9,
      new Opcode("RETI", "", 0xd9, 16, 1, true, (cpu) => {
        const lsb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const msb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        cpu.setPC(cpu.toUnsigned16Bit(lsb, msb));
        cpu.setIme(1);
      })
    );

    // ---------- RET ----------
    this.opcodeList.set(
      0xc9,
      new Opcode("RET", "", 0xc9, 16, 1, true, (cpu) => {
        const lsb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const msb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        cpu.setPC(cpu.toUnsigned16Bit(lsb, msb));
      })
    );

    // ---------- RET NZ ----------
    this.opcodeList.set(
      0xc0,
      new Opcode("RET", "nz", 0xc0, 8, 1, true, (cpu) => {
        const lsb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const msb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        if (cpu.getZFlag() === 0) {
          cpu.setPC(cpu.toUnsigned16Bit(lsb, msb));
          cpu.setCPUCycle(cpu.getCPUCycle() + 12); // total 20
        }
      })
    );

    // ---------- RET Z ----------
    this.opcodeList.set(
      0xc8,
      new Opcode("RET", "z", 0xc8, 8, 1, true, (cpu) => {
        const lsb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const msb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        if (cpu.getZFlag() === 1) {
          cpu.setPC(cpu.toUnsigned16Bit(lsb, msb));
          cpu.setCPUCycle(cpu.getCPUCycle() + 12); // total 20
        }
      })
    );

    // ---------- RET NC ----------
    this.opcodeList.set(
      0xd0,
      new Opcode("RET", "nc", 0xd0, 8, 1, true, (cpu) => {
        // Wenn Carry NICHT gesetzt ist → RET
        if (cpu.getCFlag() === 0) {
          const lsb = cpu.memory.readByte(cpu.getSP());
          cpu.increaseSP(1);
          const msb = cpu.memory.readByte(cpu.getSP());
          cpu.increaseSP(1);

          cpu.setPC(cpu.toUnsigned16Bit(lsb, msb));

          // +12 cycles → total 20
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          // Bedingung nicht erfüllt:
          // KEIN Stack Read
          // PC += 1
          cpu.setPC(cpu.getPC() + 1);
          // bleibt bei 8 cycles (Basis)
        }
      })
    );

    // ---------- RET C ----------
    this.opcodeList.set(
      0xd8,
      new Opcode("RET", "c", 0xd8, 8, 1, true, (cpu) => {
        const lsb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const msb = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        if (cpu.getCFlag() === 1) {
          cpu.setPC(cpu.toUnsigned16Bit(lsb, msb));
          cpu.setCPUCycle(cpu.getCPUCycle() + 12); // total 20
        }
      })
    );

    this.opcodeList.set(
      0xc7,
      new Opcode("RST", "00H", 0xc7, 32, 1, true, (cpu) => {
        /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
        cpu.decreaseSP(2);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff);
        cpu.memory.writeByte(cpu.getSP() + 1, cpu.getPC() & 0xff);

        cpu.setPC(0x00);
      })
    );
    this.opcodeList.set(
      0xcf,
      new Opcode("RST", "08H", 0xcf, 32, 1, true, (cpu) => {
        const n = 0x08;
        cpu.decreaseSP(1);

        //msb
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);
        cpu.decreaseSP(1);

        //lsb
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);

        const msbValue = 0x00;
        const finalValue = cpu.toUnsigned16Bit(n, msbValue);

        cpu.setPC(finalValue);
      })
    );
    this.opcodeList.set(
      0xd7,
      new Opcode("RST", "10H", 0xd7, 32, 1, true, (cpu) => {
        // RST 10H
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);
        cpu.setPC(0x0010);
      })
    );
    this.opcodeList.set(
      0xdf,
      new Opcode("RST", "18H", 0xdf, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);
        cpu.setPC(0x0018);
      })
    );
    this.opcodeList.set(
      0xe7,
      new Opcode("RST", "20H", 0xe7, 32, 1, true, (cpu) => {
        // RST 20H
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);
        cpu.setPC(0x0020);
      })
    );
    this.opcodeList.set(
      0xef,
      new Opcode("RST", "28H", 0xef, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);
        cpu.setPC(0x0028);
      })
    );
    this.opcodeList.set(
      0xf7,
      new Opcode("RST", "30H", 0xf7, 32, 1, true, (cpu) => {
        // RST 30H
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);
        cpu.setPC(0x0030);
      })
    );
    this.opcodeList.set(
      0xff,
      new Opcode("RST", "38H", 0xff, 32, 1, true, (cpu) => {
        const n = 0x38;
        const msbValue = 0x00;
        const finalValue = cpu.toUnsigned16Bit(msbValue, n);

        // Decrement the Stack Pointer and write high byte of PC
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() & 0xff00) >> 8);

        // Decrement the Stack Pointer and write low byte of PC
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff);

        // Set the new PC to the RST address
        cpu.setPC(finalValue);
      })
    );

    this.opcodeList.set(
      0xf3,
      new Opcode("DI", "", 0xf3, 8, 1, false, (cpu) => {
        /* IME = 0*/
        cpu.setIme(0);
      })
    );
    this.opcodeList.set(
      0xfb,
      new Opcode("EI", "", 0xfb, 8, 1, false, (cpu) => {
        /*IME_scheduled = true*/
        cpu.setImeScheduled(1);
      })
    );
    this.opcodeList.set(
      0x17,
      new Opcode("RLA", "", 0x17, 8, 1, false, (cpu) => {
        let a = cpu.getA();
        let oldCarry = cpu.getCFlag(); // carry INPUT
        let msb = (a >> 7) & 1; // carry OUTPUT

        let result = ((a << 1) & 0xfe) | oldCarry;

        cpu.setA(result & 0xff);

        cpu.setZFlag(0); // ALWAYS 0
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );
    this.opcodeList.set(
      0x0f,
      new Opcode("RRCA", "", 0x0f, 8, 1, false, (cpu) => {
        let a = cpu.getA();
        let lsb = a & 1;

        let result = ((a >> 1) | (lsb << 7)) & 0xff;

        cpu.setA(result);

        cpu.setZFlag(0); // ALWAYS 0
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.opcodeList.set(
      0x1f,
      new Opcode("RRA", "", 0x1f, 8, 1, false, (cpu) => {
        let a = cpu.getA();
        let oldCarry = cpu.getCFlag(); // carry INPUT
        let lsb = a & 1; // carry OUTPUT

        let result = ((a >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setA(result);

        cpu.setZFlag(0); // ALWAYS 0
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x37,
      new Opcode("SWAP", "A", 0x37, 16, 2, false, (cpu) => {
        /* 
                Swap upper & lower nibles of n
            */
        let value = cpu.getA();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setA(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x31,
      new Opcode("SWAP", "C", 0x31, 16, 1, false, (cpu) => {
        /* 
                Swap upper & lower nibles of n
            */
        let value = cpu.getC();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setC(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x32,
      new Opcode("SWAP", "D", 0x32, 16, 1, false, (cpu) => {
        /* 
                Swap upper & lower nibles of n
            */
        let value = cpu.getD();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setD(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x33,
      new Opcode("SWAP", "E", 0x33, 16, 1, false, (cpu) => {
        /* 
                Swap upper & lower nibles of n
            */
        let value = cpu.getE();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setE(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x34,
      new Opcode("SWAP", "H", 0x34, 16, 1, false, (cpu) => {
        /* 
                Swap upper & lower nibles of n
            */
        let value = cpu.getH();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setH(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x35,
      new Opcode("SWAP", "L", 0x35, 16, 1, false, (cpu) => {
        /* 
                Swap upper & lower nibles of n
            */
        let value = cpu.getL();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setL(result);

        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x36,
      new Opcode("SWAP", "HL", 0x36, 24, 2, false, (cpu) => {
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.cbOpcodeList.set(
      0x07,
      new Opcode("RLC", "A", 0x07, 16, 1, false, (cpu) => {
        const value = cpu.getA();
        const carry = (value >> 7) & 1;
        const result = ((value << 1) | carry) & 0xff;

        cpu.setA(result);

        cpu.setZFlag(0); // ALWAYS 0 for A
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(carry);
      })
    );
    this.cbOpcodeList.set(
      0x00,
      new Opcode("RLC", "B", 0x00, 16, 2, false, (cpu) => {
        let b = cpu.getB();

        // Extract MSB
        let msb = (b & 0x80) >> 7;

        // Rotate left
        let result = ((b << 1) & 0xfe) | msb;

        // Flags
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update ONLY B
        cpu.setB(result);
      })
    );
    this.cbOpcodeList.set(
      0x01,
      new Opcode("RLC", "C", 0x01, 16, 2, false, (cpu) => {
        let c = cpu.getC();

        let msb = (c & 0x80) >> 7;
        let result = ((c << 1) & 0xfe) | msb;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setC(result);
      })
    );
    this.cbOpcodeList.set(
      0x02,
      new Opcode("RLC", "D", 0x02, 16, 2, false, (cpu) => {
        let d = cpu.getD();

        let msb = (d & 0x80) >> 7;
        let result = ((d << 1) & 0xfe) | msb;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setD(result);
      })
    );
    this.cbOpcodeList.set(
      0x03,
      new Opcode("RLC", "E", 0x03, 16, 2, false, (cpu) => {
        let e = cpu.getE();

        let msb = (e & 0x80) >> 7;
        let result = ((e << 1) & 0xfe) | msb;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setE(result);
      })
    );
    this.cbOpcodeList.set(
      0x04,
      new Opcode("RLC", "H", 0x04, 16, 2, false, (cpu) => {
        let h = cpu.getH();

        let msb = (h & 0x80) >> 7;
        let result = ((h << 1) & 0xfe) | msb;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setH(result);
      })
    );
    this.cbOpcodeList.set(
      0x05,
      new Opcode("RLC", "L", 0x05, 16, 2, false, (cpu) => {
        let l = cpu.getL();

        let msb = (l & 0x80) >> 7;
        let result = ((l << 1) & 0xfe) | msb;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setL(result);
      })
    );
    this.cbOpcodeList.set(
      0x06,
      new Opcode("RLC", "(HL)", 0x06, 32, 2, false, (cpu) => {
        let addr = cpu.getHL();
        let value = cpu.memory.readByte(addr);

        let msb = (value & 0x80) >> 7;
        let result = ((value << 1) & 0xfe) | msb;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.memory.writeByte(addr, result);
      })
    );
    this.cbOpcodeList.set(
      0x17,
      new Opcode("RL", "A", 0x17, 16, 2, false, (cpu) => {
        let a = cpu.getA();
        let carryIn = cpu.getCFlag();
        let msb = (a & 0x80) >> 7;

        let result = ((a << 1) & 0xfe) | carryIn;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setA(result);
      })
    );
    this.cbOpcodeList.set(
      0x10,
      new Opcode("RL", "B", 0x10, 16, 2, false, (cpu) => {
        let b = cpu.getB();
        let carryIn = cpu.getCFlag();
        let msb = (b & 0x80) >> 7;

        let result = ((b << 1) & 0xfe) | carryIn;

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        cpu.setB(result);
      })
    );

    this.cbOpcodeList.set(
      0x11,
      new Opcode("RL", "C", 0x11, 16, 1, false, (cpu) => {
        /**/
        // Get the most significant bit of the C register
        let msb = (cpu.getBC() & 0x0080) >> 7;

        // Shift the C register to the left by one bit and set the least significant bit to the value of the carry flag
        let result = ((cpu.getBC() << 1) & 0xfffe) | (cpu.getC() ? 1 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the C register
        let newBC = (cpu.getBC() & 0xff00) | result;
        cpu.setBC(newBC);
      })
    );
    this.cbOpcodeList.set(
      0x12,
      new Opcode("RL", "D", 0x12, 16, 1, false, (cpu) => {
        // Get the most significant bit of the D register
        let msb = (cpu.getDE() & 0x8000) >> 8;

        // Shift the D register to the left by one bit and set the least significant bit to the value of the carry flag
        let result = ((cpu.getDE() << 1) & 0xfffe) | (cpu.getC() ? 1 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the D register
        let newDE = (cpu.getDE() & 0xff) | (result << 8);
        cpu.setDE(newDE);
      })
    );
    this.cbOpcodeList.set(
      0x13,
      new Opcode("RL", "E", 0x13, 16, 1, false, (cpu) => {
        // Get the most significant bit of the E register
        let msb = (cpu.getDE() & 0x8000) >> 8;

        // Shift the E register to the left by one bit and set the least significant bit to the value of the carry flag
        let result = ((cpu.getDE() << 1) & 0xfffe) | (cpu.getC() ? 1 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the E register
        let newDE = (cpu.getDE() & 0xff) | (result << 8);
        cpu.setDE(newDE);
      })
    );
    this.cbOpcodeList.set(
      0x14,
      new Opcode("RL", "H", 0x14, 16, 1, false, (cpu) => {
        // Get the most significant bit of the H register
        let msb = (cpu.getHL() & 0x8000) >> 8;

        // Shift the H register to the left by one bit and set the least significant bit to the value of the carry flag
        let result = ((cpu.getHL() << 1) & 0xfffe) | (cpu.getC() ? 1 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the H register
        let newHL = (cpu.getHL() & 0xff) | (result << 8);
        cpu.setHL(newHL);
      })
    );
    this.cbOpcodeList.set(
      0x15,
      new Opcode("RL", "L", 0x15, 16, 1, false, (cpu) => {
        // Get the most significant bit of the L register
        let msb = (cpu.getHL() & 0x0080) >> 7;

        // Shift the L register to the left by one bit and set the least significant bit to the value of the carry flag
        let result = ((cpu.getHL() << 1) & 0xfffe) | (cpu.getC() ? 1 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the L register
        let newHL = (cpu.getHL() & 0xff00) | result;
        cpu.setHL(newHL);
      })
    );
    this.cbOpcodeList.set(
      0x16,
      new Opcode("RL", "HL", 0x16, 32, 2, false, (cpu) => {
        const hl = cpu.getHL();
        const value = cpu.memory.readByte(hl);

        // Get the most significant bit of the value
        const msb = (value & 0x80) >> 7;

        // Shift the value to the left by one bit and set the least significant bit to the value of the carry flag
        const result = ((value << 1) & 0xfe) | (cpu.getC() ? 1 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Write the result back to memory
        cpu.memory.writeByte(hl, result);
      })
    );

    this.cbOpcodeList.set(
      0x0f,
      new Opcode("RRC", "A", 0x0f, 16, 1, false, (cpu) => {
        let lsb = cpu.getA() & 0x01;

        // Shift the A register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = (cpu.getA() >> 1) | (cpu.getC() ? 0x80 : 0x00);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the A register
        cpu.setA(result);
      })
    );
    this.cbOpcodeList.set(
      0x08,
      new Opcode("RRC", "B", 0x08, 16, 2, false, (cpu) => {
        // Get the least significant bit of the B register
        let lsb = cpu.getBC() & 0x0001;

        // Shift the B register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = ((cpu.getBC() >> 1) & 0x7fff) | (cpu.getC() ? 0x8000 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the B register
        cpu.setBC(result);
      })
    );
    this.cbOpcodeList.set(
      0x09,
      new Opcode("RRC", "C", 0x09, 16, 1, false, (cpu) => {
        // Get the least significant bit of the C register
        let lsb = cpu.getC() & 0x01;

        // Shift the C register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = ((cpu.getC() >> 1) & 0x7f) | (cpu.getC() ? 0x80 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the C register
        let newBC = (cpu.getBC() & 0xff00) | result;
        cpu.setBC(newBC);
      })
    );
    this.cbOpcodeList.set(
      0x0a,
      new Opcode("RRC", "D", 0x0a, 16, 1, false, (cpu) => {
        // Get the least significant bit of the D register
        let lsb = cpu.getD() & 0x01;

        // Shift the D register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = (cpu.getD() >> 1) | (lsb << 15);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the DE register
        cpu.setD(result);
      })
    );
    this.cbOpcodeList.set(
      0x0b,
      new Opcode("RRC", "E", 0x0b, 16, 1, false, (cpu) => {
        // Get the most significant bit of the DE register
        let msb = (cpu.getE() & 0x80) >> 7;

        // Shift the DE register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = ((cpu.getE() >> 1) & 0x7f) | (cpu.getCFlag() ? 0x80 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the DE register
        cpu.setE(result);
      })
    );
    this.cbOpcodeList.set(
      0x0c,
      new Opcode("RRC", "H", 0x0c, 16, 1, false, (cpu) => {
        // Get the least significant bit of the H register
        let lsb = cpu.getH() & 0x01;

        // Shift the H register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = (cpu.getH() >> 1) | (cpu.getCFlag() ? 0x80 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the H register
        cpu.setH(result);
      })
    );
    this.cbOpcodeList.set(
      0x0d,
      new Opcode("RRC", "L", 0x0d, 16, 1, false, (cpu) => {
        // Get the least significant bit of the L register
        let lsb = cpu.getL() & 0x01;

        // Shift the L register to the right by one bit and set the most significant bit to the value of the carry flag
        let result = (cpu.getL() >> 1) | (cpu.getCFlag() ? 0x80 : 0x00);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the L register
        cpu.setL(result);
      })
    );
    this.cbOpcodeList.set(
      0x0e,
      new Opcode("RRC", "HL", 0x0e, 32, 2, false, (cpu) => {
        // Get the value at the memory address in the HL register
        let value = cpu.memory.readByte(cpu.getHL());

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit, and set the most significant bit to the value of the carry flag
        let result = ((value >> 1) & 0x7f) | (cpu.getCFlag() ? 0x80 : 0);

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value at the memory address in the HL register
        cpu.memory.writeByte(cpu.getHL(), result);
      })
    );

    this.cbOpcodeList.set(
      0x1f,
      new Opcode("RR", "A", 0x1f, 16, 1, false, (cpu) => {
        let a = cpu.getA();
        let oldCarry = cpu.getCFlag();
        let lsb = a & 1;

        let result = ((a >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setA(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x18,
      new Opcode("RR", "B", 0x18, 16, 2, false, (cpu) => {
        let b = cpu.getB();
        let oldCarry = cpu.getCFlag();
        let lsb = b & 1;

        let result = ((b >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setB(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x19,
      new Opcode("RR", "C", 0x19, 16, 1, false, (cpu) => {
        let c = cpu.getC();
        let oldCarry = cpu.getCFlag();
        let lsb = c & 1;

        let result = ((c >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setC(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x1a,
      new Opcode("RR", "D", 0x1a, 16, 1, false, (cpu) => {
        let d = cpu.getD();
        let oldCarry = cpu.getCFlag();
        let lsb = d & 1;

        let result = ((d >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setD(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x1b,
      new Opcode("RR", "E", 0x1b, 16, 1, false, (cpu) => {
        let e = cpu.getE();
        let oldCarry = cpu.getCFlag();
        let lsb = e & 1;

        let result = ((e >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setE(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x1c,
      new Opcode("RR", "H", 0x1c, 16, 1, false, (cpu) => {
        let h = cpu.getH();
        let oldCarry = cpu.getCFlag();
        let lsb = h & 1;

        let result = ((h >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setH(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x1d,
      new Opcode("RR", "L", 0x1d, 16, 1, false, (cpu) => {
        let l = cpu.getL();
        let oldCarry = cpu.getCFlag();
        let lsb = l & 1;

        let result = ((l >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setL(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x1e,
      new Opcode("RR", "HL", 0x1e, 32, 2, false, (cpu) => {
        let addr = cpu.getHL();
        let value = cpu.memory.readByte(addr);

        let oldCarry = cpu.getCFlag();
        let lsb = value & 1;

        let result = ((value >> 1) | (oldCarry << 7)) & 0xff;

        cpu.memory.writeByte(addr, result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x27,
      new Opcode("SLA", "A", 0x27, 16, 1, false, (cpu) => {
        // Get the value of register A
        let value = cpu.getA();

        // Get the most significant bit of the value
        let msb = (value & 0x80) >> 7;

        // Shift the value to the left by one bit and set the least significant bit to 0
        let result = (value << 1) & 0xfe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of register A with the result
        cpu.setA(result);
      })
    );

    this.cbOpcodeList.set(
      0x20,
      new Opcode("SLA", "B", 0x20, 16, 2, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getBC() >> 8;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the left by one bit and set the least significant bit to 0
        let result = (value << 1) & 0xfe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the B register with the result
        cpu.setBC((cpu.getBC() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x21,
      new Opcode("SLA", "C", 0x21, 16, 1, false, (cpu) => {
        // Get the least significant bit of the C register
        let lsb = cpu.getBC() & 0x01;

        // Shift the C register to the left by one bit and set the least significant bit to 0
        let result = (cpu.getBC() << 1) & 0xfffe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the C register in the BC register pair with the result
        cpu.setBC((cpu.getBC() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x22,
      new Opcode("SLA", "D", 0x22, 16, 1, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getDE() >> 8;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the left by one bit and set the least significant bit to 0
        let result = (value << 1) & 0xfe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the B register with the result
        cpu.setDE((cpu.getDE() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x23,
      new Opcode("SLA", "E", 0x23, 16, 1, false, (cpu) => {
        // Get the least significant bit of the C register
        let lsb = cpu.getDE() & 0x01;

        // Shift the C register to the left by one bit and set the least significant bit to 0
        let result = (cpu.getDE() << 1) & 0xfffe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the C register in the BC register pair with the result
        cpu.setDE((cpu.getDE() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x24,
      new Opcode("SLA", "H", 0x24, 16, 1, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getHL() >> 8;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the left by one bit and set the least significant bit to 0
        let result = (value << 1) & 0xfe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the B register with the result
        cpu.setHL((cpu.getHL() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x25,
      new Opcode("SLA", "L", 0x25, 16, 1, false, (cpu) => {
        // Get the least significant bit of the C register
        let lsb = cpu.getHL() & 0x01;

        // Shift the C register to the left by one bit and set the least significant bit to 0
        let result = (cpu.getHL() << 1) & 0xfffe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the C register in the BC register pair with the result
        cpu.setHL((cpu.getHL() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x26,
      new Opcode("SLA", "HL", 0x26, 32, 2, false, (cpu) => {
        // Get the value at the memory address stored in the HL register pair
        let value = cpu.memory.readByte(cpu.getHL());

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the left by one bit and set the least significant bit to 0
        let result = (value << 1) & 0xfe;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of memory at the HL register pair with the result
        cpu.memory.writeByte(cpu.getHL(), result);
      })
    );

    this.cbOpcodeList.set(
      0x3f,
      new Opcode("SRL", "A", 0x3f, 16, 1, false, (cpu) => {
        // Get the value of register A
        let value = cpu.getA();

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit to 0
        let result = (value >> 1) & 0x7f;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of register A with the result
        cpu.setA(result);
      })
    );

    this.cbOpcodeList.set(
      0x38,
      new Opcode("SRL", "B", 0x38, 16, 1, false, (cpu) => {
        let value = cpu.getB();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0xff;

        cpu.setB(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x39,
      new Opcode("SRL", "C", 0x39, 16, 1, false, (cpu) => {
        // Get the value of register C
        let value = cpu.getBC() & 0xff;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit to 0
        let result = (value >> 1) & 0x7f;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of register C with the result
        cpu.setBC((cpu.getBC() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x3a,
      new Opcode("SRL", "D", 0x3a, 16, 1, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getDE() >> 8;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit
        let result = value >> 1;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the B register with the result
        cpu.setDE((cpu.getDE() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x3b,
      new Opcode("SRL", "E", 0x3b, 16, 1, false, (cpu) => {
        // Get the value of register C
        let value = cpu.getDE() & 0xff;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit to 0
        let result = (value >> 1) & 0x7f;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of register C with the result
        cpu.setDE((cpu.getDE() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x3c,
      new Opcode("SRL", "H", 0x3c, 16, 1, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getHL() >> 8;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit
        let result = value >> 1;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the B register with the result
        cpu.setHL((cpu.getHL() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x3d,
      new Opcode("SRL", "L", 0x3d, 16, 1, false, (cpu) => {
        // Get the value of register C
        let value = cpu.getHL() & 0xff;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit to 0
        let result = (value >> 1) & 0x7f;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of register C with the result
        cpu.setHL((cpu.getHL() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x3e,
      new Opcode("SRL", "HL", 0x3e, 32, 2, false, (cpu) => {
        // Get the value at the memory address stored in the HL register
        let value = cpu.memory.readByte(cpu.getHL());

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Shift the value to the right by one bit and set the sign bit to 0
        let result = value >> 1;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value at the memory address stored in the HL register with the result
        cpu.memory.writeByte(cpu.getHL(), result);
      })
    );

    this.cbOpcodeList.set(
      0x2f,
      new Opcode("SRA", "A", 0x2f, 16, 1, false, (cpu) => {
        // Get the value of register A
        let value = cpu.getA();

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Get the most significant bit of the value and preserve it
        let msb = value & 0x80;

        // Shift the value to the right by one bit and set the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of register A with the result
        cpu.setA(result);
      })
    );

    this.cbOpcodeList.set(
      0x28,
      new Opcode("SRA", "B", 0x28, 16, 2, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getBC() >> 8;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the B register with the result
        cpu.setBC((cpu.getBC() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x29,
      new Opcode("SRA", "C", 0x29, 16, 1, false, (cpu) => {
        // Get the value of the C register
        let value = cpu.getBC() & 0xff;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the C register with the result
        cpu.setBC((cpu.getBC() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x2a,
      new Opcode("SRA", "D", 0x2a, 16, 1, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getDE() >> 8;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the B register with the result
        cpu.setDE((cpu.getDE() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x2b,
      new Opcode("SRA", "E", 0x2b, 16, 1, false, (cpu) => {
        // Get the value of the C register
        let value = cpu.getDE() & 0xff;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the C register with the result
        cpu.setDE((cpu.getDE() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x2c,
      new Opcode("SRA", "H", 0x2c, 16, 1, false, (cpu) => {
        // Get the value of the B register
        let value = cpu.getHL() >> 8;

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of the B register with the result
        cpu.setHL((cpu.getHL() & 0x00ff) | (result << 8));
      })
    );
    this.cbOpcodeList.set(
      0x2d,
      new Opcode("SRA", "L", 0x2d, 16, 1, false, (cpu) => {
        // Get the value of the C register
        let value = cpu.getHL() & 0xff;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);

        // Update the value of the C register with the result
        cpu.setHL((cpu.getHL() & 0xff00) | result);
      })
    );
    this.cbOpcodeList.set(
      0x2e,
      new Opcode("SRA", "HL", 0x2e, 32, 2, false, (cpu) => {
        // Get the value of memory at the address in HL
        let value = cpu.memory.readByte(cpu.getHL());

        // Get the least significant bit of the value
        let lsb = value & 0x01;

        // Get the most significant bit of the value
        let msb = value & 0x80;

        // Shift the value to the right by one bit and preserve the sign bit
        let result = (value >> 1) | msb;

        // Set the flags register based on the result
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);

        // Update the value of memory at the address in HL with the result
        cpu.memory.writeByte(cpu.getHL(), result);
      })
    );

    this.cbOpcodeList.set(
      0x47,
      new Opcode("BIT", "b,A", 0x47, 16, 1, false, (cpu) => {
        // Get the value of register A
        let value = cpu.getA();

        // Get the value of bit b in register A
        let bitValue = (value >> b) & 0x01;

        // Set the flags register based on the result
        cpu.setZFlag(bitValue === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(1);
      })
    );
    this.cbOpcodeList.set(
      0x40,
      new Opcode("BIT", "b,B", 0x40, 16, 2, false, (cpu) => {
        // Get the value of register B from BC
        let bc = cpu.getBC();
        let value = (bc >> 8) & 0x00ff;

        // Get the bit to test from the opcode
        let bit = (opcode >> 3) & 0x07;

        // Test the bit and set the flags register accordingly
        if ((value & (1 << bit)) === 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }
        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(cpu.getC());
      })
    );
    this.cbOpcodeList.set(
      0x41,
      new Opcode("BIT", "b,C", 0x41, 16, 1, false, (cpu) => {
        // Get the value of register C from BC
        let bc = cpu.getBC();
        let value = bc & 0x00ff;

        // Get the bit to test from the opcode
        let bit = (opcode >> 3) & 0x07;

        // Test the bit and set the flags register accordingly
        if ((value & (1 << bit)) === 0) {
          cpu.setZFlag(1);
        } else {
          cpu.setZFlag(0);
        }
        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(cpu.getC());
      })
    );
    this.cbOpcodeList.set(
      0x42,
      new Opcode("BIT", "b,D", 0x42, 16, 1, false, (cpu) => {
        // Get the value of register D
        let value = cpu.getDE() >> 8;

        // Shift the value to the right by b bits and set the Z flag based on the result
        let result = (value >> b) & 0x01;
        cpu.setZFlag(result === 0 ? 1 : 0);

        // Set the N flag to 0 and the H flag to 1
        cpu.setNFlag(0);
        cpu.setHFlag(1);

        // Update the value of register D with the result
        value &= ~(0x01 << b);
        cpu.setDE((value << 8) | (cpu.getDE() & 0x00ff));
      })
    );
    this.cbOpcodeList.set(
      0x43,
      new Opcode("BIT", "b,E", 0x43, 16, 1, false, (cpu) => {
        // Get the value of register E
        let value = cpu.getDE() & 0xff;

        // Shift the value to the right by b bits and set the Z flag based on the result
        let result = (value >> b) & 0x01;
        cpu.setZFlag(result === 0 ? 1 : 0);

        // Set the N flag to 0 and the H flag to 1
        cpu.setNFlag(0);
        cpu.setHFlag(1);

        // Update the value of register E with the result
        value &= ~(0x01 << b);
        cpu.setDE((cpu.getDE() & 0xff00) | value);
      })
    );
    this.cbOpcodeList.set(
      0x44,
      new Opcode("BIT", "b,H", 0x44, 16, 1, false, (cpu) => {
        // Get the value of register H
        let value = cpu.getHL() >> 8;

        // Shift the value to the right by b bits and set the Z flag based on the result
        let result = (value >> b) & 0x01;
        cpu.setZFlag(result === 0 ? 1 : 0);

        // Set the N flag to 0 and the H flag to 1
        cpu.setNFlag(0);
        cpu.setHFlag(1);

        // Update the value of register H with the result
        value &= ~(0x01 << b);
        cpu.setHL((value << 8) | (cpu.getHL() & 0x00ff));
      })
    );
    this.cbOpcodeList.set(
      0x45,
      new Opcode("BIT", "b,L", 0x45, 16, 1, false, (cpu) => {
        // Get the value of register L
        let value = cpu.getHL() & 0xff;

        // Shift the value to the right by b bits and set the Z flag based on the result
        let result = (value >> b) & 0x01;
        cpu.setZFlag(result === 0 ? 1 : 0);

        // Set the N flag to 0 and the H flag to 1
        cpu.setNFlag(0);
        cpu.setHFlag(1);

        // Update the value of register L with the result
        value &= ~(0x01 << b);
        cpu.setHL((cpu.getHL() & 0xff00) | value);
      })
    );
    this.cbOpcodeList.set(
      0x46,
      new Opcode("BIT", "b, (HL)", 0x46, 16, 2, false, (cpu) => {
        // Get the value at the memory address stored in HL
        let value = cpu.memory.readByte(cpu.getHL());

        // Shift the value to the right by b bits and set the Z flag based on the result
        let result = (value >> b) & 0x01;
        cpu.setZFlag(result === 0 ? 1 : 0);

        // Set the N flag to 0 and the H flag to 1
        cpu.setNFlag(0);
        cpu.setHFlag(1);

        // Update the value at the memory address stored in HL with the result
        value &= ~(0x01 << b);
        cpu.memory.writeByte(cpu.getHL(), value);
      })
    );

    this.cbOpcodeList.set(
      0xc7,
      new Opcode("SET", "b,A", 0xc7, 16, 1, false, (cpu) => {
        // Get the value of register A
        let value = cpu.getA();

        // Set the bit at position b
        value |= 1 << b;

        // Update the value of register A with the result
        cpu.setA(value);

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc0,
      new Opcode("SET", "b,B", 0xc0, 16, 2, false, (cpu) => {
        // Get the value of register B
        let value = cpu.getBC() >> 8;

        // Set the bit at position b to 1
        value |= 0x01 << b;

        // Update the value of register B with the result
        cpu.setBC((value << 8) | (cpu.getBC() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc1,
      new Opcode("SET", "b,C", 0xc1, 16, 1, false, (cpu) => {
        // Get the value of register C
        let value = cpu.getBC() & 0x00ff;

        // Set the bit at position b
        value |= 0x01 << b;

        // Update the value of register C with the result
        cpu.setBC((cpu.getBC() & 0xff00) | value);

        // Increment program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc2,
      new Opcode("SET", "b,D", 0xc2, 16, 1, false, (cpu) => {
        // Get the value of register D
        let value = cpu.getDE() >> 8;

        // Set the bit at position b in the value
        value |= 0x01 << b;

        // Update the value of register D with the result
        cpu.setDE((value << 8) | (cpu.getDE() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc3,
      new Opcode("SET", "b,E", 0xc3, 16, 1, false, (cpu) => {
        // Get the value of register D
        let value = cpu.getDE() & 0xff;

        // Set the bit at position b
        value |= 0x01 << b;

        // Update the value of register D with the result
        cpu.setDE((cpu.getDE() & 0xff00) | value);

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc4,
      new Opcode("SET", "b,H", 0xc4, 16, 1, false, (cpu) => {
        // Get the value of register H
        let value = cpu.getHL() >> 8;

        // Set the b-th bit in the value
        value |= 0x01 << b;

        // Update the value of register H with the result
        cpu.setHL((value << 8) | (cpu.getHL() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc5,
      new Opcode("SET", "b,L", 0xc5, 16, 1, false, (cpu) => {
        // Get the value in register L
        let value = cpu.getHL() & 0x00ff;

        // Set the bit b in the value
        value |= 1 << b;

        // Update the value of register L with the result
        let result = (cpu.getHL() & 0xff00) | value;
        cpu.setHL(result);

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0xc6,
      new Opcode("SET", "b, (HL)", 0xc6, 16, 2, false, (cpu) => {
        // Get the value at the memory address stored in HL
        let position = cpu.getHL();
        let value = cpu.memory.readByte(position);

        // Set the bit b in the value
        value |= 1 << b;

        // Write the updated value back to memory
        cpu.memory.writeByte(position, value);

        // Increment the program counter
        cpu.increasePC(1);
      })
    );

    //@TODO RES MISSING !!!
    this.cbOpcodeList.set(
      0x87,
      new Opcode("RES", "b,A", 0x87, 16, 1, false, (cpu) => {
        // Get the value of register A
        let value = cpu.getAF() >> 8;

        // Reset the b-th bit of the value
        value &= ~(0x01 << b);

        // Update the value of register A with the result
        cpu.setAF((value << 8) | (cpu.getAF() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0x80,
      new Opcode("RES", "b,B", 0x80, 16, 2, false, (cpu) => {
        // Get the value of register B
        let value = cpu.getBC() >> 8;

        // Clear the b-th bit of the value
        value &= ~(0x01 << b);

        // Update the value of register B with the result
        cpu.setBC((value << 8) | (cpu.getBC() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0x81,
      new Opcode("RES", "b,C", 0x81, 16, 1, false, (cpu) => {
        // Get the value of register C
        let value = cpu.getBC() & 0x00ff;

        // Reset the b-th bit of the value
        value &= ~(0x01 << b);

        // Update the value of register C with the result
        cpu.setBC((cpu.getBC() & 0xff00) | value);

        // Set the flags register
        cpu.setZFlag(0);
        cpu.setNFlag(0);
        cpu.setHFlag(1);
      })
    );
    this.cbOpcodeList.set(
      0x82,
      new Opcode("RES", "b,D", 0x82, 16, 1, false, (cpu) => {
        // Get the value of register D
        let value = cpu.getDE() >> 8;

        // Clear the b-th bit of the value
        value &= ~(0x01 << b);

        // Update the value of register D with the result
        cpu.setDE((value << 8) | (cpu.getDE() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0x83,
      new Opcode("RES", "b,E", 0x83, 16, 1, false, (cpu) => {
        // Get the value of register E from the 16-bit register DE
        let value = cpu.getDE() & 0x00ff;

        // Clear the b-th bit of the value
        value &= ~(1 << b);

        // Update the value of register E in the 16-bit register DE
        cpu.setDE((cpu.getDE() & 0xff00) | value);

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0x84,
      new Opcode("RES", "b,H", 0x84, 16, 1, false, (cpu) => {
        // Get the value of register H from the 16-bit register HL
        let value = cpu.getHL() >> 8;

        // Clear the b-th bit of the value
        value &= ~(1 << b);

        // Update the value of register H in the 16-bit register HL
        cpu.setHL((value << 8) | (cpu.getHL() & 0x00ff));

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0x85,
      new Opcode("RES", "b,L", 0x85, 16, 1, false, (cpu) => {
        // Get the value of register L from the 16-bit register HL
        let value = cpu.getHL() & 0x00ff;

        // Clear the b-th bit of the value
        value &= ~(1 << b);

        // Update the value of register L in the 16-bit register HL
        cpu.setHL((cpu.getHL() & 0xff00) | value);

        // Increment the program counter
        cpu.increasePC(1);
      })
    );
    this.cbOpcodeList.set(
      0x86,
      new Opcode("RES", "b, (HL)", 0x86, 16, 2, false, (cpu) => {
        // Read the value from memory
        let value = cpu.memory.readByte(cpu.getHL());

        // Clear the b-th bit of the value
        value &= ~(1 << b);

        // Write the modified value back to memory
        cpu.memory.writeByte(cpu.getHL(), value);

        // Set flags
        cpu.setZFlag(0);
        cpu.setNFlag(0);
        cpu.setHFlag(1);
      })
    );
  }

  //returns the instruction which can be found by opcodeValue( decode step )
  static getInstruction(opcodeValue) {
    if (!this.opcodeList.has(opcodeValue)) {
      throw new Error(
        "Instruction not found " +
          opcodeValue?.toString(16).padStart(2, "0").toUpperCase()
      );
    }
    return this.opcodeList.get(opcodeValue);
  }

  static getCBInstruction(cbOpcodeValue) {
    if (!this.cbOpcodeList.has(cbOpcodeValue)) {
      throw new Error(
        "CB Instruction not found " +
          cbOpcodeValue?.toString(16).padStart(2, "0").toUpperCase()
      );
    }
    return this.cbOpcodeList.get(cbOpcodeValue);
  }

  static executeInstruction(cpu, instruction) {
    cpu.increaseCPUCycle(instruction.getOpcodeCycle());
    instruction.executeOn(cpu);
  }
}
