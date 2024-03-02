class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload(){
        this.load.path = './assets/'

        this.load.image('castle', '/img/castle.png')
    }

    create(){
        this.scene.start('playScene')
    }

    update(){

    }
}