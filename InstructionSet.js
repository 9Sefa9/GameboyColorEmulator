class InstructionSet extends CPU {
    static opcodeList = new Map();

    static prepareInstructions() {
        
        this.opcodeList.set(0x00, new Opcode('NOP', '', 0x00, 8, 1, (cpu) => {
            // Does nothing
        }));
        
        //8-bit operations
        this.opcodeList.set(0x41, new Opcode('LD', 'r,r’', 0x41, 8, 1, (cpu) => {

            const bPart = (cpu.getBC() & 0xFF00);
            const cPart = (cpu.getBC() & 0x00FF);
            const result = (cPart | bPart);
            cpu.setBC(result);
        }));
        //TODO
        this.opcodeList.set(0x06, new Opcode('LD', 'r,n', 0x06, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(pc + 1);
            const result = (cpu.getBC() & 0x00FF) | (n << 8)
            cpu.setBC(result);
        }));
        this.opcodeList.set(0x46, new Opcode('LD', 'r,(HL)', 0x46, 16, 1, (cpu) => {
            const memoryValue = cpu.memory[cpu.getHL()];
            const result = (cpu.getBC() & 0x00FF) | (memoryValue << 8)
            cpu.setBC(result);
        }));
        this.opcodeList.set(0x70, new Opcode('LD', '(HL),r', 0x70, 16, 1, (cpu) => {
            //write(HL,B)
            cpu.memory[cpu.getHL()] = ((cpu.getBC() & 0xFF00) >> 8) & 0xFF;

        }));
        this.opcodeList.set(0x36, new Opcode('LD', '(HL),n', 0x36, 24, 2, (cpu) => {
            // write(HL, n)
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            cpu.memory[cpu.getHL()] = n;


        }));
        this.opcodeList.set(0x0A, new Opcode('LD', 'A,(BC)', 0x0A, 16, 1, (cpu) => {
            // A = read(BC)
            const memoryValue = cpu.memory[cpu.getBC()];
            cpu.setA(memoryValue);


        }));
        this.opcodeList.set(0x1A, new Opcode('LD', 'A,(DE)', 0x1A, 16, 1, (cpu) => {
            // A= read(DE)
            const memoryValue = cpu.memory[cpu.getDE()];
            cpu.setA(memoryValue);


        }));
        this.opcodeList.set(0x02, new Opcode('LD', '(BC),A', 0x02, 16, 1, (cpu) => {
            // write(BC, A)
            cpu.memory[cpu.getBC()] = cpu.getA();
        }));
        this.opcodeList.set(0x12, new Opcode('LD', '(DE),A', 0x12, 16, 1, (cpu) => {
            // write(DE, A)

            cpu.memory[cpu.getDE()] = cpu.getA();
        }));
        this.opcodeList.set(0xFA, new Opcode('LD', 'A,(nn)', 0xFA, 32, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            //A = read(nn)

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)
            const memoryData = cpu.memory[nn];
            cpu.setA(memoryData);
        }));
        this.opcodeList.set(0xEA, new Opcode('LD', '(nn),A', 0xEA, 32, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            //A = read(nn)

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)
            cpu.memory[nn] = cpu.getA();
        }));

        //Continue with Page 14.
        this.opcodeList.set(0xF2, new Opcode('LDH', 'A,(C)', 0xF2, 16, 1, (cpu) => {
            // :A = read(unsigned_16(lsb=C, msb=0xFF))
            const lsbValue = cpu.getBC() & 0xFF;

            const msbValue = 0xFF;

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            const memoryValue = cpu.memory[finalValue];
            cpu.setA(memoryValue);
        }));
        this.opcodeList.set(0xFE2, new Opcode('LDH', '(C),A', 0xE2, 16, 1, (cpu) => {
            // write(unsigned_16(lsb=C, msb=0xFF), A)
            const lsbValue = cpu.getBC() & 0xFF;

            const msbValue = 0xFF;

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            cpu.memory[finalValue] = cpu.getA();
        }));
        this.opcodeList.set(0xF0, new Opcode('LDH', 'A,(n)', 0xF0, 24, 2, (cpu) => {
            //n = read(PC++)
            //A = read(unsigned_16(lsb=n, msb=0xFF))

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = 0xFF;

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            const memoryValue = cpu.memory[finalValue];
            cpu.setA(memoryValue);
        }));
        this.opcodeList.set(0xE0, new Opcode('LDH', '(n), A', 0xE0, 24, 2, (cpu) => {
            // n = read(PC++)
            //write(unsigned_16(lsb=n, msb=0xFF), A)

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = 0xFF;

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            cpu.memory[finalValue] = cpu.getA();

        }));
        this.opcodeList.set(0x3A, new Opcode('LD', 'A,(HL-)', 0x3A, 16, 1, (cpu) => {
            // A = read(HL--)

            const memoryValue = cpu.memory[cpu.getHL()];
            cpu.setA(memoryValue);
            cpu.setHL(cpu.getHL() - 1);

        }));
        this.opcodeList.set(0x32, new Opcode('LD', '(HL-),A', 0x32, 16, 1, (cpu) => {
            // write(HL--, A)

            cpu.memory[cpu.getHL()] = cpu.getA();
            cpu.setHL(cpu.getHL() - 1);
        }));
        this.opcodeList.set(0x2A, new Opcode('LD', 'A,(HL+)', 0x2A, 16, 1, (cpu) => {
            // A = read(HL++)

            const memoryValue = cpu.memory[cpu.getHL()];
            cpu.setA(memoryValue);
            cpu.setHL(cpu.getHL() + 1);

        }));
        this.opcodeList.set(0x22, new Opcode('LD', '(HL+),A', 0x22, 16, 1, (cpu) => {
            // write(HL++, A)

            cpu.memory[cpu.getHL()] = cpu.getA();
            cpu.setHL(cpu.getHL() + 1);

        }));
        this.opcodeList.set(0x01, new Opcode('LD', 'rr,nn', 0x01, 24, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)

            cpu.setBC(nn);

        }));
        this.opcodeList.set(0x08, new Opcode('LD', '(nn),SP', 0x08, 40, 3, (cpu) => {
            /*
                nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
                write(nn, lsb(SP))
                write(nn+1, msb(SP)) 
            */
            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)
            cpu.memory[nn] = (cpu.getSP() & 0xFF);
            cpu.memory[nn + 1] = ((cpu.getSP() & 0xFF00) >> 8);

        }));
        this.opcodeList.set(0xF9, new Opcode('LD', 'SP,HL', 0xF9, 16, 1, (cpu) => {
            /*
               SP = HL
            */
            cpu.setSP(cpu.getHL());

        }));
        this.opcodeList.set(0xC5, new Opcode('PUSH', 'rr', 0xC5, 32, 1, (cpu) => {
            /*
                SP--
                write(SP--, msb(BC))
                write(SP, lsb(BC))
            */
            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = (cpu.getBC() & 0xFF);

        }));
        this.opcodeList.set(0xC1, new Opcode('POP', 'rr', 0xC1, 24, 1, (cpu) => {
            /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
            */
            const lsbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const msbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue)
            cpu.setBC(finalValue);
        }));

        // 8-bit arithmetic and logical instructions
        this.opcodeList.set(0x80, new Opcode('ADD', 'r', 0x80, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((result & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (result > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x86, new Opcode('ADD', '(HL)', 0x86, 16, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const data = cpu.memory[cpu.getHL()];
            const result = cpu.getA() + data;
            const carryPerBit = cpu.getA() + data;
            cpu.setA(result);


            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xC6, new Opcode('ADD', 'n', 0xC6, 16, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A + n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() + n;
            const carryPerBit = cpu.getA() + n;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x88, new Opcode('ADC', 'r', 0x88, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + cpu.getC() + ((cpu.getBC() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() + cpu.getC() + ((cpu.getBC() & 0xFF00) >> 8);

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x8E, new Opcode('ADC', '(HL)', 0x8E, 16, 1, (cpu) => {
            /* data = read(HL)
                result, carry_per_bit = A + flags.C + data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const data = cpu.memory[cpu.getHL()];
            const result = cpu.getA() + cpu.getC() + data;
            const carryPerBit = cpu.getA() + cpu.getC() + data;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xCE, new Opcode('ADC', 'n', 0xCE, 16, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A + flags.C + n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() + cpu.getC() + n;
            const carryPerBit = cpu.getA() + cpu.getC() + n;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x90, new Opcode('SUB', 'r', 0x90, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - ((cpu.getBC() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - ((cpu.getBC() & 0xFF00) >> 8);

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x96, new Opcode('SUB', '(HL)', 0x96, 16, 1, (cpu) => {
            /* data = read(HL)
                result, carry_per_bit = A - data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const data = cpu.memory[cpu.getHL()];
            const result = cpu.getA() - data;
            const carryPerBit = cpu.getA() - data;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xD6, new Opcode('SUB', 'n', 0xD6, 16, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() - n;
            const carryPerBit = cpu.getA() - n;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x98, new Opcode('SBC', 'r', 0x98, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() - cpu.getC() - ((cpu.getBC() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - cpu.getC() - ((cpu.getBC() & 0xFF00) >> 8);

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x9E, new Opcode('SBC', '(HL)', 0x9E, 16, 1, (cpu) => {
            /* data = read(HL)
                result, carry_per_bit = A - flags.C - data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */
            const data = cpu.memory[cpu.getHL()];

            const result = cpu.getA() - cpu.getC() - data;
            const carryPerBit = cpu.getA() - cpu.getC() - data;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xDE, new Opcode('SBC', 'n', 0xDE, 16, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - flags.C - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = cpu.getA() - cpu.getC() - n;
            const carryPerBit = cpu.getA() - cpu.getC() - n;

            cpu.setA(result);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xB8, new Opcode('CP', 'r', 0xB8, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            //  const n = cpu.memory[cpu.getPC()];
            //   cpu.setPC(cpu.getPC()+1);
            const result = cpu.getA() - ((cpu.getBC() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - ((cpu.getBC() & 0xFF00) >> 8);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xBE, new Opcode('CP', '(HL)', 0xBE, 16, 1, (cpu) => {
            /* data = read(HL)
                result, carry_per_bit = A - data
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const data = cpu.memory[cpu.getHL()];
            //   cpu.setPC(cpu.getPC()+1);
            const result = cpu.getA() - data;
            const carryPerBit = cpu.getA() - data;

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0xFE, new Opcode('CP', 'n', 0xFE, 16, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = cpu.getA() - n;
            const carryPerBit = cpu.getA() - n;

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            if (carryPerBit > 0xFF) {
                cpu.setC(1)
            } else {
                cpu.setC(0);
            }
        }));
        this.opcodeList.set(0x04, new Opcode('INC', 'r', 0x04, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            //const n = cpu.memory[cpu.getPC()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = ((cpu.getBC() & 0xFF00) >> 8) + 1;
            const carryPerBit = ((cpu.getBC() & 0xFF00) >> 8) + 1;
            const B = (result << 8) | (cpu.getBC() & 0x00FF);
            cpu.setBC(B);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0x34, new Opcode('INC', '(HL)', 0x34, 24, 1, (cpu) => {
            /* data = read(HL)
                result, carry_per_bit = data + 1
                write(HL, result)
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const data = cpu.memory[cpu.getHL()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = data + 1;
            const carryPerBit = data + 1;
            cpu.memory[cpu.getHL()] = result;

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0x05, new Opcode('DEC', 'r', 0x05, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            // const data = cpu.memory[cpu.getHL()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = ((cpu.getBC() & 0xFF00) >> 8) - 1;
            const carryPerBit = ((cpu.getBC() & 0xFF00) >> 8) - 1;
            const B = (result << 8) | (cpu.getBC() & 0x00FF);
            cput.setBC(B);

            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0x35, new Opcode('DEC', '(HL)', 0x35, 24, 1, (cpu) => {
            /* data = read(HL)
                result, carry_per_bit = data - 1
                write(HL, result)
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            const data = cpu.memory[cpu.getHL()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = data - 1;
            const carryPerBit = data - 1;
            // const B = (result << 8) | (cpu.getBC() & 0x00FF);
            // cput.setBC(B);
            cpu.memory[cpu.getHL()] = result;
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(1);

            if ((carryPerBit & 0x0F) > 0x0F) {
                cpu.setH(1)
            } else {
                cpu.setH(0)
            }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0xA0, new Opcode('AND', 'r', 0xA0, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
            */
            //  const data = cpu.memory[cpu.getHL()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = cpu.getA() & ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setA(result);
            //  const carryPerBit = data - 1;
            // const B = (result << 8) | (cpu.getBC() & 0x00FF);
            // cput.setBC(B);
            // cpu.memory[cpu.getHL()] = result;
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
            // if ((carryPerBit & 0x0F) > 0x0F) {
            //     cpu.setH(1)
            // } else {
            //     cpu.setH(0)
            // }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0xA6, new Opcode('AND', '(HL)', 0xA6, 16, 1, (cpu) => {
            /* data = read(HL)
                result = A & data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
            const data = cpu.memory[cpu.getHL()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = cpu.getA() & data;
            cpu.setA(result);
            //  const carryPerBit = data - 1;
            // const B = (result << 8) | (cpu.getBC() & 0x00FF);
            // cput.setBC(B);
            // cpu.memory[cpu.getHL()] = result;
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
            // if ((carryPerBit & 0x0F) > 0x0F) {
            //     cpu.setH(1)
            // } else {
            //     cpu.setH(0)
            // }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0xE6, new Opcode('AND', 'n', 0xE6, 16, 1, (cpu) => {
            /* n = read(PC++)
                result = A & n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() & n;
            cpu.setA(result);
            //  const carryPerBit = data - 1;
            // const B = (result << 8) | (cpu.getBC() & 0x00FF);
            // cput.setBC(B);
            // cpu.memory[cpu.getHL()] = result;
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
            // if ((carryPerBit & 0x0F) > 0x0F) {
            //     cpu.setH(1)
            // } else {
            //     cpu.setH(0)
            // }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0xB0, new Opcode('OR', 'r', 0xB0, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
            */
            const result = cpu.getA() | ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xB6, new Opcode('OR', '(HL)', 0xB6, 16, 1, (cpu) => {
            /* data = read(HL)
                result = A | data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0

            */
            const data = cpu.memory[cpu.getHL()];
            const result = cpu.getA() | data;
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xF6, new Opcode('OR', 'n', 0xF6, 16, 1, (cpu) => {
            /* n = read(PC++)
                result = A & n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() | n;
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA8, new Opcode('XOR', 'r', 0xA8, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
            */
            const result = cpu.getA() ^ ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xAE, new Opcode('XOR', '(HL)', 0xAE, 16, 1, (cpu) => {
            /* data = read(HL)
                result = A & data
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
            const data = cpu.memory[cpu.getHL()];
            //cpu.setPC(cpu.getPC() + 1);
            const result = cpu.getA() ^ data;
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xEE, new Opcode('XOR', 'n', 0xEE, 16, 1, (cpu) => {
            /* n = read(PC++)
                result = A & n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1
                flags.C = 0

            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const result = cpu.getA() ^ n;
            cpu.setA(result);
            //  const carryPerBit = data - 1;
            // const B = (result << 8) | (cpu.getBC() & 0x00FF);
            // cput.setBC(B);
            // cpu.memory[cpu.getHL()] = result;
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
            // if ((carryPerBit & 0x0F) > 0x0F) {
            //     cpu.setH(1)
            // } else {
            //     cpu.setH(0)
            // }

            // if (carryPerBit > 0xFF) {
            //     cpu.setC(1)
            // } else {
            //     cpu.setC(0);
            // }
        }));
        this.opcodeList.set(0x3F, new Opcode('CCF', '', 0x3F, 8, 1, (cpu) => {
            /* flags.N = 0
                flags.H = 0
                flags.C = ~flags.C

            */
            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(~cpu.getC());

        }));
        this.opcodeList.set(0x37, new Opcode('SCF', '', 0x37, 8, 1, (cpu) => {
            /* flags.N = 0
                flags.H = 0
                flags.C = 1
            */
            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(1);

        }));
        this.opcodeList.set(0x27, new Opcode('DAA', '', 0x27, 8, 1, (cpu) => {
            /* 
                  https://forums.nesdev.org/viewtopic.php?t=15944
                // note: assumes a is a uint8_t and wraps from 0xff to 0
                if (!n_flag) {  // after an addition, adjust if (half-)carry occurred or if result is out of bounds
                if (c_flag || a > 0x99) { a += 0x60; c_flag = 1; }
                if (h_flag || (a & 0x0f) > 0x09) { a += 0x6; }
                } else {  // after a subtraction, only adjust if (half-)carry occurred
                if (c_flag) { a -= 0x60; }
                if (h_flag) { a -= 0x6; }
                }
                // these flags are always updated
                z_flag = (a == 0); // the usual z flag
                h_flag = 0; // h flag is always cleared
            */
            // note: assumes a is a uint8_t and wraps from 0xff to 0
            if (cpu.getN() == 0) {  // after an addition, adjust if (half-)carry occurred or if result is out of bounds
                if (cpu.getC() || cpu.getA() > 0x99) {
                    cpu.setA(cpu.getA() + 0x60);
                    cpu.setC(1);
                }
                if (cpu.getH() || (cpu.getA() & 0x0f) > 0x09) {
                    cpu.setA(cpu.getA() + 0x6);
                }
            } else {  // after a subtraction, only adjust if (half-)carry occurred
                if (cpu.getC()) {
                    cpu.setA(cpu.getA() - 0x60);
                }
                if (cpu.getH()) {
                    cpu.setA(cpu.getA() - 0x6);
                }
            }
            // these flags are always updated
            if (a == 0) {
                cpu.setZ(1);
            } else {
                cpu.setZ(0);
            }
            // the usual z flag
            cpu.setH(0);// h flag is always cleared

        }));
        this.opcodeList.set(0x2F, new Opcode('CPL', '', 0x2F, 8, 1, (cpu) => {
            /* flags.N = 0
                flags.H = 0
                flags.C = 1
            */
            cpu.setA(~cpu.getA());
            cpu.setN(1);
            cpu.setH(1);

        }));
    }

    //returns the instruction which can be found by opcodeValue( decode step )
    static getInstruction(opcodeValue) {

        if (!this.opcodeList.get(opcodeValue)) {
            throw new Error("Instruction not found.");
        }
        return this.opcodeList.get(opcodeValue);


    }
    static executeInstruction(cpu, instruction) {
        cpu.setCPUCycle(cpu.getCPUCycle() + instruction.getOpcodeCycle());
        instruction.executeOn(cpu);
    }
}