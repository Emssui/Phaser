
class Game5 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene5'});
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
            text: 'Level 1',
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
        this.load.image('tiles5', 'assets/tiles/spritesheet5.png');

        // load tilemap
        this.load.tilemapTiledJSON('map5', 'assets/tiles/map5.json');

        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('ceiling', 'assets/images/untitled.png');  
        this.load.image('button', 'assets/images/button.png');
        this.load.image('background2', 'assets/images/waterParallax.jpg');
        this.load.image('fish1', 'assets/images/fish1.png');
        this.load.image('fish2', 'assets/images/fish2.png');
        this.load.image('door', 'assets/images/door.png');

        this.load.audio('jump', 'assets/audios/jump.mp3');
        this.load.audio('coinSound', 'assets/audios/coin.mp3');

        for(let i= 0; i < 500; i++) {
            this.load.image('ground' + i, 'assets/images/ground.png');
        }

        this.load.image('up', 'assets/images/up.png');
        this.load.image('down', 'assets/images/down.png');
        this.load.image('left', 'assets/images/left.png');
        this.load.image('right', 'assets/images/right.png');
        this.load.image('shift', 'assets/images/sprint.png');

        this.isMobile = this.checkIsMobile();
    };

    create() {
        scoreManager.level = 0
        scoreManager.level = 5;

        this.up = this.add.sprite(1480, 600,'up').setInteractive().setScrollFactor(0);
        this.left = this.add.sprite(300, 700,'left').setInteractive().setScrollFactor(0);
        this.right = this.add.sprite(500, 700,'right').setInteractive().setScrollFactor(0);
        this.down = this.add.sprite(1480, 750,'down').setInteractive().setScrollFactor(0);
        this.shift = this.add.sprite(1330, 675,'shift').setInteractive().setScrollFactor(0);

        this.up.setScale(0.2).setDepth(3).setVisible(false);
        this.down.setScale(0.2).setDepth(3).setVisible(false);
        this.right.setScale(0.2).setDepth(3).setVisible(false);
        this.left.setScale(0.2).setDepth(3).setVisible(false);   
        this.shift.setScale(0.2).setDepth(3).setVisible(false);    

        const { width, height } = this.scale;
    
        this.background.push({
			ratioX: 0.3,
			sprite: this.add.tileSprite(0, -20, width, height, 'background2')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
                .setScale(1.4)
		});

        const map = this.make.tilemap({ 
            key: 'map5'
        });
        const tileset = map.addTilesetImage('spritesheet5', 'tiles5');

        this.groundLayer = map.createLayer('Tile Layer 1', tileset, -600, -600);
        this.groundLayer.setDepth(2);

        var player1 = this.physics.add.sprite(340, 400, 'player1');
        this.btn = this.physics.add.sprite(6000, 600, 'button');
        this.door = this.physics.add.sprite(3850, 700, 'door');

        this.door.setDepth(2);
        this.door.setScale(0.5);
        this.door.setImmovable(true);
        this.door.body.allowGravity = false; // Disable gavity for the lava  

        this.btn.setDepth(-1);
        this.btn.setScale(4);
        this.btn.body.allowGravity = false; // Disable gavity for the lava  

        this.Text = this.add.text(300, 350, 'Level 5, use shift to Boost!', { fontSize: '50px', fill: '#000' });

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
        player1.setBounce(0);
        player1.setDrag(100);
        player1.setGravityY(300);
        player1.setScale(0.6);

        // Store the player reference for movement
        this.player = player1;

        // Create an array to store coin sprites
        this.coins = this.physics.add.group({
            key: 'coin1',
            repeat: 12, // Number of coins to create
            setXY: { x: 1000, y: 100, stepX: 240 } // Position of the first coin and the distance between coins
        });

        // Set properties for each coin
        this.coins.children.iterate(function (coin) {
            coin.setScale(0.15); // Adjust scale as needed
            coin.setGravityY(0);
            this.physics.add.collider(coin, this.groundLayer);
            coin.setBounce(0.5);

            // Define coin animation for each coin
            coin.anims.create({
                key: 'fishFrames',
                frames:[
                    {key: 'fish1'},
                    {key: 'fish2'}
                ],
                frameRate: 3, // Adjust frame rate as needed
                repeat: -1 // Loop indefinitely
            });

            // Play coin animation for each coin
            coin.play('fishFrames');
        }, this);

        // Initialize score
        this.score = 0;

        // Create score text
        this.scoreText = this.add.text(20, 60, 'Survive', { fontSize: '50px', fill: '#000' });  
        this.timerText = this.add.text(20, 60, 'Time Left: ' + this.timer, { fontFamily: 'Impact', fontSize: '50px', fill: '#000' });  
        this.timerText.setDepth(2);
        this.scoreText.setDepth(2);

        this.timer = 20;

        this.timerMinus = setInterval(() => {
            this.timer = this.timer - 1;
            console.log(this.timer);
        }, 1000);

        // Set up collision between player and coins
        this.physics.add.overlap(this.player, this.coins, () => {
            clearInterval(this.timerMinus); // Clear the interval when the scene is destroyed
            this.scene.start("DeathScene");
        });

        this.cameras.main.zoomTo(1.3);

        // Setup keyboard keys for movement
        this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left,up,shift');

        this.physics.world.gravity.y = -10;

        // Boolean to check if the player is on the ground
        this.isPlayerOnGround = false;

        // Create ground group
        this.groundGroup = this.physics.add.staticGroup();

        this.groundLayer.setCollisionBetween(0, 100);

        // Check for overlap with ground to update isPlayerOnGround flag
        this.physics.add.collider(player1, this.groundLayer, () => {
            this.isPlayerOnGround = true;
        }, null, this);

        this.physics.add.collider(this.coins, this.groundLayer);
        this.physics.add.collider(this.coins, this.coins);
        this.physics.add.collider(this.coins, this.door);
        this.physics.add.collider(this.player, this.door);

        this.score = 0;

        this.physics.add.collider(this.player, this.btn, () => {
            this.scene.start("VictoryScene");
        });

        // Ground check hitbox
        this.groundHitbox = this.physics.add.sprite(player1.x, player1.y + player1.height / 2, 'ground');
        this.groundHitbox.setVisible(false); // Make it invisible

        if(this.isMobile) {
            this.up.setVisible(true);
            this.down.setVisible(true);
            this.left.setVisible(true);
            this.right.setVisible(true);
            this.shift.setVisible(true);
        }

        this.up.on('pointerdown', () => {
            this.keys.W.isDown = true;
        });

        this.down.on('pointerdown', () => {
            this.keys.S.isDown = true;
        });
    
        this.left.on('pointerdown', () => {
            this.keys.A.isDown = true;
        });
    
        this.right.on('pointerdown', () => {
            this.keys.D.isDown = true;
        });

        this.shift.on('pointerdown', () => {
            this.keys.shift.isDown = true;
        });
    
        // Add event listeners to stop movement when images are released
        this.up.on('pointerup', () => {
            this.keys.W.isDown = false;
        });

        this.down.on('pointerup', () => {
            this.keys.S.isDown = false;
        });

        this.left.on('pointerup', () => {
            this.keys.A.isDown = false;
        });
    
        this.right.on('pointerup', () => {
            this.keys.D.isDown = false;
        });

        this.shift.on('pointerup', () => {
            this.keys.shift.isDown = false;
        });
    };

    update() {
        this.timerText.setText('Time Left: ' + this.timer);

        if(this.timer <= 0) {
            clearInterval(this.timerMinus); // Clear the interval when the scene is destroyed
            this.door.setVisible(false);
            this.door.body.enable = false;
        }
         // Move fish towards the player's position
         this.coins.children.iterate(function (fish) {
            const directionX = this.player.x - fish.x;
            const directionY = this.player.y - fish.y;
            const angle = Math.atan2(directionY, directionX); // Calculate angle
            fish.setRotation(angle + Math.PI / 1); // Set rotation (adjust as needed)
            
            const length = Math.sqrt(directionX * directionX + directionY * directionY);
            const dirX = directionX / length;
            const dirY = directionY / length;
            const speed = 700; // Adjust speed as needed
            fish.setVelocity(dirX * speed, dirY * speed);
        }, this);

        for (let i = 0; i < this.background.length; ++i) {
            const bg = this.background[i];

            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX;
        }

        if(this.player.body.velocity.y > 0) {
            this.isPlayerOnGround = false;
        }

        this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;

        this.movePlayer();

        this.timerText.setPosition(this.player.x - 100, this.player.y - 340);

        this.scoreText.setPosition(this.player.x - 100, this.player.y - 240);
    
        this.groundHitbox.setPosition(this.player.x, this.player.y + this.player.height / 2);
    };
    
    checkIsMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    }

    movePlayer() {
        // If the Shift key is down, apply boost
        if (this.keys.shift.isDown) {
            if (this.keys.A.isDown) {
                // Move the player to the left with boost
                this.player.setVelocityX(-700);
            } else if (this.keys.D.isDown) {
                // Move the player to the right with boost
                this.player.setVelocityX(700);
            } else if (this.keys.W.isDown) {
                // Move the player upward (jump)
                this.player.setVelocityY(-700);
            } else if (this.keys.S.isDown) {
                // Move the player upward (jump)
                this.player.setVelocityY(700);
            }
        } else {
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
            
            if (this.keys.W.isDown) {
                // Move the player upward (jump)
                this.player.setVelocityY(-320);
            } else if (this.keys.S.isDown) {
                // Move the player upward (jump)
                this.player.setVelocityY(320);
            }
        }       
    }
};

