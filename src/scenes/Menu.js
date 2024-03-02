class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload(){
        this.load.path = './assets/'

        this.load.image('castle', '/img/castle.png')
        this.load.image('tongue', '/img/FrogTongue.png')

        this.load.audio('music', '/sounds/BattleFrogsTheme.wav')

        this.load.spritesheet('frogeat', 'img/FrogEat.png', {
            frameWidth: 128,
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