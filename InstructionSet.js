class InstructionSet extends CPU {
    static opcodeList = new Map();

    static prepareInstructions() {
        this.opcodeList.set(0x76, new Opcode('HALT', '', 0x76, 8, 1, (cpu) => {
            // Power down CPU until an interrupt occurs. Use this
            //when ever possible to reduce energy consumption
            console.log("HALT not implemented");
            
        }));
        this.opcodeList.set(0x1000, new Opcode('STOP', '', 0x1000, 8, 1, (cpu) => {
            // Power down CPU until an interrupt occurs. Use this
            //when ever possible to reduce energy consumption
            console.log("STOP not implemented");
            
        }));
        this.opcodeList.set(0x00, new Opcode('NOP', '', 0x00, 8, 1, (cpu) => {
            // Does nothing
        }));

        //8-bit operations
        this.opcodeList.set(0x7F, new Opcode('LD', 'A,A', 0x7F, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getA()];
            cpu.setA(value);
        }));
        this.opcodeList.set(0x78, new Opcode('LD', 'A,B', 0x78, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];
            cpu.setA(value);
        }));
        this.opcodeList.set(0x79, new Opcode('LD', 'A,C', 0x79, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setA(value);
        }));
        this.opcodeList.set(0x7A, new Opcode('LD', 'A,D', 0x7A, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setA(value);
        }));
        this.opcodeList.set(0x7B, new Opcode('LD', 'A,E', 0x7B, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setA(value);
        }));
        this.opcodeList.set(0x7C, new Opcode('LD', 'A,H', 0x7C, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setA(value);
        }));
        this.opcodeList.set(0x7D, new Opcode('LD', 'A,L', 0x7D, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setA(value);
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

        this.opcodeList.set(0x7E, new Opcode('LD', 'A,(HL)', 0x7E, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL())];
            cpu.setA(value);
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
        this.opcodeList.set(0x3E, new Opcode('LD', 'A,#', 0x3E, 32, 3, (cpu) => {
            //I think that's an immediate load. It takes the next byte (the one immediately after 3E in the ROM) 
            //and stores that in A. So if you saw 3E F2 ..., F2 would be stored in A.
            console.log("UNSURE OPERATION HERE! - opcode ");
            cpu.setPC(cpu.getPC() + 1);
            const n = cpu.memory[cpu.getPC()];
            const memoryData = cpu.memory[n];
            cpu.setA(memoryData);
        }));
        this.opcodeList.set(0x47, new Opcode('LD', 'B,A', 0x47, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getA()];
            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x4F, new Opcode('LD', 'C,A', 0x4F, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getA()];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x40, new Opcode('LD', 'B,B', 0x40, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];
            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x41, new Opcode('LD', 'B,C', 0x41, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x42, new Opcode('LD', 'B,D', 0x42, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x43, new Opcode('LD', 'B,E', 0x43, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x44, new Opcode('LD', 'B,H', 0x44, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x45, new Opcode('LD', 'B,L', 0x45, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x46, new Opcode('LD', 'B,(HL)', 0x46, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));


        this.opcodeList.set(0x48, new Opcode('LD', 'C,B', 0x48, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x49, new Opcode('LD', 'C,C', 0x49, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x4A, new Opcode('LD', 'C,D', 0x4A, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x4B, new Opcode('LD', 'C,E', 0x4B, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x4C, new Opcode('LD', 'C,H', 0x4C, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x4D, new Opcode('LD', 'C,L', 0x4D, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x4E, new Opcode('LD', 'C,(HL)', 0x4E, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));




        this.opcodeList.set(0x50, new Opcode('LD', 'D,B', 0x50, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x51, new Opcode('LD', 'D,C', 0x51, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x52, new Opcode('LD', 'D,D', 0x52, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x53, new Opcode('LD', 'D,E', 0x53, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x54, new Opcode('LD', 'D,H', 0x54, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x55, new Opcode('LD', 'D,L', 0x55, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x56, new Opcode('LD', 'D,(HL)', 0x56, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));



        this.opcodeList.set(0x58, new Opcode('LD', 'E,B', 0x58, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x59, new Opcode('LD', 'E,C', 0x59, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5A, new Opcode('LD', 'E,D', 0x5A, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5B, new Opcode('LD', 'E,E', 0x5B, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5C, new Opcode('LD', 'E,H', 0x5C, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5D, new Opcode('LD', 'E,L', 0x5D, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5E, new Opcode('LD', 'E,(HL)', 0x5E, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));



        this.opcodeList.set(0x60, new Opcode('LD', 'H,B', 0x60, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x61, new Opcode('LD', 'H,C', 0x61, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x62, new Opcode('LD', 'H,D', 0x62, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x63, new Opcode('LD', 'H,E', 0x63, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x64, new Opcode('LD', 'H,H', 0x64, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x65, new Opcode('LD', 'H,L', 0x65, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x66, new Opcode('LD', 'H,(HL)', 0x66, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));




        this.opcodeList.set(0x68, new Opcode('LD', 'L,B', 0x68, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x69, new Opcode('LD', 'L,C', 0x69, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6A, new Opcode('LD', 'L,D', 0x6A, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6B, new Opcode('LD', 'L,E', 0x6B, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6C, new Opcode('LD', 'L,H', 0x6C, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6D, new Opcode('LD', 'L,L', 0x6D, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6E, new Opcode('LD', 'L,(HL)', 0x6E, 16, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));



        this.opcodeList.set(0x70, new Opcode('LD', '(HL),B', 0x70, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setHL(value);
        }));
        this.opcodeList.set(0x71, new Opcode('LD', '(HL),C', 0x71, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x72, new Opcode('LD', '(HL),D', 0x72, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x73, new Opcode('LD', '(HL),E', 0x73, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x74, new Opcode('LD', '(HL),H', 0x74, 16, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x75, new Opcode('LD', '(HL),L', 0x75, 16, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x36, new Opcode('LD', '(HL),n', 0x36, 16, 2, (cpu) => {
            // write(HL, n)
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            cpu.memory[cpu.getHL()] = n;
        }));

        this.opcodeList.set(0x06, new Opcode('LD', 'B,n', 0x06, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = (cpu.getBC() & 0x00FF) | (n << 8)
            cpu.setBC(result);
        }));
        this.opcodeList.set(0x0E, new Opcode('LD', 'C,n', 0x0E, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = (cpu.getBC() & 0xFF00) | n
            cpu.setBC(result);
        }));
        this.opcodeList.set(0x16, new Opcode('LD', 'D,n', 0x16, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = (cpu.getDE() & 0x00FF) | (n << 8)
            cpu.setDE(result);
        }));
        this.opcodeList.set(0x1E, new Opcode('LD', 'E,n', 0x1E, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = (cpu.getDE() & 0xFF00) | n;
            cpu.setDE(result);
        }));
        this.opcodeList.set(0x26, new Opcode('LD', 'H,n', 0x26, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = (cpu.getHL() & 0x00FF) | n << 8;
            cpu.setHL(result);
        }));
        this.opcodeList.set(0x2E, new Opcode('LD', 'L,n', 0x2E, 16, 2, (cpu) => {
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            const result = (cpu.getHL() & 0xFF00) | n;
            cpu.setHL(result);
        }));
        this.opcodeList.set(0x02, new Opcode('LD', '(BC),A', 0x02, 16, 1, (cpu) => {
            // write(BC, A)
            cpu.memory[cpu.getBC()] = cpu.getA();
        }));
        this.opcodeList.set(0x12, new Opcode('LD', '(DE),A', 0x12, 16, 1, (cpu) => {
            // write(DE, A)

            cpu.memory[cpu.getDE()] = cpu.getA();
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
        this.opcodeList.set(0x01, new Opcode('LD', 'BC,nn', 0x01, 24, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)

            cpu.setBC(nn);

        }));
        this.opcodeList.set(0x11, new Opcode('LD', 'DE,nn', 0x11, 24, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)

            cpu.setDE(nn);

        }));
        this.opcodeList.set(0x21, new Opcode('LD', 'HL,nn', 0x21, 24, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)

            cpu.setHL(nn);

        }));
        this.opcodeList.set(0x31, new Opcode('LD', 'SP,nn', 0x31, 24, 3, (cpu) => {
            // nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
            // BC = nn

            const lsbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const msbValue = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            const nn = cpu.toUnsigned16Bit(lsbValue, msbValue)

            cpu.setSP(nn);

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
        this.opcodeList.set(0xF8, new Opcode('LD', 'SP,HL', 0xF8, 16, 1, (cpu) => {
            /*
               SP = HL
            */
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1)
            cpu.setSP(n);

        }));
        this.opcodeList.set(0xF9, new Opcode('LD', 'SP,HL', 0xF9, 16, 1, (cpu) => {
            /*
               SP = HL
            */
            cpu.setSP(cpu.getHL());

        }));
        this.opcodeList.set(0xF5, new Opcode('PUSH', 'AF', 0xF5, 32, 1, (cpu) => {

            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = (cpu.getA());
            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = (cpu.getF());

        }));
        this.opcodeList.set(0xD5, new Opcode('PUSH', 'DE', 0xD5, 32, 1, (cpu) => {

            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = ((cpu.getDE() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = (cpu.getDE() & 0xFF);

        }));
        this.opcodeList.set(0xC5, new Opcode('PUSH', 'BC', 0xC5, 32, 1, (cpu) => {

            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = (cpu.getBC() & 0xFF);

        }));
        this.opcodeList.set(0xE5, new Opcode('PUSH', 'HL', 0xC5, 32, 1, (cpu) => {

            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = ((cpu.getHL() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);
            cpu.memory[cpu.getSP()] = (cpu.getHL() & 0xFF);

        }));
        this.opcodeList.set(0xF1, new Opcode('POP', 'AF', 0xF1, 24, 1, (cpu) => {
            /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
            */
            const lsbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const msbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue)
            cpu.setAF(finalValue);
        }));
        this.opcodeList.set(0xD1, new Opcode('POP', 'BC', 0xD1, 24, 1, (cpu) => {
            /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
            */
            const lsbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const msbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue)
            cpu.setDE(finalValue);
        }));
        this.opcodeList.set(0xE1, new Opcode('POP', 'HL', 0xE1, 24, 1, (cpu) => {
            /* BC = unsigned_16(lsb=read(SP++), msb=read(SP++))
            */
            const lsbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const msbValue = cpu.memory[cpu.getSP()];
            cpu.setSP(cpu.getSP() + 1);

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue)
            cpu.setHL(finalValue);
        }));
        // 8-bit arithmetic and logical instructions
        this.opcodeList.set(0x87, new Opcode('ADD', 'A,A', 0x87, 8, 1, (cpu) => {
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
        this.opcodeList.set(0x80, new Opcode('ADD', 'A,B', 0x80, 8, 1, (cpu) => {
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
        this.opcodeList.set(0x81, new Opcode('ADD', 'A,C', 0x81, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + ((cpu.getBC() & 0xFF));
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
        this.opcodeList.set(0x82, new Opcode('ADD', 'A,D', 0x82, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + ((cpu.getDE() & 0xFF00) >> 8);
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
        this.opcodeList.set(0x83, new Opcode('ADD', 'A,E', 0x83, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + ((cpu.getDE() & 0xFF));
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
        this.opcodeList.set(0x84, new Opcode('ADD', 'A,H', 0x84, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + ((cpu.getHL() & 0xFF00) >> 8);
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
        this.opcodeList.set(0x85, new Opcode('ADD', 'A,L', 0x85, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + ((cpu.getHL() & 0xFF));
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

        // 16-bit arithmetic operations
        this.opcodeList.set(0x09, new Opcode('ADD', 'HL,BC', 0x09, 8, 1, (cpu) => {
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
        this.opcodeList.set(0x19, new Opcode('ADD', 'HL,DE', 0x19, 8, 1, (cpu) => {
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
        this.opcodeList.set(0x29, new Opcode('ADD', 'HL,HL', 0x29, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getHL() + cpu.getHL();
            cpu.setHL(result);

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
        this.opcodeList.set(0x39, new Opcode('ADD', 'HL,SP', 0x39, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getHL() + cpu.getSP();
            cpu.setHL(result);

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
        this.opcodeList.set(0xE8, new Opcode('ADD', 'SP,n', 0xE8, 24, 1, (cpu) => {
            /* result, carry_per_bit = A + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const value = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);

            cpu.setSP(value);

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
        this.opcodeList.set(0x8F, new Opcode('ADC', 'A,A', 0x8F, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + cpu.getC() + cpu.getA();
            const carryPerBit = cpu.getA() + cpu.getC() + cpu.getA();

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

        this.opcodeList.set(0x88, new Opcode('ADC', 'A,B', 0x88, 8, 1, (cpu) => {
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
        this.opcodeList.set(0x89, new Opcode('ADC', 'A,C', 0x89, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + cpu.getC() + ((cpu.getBC() & 0xFF));
            const carryPerBit = cpu.getA() + cpu.getC() + ((cpu.getBC() & 0xFF));

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
        this.opcodeList.set(0x8A, new Opcode('ADC', 'A,D', 0x8A, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + cpu.getC() + ((cpu.getDE() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() + cpu.getC() + ((cpu.getDE() & 0xFF00) >> 8);

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
        this.opcodeList.set(0x8B, new Opcode('ADC', 'A,E', 0x8B, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + cpu.getC() + ((cpu.getDE() & 0xFF));
            const carryPerBit = cpu.getA() + cpu.getC() + ((cpu.getDE() & 0xFF));

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
        this.opcodeList.set(0x8C, new Opcode('ADC', 'A,H', 0x8C, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() + cpu.getC() + ((cpu.getHL() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() + cpu.getC() + ((cpu.getHL() & 0xFF00) >> 8);

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
        this.opcodeList.set(0x8D, new Opcode('ADC', 'A,L', 0x8D, 8, 1, (cpu) => {
            /* result, carry_per_bit = A + flags.C + B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */

            const result = cpu.getA() + cpu.getC() + ((cpu.getHL() & 0xFF));
            const carryPerBit = cpu.getA() + cpu.getC() + ((cpu.getHL() & 0xFF));

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
        this.opcodeList.set(0x97, new Opcode('SUB', 'A', 0x97, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - cpu.getA();
            const carryPerBit = cpu.getA() - cpu.getA();

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
        this.opcodeList.set(0x90, new Opcode('SUB', 'B', 0x90, 8, 1, (cpu) => {
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
        this.opcodeList.set(0x91, new Opcode('SUB', 'C', 0x91, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - (cpu.getBC() & 0xFF);
            const carryPerBit = cpu.getA() - (cpu.getBC() & 0xFF);

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
        this.opcodeList.set(0x92, new Opcode('SUB', 'D', 0x92, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - ((cpu.getDE() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - ((cpu.getDE() & 0xFF00) >> 8);

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
        this.opcodeList.set(0x93, new Opcode('SUB', 'E', 0x93, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - (cpu.getDE() & 0xFF);
            const carryPerBit = cpu.getA() - (cpu.getDE() & 0xFF);

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
        this.opcodeList.set(0x94, new Opcode('SUB', 'H', 0x94, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - ((cpu.getHL() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - ((cpu.getHL() & 0xFF00) >> 8);

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
        this.opcodeList.set(0x95, new Opcode('SUB', 'L', 0x95, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

            */

            const result = cpu.getA() - (cpu.getHL() & 0xFF);
            const carryPerBit = cpu.getA() - (cpu.getHL() & 0xFF);

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
        this.opcodeList.set(0x9F, new Opcode('SBC', 'A', 0x9F, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */
            const result = cpu.getA() - cpu.getC() - cpu.getA();
            const carryPerBit = cpu.getA() - cpu.getC() - pu.getA();

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
        this.opcodeList.set(0x98, new Opcode('SBC', 'B', 0x98, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */

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
        this.opcodeList.set(0x99, new Opcode('SBC', 'C', 0x99, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
            */

            const result = cpu.getA() - cpu.getC() - (cpu.getBC() & 0xFF);
            const carryPerBit = cpu.getA() - cpu.getC() - (cpu.getBC() & 0xFF);

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
        this.opcodeList.set(0x9A, new Opcode('SBC', 'D', 0x9A, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

                ((cpu.getDE() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */

            const result = cpu.getA() - cpu.getC() - ((cpu.getDE() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - cpu.getC() - ((cpu.getDE() & 0xFF00) >> 8);

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
        this.opcodeList.set(0x9B, new Opcode('SBC', 'E', 0x9B, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

                ((cpu.getDE() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */

            const result = cpu.getA() - cpu.getC() - (cpu.getDE() & 0xFF);
            const carryPerBit = cpu.getA() - cpu.getC() - (cpu.getDE() & 0xFF);

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
        this.opcodeList.set(0x9C, new Opcode('SBC', 'H', 0x9C, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

                ((cpu.getDE() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */

            const result = cpu.getA() - cpu.getC() - ((cpu.getHL() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - cpu.getC() - ((cpu.getHL() & 0xFF00) >> 8);

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
        this.opcodeList.set(0x9D, new Opcode('SBC', 'L', 0x9D, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = A - n
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0

                ((cpu.getDE() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */

            const result = cpu.getA() - cpu.getC() - (cpu.getHL() & 0xFF);
            const carryPerBit = cpu.getA() - cpu.getC() - (cpu.getHL() & 0xFF);

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
        this.opcodeList.set(0xBF, new Opcode('CP', 'A', 0xBF, 8, 1, (cpu) => {
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
        this.opcodeList.set(0xB8, new Opcode('CP', 'B', 0xB8, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
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
        this.opcodeList.set(0xB9, new Opcode('CP', 'C', 0xB9, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() - (cpu.getBC() & 0xFF);
            const carryPerBit = cpu.getA() - (cpu.getBC() & 0xFF);

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
        this.opcodeList.set(0xBA, new Opcode('CP', 'D', 0xBA, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() - ((cpu.getDE() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - ((cpu.getDE() & 0xFF00) >> 8);

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
        this.opcodeList.set(0xBB, new Opcode('CP', 'E', 0xBB, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() - (cpu.getDE() & 0xFF);
            const carryPerBit = cpu.getA() - (cpu.getDE() & 0xFF);

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
        this.opcodeList.set(0xBC, new Opcode('CP', 'H', 0xBC, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() - ((cpu.getHL() & 0xFF00) >> 8);
            const carryPerBit = cpu.getA() - ((cpu.getHL() & 0xFF00) >> 8);

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
        this.opcodeList.set(0xBD, new Opcode('CP', 'L', 0xBD, 8, 1, (cpu) => {
            /* result, carry_per_bit = A - B
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                flags.C = 1 if carry_per_bit[7] else 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() - (cpu.getHL() & 0xFF);
            const carryPerBit = cpu.getA() - (cpu.getHL() & 0xFF);

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
        this.opcodeList.set(0x3C, new Opcode('INC', 'A', 0x3C, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = cpu.getA() + 1;
            const carryPerBit = cpu.getA() + 1;
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

        }));
        this.opcodeList.set(0x04, new Opcode('INC', 'B', 0x04, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
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

        }));
        this.opcodeList.set(0x0C, new Opcode('INC', 'C', 0x0C, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = ((cpu.getBC() & 0xFF)) + 1;
            const carryPerBit = ((cpu.getBC() & 0xFF)) + 1;
            const C = (cpu.getBC() & 0xFF00) | (result >> 8);
            cpu.setBC(C);

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

        }));
        this.opcodeList.set(0x14, new Opcode('INC', 'D', 0x14, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = ((cpu.getDE() & 0xFF00) >> 8) + 1;
            const carryPerBit = ((cpu.getDE() & 0xFF00) >> 8) + 1;
            const D = (cpu.getDE() & 0x00FF) | (result << 8);
            cpu.setDE(D);

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

        }));
        this.opcodeList.set(0x1C, new Opcode('INC', 'E', 0x1C, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = ((cpu.getDE() & 0xFF)) + 1;
            const carryPerBit = ((cpu.getDE() & 0xFF)) + 1;
            const E = (cpu.getDE() & 0xFF00) | (result >> 8);
            cpu.setDE(E);

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

        }));
        this.opcodeList.set(0x24, new Opcode('INC', 'H', 0x24, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = ((cpu.getHL() & 0xFF00) >> 8) + 1;
            const carryPerBit = ((cpu.getHL() & 0xFF00) >> 8) + 1;
            const H = (cpu.getHL() & 0x00FF) | (result << 8);
            cpu.setHL(H);

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

        }));
        this.opcodeList.set(0x2C, new Opcode('INC', 'L', 0x2C, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = ((cpu.getHL() & 0xFF)) + 1;
            const carryPerBit = ((cpu.getHL() & 0xFF)) + 1;
            const L = (cpu.getHL() & 0xFF00) | (result >> 8);
            cpu.setHL(L);

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

        }));
        this.opcodeList.set(0x03, new Opcode('INC', 'BC', 0x03, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = cpu.getBC() + 1;
            const carryPerBit = cpu.getBC() + 1;
            cpu.setBC(result);

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

        }));
        this.opcodeList.set(0x13, new Opcode('INC', 'DE', 0x13, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = cpu.getDE() + 1;
            const carryPerBit = cpu.getDE() + 1;
            cpu.setDE(result);

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

        }));
        this.opcodeList.set(0x23, new Opcode('INC', 'HL', 0x23, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = cpu.getHL() + 1;
            const carryPerBit = cpu.getHL() + 1;
            cpu.setHL(result);

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

        }));
        this.opcodeList.set(0x33, new Opcode('INC', 'SP', 0x33, 8, 1, (cpu) => {
            /* n = read(PC++)
                result, carry_per_bit = B + 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 1 if carry_per_bit[3] else 0

            */
            const result = cpu.getSP() + 1;
            const carryPerBit = cpu.getSP() + 1;
            cpu.setSP(result);

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

        }));
        this.opcodeList.set(0x3D, new Opcode('DEC', 'A', 0x3D, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                ((cpu.getA() & 0xFF00) >> 8)
                cpu.getA() & 0xFF
            */
            const result = cpu.getA() - 1;
            const carryPerBit = cpu.getA() - 1;
            cput.setA(result);

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

        }));
        this.opcodeList.set(0x05, new Opcode('DEC', 'B', 0x05, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
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

        }));
        this.opcodeList.set(0x0D, new Opcode('DEC', 'C', 0x0D, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            const result = ((cpu.getBC() & 0xFF)) - 1;
            const carryPerBit = ((cpu.getBC() & 0xFF)) - 1;
            const C = (cpu.getBC() & 0xFF00) | (result >> 8)
            cput.setBC(C);

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

        }));
        this.opcodeList.set(0x15, new Opcode('DEC', 'D', 0x15, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            const result = ((cpu.getDE() & 0xFF00) >> 8) - 1;
            const carryPerBit = ((cpu.getDE() & 0xFF00) >> 8) - 1;
            const D = (result << 8) | (cpu.getDE() & 0x00FF);
            cput.setDE(D);

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

        }));
        this.opcodeList.set(0x1D, new Opcode('DEC', 'E', 0x1D, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            const result = ((cpu.getDE() & 0xFF)) - 1;
            const carryPerBit = ((cpu.getDE() & 0xFF)) - 1;
            const E = (cpu.getDE() & 0xFF00) | (result >> 8)
            cput.setDE(E);

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

        }));
        this.opcodeList.set(0x25, new Opcode('DEC', 'H', 0x25, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            const result = ((cpu.getHL() & 0xFF00) >> 8) - 1;
            const carryPerBit = ((cpu.getHL() & 0xFF00) >> 8) - 1;
            const H = (result << 8) | (cpu.getHL() & 0x00FF);
            cput.setHL(H);

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

        }));
        this.opcodeList.set(0x2D, new Opcode('DEC', 'L', 0x2D, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
            */
            const result = ((cpu.getHL() & 0xFF)) - 1;
            const carryPerBit = ((cpu.getHL() & 0xFF)) - 1;
            const L = (cpu.getHL() & 0xFF00) | (result >> 8)
            cput.SetHL(L);

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
            const result = data - 1;
            const carryPerBit = data - 1;
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

        }));
        this.opcodeList.set(0x0B, new Opcode('DEC', 'BC', 0x0B, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                ((cpu.getA() & 0xFF00) >> 8)
                cpu.getA() & 0xFF
            */
            const result = cpu.getBC() - 1;
            const carryPerBit = cpu.getBC() - 1;
            cpu.setBC(result);

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

        }));
        this.opcodeList.set(0x1B, new Opcode('DEC', 'DE', 0x1B, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                ((cpu.getA() & 0xFF00) >> 8)
                cpu.getA() & 0xFF
            */
            const result = cpu.getDE() - 1;
            const carryPerBit = cpu.getDE() - 1;
            cpu.setDE(result);

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

        }));
        this.opcodeList.set(0x2B, new Opcode('DEC', 'HL', 0x2B, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                ((cpu.getA() & 0xFF00) >> 8)
                cpu.getA() & 0xFF
            */
            const result = cpu.getHL() - 1;
            const carryPerBit = cpu.getHL() - 1;
            cpu.setHL(result);

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

        }));
        this.opcodeList.set(0x3B, new Opcode('DEC', 'SP', 0x3B, 8, 1, (cpu) => {
            /* result, carry_per_bit = B - 1
                B = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 1
                flags.H = 1 if carry_per_bit[3] else 0
                ((cpu.getA() & 0xFF00) >> 8)
                cpu.getA() & 0xFF
            */
            const result = cpu.getSP() - 1;
            const carryPerBit = cpu.getSP() - 1;
            cpu.setSP(result);

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

        }));
        this.opcodeList.set(0xA7, new Opcode('AND', 'A', 0xA7, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
            */
            const result = cpu.getA() & ((cpu.getA()));
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA0, new Opcode('AND', 'B', 0xA0, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
            */
            const result = cpu.getA() & ((cpu.getBC() & 0xFF00) >> 8);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA1, new Opcode('AND', 'C', 0xA1, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() & (cpu.getBC() & 0xFF);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA2, new Opcode('AND', 'D', 0xA2, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() & ((cpu.getDE() & 0xFF00) >> 8);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA3, new Opcode('AND', 'E', 0xA3, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() & (cpu.getDE() & 0xFF);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA4, new Opcode('AND', 'H', 0xA4, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() & ((cpu.getHL() & 0xFF00) >> 8);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
        }));
        this.opcodeList.set(0xA5, new Opcode('AND', 'L', 0xA5, 8, 1, (cpu) => {
            /* result = A & B
                A = result
                flags.Z = 1 if result == 0 else 0
                ((cpu.getA() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF);
            */
            const result = cpu.getA() & (cpu.getHL() & 0xFF);
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);
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
            const result = cpu.getA() & data;
            cpu.setA(result);
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(1);
            cpu.setC(0);

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
        }));
        this.opcodeList.set(0xB7, new Opcode('OR', 'A', 0xB7, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
            */
            const result = cpu.getA() | ((cpu.getA()));
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
        this.opcodeList.set(0xB0, new Opcode('OR', 'B', 0xB0, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
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
        this.opcodeList.set(0xB1, new Opcode('OR', 'C', 0xB1, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
            const result = cpu.getA() | ((cpu.getBC() & 0xFF));
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
        this.opcodeList.set(0xB2, new Opcode('OR', 'D', 0xB2, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
            const result = cpu.getA() | ((cpu.getDE() & 0xFF00) >> 8);
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
        this.opcodeList.set(0xB3, new Opcode('OR', 'E', 0xB3, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
            const result = cpu.getA() | ((cpu.getDE() & 0xFF));
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
        this.opcodeList.set(0xB4, new Opcode('OR', 'H', 0xB4, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
            const result = cpu.getA() | ((cpu.getHL() & 0xFF00) >> 8);
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
        this.opcodeList.set(0xB5, new Opcode('OR', 'L', 0xB5, 8, 1, (cpu) => {
            /* result = A | B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                ((cpu.getBC() & 0xFF));
            */
            const result = cpu.getA() | ((cpu.getHL() & 0xFF));
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
        this.opcodeList.set(0xAF, new Opcode('XOR', 'A', 0xAF, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
            const result = cpu.getA() ^ (cpu.getA())
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
        this.opcodeList.set(0xA8, new Opcode('XOR', 'B', 0xA8, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
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
        this.opcodeList.set(0xA9, new Opcode('XOR', 'C', 0xA9, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
            const result = cpu.getA() ^ (cpu.getBC() & 0xFF)
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
        this.opcodeList.set(0xAA, new Opcode('XOR', 'D', 0xAA, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
            const result = cpu.getA() ^ ((cpu.getDE() & 0xFF00) >> 8);
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
        this.opcodeList.set(0xAB, new Opcode('XOR', 'E', 0xAB, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
            const result = cpu.getA() ^ (cpu.getDE() & 0xFF)
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
        this.opcodeList.set(0xAC, new Opcode('XOR', 'H', 0xAC, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
            const result = cpu.getA() ^ ((cpu.getHL() & 0xFF00) >> 8);
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
        this.opcodeList.set(0xAD, new Opcode('XOR', 'L', 0xAD, 8, 1, (cpu) => {
            /* result = A ^ B
                A = result
                flags.Z = 1 if result == 0 else 0
                flags.N = 0
                flags.H = 0
                flags.C = 0
                ((cpu.getBC() & 0xFF00) >> 8);
                (cpu.getBC() & 0xFF)
            */
            const result = cpu.getA() ^ (cpu.getHL() & 0xFF)
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
            if (result == 0) {
                cpu.setZ(1)
            } else {
                cpu.setZ(0);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);
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
        this.opcodeList.set(0xCB37, new Opcode('SWAP', 'A', 0xCB37, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getA() & 0xF0) >> 4;
            const lowerNibble = (cpu.getA() & 0x0F) << 4;

            // Combine the nibbles in reverse order
            const swapped = lowerNibble | upperNibble;
            cpu.setA(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB30, new Opcode('SWAP', 'B', 0xCB30, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getBC() & 0xF000) >> 12;
            const lowerNibble = (cpu.getBC() & 0x0FFF) << 4;

            // Combine the nibbles in reverse order
            const swapped = (lowerNibble | upperNibble);
            cpu.setBC(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB31, new Opcode('SWAP', 'C', 0xCB31, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getBC() & 0xF0) << 4;
            const lowerNibble = (cpu.getBC() & 0x0F) << 4;
            const swapped = (upperNibble | (cpu.getBC() >> 4)) | lowerNibble;
            cpu.setBC(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB32, new Opcode('SWAP', 'D', 0xCB32, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getDE() & 0xF000) >> 12;
            const lowerNibble = (cpu.getDE() & 0x0FFF) << 4;

            // Combine the nibbles in reverse order
            const swapped = (lowerNibble | upperNibble);
            cpu.setDE(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB33, new Opcode('SWAP', 'E', 0xCB33, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getDE() & 0xF0) << 4;
            const lowerNibble = (cpu.getDE() & 0x0F) << 4;
            const swapped = (upperNibble | (cpu.getDE() >> 4)) | lowerNibble;
            cpu.setDE(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB34, new Opcode('SWAP', 'H', 0xCB34, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getHL() & 0xF000) >> 12;
            const lowerNibble = (cpu.getHL() & 0x0FFF) << 4;

            // Combine the nibbles in reverse order
            const swapped = (lowerNibble | upperNibble);
            cpu.getHL(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB35, new Opcode('SWAP', 'L', 0xCB35, 16, 1, (cpu) => {
            /* 
                Swap upper & lower nibles of n
            */
            const upperNibble = (cpu.getHL() & 0xF0) << 4;
            const lowerNibble = (cpu.getHL() & 0x0F) << 4;
            const swapped = (upperNibble | (cpu.getHL() >> 4)) | lowerNibble;
            cpu.getHL(swapped);
            if (swapped === 0) {
                cpu.setZ(1);
            }

            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

        }));
        this.opcodeList.set(0xCB36, new Opcode('SWAP', 'HL', 0xCB36, 24, 1, (cpu) => {

            console.log("0CB36 not implemented.");
            cpu.setN(0);
            cpu.setH(0);
            cpu.setC(0);

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
        this.opcodeList.set(0xC3, new Opcode('JP', 'n', 0xC3, 32, 3, (cpu) => {
            /* nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
               PC = nn
            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xE9, new Opcode('JP', 'HL', 0xE9, 8, 1, (cpu) => {
            /* PC = HL
            */
            cpu.setPC(cpu.getHL());
        }));
        this.opcodeList.set(0xC2, new Opcode('JP', 'nz,nn', 0xC2, 24, 3, (cpu) => {
            /*  Jump to address n if following condition is true:
                cc = NZ, Jump if Z flag is reset.
                cc = Z, Jump if Z flag is set.
                cc = NC, Jump if C flag is reset.
                cc = C, Jump if C flag is set.

            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            if (cpu.getZ() === 0) {
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xCA, new Opcode('JP', 'z,nn', 0xCA, 24, 3, (cpu) => {
            /*  Jump to address n if following condition is true:
                cc = NZ, Jump if Z flag is reset.
                cc = Z, Jump if Z flag is set.
                cc = NC, Jump if C flag is reset.
                cc = C, Jump if C flag is set.

            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            if (cpu.getZ() === 1) {
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xD2, new Opcode('JP', 'nc,nn', 0xD2, 24, 3, (cpu) => {
            /*  Jump to address n if following condition is true:
                cc = NZ, Jump if Z flag is reset.
                cc = Z, Jump if Z flag is set.
                cc = NC, Jump if C flag is reset.
                cc = C, Jump if C flag is set.

            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            if (cpu.getC() === 0) {
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xDA, new Opcode('JP', 'c,nn', 0xDA, 24, 3, (cpu) => {
            /*  e = signed_8(read(PC++))
                PC = PC + e

            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            if (cpu.getC() === 1) {
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0x18, new Opcode('JR', 'cc,e', 0x18, 16, 2, (cpu) => {
            /*  e = signed_8(read(PC++))
                if F.check_condition(cc):
                PC = PC + e

            */
            let e = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1)

            // convert the unsigned 8-bit value to a signed 8-bit value
            if (e & 0x80) {
                e = -(~e + 1);
            }

            cpu.setPC(cpu.getPC() + e);
        }));
        this.opcodeList.set(0x20, new Opcode('JR', 'nz,e', 0x20, 16, 2, (cpu) => {
            /*  e = signed_8(read(PC++))
                if F.check_condition(cc):
                PC = PC + e

            */
            let e = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1)

            // convert the unsigned 8-bit value to a signed 8-bit value
            if (e & 0x80) {
                e = -(~e + 1);
            }
            if (cpu.getZ() === 0) {
                cpu.setPC(cpu.getPC() + e);
            }
        }));
        this.opcodeList.set(0x28, new Opcode('JR', 'z,e', 0x28, 16, 2, (cpu) => {
            /*  e = signed_8(read(PC++))
                if F.check_condition(cc):
                PC = PC + e

            */
            let e = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1)

            // convert the unsigned 8-bit value to a signed 8-bit value
            if (e & 0x80) {
                e = -(~e + 1);
            }
            if (cpu.getZ() === 1) {
                cpu.setPC(cpu.getPC() + e);
            }
        }));
        this.opcodeList.set(0x37, new Opcode('SCF', '', 0x37, 8, 2, (cpu) => {
            /* 
            Z - Not affected.
            N - Reset.
            H - Reset.
            C - Set.
            */
           
            cpu.setC(1);
            cpu.setN(0);
            cpu.setH(0);
        }));
        this.opcodeList.set(0x30, new Opcode('JR', 'nc,e', 0x30, 16, 2, (cpu) => {
            /*  e = signed_8(read(PC++))
                if F.check_condition(cc):
                PC = PC + e

            */
            let e = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1)

            // convert the unsigned 8-bit value to a signed 8-bit value
            if (e & 0x80) {
                e = -(~e + 1);
            }

            if (cpu.getC() === 0) {
                cpu.setPC(cpu.getPC() + e);
            }
        }));
        this.opcodeList.set(0x38, new Opcode('JR', 'c,e', 0x38, 16, 2, (cpu) => {
            /*  e = signed_8(read(PC++))
                if F.check_condition(cc):
                PC = PC + e

            */
            let e = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1)

            // convert the unsigned 8-bit value to a signed 8-bit value
            if (e & 0x80) {
                e = -(~e + 1);
            }

            if (cpu.getC() === 1) {
                cpu.setPC(cpu.getPC() + e);
            }
        }));
        this.opcodeList.set(0xCD, new Opcode('CALL', 'nn', 0xCD, 48, 3, (cpu) => {
            /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = nn
            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            cpu.setPC(finalValue);

        }));


        this.opcodeList.set(0xC4, new Opcode('CALL', 'nz,nn', 0xC4, 24, 3, (cpu) => {
            /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
                if F.check_condition(cc):
                    SP--
                    write(SP--, msb(PC))
                    write(SP, lsb(PC))
                    PC = nn
            */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getZ() === 0) {

                cpu.setCPUCycle(cpu.getCPUCycle() + 48);
                cpu.setSP(cpu.getSP() - 1);

                cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);

                cpu.setSP(cpu.getSP() - 1);
                cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xCC, new Opcode('CALL', 'z,nn', 0xCC, 24, 3, (cpu) => {
            /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
               if F.check_condition(cc):
                   SP--
                   write(SP--, msb(PC))
                   write(SP, lsb(PC))
                   PC = nn
           */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getZ() === 1) {

                cpu.setCPUCycle(cpu.getCPUCycle() + 48);
                cpu.setSP(cpu.getSP() - 1);

                cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);

                cpu.setSP(cpu.getSP() - 1);
                cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xD4, new Opcode('CALL', 'nc,nn', 0xD4, 24, 3, (cpu) => {
            /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
              if F.check_condition(cc):
                  SP--
                  write(SP--, msb(PC))
                  write(SP, lsb(PC))
                  PC = nn
          */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getC() === 0) {

                cpu.setCPUCycle(cpu.getCPUCycle() + 48);
                cpu.setSP(cpu.getSP() - 1);

                cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);

                cpu.setSP(cpu.getSP() - 1);
                cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xDC, new Opcode('CALL', 'c, nn', 0xDC, 24, 3, (cpu) => {
            /*  nn = unsigned_16(lsb=read(PC++), msb=read(PC++))
              if F.check_condition(cc):
                  SP--
                  write(SP--, msb(PC))
                  write(SP, lsb(PC))
                  PC = nn
          */
            const lsbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const msbValue = cpu.getPC();
            cpu.setPC(cpu.getPC() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getC() === 1) {

                cpu.setCPUCycle(cpu.getCPUCycle() + 48);
                cpu.setSP(cpu.getSP() - 1);

                cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);

                cpu.setSP(cpu.getSP() - 1);
                cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

                cpu.setPC(finalValue);
            }

        }));

        this.opcodeList.set(0xC9, new Opcode('RET', '', 0xC9, 32, 1, (cpu) => {
            /* PC = unsigned_16(lsb=read(SP++), msb=read(SP++))
          */
            const lsbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const msbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            cpu.setPC(finalValue);

        }));

        this.opcodeList.set(0xC0, new Opcode('RET', 'nz', 0xC0, 16, 1, (cpu) => {
            /* if F.check_condition(cc):
                PC = unsigned_16(lsb=read(SP++), msb=read(SP++))
          */
            const lsbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const msbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            if (cpu.getZ() === 0) {
                cpu.setCPUCycle(cpu.getCPUCycle() + 40);
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xC8, new Opcode('RET', 'z', 0xC8, 16, 1, (cpu) => {
            /* if F.check_condition(cc):
                PC = unsigned_16(lsb=read(SP++), msb=read(SP++))
          */
            const lsbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const msbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getZ() === 1) {
                cpu.setCPUCycle(cpu.getCPUCycle() + 40);
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xD0, new Opcode('RET', 'nc', 0xD0, 16, 1, (cpu) => {
            /* if F.check_condition(cc):
                PC = unsigned_16(lsb=read(SP++), msb=read(SP++))

          */
            const lsbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const msbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getC() === 0) {
                cpu.setCPUCycle(cpu.getCPUCycle() + 40);
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xD8, new Opcode('RET', 'c', 0xD8, 16, 1, (cpu) => {
            /* if F.check_condition(cc):
                PC = unsigned_16(lsb=read(SP++), msb=read(SP++))

          */
            const lsbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const msbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);
            if (cpu.getC() === 1) {
                cpu.setCPUCycle(cpu.getCPUCycle() + 40);
                cpu.setPC(finalValue);
            }

        }));
        this.opcodeList.set(0xD9, new Opcode('RST', 'n', 0xD9, 32, 1, (cpu) => {
            /* if F.check_condition(cc):
                PC = unsigned_16(lsb=read(SP++), msb=read(SP++))

          */
            const lsbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const msbValue = cpu.getSP();
            cpu.setSP(cpu.getSP() + 1)

            const finalValue = cpu.toUnsigned16Bit(lsbValue, msbValue);

            cpu.setPC(finalValue);
            cpu.setIme(1);

        }));
        this.opcodeList.set(0xC7, new Opcode('RETI', '00H', 0xC7, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x00;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xCF, new Opcode('RETI', '08H', 0xCF, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x08;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xD7, new Opcode('RETI', '10H', 0xD7, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x10;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xDF, new Opcode('RETI', '18H', 0xDF, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x18;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xE7, new Opcode('RETI', '20H', 0xE7, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x00;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xEF, new Opcode('RETI', '28H', 0xEF, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x28;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xF7, new Opcode('RETI', '30H', 0xF7, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x30;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xFF, new Opcode('RETI', '38H', 0xFF, 32, 1, (cpu) => {
            /* n = rst_address(opcode)
                SP--
                write(SP--, msb(PC))
                write(SP, lsb(PC))
                PC = unsigned_16(lsb=n, msb=0x00)
          */
            const n = 0x38;
            cpu.setSP(cpu.getSP() - 1);

            //msb
            cpu.memory[cpu.getSP()] = ((cpu.getPC() & 0xFF00) >> 8);
            cpu.setSP(cpu.getSP() - 1);

            //lsb
            cpu.memory[cpu.getSP()] = (cpu.getPC() & 0xFF);

            const msbValue = 0x00;
            const finalValue = cpu.toUnsigned16Bit(n, msbValue);

            cpu.setPC(finalValue);
        }));
        this.opcodeList.set(0xF3, new Opcode('DI', '', 0xF3, 8, 1, (cpu) => {
            /* IME = 0*/
            cpu.setIme(0);
        }));
        this.opcodeList.set(0xFB, new Opcode('EI', '', 0xFB, 8, 1, (cpu) => {
            /*IME_scheduled = true*/
            cpu.setImeScheduled(1);
        }));
        this.opcodeList.set(0x07, new Opcode('RLCA', '', 0x07, 8, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0x17, new Opcode('RLA', '', 0x17, 8, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0x0F, new Opcode('RRCA', '', 0x0F, 8, 1, (cpu) => {
            /**/
        }));    
        this.opcodeList.set(0x1F, new Opcode('RRA', '', 0x1F, 8, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0x1F, new Opcode('RLC', 'n', 0x1F, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB07, new Opcode('RLC', 'A', 0xCB07, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB00, new Opcode('RLC', 'B', 0xCB00, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB01, new Opcode('RLC', 'C', 0xCB01, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB02, new Opcode('RLC', 'D', 0xCB02, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB03, new Opcode('RLC', 'E', 0xCB03, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB04, new Opcode('RLC', 'H', 0xCB04, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB05, new Opcode('RLC', 'L', 0xCB05, 16, 1, (cpu) => {
            /**/
        }));
        this.opcodeList.set(0xCB06, new Opcode('RLC', 'HL', 0xCB06, 24, 1, (cpu) => {
            /**/
        }));
    }

    //returns the instruction which can be found by opcodeValue( decode step )
    static getInstruction(opcodeValue) {

        if (!this.opcodeList.get(opcodeValue)) {
            throw new Error("Instruction not found: ", opcodeValue);
        }
        return this.opcodeList.get(opcodeValue);


    }
    static executeInstruction(cpu, instruction) {
        cpu.setCPUCycle(cpu.getCPUCycle() + instruction.getOpcodeCycle());
        instruction.executeOn(cpu);
    }
}