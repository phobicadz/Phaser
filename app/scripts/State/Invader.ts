namespace Bellend.invader {
   // use namespace instead of creating a singleton class
        let invader:string[] = [
            "0", "1", "1", "1", "0",
            "1", "0", "1", "0", "1",
            "1", "0", "1", "0", "1",
            "1", "1", "1", "1", "1",
            "1", "0", "1", "0", "1" ];
        let g_noise:number = 0xDEADBABE;

        export function createInvader(id:number,gameRef:Phaser.Game):PIXI.Texture {
            let invaderSeed = g_noise;  
            let i:number;
            let x:number;
            let y:number;

            for (i=0; i<5*5; i++)
                    invader[i] = "0";
            for (y=0; y<5; y++) {
                    for (x=0; x<5; x++) {
                            if (x < 3) {
                                    // left side randomness
                                    invader[x + y*5] = (myRand() & 0x1).toString();
                            } else {
                                    // right side symmetry
                                    invader[x + y*5] = invader[(4-x) + y*5];
                            }
                    }
            }
            // need to convert it to correct format so we can create a texture from it....
            let colour:string = gameRef.rnd.between(0, 15).toString(16).toUpperCase(); // converts int to hex
            let spritearray:string[] = [];
            for(i=0; i<5; i++) {
                let line:string="";
                for(x=0; x<5;x++) {
                    if(invader[i*5+x] == "0") line+="."; else line+= colour
                }
                spritearray.push(line);
            }
            // return the texture to use as a sprite
            // key has to be unique (obvious when you think about it)
            return gameRef.create.texture('invader'+id,spritearray,4,4,0);
        }

        function myRand(): number  {
            let taps:number = 0x80306031;
            let l:number = g_noise;

            if (l & 0x1)    l = (1 << 31) | ((l ^ taps) >> 1);
                    else  l = (l >> 1);
            g_noise = l;
            return l;
        }
    }