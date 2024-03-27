class Game1 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene2'});
        this.buttonCoordinates = [
            { x: 7500, y: 2000 },
            { x: 7200, y: 2600 },
            { x: 7900, y: 3000 }
        ];
        this.buttonIndex = 0;
        this.buttons = []; // Array to store buttons
        this.direction = false;
    };

    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
    
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
        this.load.image('iceTiles', 'assets/tiles/spritesheet2.png');

        this.load.tilemapTiledJSON('map2', 'assets/tiles/map2.json');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('ceiling', 'assets/images/untitled.png');  
        this.load.image('water', 'assets/images/water.png');
        this.load.image('button', 'assets/images/button.png');

        for(let i = 0; i < 500; i++) {
            this.load.image('ground' + i, 'assets/images/ground.png');
        }
    };

    create() {
        this.cameras.main.setBackgroundColor("#6c6c6c");

        const map = this.make.tilemap({ 
            key: 'map2'
        });
        const tileset = map.addTilesetImage('ice', 'iceTiles');
        this.direction = true;

        const groundLayer = map.createLayer('Tile Layer 1', tileset, -600, -100);
        const layer = map.createLayer('walls', tileset, -600, -100);

        var player1 = this.physics.add.sprite(400, 400, 'player1');
        this.water = this.physics.add.sprite(1950, 1200, 'water');
        
        this.water.setDepth(-1)
        this.water.setScale(5,1)
        this.water.body.allowGravity = false;

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        player1.play('playerFrames');

        player1.setBounce(0);
        player1.setDrag(100);
        player1.setGravityY(300);
        player1.setScale(0.6);
        player1.setMaxVelocity(1000, 800)

        this.player = player1;

        this.coins2 = this.physics.add.group({
            key: 'coin1',
            repeat: 12,
            setXY: { x: 1000, y: 100, stepX: 250 }
        });

        this.coins2.children.iterate(function (coin) {
            coin.setScale(0.15);
            coin.setGravityY(500);
            this.physics.add.collider(coin,layer);
            coin.setBounce(0.5);
            coin.play('coinframes');
        }, this);

        this.score = 0;

        this.scoreText = this.add.text(20, 60, 'Score: 0', { fontSize: '50px', fill: '#fff' });       

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
        this.physics.add.collider(player1, layer);

        this.score = 0;

        this.physics.add.collider(this.player, this.water, this.restartScene, null, this); 
        this.physics.add.collider(this.player, this.buttons, this.restartScene, null, this); 

        // Create the buttons
        this.buttonCoordinates.forEach((coord, index) => {
            const direction = index === 0 ? true : false; // Set direction to true for the first button and false for others
            const button = this.createButton(coord.x, coord.y, direction);
            this.buttons.push(button);
        });

        this.groundHitbox = this.physics.add.sprite(player1.x, player1.y + player1.height / 2, 'ground');
        this.groundHitbox.setVisible(false);
    };

    update() {
        if(this.player.body.velocity.y > 30) {
            this.isPlayerOnGround = false;
        }

        if (this.player.x >= 7000) {
            this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
        } else {
            this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        }
        
        if(this.player.x >= 7000) {
            this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        }

        if (this.direction) {
            this.buttons.forEach(button => {
                if (button.x >= this.buttonCoordinates[this.buttonIndex].x + 800) {
                    this.direction = false;
                } else {
                    button.x += 5; // Move right
                }
            });
        } else {
            this.buttons.forEach(button => {
                if (button.x <= this.buttonCoordinates[this.buttonIndex].x - 800) {
                    this.direction = true;
                } else {
                    button.x -= 5; // Move left
                }
            });
        }

        this.movePlayer();

        this.scoreText.setPosition(this.player.x - 100, 250);
        this.groundHitbox.setPosition(this.player.x, this.player.y + this.player.height / 2);
    };

    createButton(x, y, direction) {
        const button = this.physics.add.sprite(x, y, 'button');
        button.setDepth(-1);
        button.setScale(0.3);
        button.body.allowGravity = false;
        button.direction = direction; // Set the direction property of the button
        return button;
    }

    restartScene() {
        this.scene.restart();
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true); // Remove the coin from the screen
        this.tweens.add({
            targets: this,
            score: this.score + 10,
            duration: 200,
            onUpdate: () => {
              this.scoreText.setText("Score: " + Math.floor(this.score));
            },
        });
    }

    movePlayer() {
        if (this.keys.A.isDown || this.keys.left.isDown) {
            this.player.setVelocityX(-400);
        } else if (this.keys.D.isDown || this.keys.right.isDown) {
            this.player.setVelocityX(400);
        } else {
            this.player.setVelocityX(0);
        }

        if ((this.keys.W.isDown || this.keys.up.isDown) && this.isPlayerOnGround) {
            this.player.setVelocityY(-320);
            this.isPlayerOnGround = false;
        }
    }
};
