module Bellend.State {
  export class Main extends Phaser.State {
    left:Phaser.Key;
    right:Phaser.Key;
    fireButton:Phaser.Key;
    paddle:Phaser.Sprite;
    bricks:Phaser.Group;
    ball:Phaser.Sprite;
    weapon:Phaser.Weapon;
    ship:Phaser.Sprite;

    create() {
        this.stage.backgroundColor = 0xFFFFFF;    
        // Create game objects here
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.enableBody=true;
        this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.weapon = this.game.add.weapon(1, 'bullet');

        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        //  Because our bullet is drawn facing up, we need to offset its rotation:
        this.weapon.bulletAngleOffset = 90;
        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 400;
        this.ship = this.add.sprite(320, 300, 'ship');
        this.game.physics.arcade.enable(this.ship);
        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        //this.weapon.trackSprite(this.ship, 14, 0);
       
        this.createInvaders();
     
        this.physics.arcade.overlap(this.weapon.bullets,this.bricks,function hit(x,y) {alert('collide')},null,this);   
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
            this.weapon.fire(this.ship);
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

  createInvaders() {
        // Add 25 bricks to the group (5 columns and 5 lines)
        this.bricks = this.add.group();

        for (let i = 0; i < 5; i++) {
            let inv:PIXI.Texture = invader.createInvader(i,this.game)
            for (let j = 0; j < 10; j++) {
                // Create the brick at the correct position
                let brick = this.add.sprite(55+j*60, 55+i*35, inv);
                // Make sure the brick won't move when the ball hits it
                brick.body.immovable = true;
                // Add the brick to the group
                this.bricks.add(brick);
            }
        }
  }

  hit(weapon,brick) {
      brick.kill();
    }

  render() {
      this.weapon.debug();
  }

  }
}