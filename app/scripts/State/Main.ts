module Bellend.State {
  export class Main extends Phaser.State {
    left:Phaser.Key;
    right:Phaser.Key;
    paddle:Phaser.Sprite;
    bricks:Phaser.Group;
    ball:Phaser.Sprite;

    create() {
      this.stage.backgroundColor = 0xffff00;    
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
            var brick = this.add.sprite(55+i*60, 55+j*35, 'brick');
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


  hit(ball,brick) {
      brick.kill();
    }
  }
}