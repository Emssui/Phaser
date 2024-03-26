    class Game1 extends Phaser.Scene {
        constructor() {
            super({ key: 'GameScene2'});
        };

        preload() {
            var width = this.cameras.main.width;
            var height = this.cameras.main.height; // Corrected typo
        
            var progressBar = this.add.graphics();
            var progressBox = this.add.graphics();
        
            progressBox.fillRect(width / 2 - 30, height / 2 - 30, 2, 2);
            var loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: 'Loading...',
                style: {
                    font: '22px monospace',
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
            this.load.image('iceTiles', 'assets/tiles/spritesheet2.png');

            // load tilemap
            this.load.tilemapTiledJSON('map2', 'assets/tiles/map2.json');

            this.load.image('ground', 'assets/images/ground.png');
            this.load.image('ceiling', 'assets/images/untitled.png');  
            this.load.image('lava', 'assets/images/lava.png');
            this.load.image('button', 'assets/images/button.png');

            for(let i= 0; i < 500; i++) {
                this.load.image('ground' + i, 'assets/images/ground.png');
            }
        };

        create() {
            const map = this.make.tilemap({ 
                key: 'map2'
            });
            const tileset = map.addTilesetImage('ice', 'iceTiles');

            const groundLayer = map.createLayer('Tile Layer 1', tileset, -600, -100);
            const layer = map.createLayer('walls', tileset, -600, -100);

            var player1 = this.physics.add.sprite(300, 400, 'player1');
            this.lava = this.physics.add.sprite(1950, 930, 'lava');
            this.btn = this.physics.add.sprite(5950, 870, 'button');
            
            this.lava.setDepth(-1)
            this.lava.setScale(17,1)
            this.lava.body.allowGravity = false; // Disable gavity for the lava  

            this.btn.setDepth(-1)
            this.btn.body.allowGravity = false; // Disable gavity for the lava  

            this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

            player1.play('playerFrames');

            // Set physics properties on the sprite directly, not on the animation
            player1.setBounce(0);
            player1.setDrag(100);
            player1.setGravityY(300);
            player1.setScale(0.6);

            // Store the player reference for movement
            this.player = player1;

            // Create an array to store coin sprites
            this.coins2 = this.physics.add.group({
                key: 'coin1',
                repeat: 12, // Number of coins to create
                setXY: { x: 1000, y: 100, stepX: 250 } // Position of the first coin and the distance between coins
            });

            // Set properties for each coin
            this.coins2.children.iterate(function (coin) {
                coin.setScale(0.15); // Adjust scale as needed
                coin.setGravityY(500);
                this.physics.add.collider(coin,layer);
                coin.setBounce(0.5);

                // Play coin animation for each coin
                coin.play('coinframes');
            }, this);

            // Initialize score
            this.score = 0;

            // Create score text
            this.scoreText = this.add.text(20, 60, 'Score: 0', { fontSize: '50px', fill: '#fff' });       

            // Set up collision between player and coins
            this.physics.add.overlap(this.player, this.coins2, this.collectCoin, null, this);
            this.cameras.main.zoomTo(1.3);

            // Setup keyboard keys for movement
            this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left,up');

            // Boolean to check if the player is on the ground
            this.isPlayerOnGround = false;

            // Create ground group
            this.groundGroup = this.physics.add.staticGroup();

            groundLayer.setCollisionBetween(0, 100);
            layer.setCollisionBetween(0, 100);

            // Check for overlap with ground to update isPlayerOnGround flag
            this.physics.add.collider(player1, groundLayer, () => {
                this.isPlayerOnGround = true;
            }, null, this);

            this.physics.add.collider(this.coins2, groundLayer);
            this.physics.add.collider(player1, layer);

            this.score = 0;
            
            // lava restart
            this.physics.add.collider(this.player, this.lava, this.restartScene, null, this);            
            this.physics.add.collider(this.player, this.btn, this.restartScene, null, this);


            // Ground check hitbox
            this.groundHitbox = this.physics.add.sprite(player1.x, player1.y + player1.height / 2, 'ground');
            this.groundHitbox.setVisible(false); // Make it invisible
        };

        update() {
            if(this.player.body.velocity.y > 0) {
                this.isPlayerOnGround = false;
            }

            if (this.player.x >= 7300) {
                // Set the camera to follow the player's y-coordinate
                this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
            } else {
                // Otherwise, set the camera to follow the player's x-coordinate
                this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
            }

            this.movePlayer();

            this.scoreText.setPosition(this.player.x - 100, 250);
            this.groundHitbox.setPosition(this.player.x, this.player.y + this.player.height / 2);
        };

        
        restartScene() {
            // Restart the current scene
            this.scene.restart();
        }
        
        collectCoin(player, coin) {
            coin.disableBody(true, true); // Remove the coin from the screen
            this.score += 10; // Increase score by 10 for each coin collected
            this.scoreText.setText('Score: ' + this.score); // Update score text
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

            // If the W key or up arrow key is pressed and the player is on the ground
            if ((this.keys.W.isDown || this.keys.up.isdown) && this.isPlayerOnGround) {
                // Move the player upward (jump)
                this.player.setVelocityY(-320);
                // Set the player to not be on the ground
                this.isPlayerOnGround = false;
            }
        }

        collectCoin(player, coin) {
            // Increment score
            this.score += 10;
        
            // Update score text
            this.scoreText.setText('Score: ' + this.score);
        
            // Disable coin
            coin.disableBody(true, true);
        }
    };

