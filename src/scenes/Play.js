class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
         // rat
         this.ratSpeed = -150
         this.ratSpawnDelay = 1000
         this.ratPos = new Phaser.Math.Vector2()
         this.ratRandom = 0
         this.tempRat = 0
    }

    create(){
        // set up rat group
        this.ratGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        this.time.delayedCall(this.ratSpawnDelay, () => { 
            this.addRat()
        })
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
}

