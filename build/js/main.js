var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        class Boot extends Phaser.State {
            preload() {
                this.load.image('preload-bar', 'assets/images/preload-bar.png');
            }
            create() {
                this.game.stage.backgroundColor = 0xFF0FF0;
                this.game.state.start('preload');
            }
        }
        State.Boot = Boot;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        class Main extends Phaser.State {
            create() {
                this.stage.backgroundColor = 0xffff00;
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.world.enableBody = true;
                this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                this.paddle = this.add.sprite(200, 400, 'paddle');
                this.paddle.body.immovable = true;
                this.bricks = this.add.group();
                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        var brick = this.add.sprite(55 + i * 60, 55 + j * 35, 'brick');
                        brick.body.immovable = true;
                        this.bricks.add(brick);
                    }
                }
                this.ball = this.add.sprite(200, 300, 'ball');
                this.ball.body.velocity.x = 250;
                this.ball.body.velocity.y = 250;
                this.ball.body.bounce.setTo(1);
                this.ball.body.collideWorldBounds = true;
            }
            update() {
                if (this.left.isDown) {
                    this.paddle.body.velocity.x = -300;
                }
                else if (this.right.isDown) {
                    this.paddle.body.velocity.x = 300;
                }
                else {
                    this.paddle.body.velocity.x = 0;
                }
                this.physics.arcade.collide(this.paddle, this.ball);
                this.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
                if (this.ball.y > this.paddle.y) {
                    this.game.state.start('main');
                }
            }
            hit(ball, brick) {
                brick.kill();
            }
        }
        State.Main = Main;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        class Menu extends Phaser.State {
            create() {
                this.background = this.add.sprite(80, 0, 'menu-background');
                this.input.onDown.addOnce(() => {
                    this.game.state.start('main');
                });
            }
        }
        State.Menu = Menu;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        class Preload extends Phaser.State {
            preload() {
                this.load.image('menu-background', 'assets/images/menu-background.png');
                this.load.image('paddle', 'assets/images/paddle.png');
                this.load.image('brick', 'assets/images/brick.png');
                this.load.image('ball', 'assets/images/ball.png');
            }
            create() {
                this.game.state.start('menu');
            }
        }
        State.Preload = Preload;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    class Game extends Phaser.Game {
        constructor() {
            super(640, 480, Phaser.AUTO, 'game-div');
            this.state.add('boot', Bellend.State.Boot);
            this.state.add('preload', Bellend.State.Preload);
            this.state.add('menu', Bellend.State.Menu);
            this.state.add('main', Bellend.State.Main);
            this.state.start('boot');
        }
    }
    Bellend.Game = Game;
})(Bellend || (Bellend = {}));
window.onload = () => {
    var game = new Bellend.Game();
};
//# sourceMappingURL=main.js.map