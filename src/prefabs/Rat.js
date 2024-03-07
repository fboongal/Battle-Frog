class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY, elite) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY, 'ratrun')

        this.laneY = laneY

        this.parentScene = scene
        if(!elite) {
            this.hp = 1
        }
        else {
            this.hp = 3
            this.setTexture('eliteratrun')
        }
        
        this.hit = false     
        this.spitHit = false           

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity) 
        //this.setDragX(5)         
        this.setImmovable()                    
        this.newRat = true
        
        this.eatKnocked = false
        this.goUp = false
    }

    update() {
        if(this.x < 0) {
            this.destroy()
        }

        //if moved away from lane Y axis, move back lane Y axis

        const tolerance = 4

        this.distance = this.y - this.laneY
        if(this.distance < 0) {
            this.distance *= -1
        }

        //console.log(distance)

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