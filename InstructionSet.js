class InstructionSet{
    constructor(opcode){
        this.opcode = opcode;
        this.opcodeList = new Map();
        this.prepareInstructions();
       
    }
    //TODO - wie genau soll ich den funktionsaufruf machen ? ich bräcuhte zugänge von ausen wie memory oder register. ich kann dsas aber nicht in dieser klasse tun!
    getInstruction(opcodeValue){
        switch(opcodeValue){
            case 0x30:{
                console.log("ES KLAPPT.");
                break;
            }
            default:{
                console.log("OPCODE NOT FOUND or is undefined!",opcodeValue);
            }
        }
    }
    prepareInstructions(){
        this.opcodeList.set(0x30, new Opcode('LD','B,n',0x30,8),{
            
        });
        this.opcodeList.set(0x0E, new Opcode('LD','B,n',0x0E,8),{

        });
    }
}