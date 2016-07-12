var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
                this.load.image('preload-bar', 'assets/images/preload-bar.png');
            };
            Boot.prototype.create = function () {
                this.game.stage.backgroundColor = 0xFFFFFF;
                // Assign global settings here
                this.game.state.start('preload');
            };
            return Boot;
        })(Phaser.State);
        State.Boot = Boot;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                _super.apply(this, arguments);
            }
            Preload.prototype.preload = function () {
                //     this.preloadBar = this.add.sprite(0, 148, 'preload-bar');
                //    this.load.setPreloadSprite(this.preloadBar);
                this.load.image('menu-background', 'assets/images/menu-background.png');
                this.load.image('paddle', 'assets/images/paddle.png');
                this.load.image('brick', 'assets/images/brick.png');
                this.load.image('ball', 'assets/images/ball.png');
                // Load remaining assets here
            };
            Preload.prototype.create = function () {
                this.game.state.start('menu');
            };
            return Preload;
        })(Phaser.State);
        State.Preload = Preload;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu() {
                _super.apply(this, arguments);
            }
            Menu.prototype.create = function () {
                var _this = this;
                this.background = this.add.sprite(80, 0, 'menu-background');
                this.input.onDown.addOnce(function () {
                    _this.game.state.start('main');
                    // alert('Balls');
                });
            };
            return Menu;
        })(Phaser.State);
        State.Menu = Menu;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
var Bellend;
(function (Bellend) {
    var State;
    (function (State) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.apply(this, arguments);
            }
            Main.prototype.create = function () {
                this.stage.backgroundColor = 0xffff00;
                // Create game objects here
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.world.enableBody = true;
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
                        var brick = this.add.sprite(55 + i * 60, 55 + j * 35, 'brick');
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
            };
            Main.prototype.update = function () {
                if (this.left.isDown) {
                    this.paddle.body.velocity.x = -300;
                }
                else if (this.right.isDown) {
                    this.paddle.body.velocity.x = 300;
                }
                else {
                    this.paddle.body.velocity.x = 0;
                }
                // Add collisions between the paddle and the ball
                this.physics.arcade.collide(this.paddle, this.ball);
                // Call the 'hit' function when the ball hits a brick
                this.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
                // Restart the game if the ball is below the paddle
                if (this.ball.y > this.paddle.y) {
                    this.game.state.start('main');
                }
            };
            Main.prototype.hit = function (ball, brick) {
                brick.kill();
            };
            return Main;
        })(Phaser.State);
        State.Main = Main;
    })(State = Bellend.State || (Bellend.State = {}));
})(Bellend || (Bellend = {}));
/// <reference path="../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path='State/Boot.ts'/>
/// <reference path='State/Preload.ts'/>
/// <reference path='State/Menu.ts'/>
/// <reference path='State/Main.ts'/>
var Bellend;
(function (Bellend) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 640, 480, Phaser.AUTO, 'game-div');
            this.state.add('boot', Bellend.State.Boot);
            this.state.add('preload', Bellend.State.Preload);
            this.state.add('menu', Bellend.State.Menu);
            this.state.add('main', Bellend.State.Main);
            this.state.start('boot');
        }
        return Game;
    })(Phaser.Game);
    Bellend.Game = Game;
})(Bellend || (Bellend = {}));
window.onload = function () {
    var game = new Bellend.Game();
};
//# sourceMappingURL=main.js.map