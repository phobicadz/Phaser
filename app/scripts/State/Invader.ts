module Bellend {
    export class invader  {

        static invader:string[] = [
        "0", "1", "1", "1", "0",
        "1", "0", "1", "0", "1",
        "1", "0", "1", "0", "1",
        "1", "1", "1", "1", "1",
        "1", "0", "1", "0", "1" ];

        static g_noise:number = 0xDEADBABE;

        static gameRef:Phaser.Game;

        constuctor() {         
         }

        static createInvader(id:number) {
            var invaderSeed = invader.g_noise;  
            var i:number;
            var x:number;
            var y:number;

            for (i=0; i<5*5; i++)
                    this.invader[i] = "0";
        
            for (y=0; y<5; y++) {
                    for (x=0; x<5; x++) {
                            if (x < 3) {
                                    // left side randomness
                                    this.invader[ x + y*5 ] = (this.myRand() & 0x1).toString();
                            } else {
                                    // right side symmetry
                                    this.invader[ x + y*5 ] = this.invader[ (4-x) + y*5 ];
                            }
                    }
            }
            // need to convert it to correct format so we can create a texture from it....
            var colour:string = invader.gameRef.rnd.between(0, 15).toString(16).toUpperCase(); // converts int to hex
            var spritearray:string[] = [];
            for(i=0; i<5; i++) {
                var line:string="";
                for(x=0; x<5;x++) {
                    if(this.invader[i*5+x] == "0") line+="."; else line+= colour
                }
                spritearray.push(line);
            }
            // return the texture to use as a sprite
            // key has to be unique (obvious when you think about it)
            return invader.gameRef.create.texture('invader'+id,spritearray,4,4,0);
        }

        static myRand()  {
            var taps:number = 0x80306031;
            var l:number = this.g_noise;

            if (l & 0x1)    l = (1 << 31) | ((l ^ taps) >> 1);
                    else  l = (l >> 1);
            this.g_noise = l;
            return l;
        }
    }

}