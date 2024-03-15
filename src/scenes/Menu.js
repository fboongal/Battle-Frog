class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload(){
        this.load.path = './assets/'

        this.load.image('castle', '/img/castlebasic.png')
        this.load.image('tongue', '/img/FrogTongue.png')
        this.load.image('bg', '/img/BGImage.png')
        this.load.image('atk', '/img/atk.png')
        this.load.image('lilypad', '/img/LilyPadNew.png')
        this.load.image('rat', '/img/rat.png')
        this.load.image('dfly', '/img/dfly.png')
        this.load.image('helmet', '/img/helmet.png')
        this.load.image('rain', '/img/rain.png')
        this.load.image('button', '/img/button.png')
        this.load.image('title', '/img/title.png')
        this.load.image('fakecastle', '/img/Castle.png')

        //this.load.audio('music', '/sounds/BattleFrogsTheme.wav')
        this.load.audio('music', '/sounds/FrogThemeDrums.wav')
        this.load.audio('bossmusic', '/sounds/BossTheme.wav')
        this.load.audio('hopsound', '/sounds/hopsound.wav')
        this.load.audio('swingsound', '/sounds/swing.wav')
        this.load.audio('hitsound', '/sounds/hit.wav')
        this.load.audio('eatsound', '/sounds/eat.wav')
        this.load.audio('spitsound', '/sounds/spit.wav')
        this.load.audio('rainloop', '/sounds/rainloop.wav')
        this.load.audio('winsound', '/sounds/WinSound.wav')

        this.load.spritesheet('frogeat', 'img/FrogSheet.png', {
            frameWidth: 128,
            frameHeight: 128
        })

        this.load.spritesheet('ratrun', 'img/ratrun.png', {
            frameWidth: 256,
            frameHeight: 128
        })

        this.load.spritesheet('eliteratrun', 'img/eliteratrun.png', {
            frameWidth: 256,
            frameHeight: 128
        })

        this.load.spritesheet('purplerat', 'img/PurpleRat.png', {
            frameWidth: 256,
            frameHeight: 128
        })

        this.load.spritesheet('ratking', 'img/RatKing.png', {
            frameWidth: 240,
            frameHeight: 220
        })
    }

    create(){
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()

        // adding title screen
        this.add.image(centerX, centerY, 'title')
        this.bgMusic = this.sound.add('music', {volume: 1, loop: true})

        // music
        if(!this.musicPlayed){
            this.bgMusic.play()
            this.musicPlayed = true
        }

        if (this.musicPlayed && this.scene.isActive('playScene')){
            this.musicPlayed = false
        }

        // add buttons + text
        this.add.image(centerX, centerY+170, 'button')
        this.add.image(centerX-150, centerY+20, 'button').setScale(0.75)

    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.scene.start('playScene', this)
        }
    }
}