class InstructionSet extends CPU {
    static opcodeList = new Map();

    static prepareInstructions() {

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

        Continue with Page 69






























        this.opcodeList.set(0x40, new Opcode('LD', 'B,B', 0x40, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];
            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x41, new Opcode('LD', 'B,C', 0x41, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x42, new Opcode('LD', 'B,D', 0x42, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x43, new Opcode('LD', 'B,E', 0x43, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x44, new Opcode('LD', 'B,H', 0x44, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x45, new Opcode('LD', 'B,L', 0x45, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));
        this.opcodeList.set(0x46, new Opcode('LD', 'B,(HL)', 0x46, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];

            cpu.setBC((cpu.getBC() & 0x00FF) | value << 8);
        }));


        this.opcodeList.set(0x40, new Opcode('LD', 'C,B', 0x40, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x41, new Opcode('LD', 'C,C', 0x41, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x42, new Opcode('LD', 'C,D', 0x42, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x43, new Opcode('LD', 'C,E', 0x43, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x44, new Opcode('LD', 'C,H', 0x44, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x45, new Opcode('LD', 'C,L', 0x45, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));
        this.opcodeList.set(0x46, new Opcode('LD', 'C,(HL)', 0x46, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setBC((cpu.getBC() & 0xFF00) | value);
        }));




        this.opcodeList.set(0x50, new Opcode('LD', 'D,B', 0x50, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x51, new Opcode('LD', 'D,C', 0x51, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x52, new Opcode('LD', 'D,D', 0x52, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x53, new Opcode('LD', 'D,E', 0x53, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x54, new Opcode('LD', 'D,H', 0x54, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x55, new Opcode('LD', 'D,L', 0x55, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x56, new Opcode('LD', 'D,(HL)', 0x56, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setDE((cpu.getDE() & 0x00FF) | (value << 8));
        }));



        this.opcodeList.set(0x58, new Opcode('LD', 'E,B', 0x58, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x59, new Opcode('LD', 'E,C', 0x59, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5A, new Opcode('LD', 'E,D', 0x5A, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5B, new Opcode('LD', 'E,E', 0x5B, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5C, new Opcode('LD', 'E,H', 0x5C, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5D, new Opcode('LD', 'E,L', 0x5D, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x5E, new Opcode('LD', 'E,(HL)', 0x5E, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setDE((cpu.getDE() & 0xFF00) | (value));
        }));



        this.opcodeList.set(0x60, new Opcode('LD', 'H,B', 0x60, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x61, new Opcode('LD', 'H,C', 0x61, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x62, new Opcode('LD', 'H,D', 0x62, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x63, new Opcode('LD', 'H,E', 0x63, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x64, new Opcode('LD', 'H,H', 0x64, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x65, new Opcode('LD', 'H,L', 0x65, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));
        this.opcodeList.set(0x66, new Opcode('LD', 'H,(HL)', 0x66, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setHL((cpu.getHL() & 0x00FF) | (value << 8));
        }));




        this.opcodeList.set(0x68, new Opcode('LD', 'L,B', 0x68, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x69, new Opcode('LD', 'L,C', 0x69, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6A, new Opcode('LD', 'L,D', 0x6A, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6B, new Opcode('LD', 'L,E', 0x6B, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6C, new Opcode('LD', 'L,H', 0x6C, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6D, new Opcode('LD', 'L,L', 0x6D, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));
        this.opcodeList.set(0x6E, new Opcode('LD', 'L,(HL)', 0x6E, 8, 1, (cpu) => {

            const value = cpu.memory[cpu.getHL()];
            cpu.setHL((cpu.getHL() & 0xFF00) | (value));
        }));



        this.opcodeList.set(0x70, new Opcode('LD', '(HL),B', 0x70, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getBC() & 0xFF00) >> 8)];

            cpu.setHL(value);
        }));
        this.opcodeList.set(0x71, new Opcode('LD', '(HL),C', 0x71, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getBC() & 0xFF)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x72, new Opcode('LD', '(HL),D', 0x72, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getDE() & 0xFF00) >> 8)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x73, new Opcode('LD', '(HL),E', 0x73, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getDE() & 0xFF)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x74, new Opcode('LD', '(HL),H', 0x74, 8, 1, (cpu) => {

            const value = cpu.memory[((cpu.getHL() & 0xFF00) >> 8)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x75, new Opcode('LD', '(HL),L', 0x75, 8, 1, (cpu) => {

            const value = cpu.memory[(cpu.getHL() & 0xFF)];
            cpu.setHL(value);
        }));
        this.opcodeList.set(0x36, new Opcode('LD', '(HL),n', 0x36, 24, 2, (cpu) => {
            // write(HL, n)
            const n = cpu.memory[cpu.getPC()];
            cpu.setPC(cpu.getPC() + 1);
            cpu.memory[cpu.getHL()] = n;
        }));

        //CONTINUE HERE!

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
        this.opcodeList.set(0x46, new Opcode('LD', 'r,(HL)', 0x46, 16, 1, (cpu) => {
            const memoryValue = cpu.memory[cpu.getHL()];
            const result = (cpu.getBC() & 0x00FF) | (memoryValue << 8)
            cpu.setBC(result);
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
        this.opcodeList.set(0xF3, new Opcode('DI', '', 0xF3, 8, 1, (cpu) => {
            /*IME_scheduled = true*/
            cpu.setImeScheduled(1);
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