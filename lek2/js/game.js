class Example extends Phaser.Scene {
    constructor() {
        super();
    };

    preload() {
        this.load.image('player1', 'assets/images/piskel1.png');
        this.load.image('player2', 'assets/images/piskel2.png');

        this.load.image('ground', 'assets/images/ground.png');
    };

    create() {
        var player1 = this.physics.add.sprite(200, 400, 'player1');

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
        player1.setCollideWorldBounds(true);
        player1.setBounce(0);
        player1.setDrag(100);
        player1.setGravityY(300);

        // Store the player reference for movement
        this.player = player1;

        // Setup keyboard keys for movement
        this.keys = this.input.keyboard.addKeys('W,A,S,D,right,left');

        // Boolean to check if the player is on the ground
        this.isPlayerOnGround = false;

        // Create ground group
        this.groundGroup = this.physics.add.staticGroup();

        // Add ground sprites to the group
        this.add.image(1000, 650, 'ground');

        // Check for overlap with ground to update isPlayerOnGround flag
        this.physics.add.collider(player1, this.groundGroup, function() {
            this.isPlayerOnGround = true;
        }, null, this);
    };

    update() {
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
        if (this.keys.W.isDown && this.isPlayerOnGround) {
            // Move the player upward (jump)
            this.player.setVelocityY(-320);
            // Set the player to not be on the ground
            this.isPlayerOnGround = false;
        }
    }
};

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: Example,
    width: 1820,
    height: 980,
    backgroundColor:'#0000FF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
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
