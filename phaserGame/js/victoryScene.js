class Victory extends Phaser.Scene {
    constructor () {
        super({ key: 'VictoryScene'});
    }

    preload () {
        this.load.audio('victory', 'assets/audios/victory.mp3');
    }
    
    create () {
        this.over = this.sound.add('victory');
        this.over.volume = 0.4;
        this.over.play();

        this.cameras.main.setBackgroundColor(0xFFFF00); 

        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 120, 'Milking The Excalibur' , { fontSize: '50px', fill: '#8B0000' }).setOrigin(0.5);       
        // add box around text
        let box = this.add.rectangle(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 300, 100, 0xFFFF00).setOrigin(0.5);
        // set depth of text to be above 
        let text1 = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Restart', { fontFamily: 'Comic Sans', fontSize: '100px', color: '#8B0000'}).setOrigin(0.5).setDepth(1);
        let header = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 5, 'VICTORY', { fontFamily: 'Comic Sans', fontSize: '170px', color: '#8B0000'}).setOrigin(0.5).setDepth(1);
    }
    
    update () {

        // if you click inside the box variable then it will change the scene
        if (this.input.activePointer.leftButtonDown() && this.input.activePointer.x > this.sys.game.config.width / 2 - 150 && this.input.activePointer.x < this.sys.game.config.width / 2 + 150 && this.input.activePointer.y > this.sys.game.config.height / 2 - 50 && this.input.activePointer.y < this.sys.game.config.height / 2 + 50)
        {   
            this.scene.start('GameScene');
            this.sound.stopAll();
            scoreManager.score = 0;
            scoreManager.level = 0; 
        }

        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 200, 'Total Score: ' + scoreManager.score, { fontSize: '50px', fill: '#8B0000' }).setOrigin(0.5);               
    }
}
