class DFly extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY, 'dfly')

        this.parentScene = scene  

        this.laneY = laneY
        
        this.hp = 1
        this.hit = false 
        this.spitHit = false

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity)         
        this.setImmovable()                    
        this.newDFly = true

        this.atkKnocked = false
        this.goUp = false
    }

    update() {
        if(this.x < 0) {
            this.destroy()
        }

        const tolerance = 4

        this.distance = this.y - this.laneY
        if(this.distance < 0) {
            this.distance *= -1
        }

        if (this.distance < tolerance){
            this.setVelocityY(0)
            //console.log('tolerable')
        }
        else{
            if(this.goUp){
                this.setVelocityY(100)
                console.log(this.goUp)
            }
            else {
                this.setVelocityY(-100)
                console.log(this.goUp)
            }
        }
    }

    hitTimer() {
        
        this.parentScene.time.delayedCall(150, () => { 
            this.hit = false 
        })
    }

    spitHitTimer() {
        this.parentScene.time.delayedCall(500, () => { 
            this.spitHit = false 
        })
    }
}