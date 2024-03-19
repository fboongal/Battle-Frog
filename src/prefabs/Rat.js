class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY, whichRat) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 125, spawnY, 'ratrun')

        this.laneY = laneY //which lane is this rat in

        this.parentScene = scene

        this.isKing = false // is this rat the king?

        this.ratSpeedOffset = Phaser.Math.Between(-10, 10) // speed offset

        this.isGettingDestroyed = false //is this rat ok to destroy?


        //set rat paremeters based on which kind of rat it is
        if(whichRat == 0) { //base
            this.hp = 100
            this.speed = velocity + this.ratSpeedOffset
        }
        else if(whichRat == 1){// eilte
            this.hp = 300
            this.speed = velocity + this.ratSpeedOffset
        }
        else if(whichRat == 2){ //purple
            this.hp = 800
            this.speed = velocity + 30 + this.ratSpeedOffset
        }

        else if(whichRat == 3){ //king
            this.hp = 15000
            this.speed = velocity - 20
            this.isKing = true
        }

        this.whichRat = whichRat
        
        this.hit = false     
        this.spitHit = false
        
        this.died = false

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(this.speed)     
        this.setImmovable()                    
        //this.newRat = true
        
        this.eatKnocked = false
        this.goUp = false

        this.gameOver = false

        //boss idea! Boss is very fast (maybe gets faster over time) 
        //but gets knocked back very far in comparison to other rats (maybe you have an ancient shield that protects from strong foes (like Link's Master Sword))
        //creating a juggle like gameplay
        //big boss health bar of course

    }
    update() {
        //if moved away from lane Y axis, move back lane Y axis
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
                //console.log(this.goUp)
            }
            else {
                this.setVelocityY(-100)
                //console.log(this.goUp)
            }
        }

        if(this.x < 0) { // if somehow goes out of screen kill it
            this.destroy()
        }
    }

    hitTimer() { //cant be hit again for this long
        this.parentScene.time.delayedCall(150, () => { 
            this.hit = false 
        })
    }

    spitHitTimer() { //can't be spat at again for this long
        this.parentScene.time.delayedCall(500, () => { 
            this.spitHit = false 
        })
    }

    knockBack(castle) {
        if(!this.gameOver){
            if(castle){
                this.died = true
            }
            this.parentScene.tweens.add({ // enemy gets knocked back
                targets: this,
                x: this.x + this.parentScene.knockBackForce,
                ease: 'Linear',
                duration: 75,
                onComplete: () => {
                    this.knockedBack = false // allow to be knocked back again
                    if(this.hp < 1 || castle){ //if enemy has no health left or has collided with the castle
                        if(!castle){ // if didn't get hit by castle...

                            //give xp based on which rat player killed
                            if(this.whichRat == 0) {
                                this.parentScene.currentXP++
                            }
                            else if(this.whichRat == 1){
                                this.parentScene.currentXP += 2
                            }
                            else if(this.whichRat == 2){
                                this.parentScene.currentXP += 3
                            }

                            this.parentScene.xpText.text = this.parentScene.currentXP + '/' + this.parentScene.xpNeed
                        }
    
                        //if this rat isn't the king...
                        if(!this.isKing){
                            this.alpha = 0
                            this.setVelocityX(0)
                            this.body.checkCollision.none = true
                            this.parentScene.time.delayedCall(2000, () => { 
                                this.destroy()
                            })
                            //tutorial
                            if(this.parentScene.theMenuScene.tutorial && castle){
                                this.parentScene.addRat()
                            }//tutorial
                        }
    
                        //if this is the king... and wasn't knocked back from the castle
                        if(this.isKing && !castle){
                            this.setVelocityX(0)
                            this.gameOver = true
                            this.parentScene.destroyAll.setPosition(centerX, centerY)
                            this.parentScene.theKingHasFallen()
                        }
                        else if (this.isKing && castle) {
                            this.setVelocityX(0)
                            this.parentScene.GameOver(true)
                            console.log('game over')
                        }
                    }
                    
                    else if(this.hp > 0){ // if enemy is still alive
                        this.setVelocityX(this.speed)
                    }
                    this.parentScene.knockBackForce = this.parentScene.baseKnockBackForce
                }
            })
        }

    }
}