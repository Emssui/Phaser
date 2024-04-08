
class Game4 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene4'});
        this.background = []; // Initialize background as an object
    };

    Text;

    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height; // Corrected typo
    
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
    
        progressBox.fillRect(width / 2 - 30, height / 2 - 30, 2, 2);
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 70,
            text: 'Level 4',
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

        // load tileset
        this.load.image('tiles4', 'assets/tiles/spritesheet4.png');

        this.load.audio('gravity', 'assets/audios/gravity.mp3');
        this.load.audio('coinSound', 'assets/audios/coin.mp3');

        // load tilemap
        this.load.tilemapTiledJSON('map4', 'assets/tiles/map4.json');

        this.load.image('water', 'assets/images/water.png');
        this.load.image('background', 'assets/images/parallax.png');

        for(let i= 0; i < 500; i++) {
            this.load.image('ground' + i, 'assets/images/ground.png');
        }
    };

    create() {
        scoreManager.level = 0
        scoreManager.level = 4;

        const { width, height } = this.scale;
    
        this.background.push({
			ratioX: 0.3,
			sprite: this.add.tileSprite(0, -20, width, height, 'background')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
                .setScale(1.4)
		});

        const map = this.make.tilemap({ 
            key: 'map4'
        });
        const tileset = map.addTilesetImage('spritesheet4', 'tiles4');

        const groundLayer = map.createLayer('Tile Layer 1', tileset, -600, -950);
        const layer = map.createLayer('kill', tileset, -600, -950);
        groundLayer.setDepth(1);
        layer.setDepth(1);

        var player1 = this.physics.add.sprite(400, 400, 'player1');
        this.btn = this.physics.add.sprite(5540, -400, 'water');
        
        this.sfx = this.sound.add('gravity');
        this.coinSound = this.sound.add('coinSound');
        this.coinSound.volume = 0.3;

        this.btn.setDepth(0)
        this.btn.body.allowGravity = false; // Disable gavity for the lava  

        this.scoreText = this.add.text(16, 16, 'Score: ' + scoreManager.score, { fontSize: '32px', fill: '#000' });       
        this.Text = this.add.text(300, 350, 'Level 4', { fontSize: '50px', fill: '#fff' });
        this.Text = this.add.text(160, 400, 'W and S to change gravity', { fontSize: '50px', fill: '#fff' });

        // Create animation
        this.anims.create({
            key: 'playerFrames',
            frames:[
                {key: 'player1'},
                {key: 'player2'},
            ],
            frameRate: 4,
            repeat: -1
        });

        player1.play('playerFrames');

        // Set physics properties on the sprite directly, not on the animation
        player1.setScale(0.6);

        // Store the player reference for movement
        this.player = player1;

        // Create an array to store coin sprites
        this.coins = this.physics.add.group({
            key: 'coin1',
            repeat: 9, // Number of coins to create
            setXY: { x: 500, y: 200, stepX: 300 } // Position of the first coin and the distance between coins
        });

        // Set properties for each coin
        this.coins.children.iterate(function (coin) {
            coin.setScale(0.15); // Adjust scale as needed
            coin.setGravityY(500);
            this.physics.add.collider(coin,layer);
            coin.setBounce(1);

            // Define coin animation for each coin
            coin.anims.create({
                key: 'coinframes',
                frames:[
                    {key: 'coin1'},
                    {key: 'coin2'}
                ],
                frameRate: 3, // Adjust frame rate as needed
                repeat: -1 // Loop indefinitely
            });

            // Play coin animation for each coin
            coin.play('coinframes');
        }, this);

        // Initialize score
        this.score = 0;

        // Create score text
        this.scoreText = this.add.text(20, 60, 'Score: ' + scoreManager.score, { fontSize: '50px', fill: '#fff' });  
        this.scoreText.setDepth(2);     

        // Set up collision between player and coins
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.cameras.main.zoomTo(1.3);

        // Setup keyboard keys for movement
        this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left,up');

        // Create ground group
        this.groundGroup = this.physics.add.staticGroup();
        this.isPlayerOnGround = false; 

        this.touch = false;

        groundLayer.setCollisionBetween(0, 100);
        layer.setCollisionBetween(0, 100);

        this.canTouchGround = true;

        // Check for overlap with ground to update isPlayerOnGround flag
        this.physics.add.collider(player1, groundLayer, () => {
            if(this.canTouchGround) {
                this.isPlayerOnGround = true;
                this.touch = !this.touch;
                this.canTouchGround = false;
            }
        }, null, this);

        this.physics.add.collider(this.coins, groundLayer);

        this.score = 0;
        
        // lava restart
        this.physics.add.collider(this.player, layer, () => {
            this.sound.stopAll();
            this.scene.start("DeathScene");
        }); 

        this.physics.add.collider(this.player, this.btn, () => {
            this.scene.start("GameScene5");
        });

        // Ground check hitbox
        this.groundHitbox = this.physics.add.sprite(player1.x, player1.y + player1.height / 2, 'ground');
        this.groundHitbox.setVisible(false); // Make it invisible

        this.timeout = true;
    };

    update() {
        for (let i = 0; i < this.background.length; ++i) {
            const bg = this.background[i];

            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX;
        }

        if (!this.isPlayerOnGround) {
            this.canTouchGround = true;
        }

        if(this.player.body.velocity.y > 0) {
            this.isPlayerOnGround = false;
        }

        if (this.player.x >= 2900) {
            this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
            this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
            this.scoreText.setPosition(this.player.x - 100, this.player.y - 340);
        } else {
            this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
            this.scoreText.setPosition(this.player.x - 100, 250);

        }        
        this.movePlayer();

        this.groundHitbox.setPosition(this.player.x, this.player.y + this.player.height / 2);
    };

    collectCoin(player, coin) {
        coin.disableBody(true, true); // Remove the coin from the screen
        scoreManager.increaseScore(10);
        this.coinSound.play();
        this.scoreText.setText("Score: " + scoreManager.getScore()); // Update score text
    }

    movePlayer() {
        // If the A key or left arrow key is pressed
        if (this.keys.A.isDown || this.keys.left.isDown) {
            // Move the player to the left
            this.player.setVelocityX(-400);
        }
        // If the D key or right arrow key is pressed
        else if (this.keys.D.isDown || this.keys.right.isDown) {
            // Move the player to the right
            this.player.setVelocityX(400);
        }
        // If neither the A or D key or left or right arrow key is pressed
        else {
            // Stop the player
            this.player.setVelocityX(0);
        }


        if (this.keys.W.isDown && this.isPlayerOnGround && this.touch == true) {
            this.sfx.play();
            this.physics.world.gravity.y = -400;

            this.tweens.add({
                targets: this.player,
                angle: this.player.angle + 180,
                duration: 1000
            })

            this.isPlayerOnGround = false;
        } else if (this.keys.S.isDown && this.isPlayerOnGround && this.touch == false) {            
            this.tweens.add({
                targets: this.player,
                angle: this.player.angle + 180,
                duration: 1000
            })
            this.sfx.play();

            this.physics.world.gravity.y = 400;
    
            this.isPlayerOnGround = false;
        }
    }
}

