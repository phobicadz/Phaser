module Bellend.State {
  export class Preload extends Phaser.State {
    private preloadBar: Phaser.Sprite;

    preload() {
      this.preloadBar = this.add.sprite(0, 148, 'preload-bar');
      this.load.setPreloadSprite(this.preloadBar);

      this.load.image('menu-background', 'assets/images/menu-background.png');

      this.load.image('paddle', 'assets/images/paddle.png');
      this.load.image('brick', 'assets/images/brick.png');  
      this.load.image('ball','assets/images/ball.png');
      
      // Load remaining assets here
    }

    create() {
      this.game.state.start('menu');
    }
  }
}