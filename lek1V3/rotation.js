class Example extends Phaser.Scene {

    singleImage;
    atlasFrame;

    constructor() {
        super();
    }

    preload() {
        this.load.image('atari', 'assets/images/phaser.png');
        this.load.image('atlas', 'assets/images/phaser.png');
        this.load.audio('background', 'assets/audio/audio.mp3')
    }

    create() {
        this.atlasFrame = this.add.image(700, 300, 'atlas');
        this.singleImage = this.add.image(300, 300, 'atari');

        var music = this.sound.add('background');
        music.play()
        music.setLoop(true);
    }

    update() {
        this.atlasFrame.rotation += 0.01;
        this.singleImage.rotation -= 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: Example,
    width: 1920,
    height: 1080
};

const game = new Phaser.Game(config);
