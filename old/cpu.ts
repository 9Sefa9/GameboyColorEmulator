type Register = number;

export default class cpu {
  private AF: Register; //Accumulator and Flags
  private BC: Register;
  private DE: Register;
  private HL: Register;
  private PC: Register; //Program Counter
  private SP: Register; //Stack Pointer

  //Flags
  private Z: number;
  private N: number;
  private H: number;
  private C: number;

  //Times
  private startTime:number;
  private currentTime:number;
  private elapsedTime:number;
  constructor() {
    this.AF = 0;
    this.BC = 0;
    this.DE = 0;
    this.HL = 0;
    this.SP = 0;
    this.PC = 0;

    //Flags
    this.Z = 0;
    this.N = 0;
    this.H = 0;
    this.C = 0;


    //Timers
    this.startTime = performance.now();
    this.currentTime = 0;
    this.elapsedTime = 0;

    requestAnimationFrame(this.cycle);
  }

  cycle() {
    this.currentTime = performance.now();
    this.elapsedTime = this.currentTime - this.startTime;
  
    if (this.elapsedTime >= 11.72) {
      this.startTime = this.currentTime;
        

    }
  
    requestAnimationFrame(this.cycle);
  }
  
 
  fetch() {
    //The instruction cycle consists of four phases: fetching an instruction from memory...
  }
  decode() {
    //decoding the fetched instruction, reading the address from memory...
  }
  execute() {
    //and finally, instruction execution. 
  }

  //Accumulator and flags
  /**
  * Set the A register to the value passed in, but keep the F register the same.
  * @param {number} value - The value to set the register to.
  */
  setA(value: number): void {
    this.AF = (this.AF & 0xFF) | (value << 8);
  }
 /**
  * It returns the value of the A register, shifted right by 8 bits
  * @returns The value of the A register as 0x00FF which comes from 0xFF00.
  */
  getA(): number {
    return (this.AF & 0xFF00) >> 8;
  }
  /**
   * Set the lower 8 bits of the AF register to the lower 8 bits of the value parameter.
   * @param {number} value - The value to set the register to.
   */
  setF(value: number): void {
    this.AF = (this.AF & 0xFF00) | (value & 0xFF);
  }
 /**
  * This function returns the value of the F register.
  * @returns The lower 8 bits of the AF register as 0x00FF.
  */
  getF(): number {
    return (this.AF & 0xFF);
  }
  /**
   * This function sets the Z flag in the AF register to the value of the 7th bit of the value passed
   * to the function
   * @param {number} value - The value to set the register to in 0xFFFF format.
   */
  setZ(value: number): void {
    this.AF = (this.AF | (value & 0x80));
  }
  
  /**
   * If the Z-flag is greater than 1, throw an error, otherwise return the Z-flag.
   * @returns The Z-flag is being returned which is either 1 or 0.
   */
  getZ(): number {
    if(this.Z > 0x01){
      throw new Error("ERROR - Z-FLAG IS TOO LARGE!");
    }
    return this.Z;
  }

  /**
   * Set the N flag to the value of the 6th bit of the value parameter.
   * @param {number} value - The value to set the flag to which could has a mask of 0xFFFF
   */
  setN(value: number): void {
    this.AF = (this.AF | (value & 0x40));
  }
  
 
  /**
   * If the N-flag is greater than 1, throw an error, otherwise return the N-flag.
   * @returns The N-flag is being returned which is either 1 or 0.
   */
  getN(): number {
    if(this.N > 0x01){
      throw new Error("ERROR - N-FLAG IS TOO LARGE!");
    }
    return this.N;
  }
 /**
  * Set the H flag to the value of the 5th bit of the value parameter.
  * @param {number} value - The value to set the H flag to.
  */
  setH(value: number): void {
    this.AF = (this.AF | (value & 0x20));
  }
  
  /**
   * If the H-flag is greater than 1, throw an error, otherwise return the H-flag.
   * @returns The H-flag is being returned which is either 1 or 0.
   */
  getH(): number {
    if(this.H > 0x01){
      throw new Error("ERROR - H-FLAG IS TOO LARGE!");
    }
    return this.H;
  }
 /**
  * The function sets the C flag in the AF register to the value of the 4th bit of the value parameter
  * @param {number} value - The value to set the flag to.
  */
  setC(value: number): void {
    this.C = (this.AF | (value & 0x10));
  }
  /**
   * If the C-flag is greater than 1, throw an error, otherwise return the C-flag.
   * @returns The C-flag is being returned which is either 1 or 0.
   */
  getC(): number {
    if(this.C > 0x01){
      throw new Error("ERROR - C-FLAG IS TOO LARGE!");
    }
    return this.C;
  }
}