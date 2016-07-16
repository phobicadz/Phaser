/// <reference path="../vendor/phaser-official/typescript/phaser.d.ts"/>

/// <reference path='State/Boot.ts'/>
/// <reference path='State/Preload.ts'/>
/// <reference path='State/Menu.ts'/>
/// <reference path='State/Main.ts'/>
/// <reference path='State/Invader.ts'/>

module Bellend {
  export class Game extends Phaser.Game {
    constructor() {
      super(640, 480, Phaser.AUTO, 'game-div');
      this.state.add('boot', State.Boot);
      this.state.add('preload', State.Preload);
      this.state.add('menu', State.Menu);
      this.state.add('main', State.Main);
      this.state.start('boot');
    }
  }
}

// same as window.onload() = function {}

window.onload = () => {
  var game = new Bellend.Game();
}