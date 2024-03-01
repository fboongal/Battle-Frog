class DFly extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY)

        this.parentScene = scene               

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity)         
        this.setImmovable()                    
        this.newDFly = true
    }

    update() {
        if(this.newDFly && this.x < game.config.width/2) {
            this.parentScene.addDFly(this.parent, this.velocity)
            this.newDFly = false
        }

        if(this.x < 0) {
            this.destroy()
        }
    }
}