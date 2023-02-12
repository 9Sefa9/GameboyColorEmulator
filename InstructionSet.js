class InstructionSet extends CPU {
    static opcodeList = new Map();

    static prepareInstructions() {
        this.opcodeList.set(0x41, new Opcode('LD', 'B,C', 0x41, 8, (cpu) => {
           
            const bPart = (cpu.getBC() & 0xFF00);
            const cPart = (cpu.getBC() & 0x00FF);
            const result = (cPart | bPart);
            cpu.setBC(result);
        }));
        //TODO
        this.opcodeList.set(0x06, new Opcode('LD', 'B,n', 0x06, 8, (cpu) => {
            const memoryValue = cpu.memory[cpu.getPC()];
            const result = | memoryValue
            this.setPC(pc + 1);
            cpu.setBC(memoryValue);
        }));
        this.opcodeList.set(0x46, new Opcode('LD', 'B,n', 0x46, 8, (cpu) => {
            //const memoryValue = cpu.memory[cpu.getHL()];
          //  this.setPC(pc + 1);
           // cpu.setBC(memoryValue);
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