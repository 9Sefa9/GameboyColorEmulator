class InstructionSet extends CPU {
  static opcodeList = new Map();
  static cbOpcodeList = new Map();

  static prepareInstructions() {
    this.opcodeList.set(
      0x76,
      new Opcode("HALT", "", 0x76, 4, 1, false, (cpu) => {
        cpu.setIsHalted(true);

        // HALT Bug: Wenn IME=0 und ein Interrupt pending ist
        if (cpu.getIme() === 0) {
          const IE = cpu.memory.readByte(0xffff);
          const IF = cpu.memory.readByte(0xff0f);
          const pendingInterrupts = IE & IF & 0x1f;

          if (pendingInterrupts !== 0) {
            cpu.setHaltBug(true);
            console.log("🐛 HALT Bug condition detected");
          }
        }
      })
    );
    this.opcodeList.set(
      0x10,
      new Opcode("STOP", "", 0x10, 4, 1, false, (cpu) => {
        cpu.setStopMode(true);
        // In echten Spielen: Taktgeschwindigkeit ändern, auf Button warten
        console.log("🐛 STOP: Entering stop mode");

        // Für jetzt: Einfach aus STOP Mode raus wenn Interrupt kommt
        // Später: Taktgeschwindigkeit anpassen + Button Abfrage
      })
    );
    const undefinedOpcodes = [0xd3, 0xe4, 0xf4, 0xfc, 0xfd, 0xdd, 0xed, 0xfd];
    undefinedOpcodes.forEach((opcode) => {
      this.opcodeList.set(
        opcode,
        new Opcode("UNDEFINED", "", opcode, 4, 1, false, (cpu) => {
          console.warn(
            `⚠️ Undefined opcode 0x${opcode.toString(16)} executed at PC: 0x` +
              cpu.getPC().toString(16)
          );
          // Behave like a NOP
        })
      );
    });
    this.opcodeList.set(
      0x00,
      new Opcode("NOP", "", 0x00, 4, 1, false, (cpu) => {
        // Does nothing
      })
    );
    //8-bit operations
    this.opcodeList.set(
      0x7f,
      new Opcode("LD", "A,A", 0x7f, 4, 1, false, (cpu) => {
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
      new Opcode("LD", "A,B", 0x78, 4, 1, false, (cpu) => {
        const value = (cpu.getBC() & 0xff00) >> 8;
        cpu.setA(value);
      })
    );
    this.opcodeList.set(
      0x79,
      new Opcode("LD", "A,C", 0x79, 4, 1, false, (cpu) => {
        cpu.setA(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x7a,
      new Opcode("LD", "A,D", 0x7a, 4, 1, false, (cpu) => {
        cpu.setA(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x7b,
      new Opcode("LD", "A,E", 0x7b, 4, 1, false, (cpu) => {
        cpu.setA(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x7c,
      new Opcode("LD", "A,H", 0x7c, 4, 1, false, (cpu) => {
        cpu.setA(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x7d,
      new Opcode("LD", "A,L", 0x7d, 4, 1, false, (cpu) => {
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
      new Opcode("LD", "A,(nn)", 0xfa, 16, 3, false, (cpu) => {
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
      new Opcode("LD", "B,A", 0x47, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x4f,
      new Opcode("LD", "C,A", 0x4f, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x40,
      new Opcode("LD", "B,B", 0x40, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x41,
      new Opcode("LD", "B,C", 0x41, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x42,
      new Opcode("LD", "B,D", 0x42, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x43,
      new Opcode("LD", "B,E", 0x43, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x44,
      new Opcode("LD", "B,H", 0x44, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x45,
      new Opcode("LD", "B,L", 0x45, 4, 1, false, (cpu) => {
        cpu.setB(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x46,
      new Opcode("LD", "B,(HL)", 0x46, 8, 1, false, (cpu) => {
        const value = cpu.memory.readByte(cpu.getHL());
        cpu.setB(value);
      })
    );

    this.opcodeList.set(
      0x48,
      new Opcode("LD", "C,B", 0x48, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x49,
      new Opcode("LD", "C,C", 0x49, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x4a,
      new Opcode("LD", "C,D", 0x4a, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x4b,
      new Opcode("LD", "C,E", 0x4b, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x4c,
      new Opcode("LD", "C,H", 0x4c, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x4d,
      new Opcode("LD", "C,L", 0x4d, 4, 1, false, (cpu) => {
        cpu.setC(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x4e,
      new Opcode("LD", "C,(HL)", 0x4e, 8, 1, false, (cpu) => {
        cpu.setC(cpu.memory.readByte(cpu.getHL()));
      })
    );

    this.opcodeList.set(
      0x50,
      new Opcode("LD", "D,B", 0x50, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x51,
      new Opcode("LD", "D,C", 0x51, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getC());
      })
    );
    this.opcodeList.set(
      0x52,
      new Opcode("LD", "D,D", 0x52, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x53,
      new Opcode("LD", "D,E", 0x53, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x54,
      new Opcode("LD", "D,H", 0x54, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x55,
      new Opcode("LD", "D,L", 0x55, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x56,
      new Opcode("LD", "D,(HL)", 0x56, 8, 1, false, (cpu) => {
        cpu.setD(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x57,
      new Opcode("LD", "D,A", 0x57, 4, 1, false, (cpu) => {
        cpu.setD(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x58,
      new Opcode("LD", "E,B", 0x58, 4, 4, false, (cpu) => {
        cpu.setE(cpu.getB());
      })
    );

    this.opcodeList.set(
      0x59,
      new Opcode("LD", "E,C", 0x59, 4, 4, false, (cpu) => {
        cpu.setE(cpu.getC());
      })
    );

    this.opcodeList.set(
      0x5a,
      new Opcode("LD", "E,D", 0x5a, 4, 4, false, (cpu) => {
        cpu.setE(cpu.getD());
      })
    );

    this.opcodeList.set(
      0x5b,
      new Opcode("LD", "E,E", 0x5b, 4, 4, false, (cpu) => {
        cpu.setE(cpu.getE());
      })
    );

    this.opcodeList.set(
      0x5c,
      new Opcode("LD", "E,H", 0x5c, 4, 4, false, (cpu) => {
        cpu.setE(cpu.getH());
      })
    );

    this.opcodeList.set(
      0x5d,
      new Opcode("LD", "E,L", 0x5d, 4, 4, false, (cpu) => {
        cpu.setE(cpu.getL());
      })
    );

    this.opcodeList.set(
      0x5e,
      new Opcode("LD", "E,(HL)", 0x5e, 8, 1, false, (cpu) => {
        cpu.setE(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x5f,
      new Opcode("LD", "E,A", 0x5f, 4, 1, false, (cpu) => {
        cpu.setE(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x60,
      new Opcode("LD", "H,B", 0x60, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getB());
      })
    );

    this.opcodeList.set(
      0x61,
      new Opcode("LD", "H,C", 0x61, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getC());
      })
    );

    this.opcodeList.set(
      0x62,
      new Opcode("LD", "H,D", 0x62, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x63,
      new Opcode("LD", "H,E", 0x63, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x64,
      new Opcode("LD", "H,H", 0x64, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x65,
      new Opcode("LD", "H,L", 0x65, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getL());
      })
    );
    this.opcodeList.set(
      0x66,
      new Opcode("LD", "H,(HL)", 0x66, 8, 1, false, (cpu) => {
        cpu.setH(cpu.memory.readByte(cpu.getHL()));
      })
    );
    this.opcodeList.set(
      0x67,
      new Opcode("LD", "H,A", 0x67, 4, 1, false, (cpu) => {
        cpu.setH(cpu.getA());
      })
    );
    this.opcodeList.set(
      0x68,
      new Opcode("LD", "L,B", 0x68, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getB());
      })
    );
    this.opcodeList.set(
      0x69,
      new Opcode("LD", "L,C", 0x69, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getC());
      })
    );

    this.opcodeList.set(
      0x6a,
      new Opcode("LD", "L,D", 0x6a, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getD());
      })
    );
    this.opcodeList.set(
      0x6b,
      new Opcode("LD", "L,E", 0x6b, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getE());
      })
    );
    this.opcodeList.set(
      0x6c,
      new Opcode("LD", "L,H", 0x6c, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getH());
      })
    );
    this.opcodeList.set(
      0x6d,
      new Opcode("LD", "L,L", 0x6d, 4, 1, false, (cpu) => {
        cpu.setL(cpu.getL()); // Copy the value of register L to itself
      })
    );
    this.opcodeList.set(
      0x6e,
      new Opcode("LD", "L,(HL)", 0x6e, 8, 1, false, (cpu) => {
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
      new Opcode("LD", "(HL),B", 0x70, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getB());
      })
    );
    this.opcodeList.set(
      0x71,
      new Opcode("LD", "(HL),C", 0x71, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getC());
      })
    );
    this.opcodeList.set(
      0x72,
      new Opcode("LD", "(HL),D", 0x72, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getD());
      })
    );
    this.opcodeList.set(
      0x73,
      new Opcode("LD", "(HL),E", 0x73, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getE());
      })
    );
    this.opcodeList.set(
      0x74,
      new Opcode("LD", "(HL),H", 0x74, 8, 1, false, (cpu) => {
        cpu.memory.writeByte(cpu.getHL(), cpu.getH());
      })
    );
    this.opcodeList.set(
      0x75,
      new Opcode("LD", "(HL),L", 0x75, 8, 1, false, (cpu) => {
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
      new Opcode("LD", "B,n", 0x06, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        // Set the high byte of BC directly using the setB function
        cpu.setB(n);
      })
    );
    this.opcodeList.set(
      0x0e,
      new Opcode("LD", "C,n", 0x0e, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        cpu.setC(n);
      })
    );
    this.opcodeList.set(
      0x16,
      new Opcode("LD", "D,n", 0x16, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        cpu.setD(n);
      })
    );
    this.opcodeList.set(
      0x1e,
      new Opcode("LD", "E,n", 0x1e, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);

        cpu.setE(n);
      })
    );
    this.opcodeList.set(
      0x26,
      new Opcode("LD", "H,n", 0x26, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        cpu.setH(n);
        // ✅ PC wird automatisch um 2 erhöht (Länge=2)
      })
    );
    this.opcodeList.set(
      0x2e,
      new Opcode("LD", "L,n", 0x2e, 8, 2, false, (cpu) => {
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
      new Opcode("LD", "(nn),A", 0xea, 16, 3, false, (cpu) => {
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
      new Opcode("LDH", "A,(C)", 0xf2, 8, 1, false, (cpu) => {
        // :A = read(unsigned_16(lsb=C, msb=0xFF))
        const c = cpu.getC();
        const address = 0xff00 + c;
        const value = cpu.memory.readByte(address);
        cpu.setA(value);
      })
    );
    this.opcodeList.set(
      0xe2,
      new Opcode("LDH", "(C),A", 0xe2, 8, 1, false, (cpu) => {
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
      new Opcode("LDH", "(n),A", 0xe0, 12, 2, false, (cpu) => {
        const offset = cpu.memory.readByte(cpu.getPC() + 1);
        const address = 0xff00 + offset;
        const value = cpu.getA();
        cpu.memory.writeByte(address, value);
      })
    );
    this.opcodeList.set(
      0x3a,
      new Opcode("LD", "A,(HL-)", 0x3a, 8, 1, false, (cpu) => {
        const address = cpu.getHL(); // Get the value from HL register
        const value = cpu.memory.readByte(address); // Read the value from memory
        cpu.setA(value); // Set the value to register A
        cpu.setHL(address - 1); // Decrement HL register
      })
    );
    this.opcodeList.set(
      0x32,
      new Opcode("LD", "(HL-),A", 0x32, 8, 1, false, (cpu) => {
        const hlValue = cpu.getHL(); // Get the value of the HL register
        cpu.memory.writeByte(hlValue, cpu.getA()); // Write the value of A to the memory location pointed by HL
        cpu.setHL(hlValue - 1); // Decrement the HL register
      })
    );
    this.opcodeList.set(
      0x2a,
      new Opcode("LD", "A,(HL+)", 0x2a, 8, 1, false, (cpu) => {
        const memoryValueHL = cpu.memory.readByte(cpu.getHL());
        cpu.setA(memoryValueHL);
        cpu.setHL(cpu.getHL() + 1);
      })
    );
    this.opcodeList.set(
      0x22,
      new Opcode("LD", "(HL+),A", 0x22, 8, 1, false, (cpu) => {
        const addr = cpu.getHL();
        cpu.memory.writeByte(addr, cpu.getA());

        cpu.setHL((addr + 1) & 0xffff);
      })
    );
    this.opcodeList.set(
      0x01,
      new Opcode("LD", "BC,nn", 0x01, 12, 3, false, (cpu) => {
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
      new Opcode("LD", "DE,nn", 0x11, 12, 3, false, (cpu) => {
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
      new Opcode("LD", "HL,nn", 0x21, 12, 3, false, (cpu) => {
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
      new Opcode("LD", "SP,nn", 0x31, 12, 3, false, (cpu) => {
        const pc = cpu.getPC();
        const lsb = cpu.memory.readByte(pc + 1);
        const msb = cpu.memory.readByte(pc + 2);

        const nn = cpu.toUnsigned16Bit(lsb, msb);
        cpu.setSP(nn);
      })
    );
    this.opcodeList.set(
      0x08,
      new Opcode("LD", "(nn),SP", 0x08, 20, 3, false, (cpu) => {
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
      new Opcode("LD", "SP,HL", 0xf9, 8, 1, false, (cpu) => {
        cpu.setSP(cpu.getHL());
      })
    );
    this.opcodeList.set(
      0xf8,
      new Opcode("LDHL", "SP,n", 0xf8, 12, 2, false, (cpu) => {
        const sp = cpu.getSP();
        const imm = cpu.memory.readByte(cpu.getPC() + 1);
        const signedImm = cpu.toSigned8Bit(imm);
        const result = sp + signedImm;

        // Flags setzen
        cpu.setZFlag(0);
        cpu.setNFlag(0);

        // Korrekte Half-Carry und Carry Berechnung
        const spLow = sp & 0xff;
        const immLow = signedImm & 0xff;
        const spLow4 = sp & 0xf;
        const immLow4 = signedImm & 0xf;

        cpu.setHFlag(spLow4 + immLow4 > 0xf ? 1 : 0);
        cpu.setCFlag(spLow + immLow > 0xff ? 1 : 0);

        cpu.setHL(result & 0xffff);
      })
    );
    this.opcodeList.set(
      0xf5,
      new Opcode("PUSH", "AF", 0xf5, 16, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getA()); // A (high byte) ZUERST

        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getF()); // F (low byte) DANACH
      })
    );
    // PUSH DE (0xd5)
    this.opcodeList.set(
      0xd5,
      new Opcode("PUSH", "DE", 0xd5, 16, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getD()); // D (high byte) ZUERST

        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getE()); // E (low byte) DANACH
      })
    );

    // PUSH BC (0xc5)
    this.opcodeList.set(
      0xc5,
      new Opcode("PUSH", "BC", 0xc5, 16, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getB()); // B (high byte) ZUERST

        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getC()); // C (low byte) DANACH
      })
    );

    // PUSH HL (0xe5)
    this.opcodeList.set(
      0xe5,
      new Opcode("PUSH", "HL", 0xe5, 16, 1, false, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getH()); // H (high byte) ZUERST

        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getL()); // L (low byte) DANACH
      })
    );
    this.opcodeList.set(
      0xf1,
      new Opcode("POP", "AF", 0xf1, 12, 1, false, (cpu) => {
        const lowByte = cpu.memory.readByte(cpu.getSP()); // F register (low)
        cpu.increaseSP(1);

        const highByte = cpu.memory.readByte(cpu.getSP()); // A register (high)
        cpu.increaseSP(1);

        cpu.setA(highByte);
        cpu.setF(lowByte & 0xf0); // Only upper 4 bits for flags
      })
    );
    this.opcodeList.set(
      0xc1,
      new Opcode("POP", "BC", 0xc1, 12, 1, false, (cpu) => {
        // ✅ KORREKT: High Byte (B) zuerst, dann Low Byte (C)
        const lowByte = cpu.memory.readByte(cpu.getSP()); // C (Low Byte)
        cpu.increaseSP(1);
        const highByte = cpu.memory.readByte(cpu.getSP()); // B (High Byte)
        cpu.increaseSP(1);

        const finalValue = (highByte << 8) | lowByte;
        cpu.setBC(finalValue);
      })
    );
    this.opcodeList.set(
      0xd1,
      new Opcode("POP", "DE", 0xd1, 12, 1, false, (cpu) => {
        // ✅ KORREKT: High Byte (D) zuerst, dann Low Byte (E)
        const lowByte = cpu.memory.readByte(cpu.getSP()); // E (Low Byte)
        cpu.increaseSP(1);
        const highByte = cpu.memory.readByte(cpu.getSP()); // D (High Byte)
        cpu.increaseSP(1);

        const finalValue = (highByte << 8) | lowByte;
        cpu.setDE(finalValue);
      })
    );
    this.opcodeList.set(
      0xe1,
      new Opcode("POP", "HL", 0xe1, 12, 1, false, (cpu) => {
        // ✅ KORREKT: High Byte (H) zuerst, dann Low Byte (L)
        const lowByte = cpu.memory.readByte(cpu.getSP()); // L (Low Byte)
        cpu.increaseSP(1);
        const highByte = cpu.memory.readByte(cpu.getSP()); // H (High Byte)
        cpu.increaseSP(1);

        const finalValue = (highByte << 8) | lowByte;
        cpu.setHL(finalValue);
      })
    );
    // 8-bit arithmetic and logical instructions
    this.opcodeList.set(
      0x87,
      new Opcode("ADD", "A,A", 0x87, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "A,B", 0x80, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "A,C", 0x81, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "A,D", 0x82, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "A,E", 0x83, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "A,H", 0x84, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "A,L", 0x85, 4, 1, false, (cpu) => {
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
      new Opcode("ADD", "(HL)", 0x86, 8, 1, false, (cpu) => {
        const a = cpu.getA();
        const data = cpu.memory.readByte(cpu.getHL());
        const result = a + data;

        cpu.setA(result & 0xff);
        cpu.setZFlag((result & 0xff) === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((a & 0x0f) + (data & 0x0f) > 0x0f ? 1 : 0);
        cpu.setCFlag(result > 0xff ? 1 : 0);
      })
    );
    this.opcodeList.set(
      0xc6,
      new Opcode("ADD", "A,n", 0xc6, 8, 2, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getPC() + 1);
        const result = A + value;

        cpu.setA(result & 0xff);
        cpu.setZFlag((result & 0xff) === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((A & 0x0f) + (value & 0x0f) > 0x0f ? 1 : 0);
        cpu.setCFlag(result > 0xff ? 1 : 0);
      })
    );

    // ADD HL,BC (0x09) - Z-Flag NICHT ändern!
    this.opcodeList.set(
      0x09,
      new Opcode("ADD", "HL,BC", 0x09, 8, 1, false, (cpu) => {
        const hl = cpu.getHL();
        const bc = cpu.getBC();
        const result = hl + bc;

        cpu.setNFlag(0);
        cpu.setHFlag((hl & 0x0fff) + (bc & 0x0fff) > 0x0fff ? 1 : 0);
        cpu.setCFlag(result > 0xffff ? 1 : 0);

        cpu.setHL(result & 0xffff);
      })
    );

    // ADD HL,DE (0x19) - Z-Flag NICHT ändern!
    this.opcodeList.set(
      0x19,
      new Opcode("ADD", "HL,DE", 0x19, 8, 1, false, (cpu) => {
        const hl = cpu.getHL();
        const de = cpu.getDE();
        const result = hl + de;

        cpu.setNFlag(0);
        cpu.setHFlag((hl & 0x0fff) + (de & 0x0fff) > 0x0fff ? 1 : 0);
        cpu.setCFlag(result > 0xffff ? 1 : 0);

        cpu.setHL(result & 0xffff);
      })
    );
    this.opcodeList.set(
      0x29,
      new Opcode("ADD", "HL,HL", 0x29, 8, 1, false, (cpu) => {
        const hl = cpu.getHL();
        const result = hl + hl;

        cpu.setNFlag(0);
        cpu.setHFlag((hl & 0x0fff) + (hl & 0x0fff) > 0x0fff ? 1 : 0);
        cpu.setCFlag(result > 0xffff ? 1 : 0);

        cpu.setHL(result & 0xffff);
      })
    );
    // ADD HL,SP (0x39) - Z-Flag NICHT ändern!
    this.opcodeList.set(
      0x39,
      new Opcode("ADD", "HL,SP", 0x39, 8, 1, false, (cpu) => {
        const hl = cpu.getHL();
        const sp = cpu.getSP();
        const result = hl + sp;

        cpu.setNFlag(0);
        cpu.setHFlag((hl & 0x0fff) + (sp & 0x0fff) > 0x0fff ? 1 : 0);
        cpu.setCFlag(result > 0xffff ? 1 : 0);

        cpu.setHL(result & 0xffff);
      })
    );
    this.opcodeList.set(
      0xe8,
      new Opcode("ADD", "SP,n", 0xe8, 16, 2, false, (cpu) => {
        const sp = cpu.getSP();
        const imm = cpu.memory.readByte(cpu.getPC() + 1);
        const signedImm = cpu.toSigned8Bit(imm);
        const result = sp + signedImm;

        // Flags setzen
        cpu.setZFlag(0);
        cpu.setNFlag(0);

        // Korrekte Half-Carry und Carry Berechnung
        const spLow = sp & 0xff;
        const immLow = signedImm & 0xff;
        const spLow4 = sp & 0xf;
        const immLow4 = signedImm & 0xf;

        cpu.setHFlag(spLow4 + immLow4 > 0xf ? 1 : 0);
        cpu.setCFlag(spLow + immLow > 0xff ? 1 : 0);

        cpu.setSP(result & 0xffff);
      })
    );
    this.opcodeList.set(
      0x8f,
      new Opcode("ADC", "A,A", 0x8f, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,B", 0x88, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,C", 0x89, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,D", 0x8a, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,E", 0x8b, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,H", 0x8c, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,L", 0x8d, 4, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,(HL)", 0x8e, 8, 1, false, (cpu) => {
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
      new Opcode("ADC", "A,n", 0xce, 8, 2, false, (cpu) => {
        const a = cpu.getA();
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        const carry = cpu.getCFlag();
        const result = a + n + carry;

        cpu.setA(result & 0xff);
        cpu.setZFlag((result & 0xff) === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((a & 0x0f) + (n & 0x0f) + carry > 0x0f ? 1 : 0);
        cpu.setCFlag(result > 0xff ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x97,
      new Opcode("SUB", "A", 0x97, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "B", 0x90, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "C", 0x91, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "D", 0x92, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "E", 0x93, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "H", 0x94, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "L", 0x95, 4, 1, false, (cpu) => {
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
      new Opcode("SUB", "(HL)", 0x96, 8, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,A", 0x9f, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,B", 0x98, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,C", 0x99, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,D", 0x9a, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,E", 0x9b, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,H", 0x9c, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,L", 0x9d, 4, 1, false, (cpu) => {
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
      new Opcode("SBC", "(HL)", 0x9e, 8, 1, false, (cpu) => {
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
      new Opcode("SBC", "A,n", 0xde, 8, 2, false, (cpu) => {
        const A = cpu.getA();
        const value = cpu.memory.readByte(cpu.getPC() + 1);
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
      new Opcode("CP", "A,A", 0xbf, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,B", 0xb8, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,C", 0xb9, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,D", 0xba, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,E", 0xbb, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,H", 0xbc, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,L", 0xbd, 4, 1, false, (cpu) => {
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
      new Opcode("CP", "A,(HL)", 0xbe, 8, 1, false, (cpu) => {
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
      new Opcode("CP", "A,n", 0xfe, 8, 2, false, (cpu) => {
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
      new Opcode("INC", "A", 0x3c, 4, 1, false, (cpu) => {
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
      new Opcode("INC", "B", 0x04, 4, 1, false, (cpu) => {
        const oldB = cpu.getB();
        const newB = (oldB + 1) & 0xff;
        cpu.setB(newB);

        cpu.setZFlag(newB === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldB & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x0c,
      new Opcode("INC", "C", 0x0c, 4, 1, false, (cpu) => {
        const oldC = cpu.getC();
        const newC = (oldC + 1) & 0xff;
        cpu.setC(newC);

        cpu.setZFlag(newC === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldC & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x14,
      new Opcode("INC", "D", 0x14, 4, 1, false, (cpu) => {
        const oldD = cpu.getD();
        const newD = (oldD + 1) & 0xff;
        cpu.setD(newD);

        cpu.setZFlag(newD === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldD & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x1c,
      new Opcode("INC", "E", 0x1c, 4, 1, false, (cpu) => {
        const oldE = cpu.getE();
        const newE = (oldE + 1) & 0xff;
        cpu.setE(newE);

        cpu.setZFlag(newE === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldE & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x24,
      new Opcode("INC", "H", 0x24, 4, 1, false, (cpu) => {
        const oldH = cpu.getH();
        const newH = (oldH + 1) & 0xff;
        cpu.setH(newH);

        cpu.setZFlag(newH === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldH & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x2c,
      new Opcode("INC", "L", 0x2c, 4, 1, false, (cpu) => {
        const oldL = cpu.getL();
        const newL = (oldL + 1) & 0xff;
        cpu.setL(newL);

        cpu.setZFlag(newL === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldL & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x34,
      new Opcode("INC", "(HL)", 0x34, 12, 1, false, (cpu) => {
        const address = cpu.getHL();
        const oldValue = cpu.memory.readByte(address);
        const newValue = (oldValue + 1) & 0xff;
        cpu.memory.writeByte(address, newValue);

        cpu.setZFlag(newValue === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag((oldValue & 0x0f) === 0x0f ? 1 : 0);
      })
    );

    this.opcodeList.set(
      0x03,
      new Opcode("INC", "BC", 0x03, 8, 1, false, (cpu) => {
        cpu.setBC((cpu.getBC() + 1) & 0xffff);
      })
    );

    this.opcodeList.set(
      0x13,
      new Opcode("INC", "DE", 0x13, 8, 1, false, (cpu) => {
        cpu.setDE((cpu.getDE() + 1) & 0xffff);
      })
    );

    this.opcodeList.set(
      0x23,
      new Opcode("INC", "HL", 0x23, 8, 1, false, (cpu) => {
        cpu.setHL((cpu.getHL() + 1) & 0xffff);
      })
    );

    this.opcodeList.set(
      0x33,
      new Opcode("INC", "SP", 0x33, 8, 1, false, (cpu) => {
        cpu.setSP((cpu.getSP() + 1) & 0xffff);
      })
    );

    this.opcodeList.set(
      0x3d,
      new Opcode("DEC", "A", 0x3d, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getA(),
          (val) => cpu.setA(val)
        )
      )
    );

    this.opcodeList.set(
      0x05,
      new Opcode("DEC", "B", 0x05, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getB(),
          (val) => cpu.setB(val)
        )
      )
    );

    this.opcodeList.set(
      0x0d,
      new Opcode("DEC", "C", 0x0d, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getC(),
          (val) => cpu.setC(val)
        )
      )
    );

    this.opcodeList.set(
      0x15,
      new Opcode("DEC", "D", 0x15, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getD(), // Vereinfacht - direkt getD() verwenden
          (val) => cpu.setD(val)
        )
      )
    );

    this.opcodeList.set(
      0x1d,
      new Opcode("DEC", "E", 0x1d, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getE(), // Vereinfacht - direkt getE() verwenden
          (val) => cpu.setE(val)
        )
      )
    );

    this.opcodeList.set(
      0x25,
      new Opcode("DEC", "H", 0x25, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getH(), // Vereinfacht - direkt getH() verwenden
          (val) => cpu.setH(val)
        )
      )
    );

    this.opcodeList.set(
      0x2d,
      new Opcode("DEC", "L", 0x2d, 4, 1, false, (cpu) =>
        cpu.dec8bit(
          () => cpu.getL(), // Vereinfacht - direkt getL() verwenden
          (val) => cpu.setL(val)
        )
      )
    );

    this.opcodeList.set(
      0x35,
      new Opcode("DEC", "(HL)", 0x35, 12, 1, false, (cpu) => {
        // 12 Zyklen korrigiert
        const address = cpu.getHL();
        const data = cpu.memory.readByte(address);
        const result = (data - 1) & 0xff;
        cpu.memory.writeByte(address, result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(1);
        cpu.setHFlag((data & 0x0f) === 0 ? 1 : 0); // Korrekt: Half Carry wenn untere 4 Bits 0 waren
      })
    );

    // 16-Bit Register DEC - bleiben bei 8 Zyklen (korrekt)
    // DEC BC (0x0B)
    this.opcodeList.set(
      0x0b,
      new Opcode("DEC", "BC", 0x0b, 8, 1, false, (cpu) => {
        cpu.setBC((cpu.getBC() - 1) & 0xffff);
      })
    );

    // DEC DE (0x1B)
    this.opcodeList.set(
      0x1b,
      new Opcode("DEC", "DE", 0x1b, 8, 1, false, (cpu) => {
        cpu.setDE((cpu.getDE() - 1) & 0xffff);
      })
    );

    // DEC HL (0x2B)
    this.opcodeList.set(
      0x2b,
      new Opcode("DEC", "HL", 0x2b, 8, 1, false, (cpu) => {
        cpu.setHL((cpu.getHL() - 1) & 0xffff);
      })
    );

    this.opcodeList.set(
      0x3b,
      new Opcode("DEC", "SP", 0x3b, 8, 1, false, (cpu) => {
        cpu.setSP((cpu.getSP() - 1) & 0xffff);
      })
    );

    this.opcodeList.set(
      0xa7,
      new Opcode("AND", "A,A", 0xa7, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,B", 0xa0, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,C", 0xa1, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,D", 0xa2, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,E", 0xa3, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,H", 0xa4, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,L", 0xa5, 4, 1, false, (cpu) => {
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
      new Opcode("AND", "A,(HL)", 0xa6, 8, 1, false, (cpu) => {
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
      new Opcode("AND", "A,n", 0xe6, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        const result = cpu.getA() & n;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(1);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0xb7,
      new Opcode("OR", "A,A", 0xb7, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,B", 0xb0, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,C", 0xb1, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,D", 0xb2, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,E", 0xb3, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,H", 0xb4, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,L", 0xb5, 4, 1, false, (cpu) => {
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
      new Opcode("OR", "A,(HL)", 0xb6, 8, 1, false, (cpu) => {
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
      new Opcode("OR", "A,n", 0xf6, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        const result = cpu.getA() | n;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.opcodeList.set(
      0xaf,
      new Opcode("XOR", "A,A", 0xaf, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,B", 0xa8, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,C", 0xa9, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,D", 0xaa, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,E", 0xab, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,H", 0xac, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,L", 0xad, 4, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,(HL)", 0xae, 8, 1, false, (cpu) => {
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
      new Opcode("XOR", "A,n", 0xee, 8, 2, false, (cpu) => {
        const n = cpu.memory.readByte(cpu.getPC() + 1);
        const result = cpu.getA() ^ n;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0x3f,
      new Opcode("CCF", "", 0x3f, 4, 1, false, (cpu) => {
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
      0x19,
      new Opcode("RR", "C", 0x19, 8, 2, false, (cpu) => {
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
      0x30,
      new Opcode("SWAP", "B", 0x30, 8, 2, false, (cpu) => {
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
      new Opcode("DAA", "", 0x27, 4, 1, false, (cpu) => {
        let a = cpu.getA();
        let adjust = 0;
        let carry = cpu.getCFlag();

        if (cpu.getNFlag() === 0) {
          // Nach Addition
          if (cpu.getHFlag() || (a & 0x0f) > 9) {
            adjust += 0x06;
          }
          if (carry || a > 0x99) {
            adjust += 0x60;
            carry = 1;
          }
        } else {
          // Nach Subtraktion
          if (cpu.getHFlag()) {
            adjust -= 0x06;
          }
          if (carry) {
            adjust -= 0x60;
          }
        }

        a = (a + adjust) & 0xff;
        cpu.setA(a);

        cpu.setZFlag(a === 0 ? 1 : 0);
        cpu.setHFlag(0);
        cpu.setCFlag(carry);
      })
    );
    this.opcodeList.set(
      0x2f,
      new Opcode("CPL", "", 0x2f, 4, 1, false, (cpu) => {
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
      new Opcode("JP", "HL", 0xe9, 4, 1, true, (cpu) => {
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
          cpu.setCPUCycle(cpu.getCPUCycle() + 4); // 4 + 12 = 16 Zyklen
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
          cpu.setCPUCycle(cpu.getCPUCycle() + 4); // 4 + 12 = 16 Zyklen
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
          cpu.setCPUCycle(cpu.getCPUCycle() + 4); // 4 + 12 = 16 Zyklen
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
          cpu.setCPUCycle(cpu.getCPUCycle() + 4); // 4 + 12 = 16 Zyklen
        } else {
          cpu.increasePC(3);
        }
      })
    );
    // JR e (0x18) - Zyklen korrigieren
    this.opcodeList.set(
      0x18,
      new Opcode("JR", "e", 0x18, 12, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));
        cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
      })
    );

    // JR NZ,e (0x20) - Zyklen und Logik korrigieren
    this.opcodeList.set(
      0x20,
      new Opcode("JR", "nz,e", 0x20, 12, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));

        if (!cpu.getZFlag()) {
          cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
        } else {
          cpu.increasePC(2);
        }
      })
    );

    // JR Z,e (0x28)
    this.opcodeList.set(
      0x28,
      new Opcode("JR", "z,e", 0x28, 12, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));

        if (cpu.getZFlag()) {
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
    // JR NC,e (0x30)
    this.opcodeList.set(
      0x30,
      new Opcode("JR", "nc,e", 0x30, 12, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));

        if (!cpu.getCFlag()) {
          cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
        } else {
          cpu.increasePC(2);
        }
      })
    );
    // JR C,e (0x38)
    this.opcodeList.set(
      0x38,
      new Opcode("JR", "c,e", 0x38, 12, 2, true, (cpu) => {
        const e = cpu.toSigned8Bit(cpu.memory.readByte(cpu.getPC() + 1));

        if (cpu.getCFlag()) {
          cpu.setPC((cpu.getPC() + 2 + e) & 0xffff);
        } else {
          cpu.increasePC(2);
        }
      })
    );
    // RRC für A (0x0F) - bereits vorhanden, aber sicherstellen
    this.cbOpcodeList.set(
      0x0f,
      new Opcode("RRC", "A", 0x0f, 8, 2, false, (cpu) => {
        let a = cpu.getA();
        let lsb = a & 1;
        let result = ((a >> 1) | (lsb << 7)) & 0xff;
        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    // RL für A (0x17) - bereits vorhanden, aber sicherstellen
    this.cbOpcodeList.set(
      0x17,
      new Opcode("RL", "A", 0x17, 8, 2, false, (cpu) => {
        let a = cpu.getA();
        let carryIn = cpu.getCFlag();
        let msb = (a >> 7) & 1;
        let result = ((a << 1) | carryIn) & 0xff;
        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.opcodeList.set(
      0xcd,
      new Opcode("CALL", "nn", 0xcd, 24, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;
        const returnAddr = cpu.getPC() + 3;

        // Stack in korrekter Reihenfolge: High zuerst, dann Low
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);
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
          const returnAddr = cpu.getPC() + 3;

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

          cpu.setPC(addr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          cpu.increasePC(3);
        }
      })
    );

    this.opcodeList.set(
      0xcc,
      new Opcode("CALL", "Z,nn", 0xcc, 12, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;

        if (cpu.getZFlag() === 1) {
          const returnAddr = cpu.getPC() + 3;

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

          cpu.setPC(addr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          // Nur PC erhöhen, keine weiteren Aktionen
          cpu.increasePC(3);
        }
      })
    );
    this.opcodeList.set(
      0xd4,
      new Opcode("CALL", "NC,nn", 0xd4, 12, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;

        if (cpu.getCFlag() === 0) {
          const returnAddr = cpu.getPC() + 3;

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

          cpu.setPC(addr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          // Nur PC erhöhen, keine weiteren Aktionen
          cpu.increasePC(3);
        }
      })
    );
    this.opcodeList.set(
      0xdc,
      new Opcode("CALL", "C,nn", 0xdc, 12, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;

        if (cpu.getCFlag() === 1) {
          const returnAddr = cpu.getPC() + 3;

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

          cpu.setPC(addr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          // Nur PC erhöhen, keine weiteren Aktionen
          cpu.increasePC(3);
        }
      })
    );
    // RES Instructions for all registers and bits
    for (let bit = 0; bit < 8; bit++) {
      // RES b,B
      this.cbOpcodeList.set(
        0x80 + bit * 8,
        new Opcode("RES", `${bit},B`, 0x80 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getB();
          value &= ~(1 << bit);
          cpu.setB(value);
        })
      );

      // RES b,C
      this.cbOpcodeList.set(
        0x81 + bit * 8,
        new Opcode("RES", `${bit},C`, 0x81 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getC();
          value &= ~(1 << bit);
          cpu.setC(value);
        })
      );

      // RES b,D
      this.cbOpcodeList.set(
        0x82 + bit * 8,
        new Opcode("RES", `${bit},D`, 0x82 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getD();
          value &= ~(1 << bit);
          cpu.setD(value);
        })
      );

      // RES b,E
      this.cbOpcodeList.set(
        0x83 + bit * 8,
        new Opcode("RES", `${bit},E`, 0x83 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getE();
          value &= ~(1 << bit);
          cpu.setE(value);
        })
      );

      // RES b,H
      this.cbOpcodeList.set(
        0x84 + bit * 8,
        new Opcode("RES", `${bit},H`, 0x84 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getH();
          value &= ~(1 << bit);
          cpu.setH(value);
        })
      );

      // RES b,L
      this.cbOpcodeList.set(
        0x85 + bit * 8,
        new Opcode("RES", `${bit},L`, 0x85 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getL();
          value &= ~(1 << bit);
          cpu.setL(value);
        })
      );

      // RES b,(HL)
      this.cbOpcodeList.set(
        0x86 + bit * 8,
        new Opcode(
          "RES",
          `${bit},(HL)`,
          0x86 + bit * 8,
          16,
          2,
          false,
          (cpu) => {
            const addr = cpu.getHL();
            let value = cpu.memory.readByte(addr);
            value &= ~(1 << bit);
            cpu.memory.writeByte(addr, value);
          }
        )
      );

      // RES b,A
      this.cbOpcodeList.set(
        0x87 + bit * 8,
        new Opcode("RES", `${bit},A`, 0x87 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getA();
          value &= ~(1 << bit);
          cpu.setA(value);
        })
      );
    }
    // ---------- RETI ----------
    this.opcodeList.set(
      0xd9,
      new Opcode("RETI", "", 0xd9, 16, 1, true, (cpu) => {
        // Zuerst RET Logic
        const lowByte = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const highByte = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);
        const returnAddr = (highByte << 8) | lowByte;

        cpu.setPC(returnAddr);

        // Dann interrupts aktivieren - SOFORT!
        cpu.setIme(1);
        cpu.setImeScheduled(0); // ✅ Wichtig: IME Scheduled zurücksetzen
      })
    );
    // Korrektur für SET-Instruktionen
    // SET Instructions for all registers and bits
    for (let bit = 0; bit < 8; bit++) {
      // SET b,B
      this.cbOpcodeList.set(
        0xc0 + bit * 8,
        new Opcode("SET", `${bit},B`, 0xc0 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getB();
          value |= 1 << bit;
          cpu.setB(value);
        })
      );

      // SET b,C
      this.cbOpcodeList.set(
        0xc1 + bit * 8,
        new Opcode("SET", `${bit},C`, 0xc1 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getC();
          value |= 1 << bit;
          cpu.setC(value);
        })
      );

      // SET b,D
      this.cbOpcodeList.set(
        0xc2 + bit * 8,
        new Opcode("SET", `${bit},D`, 0xc2 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getD();
          value |= 1 << bit;
          cpu.setD(value);
        })
      );

      // SET b,E
      this.cbOpcodeList.set(
        0xc3 + bit * 8,
        new Opcode("SET", `${bit},E`, 0xc3 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getE();
          value |= 1 << bit;
          cpu.setE(value);
        })
      );

      // SET b,H
      this.cbOpcodeList.set(
        0xc4 + bit * 8,
        new Opcode("SET", `${bit},H`, 0xc4 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getH();
          value |= 1 << bit;
          cpu.setH(value);
        })
      );

      // SET b,L
      this.cbOpcodeList.set(
        0xc5 + bit * 8,
        new Opcode("SET", `${bit},L`, 0xc5 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getL();
          value |= 1 << bit;
          cpu.setL(value);
        })
      );

      // SET b,(HL)
      this.cbOpcodeList.set(
        0xc6 + bit * 8,
        new Opcode(
          "SET",
          `${bit},(HL)`,
          0xc6 + bit * 8,
          16,
          2,
          false,
          (cpu) => {
            const addr = cpu.getHL();
            let value = cpu.memory.readByte(addr);
            value |= 1 << bit;
            cpu.memory.writeByte(addr, value);
          }
        )
      );

      // SET b,A
      this.cbOpcodeList.set(
        0xc7 + bit * 8,
        new Opcode("SET", `${bit},A`, 0xc7 + bit * 8, 8, 2, false, (cpu) => {
          let value = cpu.getA();
          value |= 1 << bit;
          cpu.setA(value);
        })
      );
    }

    // ---------- RET ----------
    this.opcodeList.set(
      0xc9,
      new Opcode("RET", "", 0xc9, 16, 1, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        const high = cpu.memory.readByte(cpu.getSP());
        cpu.increaseSP(1);

        cpu.setPC((high << 8) | low);
      })
    );

    // ---------- RET NZ ----------
    this.opcodeList.set(
      0xc0,
      new Opcode("RET", "nz", 0xc0, 8, 1, true, (cpu) => {
        if (cpu.getZFlag() === 0) {
          const lowByte = cpu.memory.readByte(cpu.getSP());
          const highByte = cpu.memory.readByte(cpu.getSP() + 1);
          const returnAddr = (highByte << 8) | lowByte;

          cpu.increaseSP(2);
          cpu.setPC(returnAddr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          cpu.increasePC(1);
        }
      })
    );

    // ---------- RET Z ----------
    this.opcodeList.set(
      0xc8,
      new Opcode("RET", "z", 0xc8, 8, 1, true, (cpu) => {
        if (cpu.getZFlag() === 1) {
          const lowByte = cpu.memory.readByte(cpu.getSP());
          const highByte = cpu.memory.readByte(cpu.getSP() + 1);
          const returnAddr = (highByte << 8) | lowByte;

          cpu.increaseSP(2);
          cpu.setPC(returnAddr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          cpu.increasePC(1);
        }
      })
    );

    // ✅ CORRECT RET NC
    this.opcodeList.set(
      0xd0,
      new Opcode("RET", "nc", 0xd0, 8, 1, true, (cpu) => {
        if (cpu.getCFlag() === 0) {
          const lowByte = cpu.memory.readByte(cpu.getSP());
          const highByte = cpu.memory.readByte(cpu.getSP() + 1);
          const returnAddr = (highByte << 8) | lowByte;

          cpu.increaseSP(2);
          cpu.setPC(returnAddr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          cpu.increasePC(1);
        }
      })
    );

    // ✅ CORRECT RET C
    this.opcodeList.set(
      0xd8,
      new Opcode("RET", "c", 0xd8, 8, 1, true, (cpu) => {
        if (cpu.getCFlag() === 1) {
          const lowByte = cpu.memory.readByte(cpu.getSP());
          const highByte = cpu.memory.readByte(cpu.getSP() + 1);
          const returnAddr = (highByte << 8) | lowByte;

          cpu.increaseSP(2);
          cpu.setPC(returnAddr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12);
        } else {
          cpu.increasePC(1);
        }
      })
    );
    this.opcodeList.set(
      0xc7,
      new Opcode("RST", "00H", 0xc7, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0000);
      })
    );

    this.opcodeList.set(
      0xcf,
      new Opcode("RST", "08H", 0xcf, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0008);
      })
    );

    this.opcodeList.set(
      0xd7,
      new Opcode("RST", "10H", 0xd7, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0010);
      })
    );

    this.opcodeList.set(
      0xdf,
      new Opcode("RST", "18H", 0xdf, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0018);
      })
    );

    this.opcodeList.set(
      0xe7,
      new Opcode("RST", "20H", 0xe7, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0020);
      })
    );

    this.opcodeList.set(
      0xef,
      new Opcode("RST", "28H", 0xef, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0028);
      })
    );

    this.opcodeList.set(
      0xf7,
      new Opcode("RST", "30H", 0xf7, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0030);
      })
    );

    this.opcodeList.set(
      0xff,
      new Opcode("RST", "38H", 0xff, 32, 1, true, (cpu) => {
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), (cpu.getPC() >> 8) & 0xff); // High byte
        cpu.decreaseSP(1);
        cpu.memory.writeByte(cpu.getSP(), cpu.getPC() & 0xff); // Low byte
        cpu.setPC(0x0038);
      })
    );
    this.cbOpcodeList.set(
      0x1f,
      new Opcode("RR", "A", 0x1f, 8, 2, false, (cpu) => {
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
      0x37,
      new Opcode("SWAP", "A", 0x37, 8, 2, false, (cpu) => {
        let value = cpu.getA();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setA(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.cbOpcodeList.set(
      0x31,
      new Opcode("SWAP", "C", 0x31, 8, 2, false, (cpu) => {
        let value = cpu.getC();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setC(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.cbOpcodeList.set(
      0x32,
      new Opcode("SWAP", "D", 0x32, 8, 2, false, (cpu) => {
        let value = cpu.getD();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setD(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.cbOpcodeList.set(
      0x33,
      new Opcode("SWAP", "E", 0x33, 8, 2, false, (cpu) => {
        let value = cpu.getE();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setE(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.cbOpcodeList.set(
      0x34,
      new Opcode("SWAP", "H", 0x34, 8, 2, false, (cpu) => {
        let value = cpu.getH();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setH(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.cbOpcodeList.set(
      0x35,
      new Opcode("SWAP", "L", 0x35, 8, 2, false, (cpu) => {
        let value = cpu.getL();
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.setL(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );

    this.cbOpcodeList.set(
      0x36,
      new Opcode("SWAP", "(HL)", 0x36, 16, 2, false, (cpu) => {
        let addr = cpu.getHL();
        let value = cpu.memory.readByte(addr);
        const result = ((value & 0x0f) << 4) | (value >> 4);

        cpu.memory.writeByte(addr, result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(0);
      })
    );
    this.opcodeList.set(
      0x07,
      new Opcode("RLCA", "", 0x07, 4, 1, false, (cpu) => {
        const a = cpu.getA();
        const carry = (a >> 7) & 1;
        const result = ((a << 1) | carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(0); // ✅ WICHTIG: RLCA setzt Z-Flag immer auf 0
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(carry);
      })
    );
    this.cbOpcodeList.set(
      0x07,
      new Opcode("RLC", "A", 0x07, 8, 2, false, (cpu) => {
        const value = cpu.getA();
        const carry = (value >> 7) & 1;
        const result = ((value << 1) | carry) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0); // ✅ RLC setzt Z-Flag basierend auf Ergebnis
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(carry);
      })
    );

    this.cbOpcodeList.set(
      0x00,
      new Opcode("RLC", "B", 0x00, 8, 2, false, (cpu) => {
        let b = cpu.getB();
        let msb = (b >> 7) & 1;
        let result = ((b << 1) | msb) & 0xff;

        cpu.setB(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x01,
      new Opcode("RLC", "C", 0x01, 8, 2, false, (cpu) => {
        let c = cpu.getC();
        let msb = (c >> 7) & 1;
        let result = ((c << 1) | msb) & 0xff;

        cpu.setC(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x02,
      new Opcode("RLC", "D", 0x02, 8, 2, false, (cpu) => {
        let d = cpu.getD();
        let msb = (d >> 7) & 1;
        let result = ((d << 1) | msb) & 0xff;

        cpu.setD(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x03,
      new Opcode("RLC", "E", 0x03, 8, 2, false, (cpu) => {
        let e = cpu.getE();
        let msb = (e >> 7) & 1;
        let result = ((e << 1) | msb) & 0xff;

        cpu.setE(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x04,
      new Opcode("RLC", "H", 0x04, 8, 2, false, (cpu) => {
        let h = cpu.getH();
        let msb = (h >> 7) & 1;
        let result = ((h << 1) | msb) & 0xff;

        cpu.setH(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x05,
      new Opcode("RLC", "L", 0x05, 8, 2, false, (cpu) => {
        let l = cpu.getL();
        let msb = (l >> 7) & 1;
        let result = ((l << 1) | msb) & 0xff;

        cpu.setL(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x06,
      new Opcode("RLC", "(HL)", 0x06, 16, 2, false, (cpu) => {
        let addr = cpu.getHL();
        let value = cpu.memory.readByte(addr);
        let msb = (value >> 7) & 1;
        let result = ((value << 1) | msb) & 0xff;

        cpu.memory.writeByte(addr, result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );
    this.opcodeList.set(
      0xf3,
      new Opcode("DI", "", 0xf3, 8, 1, false, (cpu) => {
        cpu.setIme(0);
        cpu.setImeScheduled(0);
      })
    );
    this.opcodeList.set(
      0xfb,
      new Opcode("EI", "", 0xfb, 4, 1, false, (cpu) => {
        // IME wird erst NACH der nächsten Instruction aktiviert
        cpu.setImeScheduled(1);
      })
    );
    this.cbOpcodeList.set(
      0x17,
      new Opcode("RL", "A", 0x17, 8, 2, false, (cpu) => {
        let a = cpu.getA();
        let carryIn = cpu.getCFlag();
        let msb = (a >> 7) & 1;
        let result = ((a << 1) | carryIn) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x10,
      new Opcode("RL", "B", 0x10, 8, 2, false, (cpu) => {
        let b = cpu.getB();
        let carryIn = cpu.getCFlag();
        let msb = (b >> 7) & 1;
        let result = ((b << 1) | carryIn) & 0xff;

        cpu.setB(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x11,
      new Opcode("RL", "C", 0x11, 8, 2, false, (cpu) => {
        let c = cpu.getC();
        let carryIn = cpu.getCFlag();
        let msb = (c >> 7) & 1;
        let result = ((c << 1) | carryIn) & 0xff;

        cpu.setC(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x12,
      new Opcode("RL", "D", 0x12, 8, 2, false, (cpu) => {
        let d = cpu.getD();
        let carryIn = cpu.getCFlag();
        let msb = (d >> 7) & 1;
        let result = ((d << 1) | carryIn) & 0xff;

        cpu.setD(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x13,
      new Opcode("RL", "E", 0x13, 8, 2, false, (cpu) => {
        let e = cpu.getE();
        let carryIn = cpu.getCFlag();
        let msb = (e >> 7) & 1;
        let result = ((e << 1) | carryIn) & 0xff;

        cpu.setE(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x14,
      new Opcode("RL", "H", 0x14, 8, 2, false, (cpu) => {
        let h = cpu.getH();
        let carryIn = cpu.getCFlag();
        let msb = (h >> 7) & 1;
        let result = ((h << 1) | carryIn) & 0xff;

        cpu.setH(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x15,
      new Opcode("RL", "L", 0x15, 8, 2, false, (cpu) => {
        let l = cpu.getL();
        let carryIn = cpu.getCFlag();
        let msb = (l >> 7) & 1;
        let result = ((l << 1) | carryIn) & 0xff;

        cpu.setL(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x16,
      new Opcode("RL", "(HL)", 0x16, 16, 2, false, (cpu) => {
        const hl = cpu.getHL();
        const value = cpu.memory.readByte(hl);
        const msb = (value >> 7) & 1;
        const result = ((value << 1) | cpu.getCFlag()) & 0xff;

        cpu.memory.writeByte(hl, result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );
    this.cbOpcodeList.set(
      0x0f,
      new Opcode("RRC", "A", 0x0f, 8, 2, false, (cpu) => {
        let a = cpu.getA();
        let lsb = a & 1;
        let result = ((a >> 1) | (lsb << 7)) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    // Korrektur für RRC B (0x08) - war falsch implementiert
    this.cbOpcodeList.set(
      0x08,
      new Opcode("RRC", "B", 0x08, 8, 2, false, (cpu) => {
        let b = cpu.getB();
        let lsb = b & 1;
        let result = ((b >> 1) | (lsb << 7)) & 0xff;

        cpu.setB(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x09,
      new Opcode("RRC", "C", 0x09, 8, 2, false, (cpu) => {
        let c = cpu.getC();
        let lsb = c & 1;
        let result = ((c >> 1) | (lsb << 7)) & 0xff;

        cpu.setC(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x0a,
      new Opcode("RRC", "D", 0x0a, 8, 2, false, (cpu) => {
        let d = cpu.getD();
        let lsb = d & 1;
        let result = ((d >> 1) | (lsb << 7)) & 0xff;

        cpu.setD(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x0b,
      new Opcode("RRC", "E", 0x0b, 8, 2, false, (cpu) => {
        let e = cpu.getE();
        let lsb = e & 1;
        let result = ((e >> 1) | (lsb << 7)) & 0xff;

        cpu.setE(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x0c,
      new Opcode("RRC", "H", 0x0c, 8, 2, false, (cpu) => {
        let h = cpu.getH();
        let lsb = h & 1;
        let result = ((h >> 1) | (lsb << 7)) & 0xff;

        cpu.setH(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x0d,
      new Opcode("RRC", "L", 0x0d, 8, 2, false, (cpu) => {
        let l = cpu.getL();
        let lsb = l & 1;
        let result = ((l >> 1) | (lsb << 7)) & 0xff;

        cpu.setL(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x0e,
      new Opcode("RRC", "(HL)", 0x0e, 16, 2, false, (cpu) => {
        let value = cpu.memory.readByte(cpu.getHL());
        let lsb = value & 1;
        let result = ((value >> 1) | (lsb << 7)) & 0xff;

        cpu.memory.writeByte(cpu.getHL(), result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x18,
      new Opcode("RR", "B", 0x18, 8, 2, false, (cpu) => {
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
      0x1a,
      new Opcode("RR", "D", 0x1a, 8, 2, false, (cpu) => {
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
      new Opcode("RR", "E", 0x1b, 8, 2, false, (cpu) => {
        // 8 Zyklen, Länge 2
        let e = cpu.getE();
        let oldCarry = cpu.getCFlag();
        let lsb = e & 1;

        let result = ((e >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setE(result);

        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb); // ✅ Nur EIN setHFlag!
      })
    );
    this.cbOpcodeList.set(
      0x1c,
      new Opcode("RR", "H", 0x1c, 8, 2, false, (cpu) => {
        // 8 Zyklen, Länge 2
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
      new Opcode("RR", "L", 0x1d, 8, 2, false, (cpu) => {
        // 8 Zyklen, Länge 2
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
      new Opcode("RR", "(HL)", 0x1e, 16, 2, false, (cpu) => {
        // 16 Zyklen, Länge 2
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
      new Opcode("SLA", "A", 0x27, 8, 2, false, (cpu) => {
        let value = cpu.getA();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x20,
      new Opcode("SLA", "B", 0x20, 8, 2, false, (cpu) => {
        let value = cpu.getB();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setB(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x21,
      new Opcode("SLA", "C", 0x21, 8, 2, false, (cpu) => {
        let value = cpu.getC();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setC(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x22,
      new Opcode("SLA", "D", 0x22, 8, 2, false, (cpu) => {
        let value = cpu.getD();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setD(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x23,
      new Opcode("SLA", "E", 0x23, 8, 2, false, (cpu) => {
        let value = cpu.getE();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setE(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x24,
      new Opcode("SLA", "H", 0x24, 8, 2, false, (cpu) => {
        let value = cpu.getH();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setH(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x25,
      new Opcode("SLA", "L", 0x25, 8, 2, false, (cpu) => {
        let value = cpu.getL();
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.setL(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );

    this.cbOpcodeList.set(
      0x26,
      new Opcode("SLA", "(HL)", 0x26, 16, 2, false, (cpu) => {
        let value = cpu.memory.readByte(cpu.getHL());
        let msb = (value >> 7) & 1;
        let result = (value << 1) & 0xff;

        cpu.memory.writeByte(cpu.getHL(), result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(msb);
      })
    );
    this.cbOpcodeList.set(
      0x3f,
      new Opcode("SRL", "A", 0x3f, 8, 2, false, (cpu) => {
        let value = cpu.getA();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x38,
      new Opcode("SRL", "B", 0x38, 8, 2, false, (cpu) => {
        let value = cpu.getB();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setB(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x39,
      new Opcode("SRL", "C", 0x39, 8, 2, false, (cpu) => {
        let value = cpu.getC();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setC(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x3a,
      new Opcode("SRL", "D", 0x3a, 8, 2, false, (cpu) => {
        let value = cpu.getD();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setD(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x3b,
      new Opcode("SRL", "E", 0x3b, 8, 2, false, (cpu) => {
        let value = cpu.getE();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setE(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x3c,
      new Opcode("SRL", "H", 0x3c, 8, 2, false, (cpu) => {
        let value = cpu.getH();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setH(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x3d,
      new Opcode("SRL", "L", 0x3d, 8, 2, false, (cpu) => {
        let value = cpu.getL();
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.setL(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x3e,
      new Opcode("SRL", "(HL)", 0x3e, 16, 2, false, (cpu) => {
        let value = cpu.memory.readByte(cpu.getHL());
        let lsb = value & 0x01;
        let result = (value >> 1) & 0x7f;

        cpu.memory.writeByte(cpu.getHL(), result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    this.cbOpcodeList.set(
      0x2f,
      new Opcode("SRA", "A", 0x2f, 8, 2, false, (cpu) => {
        let value = cpu.getA();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setA(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x28,
      new Opcode("SRA", "B", 0x28, 8, 2, false, (cpu) => {
        let value = cpu.getB();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setB(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x29,
      new Opcode("SRA", "C", 0x29, 8, 2, false, (cpu) => {
        let value = cpu.getC();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setC(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x2a,
      new Opcode("SRA", "D", 0x2a, 8, 2, false, (cpu) => {
        let value = cpu.getD();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setD(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x2b,
      new Opcode("SRA", "E", 0x2b, 8, 2, false, (cpu) => {
        let value = cpu.getE();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setE(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x2c,
      new Opcode("SRA", "H", 0x2c, 8, 2, false, (cpu) => {
        let value = cpu.getH();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setH(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x2d,
      new Opcode("SRA", "L", 0x2d, 8, 2, false, (cpu) => {
        let value = cpu.getL();
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.setL(result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );

    this.cbOpcodeList.set(
      0x2e,
      new Opcode("SRA", "(HL)", 0x2e, 16, 2, false, (cpu) => {
        let value = cpu.memory.readByte(cpu.getHL());
        let lsb = value & 0x01;
        let msb = value & 0x80;
        let result = (value >> 1) | msb;

        cpu.memory.writeByte(cpu.getHL(), result);
        cpu.setZFlag(result === 0 ? 1 : 0);
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
      })
    );
    // Vervollständige BIT-Instruktionen für alle Register
    for (let bit = 0; bit < 8; bit++) {
      // BIT b,B
      this.cbOpcodeList.set(
        0x40 + bit * 8,
        new Opcode("BIT", `${bit},B`, 0x40 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getB();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );

      // BIT b,C
      this.cbOpcodeList.set(
        0x41 + bit * 8,
        new Opcode("BIT", `${bit},C`, 0x41 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getC();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );

      // BIT b,D
      this.cbOpcodeList.set(
        0x42 + bit * 8,
        new Opcode("BIT", `${bit},D`, 0x42 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getD();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );

      // BIT b,E
      this.cbOpcodeList.set(
        0x43 + bit * 8,
        new Opcode("BIT", `${bit},E`, 0x43 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getE();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );

      // BIT b,H
      this.cbOpcodeList.set(
        0x44 + bit * 8,
        new Opcode("BIT", `${bit},H`, 0x44 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getH();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );

      // BIT b,L
      this.cbOpcodeList.set(
        0x45 + bit * 8,
        new Opcode("BIT", `${bit},L`, 0x45 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getL();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );

      // BIT b,(HL)
      this.cbOpcodeList.set(
        0x46 + bit * 8,
        new Opcode(
          "BIT",
          `${bit},(HL)`,
          0x46 + bit * 8,
          12,
          2,
          false,
          (cpu) => {
            const value = cpu.memory.readByte(cpu.getHL());
            const bitValue = (value >> bit) & 0x01;
            cpu.setZFlag(bitValue === 0 ? 1 : 0);
            cpu.setNFlag(0);
            cpu.setHFlag(1);
          }
        )
      );

      // BIT b,A
      this.cbOpcodeList.set(
        0x47 + bit * 8,
        new Opcode("BIT", `${bit},A`, 0x47 + bit * 8, 8, 2, false, (cpu) => {
          const value = cpu.getA();
          const bitValue = (value >> bit) & 0x01;
          cpu.setZFlag(bitValue === 0 ? 1 : 0);
          cpu.setNFlag(0);
          cpu.setHFlag(1);
        })
      );
    }

    0xc4,
      new Opcode("CALL", "NZ,nn", 0xc4, 12, 3, true, (cpu) => {
        const low = cpu.memory.readByte(cpu.getPC() + 1);
        const high = cpu.memory.readByte(cpu.getPC() + 2);
        const addr = (high << 8) | low;

        if (cpu.getZFlag() === 0) {
          const returnAddr = cpu.getPC() + 3;

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), (returnAddr >> 8) & 0xff);

          cpu.decreaseSP(1);
          cpu.memory.writeByte(cpu.getSP(), returnAddr & 0xff);

          cpu.setPC(addr);
          cpu.setCPUCycle(cpu.getCPUCycle() + 12); // Total: 12 + 12 = 24 Zyklen
        } else {
          cpu.increasePC(3);
          // Bleibt bei 12 Zyklen
        }
      });
    this.opcodeList.set(
      0x1f,
      new Opcode("RRA", "", 0x1f, 4, 1, false, (cpu) => {
        let a = cpu.getA();
        let oldCarry = cpu.getCFlag();
        let lsb = a & 1;
        let result = ((a >> 1) | (oldCarry << 7)) & 0xff;

        cpu.setA(result);
        cpu.setZFlag(0); // IMMER 0 für RRA
        cpu.setNFlag(0);
        cpu.setHFlag(0);
        cpu.setCFlag(lsb);
        // ✅ PC wird automatisch um 1 erhöht (Länge=1)
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