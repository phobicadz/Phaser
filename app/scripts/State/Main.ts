module Bellend.State {
  export class Main extends Phaser.State {
    left:Phaser.Key;
    right:Phaser.Key;
    fireButton:Phaser.Key;
    paddle:Phaser.Sprite;
    invaders:Phaser.Group;
    ball:Phaser.Sprite;
    bullets:Phaser.Group;
    enemyBullets:Phaser.Group;
    bullet:Phaser.Sprite;
    enemyBullet:Phaser.Sprite;
    bulletTime:number = 0;
    ship:Phaser.Sprite;
    livingEnemies:Array<Phaser.Sprite> = [];
    lives:Phaser.Group;
    firingTimer:number = 0;

    create() {
        this.stage.backgroundColor = 0xFFFFFF;    
        // Create game objects here
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.enableBody=true;
        this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);   
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

        // The enemy's bullets
        this.enemyBullets = this.game.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyBullets.createMultiple(30, 'bullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

         //  Lives
        this.lives = this.game.add.group();
        this.game.add.text(this.game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

        for (let i=0;i<3;i++) {
            let ship = this.lives.create(320,300,'ship');
            ship.anchor.set(0.5,0,5);
        }

    }

    update() {
        if (this.ship.alive) {
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

            if (this.game.time.now > this.firingTimer)
            {
                this.enemyFires();
            }

            this.game.physics.arcade.overlap(this.bullets, this.invaders, this.collisionHandler, null, this);  
            this.game.physics.arcade.overlap(this.enemyBullets, this.ship, this.enemyHitsPlayer, null, this);
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

  enemyFires () {
    //  Grab the first bullet we can from the pool
    this.enemyBullet = this.enemyBullets.getFirstExists(false);
    this.livingEnemies.length=0;

    this.invaders.forEachAlive((invader) => {
        // put every living enemy in an array
        this.livingEnemies.push(invader);
    },this);


    if (this.enemyBullet && this.livingEnemies.length > 0)
    {    
        let random=this.game.rnd.integerInRange(0,this.livingEnemies.length-1);

        // randomly select one of them
        let shooter=this.livingEnemies[random];
        // And fire the bullet from this enemy
        this.enemyBullet.reset(shooter.body.x, shooter.body.y);

        this.game.physics.arcade.moveToObject(this.enemyBullet,this.ship,120);
        this.firingTimer = this.game.time.now + 2000;
    }

}

 enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    let live:Phaser.Sprite = this.lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    // var explosion = explosions.getFirstExists(false);
    // explosion.reset(player.body.x, player.body.y);
    // explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (this.lives.countLiving() < 1)
    {
        player.kill();
        this.enemyBullets.callAll('kill',this);
        //the "click to restart" handler
        this.game.input.onTap.addOnce(this.restart,this);
    }
}

restart () {

    //  A new level starts   
    //resets the life count
    this.lives.callAll('revive',this);
    //  And brings the aliens back from the dead :)
    this.invaders.removeAll();
    this.createInvaders();

    //revives the player
    this.ship.revive();
    //hides the text
   // stateText.visible = false;

}

  collisionHandler(bullet:Phaser.Sprite,invader:Phaser.Sprite) {
      invader.kill();
      bullet.kill();
    }

  render() {
      
  }

  }
}