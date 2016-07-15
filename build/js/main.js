var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        class Boot extends Phaser.State {
            preload() {
                this.load.image('preload-bar', 'assets/images/preload-bar.png');
            }
            create() {
                this.game.stage.backgroundColor = 0x000000;
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
            constructor(...args) {
                super(...args);
                this.invaderSeed = 0;
                this.invader = [
                    "0", "1", "1", "1", "0",
                    "1", "0", "1", "0", "1",
                    "1", "0", "1", "0", "1",
                    "1", "1", "1", "1", "1",
                    "1", "0", "1", "0", "1"];
                this.g_noise = 0xDEADBABE;
                this.dudeData = [
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
            }
            create() {
                this.stage.backgroundColor = 0xFFFFFF;
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.world.enableBody = true;
                this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                this.paddle = this.add.sprite(200, 400, 'paddle');
                this.paddle.body.immovable = true;
                this.bricks = this.add.group();
                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        var brick = this.add.sprite(55 + i * 60, 55 + j * 35, this.createInvader(i * 5 + j));
                        brick.body.immovable = true;
                        this.bricks.add(brick);
                    }
                }
                this.ball = this.add.sprite(200, 300, 'ball');
                this.ball.body.velocity.x = 200;
                this.ball.body.velocity.y = 200;
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
            hit(ball, brick) {
                brick.kill();
            }
            createInvader(id) {
                var invaderSeed = this.g_noise;
                var i;
                var x;
                var y;
                for (i = 0; i < 5 * 5; i++)
                    this.invader[i] = "0";
                for (y = 0; y < 5; y++) {
                    for (x = 0; x < 5; x++) {
                        if (x < 3) {
                            this.invader[x + y * 5] = (this.myRand() & 0x1).toString();
                        }
                        else {
                            this.invader[x + y * 5] = this.invader[(4 - x) + y * 5];
                        }
                    }
                }
                var colour = this.rnd.between(0, 15).toString(16).toUpperCase();
                var spritearray = [];
                for (i = 0; i < 5; i++) {
                    var line = "";
                    for (x = 0; x < 5; x++) {
                        if (this.invader[i * 5 + x] == "0")
                            line += ".";
                        else
                            line += colour;
                    }
                    spritearray.push(line);
                }
                return this.game.create.texture('invader' + id, spritearray, 5, 5, 0);
            }
            myRand() {
                var taps = 0x80306031;
                var l = this.g_noise;
                if (l & 0x1)
                    l = (1 << 31) | ((l ^ taps) >> 1);
                else
                    l = (l >> 1);
                this.g_noise = l;
                return l;
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
                this.load.image('bubble', 'assets/images/bubble256.png');
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