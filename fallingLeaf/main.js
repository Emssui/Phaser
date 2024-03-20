class Example extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ddddd'
            }
        });

        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ddddd'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
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
        
        // Preload tree image
        this.load.image('tree', 'assets/images/tree.png');
        this.load.image('leaf', 'assets/images/leaf.png');

        for(let i= 0; i < 500; i++) {
            this.load.image('tree' + i, 'assets/images/tree.png');
        }

        this.load.video('background', 'assets/images/backimg.mp4', 'loadeddata', false, true);

        this.load.audio('scream1', 'assets/audio/scream1.mp3');
        this.load.audio('scream2', 'assets/audio/scream2.mp3');
        this.load.audio('scream3', 'assets/audio/scream3.mp3');
        this.load.audio('scream4', 'assets/audio/scream4.mp3');
    }

    create() {
        // Add tree image
        var tree = this.add.image(900, 450, 'tree');
        tree.setScale(2);
        tree.setDepth(1)

        // Add background video
        let background = this.add.video(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background');
        background.setDepth(0);
        background.setLoop(true);
        background.play(true);

        // Set up a timer event to create leaves every 6 seconds
        this.time.addEvent({
            delay: 6000,
            loop: true,
            callback: this.createLeaves,
            callbackScope: this
        });

        // Set up world bounds collision event
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);
        this.physics.world.on('worldbounds', this.handleWorldBoundsCollision, this);
    }

    createLeaves() {
        const leafPositions = [
            { x: Phaser.Math.Between(570, 1200), y: 340 },
        ];

        const scream1 = this.sound.add('scream1');
        const scream2 = this.sound.add('scream2'); 
        const scream3 = this.sound.add('scream3'); 
        const scream4 = this.sound.add('scream4'); 

        const audios = [scream1, scream2, scream3, scream4];
        
        leafPositions.forEach(pos => {
            let randomAudio = audios[Math.floor(Math.random() * audios.length)];
            randomAudio.play();

            const leaf = this.physics.add.image(pos.x, pos.y, 'leaf');
            leaf.setDepth(2)

            this.cameras.main.startFollow(leaf)
            
            leaf.setScale(Math.random());
            leaf.setCollideWorldBounds(true);
            leaf.setBounce(0);
            leaf.setDrag(100);
            leaf.setGravityY(300);
            
            let random = Math.floor(Math.random() * 160)
            this.tweens.add({
                targets: leaf,
                angle: leaf.angle + random,
                duration: 1000,
                repeat: 0 // Make the sway repeat indefinitely
            });
        });
        this.cameras.main.zoomTo(2, 1000); // Zoom to a scale of 2 over 1 second
        this.time.delayedCall(1500, () => {
            this.cameras.main.zoomTo(1, 1500); // Zoom back to the original scale of 1 over 1 second
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: Example,
    width: 1920,
    height: 860,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
