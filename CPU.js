class CPU {

  constructor() {
    //Registers
    this.AF = 0; //Accumulator 8 bit and Flags 8 bit = 16 bit register
    this.BC = 0; //16 bit register
    this.DE = 0; //16 bit register
    this.HL = 0; //16 bit register
    this.SP = 0; //Stack Pointer
    this.PC = 0; //Program Counter

    //Flags
    this.Z = 0;//7.th bit of this.AF 
    this.N = 0;//6.th bit of this.AF 
    this.H = 0;//5.th bit of this.AF 
    this.C = 0;//4.th bit of this.AF 

    //Initialize all available Instructions to a Map
    InstructionSet.prepareInstructions();

    //Timers
    this.startTime = 0;
    this.currentTime = 0;
    this.elapsedTime = 0;
    this.frameCount = 0;
    this.fpsTitle = document.querySelector('.fps');

    //Cycle which is 8 since 1 Machine cycle represents 8 cycle in GameBoy Color
    this.cycle = 0;

    //DUMMY DATAS
    this.memory = new Array(1500).fill(Math.random() * window.performance.now());
    this.TEST = "LOOL";
  }
  start() {
    this.reset();
    this.startTime = window.performance.now();
    requestAnimationFrame(() => this.loop());
  }
  reset() {
    this.setPC(0x100);
    this.setSP(0xFFFE);
    this.memory[this.getPC()] = 0x30;
  }
  //@TODO cycleCount implementierung ( machine cycle und cycle ..)
  loop() {
    this.frameCount++;
    this.currentTime = window.performance.now();
    this.elapsedTime = this.currentTime - this.startTime;

    if (this.elapsedTime >= 11.72) {
      this.startTime = this.currentTime;

      this.wait();

      //Logic
      const opcode = this.fetch(this.getPC());
      const instruction = this.decode(opcode);
      this.execute(instruction);

      //Additional visual helpers
      this.fpsTitle.textContent = `FPS: ${Math.floor((this.frameCount / this.elapsedTime) * 1000)}`;
      this.frameCount = 0;
    }

    requestAnimationFrame(() => this.loop());
  }

  //The instruction cycle consists of four phases: fetching an instruction from memory and 
  fetch(pc) {

    // Every instruction needs one machine cycle for the fetch stage, and 
    //at least one machine cycle for the decode/execute stage.  1 machine cycle = 8 cycles
    this.setCPUCycle(this.getCPUCycle() + 8);
    this.setPC(pc + 1);
    return this.memory[pc];
  }
  //decoding the fetched instruction, reading the address from memory...
  decode(opcode) {
    this.setCPUCycle(this.getCPUCycle() + 8);
    //TODO - wie genau soll ich den instruction functionaufruf machen ?
    //0x30
    return InstructionSet.getInstruction(opcode);

  }
  //and finally, instruction execution. 
  execute(instruction) {
    this.setCPUCycle(this.getCPUCycle() + 8);
    InstructionSet.executeInstruction(this, instruction);
  }
  wait() {
    while (this.getCPUCycle() > 0) {
      this.setCPUCycle(this.getCPUCycle() - 1);
    }
  }

  //Cycle 
  setCPUCycle(value) {
    this.cycle = value;
  }
  getCPUCycle() {
    return this.cycle;
  }
  //Stack Pointer and Program Counter
  setPC(value) {
    this.PC = value;
  }
  getPC() {
    return this.PC;
  }

  setSP(value) {
    this.SP = value;
  }
  getSP() {
    return this.SP;
  }
  //Accumulator
  /**
  * Set the A register to the value passed in, but keep the F register the same.
  * @param {value} value - The value to set the register to.
  */
  setA(value) {
    this.AF = (this.AF & 0xFF) | (value << 8);
  }
  /**
   * It returns the value of the A register, shifted right by 8 bits
   * @returns The value of the A register as 0x00FF which comes from 0xFF00.
   */
  getA() {
    return (this.AF & 0xFF00) >> 8;
  }
  /**
   * Set the lower 8 bits of the AF register to the lower 8 bits of the value parameter.
   * @param {number} value - The value to set the register to.
   */
  setF(value) {
    this.AF = (this.AF & 0xFF00) | (value & 0xFF);
  }
  /**
   * This function returns the value of the F register.
   * @returns The lower 8 bits of the AF register as 0x00FF.
   */
  getF() {
    return (this.AF & 0xFF);
  }

  //Flags

  /**
   * This function sets the Z flag in the AF register to the value of the 7th bit of the value passed
   * to the function
   * @param {number} value - The value to set the register to in 0xFFFF format.
   */
  setZ(value) {
    this.AF = (this.AF | (value & 0x80));
  }

  /**
   * If the Z-flag is greater than 1, throw an error, otherwise return the Z-flag.
   * @returns The Z-flag is being returned which is either 1 or 0.
   */
  getZ() {
    if (this.Z > 0x01) {
      throw new Error("ERROR - Z-FLAG IS TOO LARGE!");
    }
    return this.Z;
  }

  /**
   * Set the N flag to the value of the 6th bit of the value parameter.
   * @param {number} value - The value to set the flag to which could has a mask of 0xFFFF
   */
  setN(value) {
    this.AF = (this.AF | (value & 0x40));
  }


  /**
   * If the N-flag is greater than 1, throw an error, otherwise return the N-flag.
   * @returns The N-flag is being returned which is either 1 or 0.
   */
  getN() {
    if (this.N > 0x01) {
      throw new Error("ERROR - N-FLAG IS TOO LARGE!");
    }
    return this.N;
  }
  /**
   * Set the H flag to the value of the 5th bit of the value parameter.
   * @param {number} value - The value to set the H flag to.
   */
  setH(value) {
    this.AF = (this.AF | (value & 0x20));
  }

  /**
   * If the H-flag is greater than 1, throw an error, otherwise return the H-flag.
   * @returns The H-flag is being returned which is either 1 or 0.
   */
  getH() {
    if (this.H > 0x01) {
      throw new Error("ERROR - H-FLAG IS TOO LARGE!");
    }
    return this.H;
  }
  /**
   * The function sets the C flag in the AF register to the value of the 4th bit of the value parameter
   * @param {number} value - The value to set the flag to.
   */
  setC(value) {
    this.C = (this.AF | (value & 0x10));
  }
  /**
   * If the C-flag is greater than 1, throw an error, otherwise return the C-flag.
   * @returns The C-flag is being returned which is either 1 or 0.
   */
  getC() {
    if (this.C > 0x01) {
      throw new Error("ERROR - C-FLAG IS TOO LARGE!");
    }
    return this.C;
  }

  //Register  BC, DE and HL
  setBC(value) {
    this.BC = value;
  }
  getBC() {
    return this.BC;
  }
  setDE(value) {
    this.DE = value;
  }
  getDE() {
    return this.DE;
  }
  setHL(value) {
    this.HL = value;
  }
  getHL() {
    return this.HL;
  }
  toUnsigned16Bit(LSBValue, MSBValue) {
    /*
      MostSignificantValue = 0x20;
      LeastSignificantValue = 0xC5;
      result = 0x20C5 
    */
    return (MSBValue << 8) | LSBValue;

  }
}