class Menu extends Phaser.Scene {
    
    preload ()
    {
    
    }
    
    create ()
    {
        // add box around text
        let box = this.add.rectangle(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 300, 100, 0x000000).setOrigin(0.5);
        // set depth of text to be above 
        let text = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Start', { fontFamily: 'Comic Sans', fontSize: '100px', color: '#FFFFFF'}).setOrigin(0.5).setDepth(1);
        let header = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 5, 'Milk Excalibur', { fontFamily: 'Comic Sans', fontSize: '150px', color: '#FFFFFF'}).setOrigin(0.5).setDepth(1);

    }
    
    update ()
    {
        // if you click inside the box variable then it will change the hex color of the box
        if (this.input.activePointer.x > this.sys.game.config.width / 2 - 150 && this.input.activePointer.x < this.sys.game.config.width / 2 + 150 && this.input.activePointer.y > this.sys.game.config.height / 2 - 50 && this.input.activePointer.y < this.sys.game.config.height / 2 + 50)
        {
            this.children.list[0].setFillStyle(808080);
        }
        else
        {
            this.children.list[0].setFillStyle(0x000000);
        }
        // if you click inside the box variable then it will change the scene
        if (this.input.activePointer.leftButtonDown() && this.input.activePointer.x > this.sys.game.config.width / 2 - 150 && this.input.activePointer.x < this.sys.game.config.width / 2 + 150 && this.input.activePointer.y > this.sys.game.config.height / 2 - 50 && this.input.activePointer.y < this.sys.game.config.height / 2 + 50)
        {
            this.scene.start('GameScene3');
        }
    }
}