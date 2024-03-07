class FrogProjectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnX, spawnY) {
        // call Phaser Physics Sprite constructor
        super(scene, spawnX, spawnY, 'helmet')

        this.parentScene = scene               

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity)         
        this.setImmovable()                    
    }

    update() {
        this.rotation += 0.025

        if(this.x > game.config.width) {
            this.destroy()
        }
    }
}