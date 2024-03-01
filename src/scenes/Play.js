class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // frog
        this.frogVelocity = 700
        this.frogMaxVelocity = 800
        this.frogBounce = 0.5

        // hop points
        this.hopPoint = new Phaser.Math.Vector2()
        this.canHop = true

         // rat
         this.ratSpeed = -150
         this.ratSpawnDelay = 1000
         this.ratPos = new Phaser.Math.Vector2()
         this.ratRandom = 0
         this.tempRat = 0
    }

    create(){
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()

        //creation of frog and its properties
        this.frog = this.physics.add.sprite(250, 375).setOrigin(0.5).setScale(0.5)
        this.frog.setCollideWorldBounds(true)
        this.frog.setBounce(this.frogBounce)
        this.frog.setImmovable()
        this.frog.setMaxVelocity(0, this.frogMaxVelocity )
        this.frog.setDragY(this.frogDragY)
        this.frog.setDepth(1)
        this.frog.destroyed = false 

        // set up rat group
        this.ratGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        this.time.delayedCall(this.ratSpawnDelay, () => { 
            this.addRat()
        })
    }

    update() {
        // movement inputs
        if(Phaser.Input.Keyboard.JustDown(cursors.down)) {
            if(this.frog.y < 525 && this.canHop) {
                //hop to test
                this.hopPoint.x = this.frog.x
                this.hopPoint.y = this.frog.y + 150
                this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
                this.canHop = false
            }
        }
        else if(Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if(this.frog.y > 75 && this.canHop) {
                //hop to test
                this.hopPoint.x = this.frog.x
                this.hopPoint.y = this.frog.y - 150
                this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
                this.canHop = false
            }
        }

          // check to see if frog has reached hop point
          const tolerance = 4;

          const distance = Phaser.Math.Distance.BetweenPoints(this.frog, this.hopPoint)
  
          if (this.frog.body.speed > 0)
          {
  
              if (distance < tolerance)
              {
                  this.frog.body.reset(this.hopPoint.x, this.hopPoint.y)
                  this.canHop = true
              }
          }

          // collisions
        this.physics.world.collide(this.frog, this.ratGroup, this.ratCollision, null, this) // rat vs frog
    }

    addRat() {

        this.ratRandom = Phaser.Math.Between(0, 3)

        if(this.ratRandom == 0){
            this.ratPos.y = 75
        }
        else if(this.ratRandom == 1) {
            this.ratPos.y = 225
        }
        else if(this.ratRandom == 2) {
            this.ratPos.y = 375
        }
        else if(this.ratRandom == 3) {
            this.ratPos.y = 525
        }

        this.rat = new Rat(this, this.ratSpeed, this.ratPos.y).setScale(0.5)

        this.ratGroup.add(this.rat)
    }

    ratCollision(frog, rat) {
        console.log('Rats!')
    }
}

