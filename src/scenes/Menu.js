class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload(){
        this.load.path = './assets/'

        // load play/in-game scene assets
        this.load.image('castle', '/img/Scene/castlebasic.png')
        this.load.image('bg', '/img/Scene/BGImage.png')
        this.load.image('fg', '/img/Scene/FG.png')
        this.load.image('lilypad', '/img/Scene/LilyPadNew.png')
        this.load.image('rain', '/img/Scene/rain.png')
        this.load.image('fakecastle', '/img/Scene/castle.png')
        this.load.image('night', '/img/Scene/NightAlpha.png')

        // load HP Bar UI        
        this.load.image('0HP', '/img/HP/0.png') 
        this.load.image('1HP', '/img/HP/1.png') 
        this.load.image('2HP', '/img/HP/2.png') 
        this.load.image('3HP', '/img/HP/3.png') 
        this.load.image('4HP', '/img/HP/4.png') 
        this.load.image('5HP', '/img/HP/5.png') 
        this.load.image('6HP', '/img/HP/6.png') 
        this.load.image('7HP', '/img/HP/7.png') 
        this.load.image('8HP', '/img/HP/8.png') 
        this.load.image('9HP', '/img/HP/9.png') 
        this.load.image('10HP', '/img/HP/10.png')

        // load upgrade UI
        this.load.image('upgradeUI', '/img/UI/Upgrade_UI.png')
        this.load.image('tSelect', '/img/UI/topSelect.png')
        this.load.image('mSelect', '/img/UI/midSelect.png')
        this.load.image('bSelect', '/img/UI/botSelect.png')

        // load title UI
        this.load.image('button', '/img/UI/button.png')
        this.load.image('hbutton', '/img/UI/highlighted button.png')
        this.load.image('title', '/img/UI/title.png')

        // load check boxes
        this.load.image('cBox', '/img/UI/checkbox.png')
        this.load.image('mBox', '/img/UI/checkmark.png')

        // load game over screen
        this.load.image('gameOver', '/img/UI/GameOver.png')

        // load bitmap font
        this.load.bitmapFont('TH', 'font/TH.png', 'font/TH.xml') // Trash Hand found from https://www.dafont.com/trashhand.font by Luce Avérous
        this.load.bitmapFont('wTH', 'font/wTH.png', 'font/wTH.xml') // White Trash Hand
        this.load.bitmapFont('rTH', 'font/rTH.png', 'font/rTH.xml') // Red Trash Hand

        //this.load.audio('music', '/sounds/BattleFrogsTheme.wav')
        this.load.audio('music', '/sounds/FrogThemeDrums.wav')
        this.load.audio('bossmusic', '/sounds/BossMusic2.wav')
        this.load.audio('hopsound', '/sounds/hopsound.wav')
        this.load.audio('swingsound', '/sounds/swing.wav')
        this.load.audio('hitsound', '/sounds/hit.wav')
        this.load.audio('eatsound', '/sounds/eat.wav')
        this.load.audio('spitsound', '/sounds/spit.wav')
        this.load.audio('rainloop', '/sounds/rainloop.wav')
        this.load.audio('winsound', '/sounds/WinSound.wav')
        this.load.audio('screech', '/sounds/ratscreech.wav')
        this.load.audio('thunder', '/sounds/Thunder.wav')
        this.load.audio('ambi', '/sounds/ambience.wav')
        this.load.audio('ratlaugh', '/sounds/ratlaugh.wav')
        this.load.audio('blocksound', '/sounds/blocksound.wav')
        this.load.audio('kingblock', '/sounds/kingBlock.wav')

        // load chracter sprites
        this.load.image('dfly', '/img/Sprites/dfly.png')
        this.load.image('tongue', '/img/Sprites/FrogTongue.png')
        this.load.image('atk', '/img/Sprites/atk.png')
        this.load.image('helmet', '/img/Sprites/helmet.png')

        this.load.spritesheet('frogeat', 'img/Sprites/FrogSheet.png', {
            frameWidth: 128,
            frameHeight: 128
        })
        this.load.spritesheet('ratrun', 'img/Sprites/ratrun.png', {
            frameWidth: 256,
            frameHeight: 128
        })
        this.load.spritesheet('eliteratrun', 'img/Sprites/eliteratrun.png', {
            frameWidth: 256,
            frameHeight: 128
        })
        this.load.spritesheet('purplerat', 'img/Sprites/PurpleRat.png', {
            frameWidth: 256,
            frameHeight: 128
        })
        this.load.spritesheet('ratking', 'img/Sprites/RatKing.png', {
            frameWidth: 240,
            frameHeight: 220
        })
        this.load.spritesheet('dancerat', 'img/Sprites/ratdance.png', {
            frameWidth: 210,
            frameHeight: 374
        })
    }

    create(music){

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        // adding title screen
        this.add.image(centerX, centerY, 'title')
        this.bgMusic = this.sound.add('music', {volume: 1, loop: true})

        // music
        if(!this.musicPlayed){
            this.bgMusic.play()
            this.musicPlayed = true
            //console.log('music play')
        }

        if (this.musicPlayed && this.scene.isActive('playScene')){
            this.musicPlayed = false
            //console.log('music false')
        }

        // add buttons + text on buttons
        this.buttonOne = this.add.image(centerX-150, centerY+20, 'button').setScale(0.75)
        this.buttonOneSelect = this.add.image(centerX-150, centerY+20, 'hbutton').setScale(0.75).setAlpha(0)
        this.buttonTwo = this.add.image(centerX, centerY+170, 'button')
        this.buttonTwoSelect = this.add.image(centerX, centerY+170, 'hbutton').setAlpha(0)
        
        this.tutText = this.add.bitmapText(240, 290, 'TH', 'TUTORIAL').setScale(0.9).setDepth(1)
        this.begText = this.add.bitmapText(395, 428, 'TH', 'BEGIN').setScale(1.25).setDepth(1)
        this.tutWhiteText = this.add.bitmapText(240, 290, 'wTH', 'TUTORIAL').setScale(0.9).setDepth(1).setAlpha(0)
        this.begWhiteText = this.add.bitmapText(395, 428, 'wTH', 'BEGIN').setScale(1.25).setDepth(1).setAlpha(0)

        this.selectionOne = true
        this.selectionTwo = false

        // set tutorial to false
        this.tutorial = false

        // add cursor tool tip
        this.add.bitmapText(15, 560, 'TH', 'Press (SPACE) to select').setScale(0.4)
    }

    update(){
            // highlight text
            if(this.selectionOne){
                this.buttonOne.setAlpha(0)
                this.buttonOneSelect.setAlpha(1)
                this.buttonTwo.setAlpha(1)
                this.buttonTwoSelect.setAlpha(0)

                this.tutText.setAlpha(0)
                this.tutWhiteText.setAlpha(1)
                this.begText.setAlpha(1)
                this.begWhiteText.setAlpha(0)
            }

            else {
                this.buttonOne.setAlpha(1)
                this.buttonOneSelect.setAlpha(0)
                this.buttonTwo.setAlpha(0) 
                this.buttonTwoSelect.setAlpha(1)
                
                this.tutText.setAlpha(1)
                this.tutWhiteText.setAlpha(0)
                this.begText.setAlpha(0)
                this.begWhiteText.setAlpha(1)
            }

            if((Phaser.Input.Keyboard.JustDown(keyDOWN) || Phaser.Input.Keyboard.JustDown(cursors.down)) && this.selectionOne){
                 this.selectionOne = false   
                 this.selectionTwo = true   
            }
            else if((Phaser.Input.Keyboard.JustDown(keyUP) || Phaser.Input.Keyboard.JustDown(cursors.up)) && !this.selectionOne){
                 this.selectionOne = true
                 this.selectionTwo = false
                }

            if(Phaser.Input.Keyboard.JustDown(keySPACE) || Phaser.Input.Keyboard.JustDown(keyENTER)) {
                if(this.selectionOne){ //guide/ tutorial
                    this.tutorial = true
                    this.scene.start('playScene', this)
                }
    
                else if(this.selectionTwo){ // regular game
                    this.scene.start('playScene', this)
                }
            }

    }
}