const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1820,
    height: 980,
    backgroundColor:'#0000FF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Game, Game1],
};

const game = new Phaser.Game(config);