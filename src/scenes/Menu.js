class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload(){
        this.load.path = './assets/'

        this.load.image('castle', '/img/castle.png')
        this.load.image('tongue', '/img/FrogTongue.png')
        this.load.image('bg', '/img/BGImage.png')
        this.load.image('atk', '/img/atk.png')
        this.load.image('lilypad', '/img/LilyPadNew.png')
        this.load.image('rat', '/img/rat.png')
        this.load.image('dfly', '/img/dfly.png')
        this.load.image('helmet', '/img/helmet.png')
        this.load.image('rain', '/img/rain.png')

        this.load.audio('music', '/sounds/BattleFrogsTheme.wav')
        this.load.audio('hopsound', '/sounds/hopsound.wav')
        this.load.audio('swingsound', '/sounds/swing.wav')
        this.load.audio('hitsound', '/sounds/hit.wav')
        this.load.audio('eatsound', '/sounds/eat.wav')
        this.load.audio('spitsound', '/sounds/spit.wav')
        this.load.audio('rainloop', '/sounds/rainloop.wav')

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
    }

    create(){
        this.bgMusic = this.sound.add('music', {volume: 1, loop: true})

        if(!this.musicPlayed){
            this.bgMusic.play()
            this.musicPlayed = true
        }

        if (this.musicPlayed && this.scene.isActive('playScene')){
            this.musicPlayed = false
        }

        this.scene.start('playScene')
    }

    update(){

    }
}