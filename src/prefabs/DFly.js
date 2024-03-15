class DFly extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY, 'dfly')

        this.parentScene = scene  

        this.laneY = laneY
        
        this.hp = 1
        this.hit = false 
        this.spitHit = false

        this.speed = velocity

        this.died = false

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
                //console.log(this.goUp)
            }
            else {
                this.setVelocityY(-100)
                //console.log(this.goUp)
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
        if(castle){
            this.died = true
        }
        this.parentScene.tweens.add({
            targets: this,
            x: this.x + this.parentScene.knockBackForce,
            ease: 'Linear',
            duration: 75,
            onComplete: () => {
                this.knockedBack = false
                if(this.hp < 1 || castle){
                    this.destroy()
                    this.parentScene.currentXP++
                    this.parentScene.xpText.text = this.parentScene.currentXP + '/' + this.parentScene.xpNeed
                }
                else {
                    this.setVelocityX(this.speed)
                }
                this.parentScene.knockBackForce = this.parentScene.baseKnockBackForce
            }
        })
    }
}