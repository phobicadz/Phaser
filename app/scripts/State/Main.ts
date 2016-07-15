module Bellend.State {
  export class Main extends Phaser.State {
    left:Phaser.Key;
    right:Phaser.Key;
    paddle:Phaser.Sprite;
    bricks:Phaser.Group;
    ball:Phaser.Sprite;

    invaderSeed:number = 0;
    invader:string[] = [
        "0", "1", "1", "1", "0",
        "1", "0", "1", "0", "1",
        "1", "0", "1", "0", "1",
        "1", "1", "1", "1", "1",
        "1", "0", "1", "0", "1" ];
    g_noise:number = 0xDEADBABE;

    dudeData:string[] = [
        '.......3.....',
        '......333....',
        '....5343335..',
        '...332333333.',
        '..33333333333',
        '..37773337773',
        '..38587778583',
        '..38588888583',
        '..37888888873',
        '...333333333.',
        '.F....5556...',
        '3E34.6757.6..',
        '.E.55.666.5..',
        '......777.5..',
        '.....6..7....',
        '.....7..7....'
    ];

    create() {
        this.stage.backgroundColor = 0xFFFFFF;    
        // Create game objects here
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.enableBody=true;
        this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        // Add the paddle at the bottom of the screen
        this.paddle = this.add.sprite(200, 400, 'paddle');
        // Make sure the paddle won't move when it hits the ball
        this.paddle.body.immovable = true;
        this.bricks = this.add.group();

        // Add 25 bricks to the group (5 columns and 5 lines)
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                // Create the brick at the correct position
                var brick = this.add.sprite(55+i*60, 55+j*35, this.createInvader(i*5+j));
                // Make sure the brick won't move when the ball hits it
                brick.body.immovable = true;
                // Add the brick to the group
                this.bricks.add(brick);
            }
        }

        // Add the ball 
        this.ball = this.add.sprite(200, 300, 'ball');  
        // Give the ball some initial speed
        this.ball.body.velocity.x = 200;
        this.ball.body.velocity.y = 200;

        // Make sure the ball will bounce when hitting something
        this.ball.body.bounce.setTo(1); 
        this.ball.body.collideWorldBounds = true;

        // create some bubbles!
        //this.createBubbles();
    }

    update() {
      if (this.left.isDown) {
          this.paddle.body.velocity.x = -300; }
      else if (this.right.isDown) {
          this.paddle.body.velocity.x = 300; }
      // Stop the paddle when no key is pressed
      else {
          this.paddle.body.velocity.x = 0; } 
       // Add collisions between the paddle and the ball
      this.physics.arcade.collide(this.paddle, this.ball);
      // Call the 'hit' function when the ball hits a brick
      this.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);

      // Restart the game if the ball is below the paddle
      if(this.ball.y > this.paddle.y) {
         this.game.state.start('main');  
      }
  }

  createBubbles() {
        var delay = 0;
        for (var i = 0; i < 40; i++) {
            var sprite = this.add.sprite(-100 + (this.world.randomX), 600, 'bubble');
            sprite.scale.set(this.rnd.realInRange(0.1, 0.6));
            var speed = this.rnd.between(4000, 6000);
            this.add.tween(sprite).to({ y: -256 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
            delay += 200;
        }
  }

  hit(ball,brick) {
      brick.kill();
    }

  createInvader(id:number) {
        var invaderSeed = this.g_noise;  
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
        var colour:string = this.rnd.between(0, 15).toString(16).toUpperCase();
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
        return this.game.create.texture('invader'+id,spritearray,5,5,0);
    }

    myRand()  {
        var taps:number = 0x80306031;
        var l:number = this.g_noise;

        if (l & 0x1)    l = (1 << 31) | ((l ^ taps) >> 1);
                else  l = (l >> 1);
        this.g_noise = l;
        return l;
    }


  }
}