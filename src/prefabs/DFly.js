class DFly extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY, 'dfly')

        this.parentScene = scene  

        this.laneY = laneY //which lane
        
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
        const tolerance = 4

        this.distance = this.y - this.laneY
        if(this.distance < 0) {
            this.distance *= -1
        }

        if (this.distance < tolerance){
            this.setVelocityY(0)
        }
        else{
            if(this.goUp){
                this.setVelocityY(100)
            }
            else {
                this.setVelocityY(-100)
            }
        }

        if(this.x < 0) {
            this.destroy()
        }
    }

    hitTimer() { // wait before getting attacked again
        
        this.parentScene.time.delayedCall(150, () => { 
            this.hit = false 
        })
    }

    spitHitTimer() { // wait before getting spat at again
        this.parentScene.time.delayedCall(500, () => { 
            this.spitHit = false 
        })
    }

    knockBack(castle) {
        if(castle){
            this.died = true
        }
        this.parentScene.tweens.add({ // knock back the fly
            targets: this,
            x: this.x + this.parentScene.knockBackForce,
            ease: 'Linear',
            duration: 75,
            onComplete: () => { 
                this.knockedBack = false
                if(this.hp < 1 || castle){ //fly grants xp and dies
                    if(!castle){
                        this.parentScene.currentXP++
                    }

                    this.parentScene.xpText.text = this.parentScene.currentXP + '/' + this.parentScene.xpNeed

                    //tutorial
                    if(this.parentScene.theMenuScene.tutorial && castle){
                        this.parentScene.addDFly()
                    }//tutorial

                    this.destroy()
                }
                else {
                    this.setVelocityX(this.speed)
                }
                this.parentScene.knockBackForce = this.parentScene.baseKnockBackForce
            }
        })
    }
}