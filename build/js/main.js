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
            create() {
                this.stage.backgroundColor = 0xFFFFFF;
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.world.enableBody = true;
                this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
                this.weapon = this.game.add.weapon(1, 'bullet');
                this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
                this.weapon.bulletAngleOffset = 90;
                this.weapon.bulletSpeed = 400;
                this.ship = this.add.sprite(320, 300, 'ship');
                this.game.physics.arcade.enable(this.ship);
                this.createInvaders();
                this.physics.arcade.overlap(this.weapon.bullets, this.bricks, function hit(x, y) { alert('collide'); }, null, this);
            }
            update() {
                this.ship.body.velocity.x = 0;
                if (this.left.isDown) {
                    this.ship.body.velocity.x = -200;
                }
                else if (this.right.isDown) {
                    this.ship.body.velocity.x = 200;
                }
                if (this.fireButton.isDown) {
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
                this.bricks = this.add.group();
                for (let i = 0; i < 5; i++) {
                    let inv = Bellend.invader.createInvader(i, this.game);
                    for (let j = 0; j < 10; j++) {
                        let brick = this.add.sprite(55 + j * 60, 55 + i * 35, inv);
                        brick.body.immovable = true;
                        this.bricks.add(brick);
                    }
                }
            }
            hit(weapon, brick) {
                brick.kill();
            }
            render() {
                this.weapon.debug();
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
                this.load.image('bullet', 'assets/images/bullet.png');
                this.load.image('ship', 'assets/images/shmup-ship.png');
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
    var invader;
    (function (invader_1) {
        let invader = [
            "0", "1", "1", "1", "0",
            "1", "0", "1", "0", "1",
            "1", "0", "1", "0", "1",
            "1", "1", "1", "1", "1",
            "1", "0", "1", "0", "1"];
        let g_noise = 0xDEADBABE;
        function createInvader(id, gameRef) {
            let invaderSeed = g_noise;
            let i;
            let x;
            let y;
            for (i = 0; i < 5 * 5; i++)
                invader[i] = "0";
            for (y = 0; y < 5; y++) {
                for (x = 0; x < 5; x++) {
                    if (x < 3) {
                        invader[x + y * 5] = (myRand() & 0x1).toString();
                    }
                    else {
                        invader[x + y * 5] = invader[(4 - x) + y * 5];
                    }
                }
            }
            let colour = gameRef.rnd.between(0, 15).toString(16).toUpperCase();
            let spritearray = [];
            for (i = 0; i < 5; i++) {
                let line = "";
                for (x = 0; x < 5; x++) {
                    if (invader[i * 5 + x] == "0")
                        line += ".";
                    else
                        line += colour;
                }
                spritearray.push(line);
            }
            return gameRef.create.texture('invader' + id, spritearray, 4, 4, 0);
        }
        invader_1.createInvader = createInvader;
        function myRand() {
            let taps = 0x80306031;
            let l = g_noise;
            if (l & 0x1)
                l = (1 << 31) | ((l ^ taps) >> 1);
            else
                l = (l >> 1);
            g_noise = l;
            return l;
        }
    })(invader = Bellend.invader || (Bellend.invader = {}));
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