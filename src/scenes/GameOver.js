class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }

    create (score, menuScene) {
        //this.add.sprite(game.config.width/2, game.config.height/2, 'gameover').setScale(1.75)

        this.myscore = score
        this.theMenuScene = menuScene

        console.log(this.myscore)
        keyMENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyRESTART = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        
        this.add.image(centerX, centerY, 'gameOver')
        this.add.bitmapText(centerX, centerY - 50, 'rTH', 'The Castle has been Seiged!').setOrigin(0.5, 0).setScale(0.925)
        this.survivalTime = this.add.bitmapText(centerX, centerY + 20, 'TH','You defended the castle for ' + this.myscore + ' seconds').setOrigin(0.5, 0).setScale(0.45)
        this.restartText = this.add.bitmapText(centerX, centerY + 85, 'TH', 'Defend Once More?').setOrigin(0.5, 0).setScale(0.65)

        // ye or nay
        this.yay = this.add.bitmapText(centerX - 60, centerY + 160, 'TH', 'YAY').setOrigin(0.5).setScale(0.9).setAlpha(0)
        this.nay = this.add.bitmapText(centerX + 60, centerY + 160, 'TH', 'NAY').setOrigin(0.5).setScale(0.9).setAlpha(1)

        // red ye or nay
        this.yayRed = this.add.bitmapText(centerX - 60, centerY + 160, 'rTH', 'YAY').setOrigin(0.5).setScale(0.9).setAlpha(1)
        this.nayRed = this.add.bitmapText(centerX + 60, centerY + 160, 'rTH', 'NAY').setOrigin(0.5).setScale(0.9).setAlpha(0)

        // set selections
        this.selectionOne = true
        this.selectionTwo = false
        }

    update() {
        // set input keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // set selections
        if(this.selectionOne) {
            this.yayRed.setAlpha(1)
            this.yay.setAlpha(0)

            this.nay.setAlpha(1)
            this.nayRed.setAlpha(0)
        }
        else if(this.selectionTwo) {
            this.nayRed.setAlpha(1)
            this.nay.setAlpha(0)

            this.yay.setAlpha(1)
            this.yayRed.setAlpha(0)
        }

        if(Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.selectionOne){
            this.selectionOne = false    
            this.selectionTwo = true   
       }
       else if(Phaser.Input.Keyboard.JustDown(keyLEFT) && !this.selectionOne){
            this.selectionOne = true
            this.selectionTwo = false
           }

       if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
           if(this.selectionOne){
                this.scene.start('playScene', this.theMenuScene)
           }

           else if(this.selectionTwo){
                this.scene.stop('playScene')
                this.scene.start('menuScene')
           }
       }
    }
}