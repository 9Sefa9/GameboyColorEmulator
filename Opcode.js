class Opcode {
    constructor(instruction, parameters, opcode, opcodeCycle, len, logic) {
        this.instruction = instruction;
        this.parameters = parameters;
        this.opcode = opcode;
        this.opcodeCycle = opcodeCycle;
        this.len = len;
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
    setLen(value){
        this.len = value;
    }
    getLen(){
        return this.len;
    }
    executeOn(cpu){
        this.logic(cpu);
    }

}