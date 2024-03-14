class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY, elite) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY, 'ratrun')

        this.laneY = laneY

        this.parentScene = scene
        if(!elite) {
            this.hp = 100
        }
        else {
            this.hp = 300
            this.setTexture('eliteratrun')
        }
        
        this.hit = false     
        this.spitHit = false

        this.speed = velocity
        
        this.died = false

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

    knockBack(castle) {
        this.parentScene.tweens.add({
            targets: this,
            x: this.x + this.parentScene.knockBackForce,
            ease: 'Linear',
            duration: 75,
            onComplete: () => {
                this.knockedBack = false
                if(this.hp < 1 || castle){ //if enemy has no health left or has collided with the castle
                    //change  instead of destroy
                    this.alpha = 0
                    this.setVelocityX(0)
                    this.body.checkCollision.none = true
                    this.died = true
                    if(!castle){
                        this.parentScene.currentXP++
                        this.parentScene.xpText.text = this.parentScene.currentXP + '/' + this.parentScene.xpNeed
                    }


                    this.parentScene.time.delayedCall(2000, () => { 
                        this.destroy()
                    })
                }
                
                else if(this.hp > 0){ // if enemy is still alive
                    this.setVelocityX(this.speed)
                }
                this.parentScene.knockBackForce = this.parentScene.baseKnockBackForce
            }
        })
    }
}