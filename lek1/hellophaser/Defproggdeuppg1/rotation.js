
class Example extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('atari', 'assets/images/phaser.png');
        this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
    }

    create() {
        this.atlasFrame = this.add.image(300, 100, 'atlas', 'dragonwiz');
        this.singleImage = this.add.image(300, 300, 'atari');
    }

    update() {
        this.atlasFrame.rotation += 0.01;
        this.singleImage.rotation += 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
