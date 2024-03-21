class Game extends Phaser.Scene {
    constructor() {
        super();
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
            console.log("dwdwdw")
        });
    
        this.load.image('player1', 'assets/images/piskel1.png');
        this.load.image('player2', 'assets/images/piskel2.png');

        this.load.image('coin1', 'assets/images/coin1.png');
        this.load.image('coin2', 'assets/images/coin2.png');

        // load tileset
        this.load.image('tiles', 'assets/tiles/grass.png');

        // load tilemap
        this.load.tilemapTiledJSON('map', 'assets/tiles/map.json');

        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('ceiling', 'assets/images/untitled.png');  
        
        for(let i= 0; i < 500; i++) {
            this.load.image('ground' + i, 'assets/images/ground.png');
            console.log(i)
        }
    };

    create() {
        const map = this.make.tilemap({ 
            key: 'map'
        });
        const tileset = map.addTilesetImage('grass', 'tiles');

        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0 )
        var player1 = this.physics.add.sprite(200, 400, 'player1');
        var coin = this.physics.add.sprite(400, 600, 'coin1');
        var coin1 = this.physics.add.sprite(1000, 600, 'coin1');

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

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

        // Store the player reference for movement
        this.player = player1;

        this.anims.create({
            key: 'coinFrames',
            frames:[
                {key: 'coin1'},
                {key: 'coin2'},
            ],
            frameRate: 2,
            repeat: -1
        });
        
        coin.setScale(0.2);
        coin.play('coinFrames');
        coin1.setScale(0.2);
        coin1.play('coinFrames');

        // Setup keyboard keys for movement
        this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left,up');

        // Boolean to check if the player is on the ground
        this.isPlayerOnGround = false;

        // Create ground group
        this.groundGroup = this.physics.add.staticGroup();

        // Add ground sprites to the group
        this.groundGroup.create(1000, 980 , 'ground');
        this.groundGroup.create(950, -500, 'ceiling').setScale(2);

        // Check for overlap with ground to update isPlayerOnGround flag
        this.physics.add.collider(player1, this.groundGroup, () => {
            this.isPlayerOnGround = true;
        }, null, this);

        this.physics.add.collider(coin, this.groundGroup);
        this.physics.add.collider(coin1, this.groundGroup);

        this.score = 0;

        // Create score text
        this.scoreText = this.add.text(20, 60, 'Score: 0', { fontSize: '50px', fill: '#fff' });
    
        // Enable collision between player and coin
        this.physics.add.collider(this.player, coin, this.collectCoin, null, this);
        this.physics.add.collider(this.player, coin1, this.collectCoin, null, this);
    };

    update() {
        this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        this.movePlayer();
    };

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
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: Game,
    width: 1820,
    height: 980,
    backgroundColor:'#0000FF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true // Enable debug mode
        }
    },
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};

const game = new Phaser.Game(config);
