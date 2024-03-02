class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }

    create (score) {
        //this.add.sprite(game.config.width/2, game.config.height/2, 'gameover').setScale(1.75)

        this.myscore = score

        console.log(this.myscore)
        keyMENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyRESTART = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        let timeConfig = {
            frontFamily: 'Courier',
            fontSize: '42px',
            //backgroundColor: 'rgba(128, 128, 128, 0.15)',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 800
        }

        this.survivalTime = this.add.text(game.config.width/2, game.config.height/2, 'The castle stood for ' + this.myscore + ' seconds', timeConfig).setOrigin(0.5, 0)
        this.restartText = this.add.text(game.config.width/2, game.config.height/2 + 100, 'Press R to restart', timeConfig).setOrigin(0.5, 0)
    }

    update() {

        if(Phaser.Input.Keyboard.JustDown(keyRESTART)){
            //this.sound.play('pickup')
            this.scene.start('menuScene')
        }
    }
}