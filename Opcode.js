class Opcode {
    constructor(instruction, parameters, opcode, opcodeCycle, logic) {
        this.instruction = instruction;
        this.parameters = parameters;
        this.opcode = opcode;
        this.opcodeCycle = opcodeCycle;
        this.logic = logic;
    }
    
    getInstruction() {
        return this.instruction;
    }

    setInstruction(value) {
        this.instruction = value;
    }

    getParameters() {
        return this.parameters;
    }

    setParameters(value) {
        this.parameters = value;
    }

    getOpcode() {
        return this.opcode;
    }

    setOpcode(value) {
        this.opcode = value;
    }

    getOpcodeCycle() {
        return this.opcodeCycle;
    }

    setOpcodeCycle(value) {
        this.opcodeCycle = value;
    }
    executeOn(cpu){
        this.logic(cpu);
    }

}