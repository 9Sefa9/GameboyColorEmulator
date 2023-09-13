class CPU {

  constructor() {
    //Registers
    this.BC = 0; //16 bit register
    this.DE = 0; //16 bit register
    this.HL = 0; //16 bit register
    this.SP = 0; //16 bit register - Stack Pointer
    this.PC = 0; //16 bit register - Program Counter
    this.i = 0;
    this.AF = 0; //Accumulator 8 bit and Flags 8 bit = 16 bit register
    this.log = "";
    //Flags 
    // 7 6 5 4 3 2 1 0
    // Z N H C 0 0 0 0

    // Zero Flag (Z):
    // This bit is set when the result of a math operation
    // is zero or two values match when using the CP
    // instruction.

    // Subtract Flag (N):
    // This bit is set if a subtraction was performed in the
    // last math instruction.

    // Half Carry Flag (H):
    // This bit is set if a carry occurred from the lower
    // nibble in the last math operation.

    // Carry Flag (C):
    // This bit is set if a carry occurred from the last
    // math operation or if register A is the smaller value
    // when executing the CP instruction.

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

    //Interrupt handling ( To do )
    this.ime = 0;
    this.imeScheduled = 0;

    //DUMMY DATAS
    this.memory = null;
  }
  start() {
    document.getElementById("rom").addEventListener('mouseover', (event) => {
      const file = event.target.files[0]; // get the selected file
      const reader = new FileReader(); // create a new FileReader object

      reader.onload = (e) => { // define the onload event handler
        const arrayBuffer = e.target.result; // get the contents of the file as an ArrayBuffer
        const rom = new Uint8Array(arrayBuffer); // create a new Uint8Array from the ArrayBuffer
        this.memory = new MBC1(rom, 0xFFFF);

        this.startTime = window.performance.now();
        this.raf = requestAnimationFrame(() => this.loop());
      };
      reader.readAsArrayBuffer(file); // read the file as an ArrayBuffer
      this.reset();
    });
    document.getElementsByClassName("fps")[0].addEventListener('mousedown', (event) => {
      this.startTime = window.performance.now();
      this.raf = requestAnimationFrame(() => this.loop());
    });
  }
  reset() {

    // this.setPC(0x0208);
    // this.setAF(0x0010)
    // this.setBC(0x0108);
    // this.setDE(0xC818);
    // this.setHL(0x4819);
    // this.setSP(0xFFFE);

    this.setPC(0x0100);
    this.setA(0x01);
    this.setBC(0x0013);
    this.setDE(0x00D8);
    this.setHL(0x014D);
    this.setSP(0xFFFE);

    this.setZFlag(1);
    this.setHFlag(1);
    this.setCFlag(1);
  }
  //@TODO cycleCount implementierung ( machine cycle und cycle ..)
  loop() {

    this.frameCount++;
    this.currentTime = window.performance.now();
    this.elapsedTime = this.currentTime - this.startTime;

    if (this.elapsedTime >= 11.72) {
      this.stopLoop();
      this.startTime = this.currentTime;

      this.wait();
      const opcode = this.fetch();
      const instruction = this.decode(opcode);

      this.log += (
        "A:" + this.getA().toString(16).padStart(2, "0").toUpperCase() +
        " F:" + this.getF().toString(16).padStart(2, "0").toUpperCase() +
        " B:" + this.getB().toString(16).padStart(2, "0").toUpperCase() +
        " C:" + this.getC().toString(16).padStart(2, "0").toUpperCase() +
        " D:" + this.getD().toString(16).padStart(2, "0").toUpperCase() +
        " E:" + this.getE().toString(16).padStart(2, "0").toUpperCase() +
        " H:" + ((this.getHL() >> 8) & 0xFF).toString(16).padStart(2, "0").toUpperCase() +
        " L:" + this.getL().toString(16).padStart(2, "0").toUpperCase() +
        " SP:" + this.getSP().toString(16).padStart(4, "0").toUpperCase() +
        " PC:" + this.getPC().toString(16).padStart(4, "0").toUpperCase() +
        " PCMEM:" + this.memory.readByte(this.getPC()).toString(16).padStart(2, "0").toUpperCase() +
        "," + this.memory.readByte(this.getPC() + 1)?.toString(16).padStart(2, "0").toUpperCase() +
        "," + this.memory.readByte(this.getPC() + 2)?.toString(16).padStart(2, "0").toUpperCase() +
        "," + this.memory.readByte(this.getPC() + 3)?.toString(16).padStart(2, "0").toUpperCase()
      ) + "\n";

      if (this.i >= 16400) {
        console.log(
          "INDEX: " + this.i +
          "A:" + this.getA().toString(16).padStart(2, "0").toUpperCase() +
          " F:" + this.getF().toString(16).padStart(2, "0").toUpperCase() +
          " B:" + this.getB().toString(16).padStart(2, "0").toUpperCase() +
          " C:" + this.getC().toString(16).padStart(2, "0").toUpperCase() +
          " D:" + this.getD().toString(16).padStart(2, "0").toUpperCase() +
          " E:" + this.getE().toString(16).padStart(2, "0").toUpperCase() +
          " H:" + ((this.getHL() >> 8) & 0xFF).toString(16).padStart(2, "0").toUpperCase() +
          " L:" + this.getL().toString(16).padStart(2, "0").toUpperCase() +
          " SP:" + this.getSP().toString(16).padStart(4, "0").toUpperCase() +
          " PC:" + this.getPC().toString(16).padStart(4, "0").toUpperCase() +
          " PCMEM:" + this.memory.readByte(this.getPC()).toString(16).padStart(2, "0").toUpperCase() +
          "," + this.memory.readByte(this.getPC() + 1)?.toString(16).padStart(2, "0").toUpperCase() +
          "," + this.memory.readByte(this.getPC() + 2)?.toString(16).padStart(2, "0").toUpperCase() +
          "," + this.memory.readByte(this.getPC() + 3)?.toString(16).padStart(2, "0").toUpperCase()
        );
      }
      this.PC+=1;
      this.execute(instruction);


      //Additional visual helpers
      this.fpsTitle.textContent = `FPS: ${Math.floor((this.frameCount / this.elapsedTime) * 1000)}`;
      this.frameCount = 0;

    }

    this.raf = requestAnimationFrame(() => this.loop());
  }
  stopLoop() {
    this.fpsTitle.addEventListener('mouseover', () => {
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
        this.raf = undefined;
        fetch('http://localhost:3000/logs', {
          method: 'POST',
          body: JSON.stringify({
            message: this.log
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

    });
  }
  //The instruction cycle consists of four phases: fetching an instruction from memory and 
  fetch() {

    // Every instruction needs one machine cycle for the fetch stage, and 
    //at least one machine cycle for the decode/execute stage.  1 machine cycle = 8 cycles
    this.cycle += 8;
    let currentMemoryData = this.memory.readByte(this.PC);

    // For Blargs CPU test ( without ppu )
    if (this.memory.readByte(0xFF02) === 0x81) {
      let c = this.memory.readByte(0xFF01);
      console.log("RESULTS-----------------------------------------------------------------------------------------------:");
      console.log(c);
      this.memory.writeByte(0xFF02, 0x0);
    }

    if (currentMemoryData === 0xCB) {
      this.PC += 1;
      currentMemoryData = (currentMemoryData & 0xFF00) | (this.memory.readByte(this.getPC()) & 0xFF);
    }

    return currentMemoryData;
  }
  //decoding the fetched instruction, reading the address from memory...
  decode(opcode) {

    this.increaseCPUCycle(8);
    return InstructionSet.getInstruction(opcode);

  }
  //and finally, instruction execution. 
  execute(instruction) {
    this.increaseCPUCycle(8);
    InstructionSet.executeInstruction(this, instruction);
  }
  wait() {
   // let currentCPUCycle = this.getCPUCycle();
    while (this.getCPUCycle() > 0) {
      this.decreaseCPUCycle(1);
    }
  }
  //Interrupts
  setIme(value) {
    this.ime = value;
  }
  setImeScheduled(value) {
    this.imeScheduled = value;
  }
  //Cycle 
  setCPUCycle(value) {
    this.cycle = value;
  }
  getCPUCycle() {
    return this.cycle;
  }
  decreaseCPUCycle(value) {
    this.cycle = this.cycle - value;
  }
  increaseCPUCycle(value) {
    this.cycle = this.cycle + value;
  }
  //Stack Pointer and Program Counter
  setPC(value) {
    this.PC = value;
  }
  getPC() {
    return this.PC;
  }
  decreasePC(value) {
    this.PC = this.PC - value;
  }
  increasePC(value) {
    this.PC = this.PC + value;
  }
  setSP(value) {
    this.SP = value;
  }
  getSP() {
    return this.SP;
  }
  decreaseSP(value) {
    this.SP = this.SP - value;
  }
  increaseSP(value) {
    this.SP = this.SP + value;
  }
  //Accumulator
  setAF(value) {
    this.AF = value;
  }
  getAF() {
    return this.AF;
  }
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
  setZFlag(value) {
    if (value !== 0) {
      // Set Z flag to 1 by setting the 7th bit of F
      this.setF(this.getF() | 0x80);
    } else {
      // Clear Z flag to 0 by clearing the 7th bit of F
      this.setF(this.getF() & 0x7F);
    }
  }

  getZFlag() {
    return (this.getF() & 0x80) >> 7;
  }

  setNFlag(value) {
    if (value !== 0) {
      // Set N flag to 1 by setting the 6th bit of F
      this.setF(this.getF() | 0x40);
    } else {
      // Clear N flag to 0 by clearing the 6th bit of F
      this.setF(this.getF() & 0xBF);
    }
  }

  getNFlag() {
    return (this.getF() & 0x40) >> 6;
  }

  setHFlag(value) {
    if (value !== 0) {
      // Set H flag to 1 by setting the 5th bit of F
      this.setF(this.getF() | 0x20);
    } else {
      // Clear H flag to 0 by clearing the 5th bit of F
      this.setF(this.getF() & 0xDF);
    }
  }

  getHFlag() {
    return (this.getF() & 0x20) >> 5;
  }

  setCFlag(value) {
    if (value !== 0) {
      // Set C flag to 1 by setting the 4th bit of F
      this.setF(this.getF() | 0x10);
    } else {
      // Clear C flag to 0 by clearing the 4th bit of F
      this.setF(this.getF() & 0xEF);
    }
  }

  getCFlag() {
    return (this.getF() & 0x10) >> 4;
  }

  //Register  BC, DE and HL
  setBC(value) {
    this.BC = value;
  }
  setC(value) {
    // Clear the lower 8 bits (LSB) of the BC register and set them to the new C value
    this.setBC((this.getBC() & 0xFF00) | (value & 0xFF));
  }
  getBC() {
    return this.BC;
  }
  getB() {
    return (this.getBC() >> 8) & 0xFF; // Extract B register value
  }

  getC() {
    // Return the lower 8 bits (LSB) of the BC register, which represent the C register
    return this.getBC() & 0xFF;
  }
  setDE(value) {
    this.DE = value;
  }
  getDE() {
    return this.DE;
  }
  getE() {
    return this.DE & 0xFF; // Extract E register value
  }
  getD() {
    return (this.DE >> 8) & 0xFF; // Extract D register value
  }
  setE(value) {
    this.DE = (this.DE & 0xFF00) | (value & 0xFF);
  }
  setD(value) {
    this.DE = (this.DE & 0xFF) | (value << 8);
  }
  setHL(value) {
    this.HL = value;
  }
  getH() {
    return (this.HL >> 8) & 0xFF; // Extract H register value
  }
  getL() {
    return this.HL & 0xFF; // Extract L register value
  }
  getHL() {
    return this.HL;
  }
  toUnsigned16Bit(LSBValue, MSBValue) {
    return (MSBValue << 8) | LSBValue;
  }
}