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
                this.bulletTime = 0;
                this.livingEnemies = [];
                this.firingTimer = 0;
                this.score = 0;
                this.scoreString = '';
            }
            create() {
                this.stage.backgroundColor = 0xFFFFFF;
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.world.enableBody = true;
                this.left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                this.right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
                this.player = this.game.add.sprite(300, 300, 'ship');
                this.player.anchor.setTo(0.5, 0.5);
                this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
                this.createInvaders();
                this.bullets = this.game.add.group();
                this.bullets.enableBody = true;
                this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
                this.bullets.createMultiple(30, 'bullet');
                this.bullets.setAll('anchor.x', 0.5);
                this.bullets.setAll('anchor.y', 1);
                this.bullets.setAll('outOfBoundsKill', true);
                this.bullets.setAll('checkWorldBounds', true);
                this.enemyBullets = this.game.add.group();
                this.enemyBullets.enableBody = true;
                this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
                this.enemyBullets.createMultiple(30, 'bullet');
                this.enemyBullets.setAll('anchor.x', 0.5);
                this.enemyBullets.setAll('anchor.y', 1);
                this.enemyBullets.setAll('outOfBoundsKill', true);
                this.enemyBullets.setAll('checkWorldBounds', true);
                this.lives = this.game.add.group();
                this.game.add.text(this.game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });
                for (let i = 0; i < 3; i++) {
                    let ship = this.lives.create(this.game.world.width - 100 + (30 * i), 60, 'ship');
                    ship.anchor.set(0.5, 0, 5);
                    ship.angle = 90;
                    ship.alpha = 0.4;
                }
                this.stateText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, ' ', { font: '84px Arial', fill: '#000' });
                this.stateText.anchor.setTo(0.5, 0.5);
                this.stateText.visible = false;
                this.scoreString = 'Score : ';
                this.scoreText = this.game.add.text(10, 10, this.scoreString + this.score, { font: '34px Arial', fill: '#000' });
            }
            update() {
                if (this.player.alive) {
                    this.player.body.velocity.x = 0;
                    if (this.left.isDown) {
                        this.player.body.velocity.x = -200;
                    }
                    else if (this.right.isDown) {
                        this.player.body.velocity.x = 200;
                    }
                    if (this.fireButton.isDown) {
                        this.fireBullet();
                    }
                    if (this.game.time.now > this.firingTimer) {
                        this.enemyFires();
                    }
                    this.game.physics.arcade.overlap(this.bullets, this.invaders, this.collisionHandler, null, this);
                    this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
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
                this.invaders = this.add.group();
                for (let i = 0; i < 5; i++) {
                    let inv = Bellend.invader.createInvader(i, this.game);
                    for (let j = 0; j < 10; j++) {
                        let invader = this.add.sprite(55 + j * 60, 55 + i * 35, inv);
                        invader.body.immovable = true;
                        invader.anchor.setTo(0.5, 0.5);
                        this.invaders.add(invader);
                    }
                }
                let tween = this.game.add.tween(this.invaders).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
                tween.onRepeat.add(() => { this.invaders.y += 5; }, this);
            }
            fireBullet() {
                if (this.game.time.now > this.bulletTime) {
                    this.bullet = this.bullets.getFirstExists(false);
                    if (this.bullet) {
                        this.bullet.reset(this.player.x, this.player.y + 8);
                        this.bullet.body.velocity.y = -400;
                        this.bulletTime = this.game.time.now + 200;
                    }
                }
            }
            enemyFires() {
                this.enemyBullet = this.enemyBullets.getFirstExists(false);
                this.livingEnemies.length = 0;
                this.invaders.forEachAlive((invader) => {
                    this.livingEnemies.push(invader);
                }, this);
                if (this.enemyBullet && this.livingEnemies.length > 0) {
                    let random = this.game.rnd.integerInRange(0, this.livingEnemies.length - 1);
                    let shooter = this.livingEnemies[random];
                    this.enemyBullet.reset(shooter.body.x, shooter.body.y);
                    this.game.physics.arcade.moveToObject(this.enemyBullet, this.player, 120);
                    this.firingTimer = this.game.time.now + 2000;
                }
            }
            enemyHitsPlayer(player, bullet) {
                bullet.kill();
                let live = this.lives.getFirstAlive();
                if (live) {
                    live.kill();
                }
                if (this.lives.countLiving() < 1) {
                    player.kill();
                    this.enemyBullets.callAll('kill', this);
                    this.stateText.text = " GAME OVER \n Click to restart";
                    this.stateText.visible = true;
                    this.game.input.onTap.addOnce(this.restart, this);
                }
            }
            restart() {
                this.lives.callAll('revive', this);
                this.invaders.removeAll();
                this.createInvaders();
                this.player.revive();
                this.stateText.visible = false;
            }
            collisionHandler(bullet, invader) {
                invader.kill();
                bullet.kill();
                this.score += 20;
                this.scoreText.text = this.scoreString + this.score;
                if (this.invaders.countLiving() == 0) {
                    this.score += 1000;
                    this.scoreText.text = this.scoreString + this.score;
                    this.enemyBullets.callAll('kill', this);
                    this.stateText.text = " You Won, \n Click to restart";
                    this.stateText.visible = true;
                    this.game.input.onTap.addOnce(this.restart, this);
                }
            }
            render() {
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