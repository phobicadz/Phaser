module Bellend.State {
  export class Boot extends Phaser.State {
    preload() {
      this.load.image('preload-bar', 'assets/images/preload-bar.png');
    }

    create() {
      this.game.stage.backgroundColor = 0xFF0FF0;

      // Assign global settings here
      
      this.game.state.start('preload');
    }
  }
}