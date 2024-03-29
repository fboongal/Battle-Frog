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
        this.rotation += 0.025 // rotate the object

        if(this.x > game.config.width) { // when it goes past the screen
            if(this.parentScene.theMenuScene.tutorial){
                this.parentScene.addDFly() //spawn another fly during tutorial
            }
            this.parentScene.enemiesHit = 0 // resets enemies hit counter
            this.destroy()
            
        }
    }
}