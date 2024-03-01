class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY)

        this.parentScene = scene               

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity) 
        //this.setDragX(5)         
        this.setImmovable()                    
        this.newRat = true          
    }

    update() {
        if(this.newRat && this.x < game.config.width) {
            this.parentScene.addRat(this.parent, this.velocity)
            this.newRat = false
        }

        if(this.x < 0) {
            this.destroy()
        }
    }
}