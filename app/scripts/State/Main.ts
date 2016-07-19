module Bellend.State {
  export class Main extends Phaser.State {
    left:Phaser.Key;
    right:Phaser.Key;
    fireButton:Phaser.Key;
    paddle:Phaser.Sprite;
    invaders:Phaser.Group;
    ball:Phaser.Sprite;
    bullets:Phaser.Group;
    bullet:Phaser.Sprite;
    bulletTime:number = 0;
    ship:Phaser.Sprite;

    create() {
        this.stage.backgroundColor = 0xFFFFFF;    
        // Create game objects here
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.enableBody=true;
        this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);    
        this.ship = this.add.sprite(320, 300, 'ship');
        this.game.physics.arcade.enable(this.ship);
  
        // create the random invaders!     
        this.createInvaders();
     
        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
    }

    update() {
        this.ship.body.velocity.x = 0;

        if (this.left.isDown)
        {
            this.ship.body.velocity.x = -200;
        }
        else if (this.right.isDown)
        {
            this.ship.body.velocity.x = 200;
        }
        if (this.fireButton.isDown)
        {
            this.fireBullet();
        }

        this.game.physics.arcade.overlap(this.bullets, this.invaders, this.collisionHandler, null, this);  
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

  createInvaders() {
        // Add 25 invaders to the group (5 columns and 5 lines)
        this.invaders = this.add.group();

        for (let i = 0; i < 5; i++) {
            let inv:PIXI.Texture = invader.createInvader(i,this.game)
            for (let j = 0; j < 10; j++) {
                // Create the invader at the correct position
                let invader = this.add.sprite(55+j*60, 55+i*35, inv);
                // Make sure the invader won't move when the bullet hits it
                invader.body.immovable = true;         

               invader.anchor.setTo(0.5,0.5);
            //    invader.animations.add('fly',[0,1,2,3],20,true);
             //   invader.play('fly');

                // Add the invader to the group
                this.invaders.add(invader);
            }
        }

        let tween = this.game.add.tween(this.invaders).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        tween.onRepeat.add(() => { this.invaders.y+=5 },this);
  }

  
  fireBullet () {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime)
    {
        //  Grab the first bullet we can from the pool
        this.bullet = this.bullets.getFirstExists(false);

        if (this.bullet)
        {
            //  And fire it
            this.bullet.reset(this.ship.x, this.ship.y + 8);
            this.bullet.body.velocity.y = -400;
            this.bulletTime = this.game.time.now + 200;
        }
    }
  }

  collisionHandler(bullet:Phaser.Sprite,invader:Phaser.Sprite) {
      invader.kill();
      bullet.kill();
    }

  render() {
      
  }

  }
}