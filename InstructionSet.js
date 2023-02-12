class InstructionSet extends CPU {
    static opcodeList = new Map();

    static prepareInstructions() {
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

           const nn = cpu.toUnsigned16Bit(lsbValue,msbValue)
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
 
            const nn = cpu.toUnsigned16Bit(lsbValue,msbValue)
            cpu.memory[nn] = cpu.getA();
         }));

         //Continue with Page 14.
         this.opcodeList.set(0xF2, new Opcode('LDH', 'A,(C)', 0xF2, 16, 1, (cpu) => {
            // :A = read(unsigned_16(lsb=C, msb=0xFF))
            const lsbValue = cpu.getBC() & 0xFF;
            
            const msbValue = 0xFF;
            
            const finalValue = cpu.toUnsigned16Bit(lsbValue,msbValue);

            const memoryValue = cpu.memory[finalValue];
            cpu.setA(memoryValue);
         }));
         this.opcodeList.set(0xF2, new Opcode('LDH', '(C),A', 0xF2, 16, 1, (cpu) => {
            // write(unsigned_16(lsb=C, msb=0xFF), A)
            const lsbValue = cpu.getBC() & 0xFF;
            
            const msbValue = 0xFF;
            
            const finalValue = cpu.toUnsigned16Bit(lsbValue,msbValue);

            cpu.memory[finalValue] = cpu.getA();
         }));
         this.opcodeList.set(0xF0, new Opcode('LDH', 'A,(n)', 0xF0, 24, 2, (cpu) => {
            //n = read(PC++)
            //A = read(unsigned_16(lsb=n, msb=0xFF))

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC()+1);
            
            const msbValue = 0xFF;
            
            const finalValue = cpu.toUnsigned16Bit(lsbValue,msbValue);

            const memoryValue = cpu.memory[finalValue];
            cpu.setA(memoryValue);
         }));
         this.opcodeList.set(0xE0, new Opcode('LDH', '(n), A', 0xE0, 24, 2, (cpu) => {
            // n = read(PC++)
            //write(unsigned_16(lsb=n, msb=0xFF), A)

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC()+1);
            
            const msbValue = 0xFF;
            
            const finalValue = cpu.toUnsigned16Bit(lsbValue,msbValue);

            cpu.memory[finalValue] = cpu.getA();
            
         }));
         this.opcodeList.set(0x3A, new Opcode('LD', 'A,(HL-)', 0x3A, 16, 1, (cpu) => {
            // A = read(HL--)

           const memoryValue = cpu.memory[cpu.getHL()];
           cpu.setA(memoryValue);
           cpu.setHL(cpu.getHL()-1);
            
         }));
         this.opcodeList.set(0x32, new Opcode('LD', '(HL-),A', 0x32, 16, 1, (cpu) => {
            // write(HL--, A)

           cpu.memory[cpu.getHL()] = cpu.getA();
            cpu.setHL(cpu.getHL()-1);            
         }));
         this.opcodeList.set(0x2A, new Opcode('LD', 'A,(HL+)', 0x2A, 16, 1, (cpu) => {
            // A = read(HL++)

            const memoryValue = cpu.memory[cpu.getHL()];
            cpu.setA(memoryValue);
            cpu.setHL(cpu.getHL()+1);

         }));
         this.opcodeList.set(0x22, new Opcode('LD', '(HL+),A', 0x22, 16, 1, (cpu) => {
            // write(HL++, A)

            cpu.memory[cpu.getHL()] = cpu.getA();
            cpu.setHL(cpu.getHL()+1);
                        
         }));
         this.opcodeList.set(0x01, new Opcode('LD', 'rr,nn', 0x01, 24, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn
            
           const lsbValue = cpu.memory[cpu.getPC()];
           cpu.setPC(cpu.getPC() + 1);

           const msbValue = cpu.memory[cpu.getPC()];
           cpu.setPC(cpu.getPC() + 1);

           const nn = cpu.toUnsigned16Bit(lsbValue,msbValue)
           
           cpu.setBC(nn);
                        
         }));
         this.opcodeList.set(0x08, new Opcode('LD', '(nn),SP', 0x08, 40, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn
            //TODO
           const lsbValue = cpu.memory[cpu.getPC()];
           cpu.setPC(cpu.getPC() + 1);

           const msbValue = cpu.memory[cpu.getPC()];
           cpu.setPC(cpu.getPC() + 1);

           const nn = cpu.toUnsigned16Bit(lsbValue,msbValue)
           cpu.memory[nn] = cpu.getSP() & 0xFF00    
           cpu.memory[nn+1]
           
                        
         }));
    }

    //returns the instruction which can be found by opcodeValue( decode step )
    static getInstruction(opcodeValue) {

        if (!this.opcodeList.get(opcodeValue)) {
            console.log("opcodeValuz4e ", opcodeValue);
            throw new Error("Instruction not found.");
        }
        return this.opcodeList.get(opcodeValue);


    }
    static executeInstruction(cpu, instruction) {
        cpu.setCPUCycle(cpu.getCPUCycle() + instruction.getOpcodeCycle());
        instruction.executeOn(cpu);
    }
}