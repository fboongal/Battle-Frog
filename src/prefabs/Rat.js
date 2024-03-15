class Rat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY, laneY, whichRat) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 125, spawnY, 'ratrun')

        this.laneY = laneY

        this.parentScene = scene

        this.isKing = false

        if(whichRat == 0) {
            this.hp = 100
            this.speed = velocity
        }
        else if(whichRat == 1){
            this.hp = 300
            //this.setTexture('eliteratrun')
            this.speed = velocity
        }
        else if(whichRat == 2){
            this.hp = 800
            //this.setTexture('purpleratrun')
            this.speed = velocity + 30
        }

        else if(whichRat == 3){
            this.hp = 15000
            //this.setTexture('purpleratrun')
            this.speed = velocity - 30
            this.isKing = true
        }
        
        this.hit = false     
        this.spitHit = false
        
        this.died = false

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(this.speed) 
        //this.setDragX(5)         
        this.setImmovable()                    
        this.newRat = true
        
        this.eatKnocked = false
        this.goUp = false

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

        //console.log(distance)

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

        if(this.x < 0) {
            this.destroy()
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
                if(this.hp < 1 || castle){ //if enemy has no health left or has collided with the castle
                    //change  instead of destroy
                    this.alpha = 0
                    this.setVelocityX(0)
                    this.body.checkCollision.none = true
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