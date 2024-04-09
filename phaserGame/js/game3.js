class Game2 extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene3'});
        this.buttonCoordinates = [
            { x: 7500, y: 2000 },
            { x: 7200, y: 2600 },
            { x: 7900, y: 2800 }
        ];
        this.buttonIndex = 0;
        this.buttons = []; // Array to store buttons
        this.direction = false;
        this.background = []; // Initialize background as an object

        this.jetpackParticles = null; // Track jetpack particles separately
        this.isJetpackActive = false; // Track if jetpack is active
    }    

    Text;

    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
    
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
    
        progressBox.fillRect(width / 2 - 30, height / 2 - 30, 2, 2);
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 70,
            text: 'Level 3',
            style: {
                font: '40px monospace',
                fill: '#ddddd'
            }
        });
    
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '22px monospace',
                fill: '#ddddd'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '22px monospace',
                fill: '#ddddd'

            }
        });
        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 160, height / 2 - 30, 320 * value, 50);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
    
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    
        this.load.image('player1', 'assets/images/piskel1.png');
        this.load.image('player2', 'assets/images/piskel2.png');
        this.load.image('coin1', 'assets/images/coin1.png');
        this.load.image('coin2', 'assets/images/coin2.png');
        this.load.image('tiles3', 'assets/tiles/spritesheet3.png');

        this.load.tilemapTiledJSON('map3', 'assets/tiles/map3.json');

        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('ceiling', 'assets/images/untitled.png');  
        this.load.image('water', 'assets/images/water.png');
        this.load.image('rocket', 'assets/images/rocket.png');
        this.load.image('jetpack', 'assets/images/jetPack.png');
        this.load.image('red', 'assets/images/red.png');
        this.load.image('ladder', 'assets/images/ladder.png');

        this.load.image('button', 'assets/images/button.png');
        this.load.image('background', 'assets/images/parallax.png');

        for(let i = 0; i < 500; i++) {
            this.load.image('ground' + i, 'assets/images/ground.png');
        }

        this.load.audio('jump3', 'assets/audios/jetpack.mp3');
        this.load.audio('coinSound', 'assets/audios/coin.mp3');
    };

    create() {
        scoreManager.level = 0
        scoreManager.level = 3;

        const { width, height } = this.scale;
    
        this.background.push({
			ratioX: 0.3,
			sprite: this.add.tileSprite(0, -20, width, height, 'background')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
                .setScale(1.4)
		});
    
        this.cameras.main.setBackgroundColor("#6c6c6c");
    
        const map = this.make.tilemap({ 
            key: 'map3'
        });
        const tileset = map.addTilesetImage('walls', 'tiles3');
        this.direction = true;
        
        const groundLayer = map.createLayer('Tile Layer 1', tileset, -600, 20);
        const layer = map.createLayer('walls', tileset, -600, 20);
        layer.setDepth(0);
        groundLayer.setDepth(1);
    
        var player1 = this.physics.add.sprite(400, 400, 'player1');
        this.water = this.physics.add.sprite(1950, 1160, 'water');
        this.btn = this.physics.add.sprite(14900, 10, 'button');
        this.ladder = this.physics.add.sprite(15000, 430, 'ladder');
        this.ladder2 = this.physics.add.sprite(14900, 430, 'ladder');

        this.jetPack = this.physics.add.sprite(1200, 700, 'jetpack');
        this.jetPack.setScale(0.3);
        this.jetPack.body.allowGravity = false;
        this.isjetpackTrue = false;
        
        this.jump = this.sound.add('jump3');
        this.coinSound = this.sound.add('coinSound');
        this.coinSound.volume = 0.3;

        this.btn.setDepth(-1)
        this.btn.body.allowGravity = false;

        this.water.setDepth(-1)
        this.water.setScale(5,1)
        this.water.body.allowGravity = false;

        this.ladder.body.allowGravity = false;
        this.ladder.setDepth(-1)
        this.ladder.setScale(0.6, 1);
        this.ladder.setImmovable(true);

        this.ladder2.body.allowGravity = false;
        this.ladder2.setScale(0.6, 1);
        this.ladder2.setImmovable(true);
    
        this.Text = this.add.text(500, 350, 'Level 3', { fontSize: '50px', fill: '#fff' });

        this.anims.create({
            key: 'playerFrames',
            frames:[
                {key: 'player1'},
                {key: 'player2'},
            ],
            frameRate: 4,
            repeat: -1
        });
        
        this.particles = this.add.particles(0, 0, 'red', {
            speed: 10,
            scale: { start: 5, end: 0 },
            blendMode: 'ADD'
        });

        player1.play('playerFrames');
        player1.setDepth(1);
        player1.setBounce(0);
        player1.setDrag(100);
        player1.setGravityY(300);
        player1.setScale(0.6);
        player1.setMaxVelocity(1000, 800)

        this.player = player1;

        this.coins2 = this.physics.add.group({
            key: 'coin1',
            repeat: 19,
            setXY: { x: 1000, y: 300, stepX: 700 }
        });
    
        this.coins2.children.iterate(function (coin) {
            coin.setScale(0.15);
            coin.setGravityY(500);
            coin.setBounce(1);
            coin.play('coinframes');
        }, this);
    
        this.score = 0;
    
        this.scoreText = this.add.text(20, 60, 'Score: ' + scoreManager.score, { fontSize: '50px', fill: '#fff' });       
    
        this.physics.add.overlap(this.player, this.coins2, this.collectCoin, null, this);
        this.cameras.main.zoomTo(1.3);
    
        this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left,up');
    
        this.isPlayerOnGround = false;
    
        this.groundGroup = this.physics.add.staticGroup();
    
        groundLayer.setCollisionBetween(0, 100);
        layer.setCollisionBetween(0, 100);
    
        this.physics.add.collider(player1, groundLayer, () => {
            this.isPlayerOnGround = true;
        }, null, this);
    
        this.physics.add.collider(this.coins2, groundLayer);
        this.physics.add.collider(this.player, this.jetPack, () => {
            this.isjetpackTrue = true;
            this.jetPack.setVisible(false);

        });

        this.physics.add.collider(this.player, this.btn, () => {
            this.scene.start("GameScene4");
        });

        this.physics.add.collider(this.player, this.ladder, () => {
            this.player.setVelocityY(-400);
        });
    
        this.score = 0;
        this.scoreText.setDepth(2);
    
        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: this.createMissile,
            callbackScope: this
        });

        this.groundHitbox = this.physics.add.sprite(player1.x, player1.y + player1.height / 2, 'ground');
        this.groundHitbox.setVisible(false);

        this.player.setVelocityX(400);
        this.frameCounter = 0;
    };
    
    update() {
        this.frameCounter++;
        
        if(this.frameCounter % 20 == 0){
            this.player.setVelocityX(this.player.body.velocity.x + 100);
        }
    
        for (let i = 0; i < this.background.length; ++i) {
            const bg = this.background[i];
    
            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX;
        }
    
        if(this.player.body.velocity.y > 30) {
            this.isPlayerOnGround = false;
        }
    
        // Adjust camera scroll
        this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        this.scoreText.setPosition(this.player.x - 100, 250);
        
        if (this.keys.W.isDown && (this.isPlayerOnGround || this.isjetpackTrue)) {
            if (!this.isJetpackActive) {
                this.jump.play();
                this.isJetpackActive = true;
                this.particles.setVisible(true);
                this.particles.setDepth(0);
                this.particles.startFollow(this.player);
            }
            this.player.setVelocityY(-400);
            this.isPlayerOnGround = false;
        } else {
            if (this.isJetpackActive) {
                this.jump.stop();
                this.isJetpackActive = false;
                this.particles.setVisible(false);
            }
        }
    }
    
    createMissile() {
        const missilePosition = [
            { x: Phaser.Math.Between(2000, 12600), y: Phaser.Math.Between(135, 730) },
        ];
    
        missilePosition.forEach(pos => {
            const missile = this.physics.add.image(pos.x, pos.y, 'rocket');
            missile.setDepth(2);
            missile.setScale(0.9);
            missile.setVelocityX(-500);
            missile.body.allowGravity = false;
    
            // Create particle emitter attached to the missile
            this.particles2 = this.add.particles(150, 0, 'red', {
                blendMode: 'SCREEN',
                scale: { start: 3, end: 0 },
                rotate: { start: 0, end: 360 },
                speed: 50,
                lifespan: 2000,
                frequency: 200,
                gravityY: 0,
                follow: missile, // Set the emitter to follow the piraya
                followOffset: {x: 0, y: 0} // Adjust offset as needed
            });

            this.tweens.add({
                targets: this.particles2,
                particleX: 700,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inout',
                duration: 1500
            });

            this.particles2.setDepth(2);
            
            this.physics.add.collider(this.player, missile,() => {
                this.sound.stopAll();
                this.scene.start("DeathScene");
            });
        });
    }
    
    collectCoin(player, coin) {
        coin.disableBody(true, true); // Remove the coin from the screen
        scoreManager.increaseScore(10); // Increase the score
        this.coinSound.play();
        this.scoreText.setText("Score: " + scoreManager.getScore()); // Update score text
    }
};
