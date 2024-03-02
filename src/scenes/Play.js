class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        //game timer
        this.timer = 0

        // frog
        this.frogVelocity = 800
        this.frogMaxVelocity = 800
        this.frogBounce = 0.5
        this.frogProjectileSpeed = 300

        // hop points
        this.hopPoint = new Phaser.Math.Vector2()
        this.canHop = true

        // hop buffer
        this.pressedDown = false
        this.pressedUp = false
        this.inputBufferTimeUp = 0
        this.inputBufferTimeDown = 0

        // attack buffer
        this.pressedAtk = false
        this.inputBufferTimeAtk = 0
        
        // eat buffer
        this.pressedEat = false
        this.inputBufferTimeEat = 0

         // rat
         this.ratSpeed = -150
         this.ratSpawnDelay = 1000
         this.ratStartSpawnDelay = 1000
         this.ratPos = new Phaser.Math.Vector2()
         this.ratRandom = 0
         this.tempRat = 0

         // dragon fly 
         this.dFlySpeed = -200
         this.dFlyStartSpawnDelay = 3000
         this.dFlySpawnDelay = 6000
         this.dFlyPos = new Phaser.Math.Vector2()
         this.dFlyRandom = 0
         this.tempDFly = 0
         this.dFlyEaten = false

         // castle
         this.castleHP = 10
    }

    create(){
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()
        
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        // castle sprite
        this.castle = this.physics.add.sprite(100, game.config.height/2, 'castle')
        this.castle.setImmovable()

        //creation of frog and its properties
        this.frog = this.physics.add.sprite(250, 375).setOrigin(0.5).setScale(0.5)
        this.frog.setCollideWorldBounds(true)
        this.frog.setBounce(this.frogBounce)
        this.frog.setImmovable()
        this.frog.setMaxVelocity(this.frogMaxVelocity, this.frogMaxVelocity )
        this.frog.setDragY(this.frogDragY)
        this.frog.setDepth(1)
        this.frog.destroyed = false 

        // set up rat group
        this.ratGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        this.time.delayedCall(this.ratStartSpawnDelay, () => { 
            this.addRat()
        })

        // set up dragonfly group
        this.dFlyGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        this.time.delayedCall(this.dFlyStartSpawnDelay, () => { 
            this.addDFly()
        })

        //set up frog projectile group
        this.frogProjectileGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })

        // Create the attack sprite, but set it initially inactive
         this.attack = this.physics.add.sprite(-300, 0).setOrigin(0.5).setActive(false)
         this.attack.setSize(150, 75)

         // Handle overlap between attack and rat
         this.physics.add.overlap(this.attack, this.ratGroup, this.attackRatCollision, null, this)

        // create the eat sprite, but set it initially inactive
         this.eat = this.physics.add.sprite(-300, 0).setOrigin(0.5).setActive(false)
         this.eat.setSize(300, 75)

        // Handle overlap between eat and dFly
         this.physics.add.overlap(this.eat, this.dFlyGroup, this.eatDFlyCollision, null, this)

        // challenge timer that increases spawn rate of enemies and dFlys
        this.challengeTimer = this.time.addEvent({
            delay: 15000,
            callback: this.addChallenge,
            callbackScope: this,
            loop: true
        })

        // spawn enemies every X seconds
        this.ratSpawnTimer = this.time.addEvent({
            delay: this.ratSpawnDelay,
            callback: this.addrat,
            callbackScope: this,
            loop: true
        })

        // spawn dFlys every 5 seconds
        this.dFlySpawnTimer = this.time.addEvent({
            delay: this.dFlySpawnDelay,
            callback: this.addDFly,
            callbackScope: this,
            loop: true
        })

        // ingame timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.addTime,
            callbackScope: this,
            loop: true
        })

        let timeConfig = {
            frontFamily: 'Courier',
            fontSize: '42px',
            //backgroundColor: 'rgba(128, 128, 128, 0.15)',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }

        this.timerText = this.add.text(game.config.width/2, 0, this.timer, timeConfig).setOrigin(0.5, 0)
        this.castleText = this.add.text(100, 0, this.castleHP, timeConfig).setOrigin(0.5, 0)
    }

    update() {
        // new hop input
        if(Phaser.Input.Keyboard.JustDown(cursors.down) || Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.keyDownCode()
        }

        else if(Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.keyUpCode()
        }

        // attack input
        if(Phaser.Input.Keyboard.JustDown(cursors.right) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.pressedAtk = true
            this.inputBufferTimeAtk = this.time.delayedCall(150, () => { 
                this.pressedAtk = false
            })
        }


        
        // eat input
        if(Phaser.Input.Keyboard.JustDown(cursors.left) || Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.pressedEat = true
            this.inputBufferTimeEat = this.time.delayedCall(150, () => {
                this.pressedEat = false
            })
        }

        // hopping stuff
        if(keyDOWN.isDown) {
            this.keyDownCode()
        }
        else if(keyUP.isDown){
            this.keyUpCode()
        }

        this.hoppingCode() // runs hopping code
        this.attackCode()// runs attack code
        this.eatCode()// runs eat/spit code
        this.collisions()// runs collisions
        
    }

    collisions() {
        // collisions
        this.physics.world.collide(this.frog, this.ratGroup, this.ratCollision, null, this) // rat vs frog
        this.physics.world.collide(this.frog, this.dFlyGroup, this.dFlyCollision, null, this) // dragon fly vs frog
        this.physics.world.collide(this.frogProjectileGroup, this.ratGroup, this.frogProjectileEnemyCollision, null, this) //frog projectile vs enemy
        this.physics.world.collide(this.frogProjectileGroup, this.dFlyGroup, this.frogProjectileEnemyCollision, null, this) //frog projectile vs dFly
        this.physics.world.collide(this.castle, this.ratGroup, this.castleEnemyCollision, null, this) //castle vs rat
        this.physics.world.collide(this.castle, this.dFlyGroup, this.castleEnemyCollision, null, this) //castle vs dragon fly
    }

    keyDownCode() {
        this.pressedUp = false
        this.pressedDown = true

        this.inputBufferTimeDown = this.time.delayedCall(100, () => { 
            this.pressedDown = false
        })
    }

    keyUpCode() {
        this.pressedDown = false
        this.pressedUp = true

        this.inputBufferTimeUp = this.time.delayedCall(100, () => { 
            this.pressedUp = false
        })
    }

    hoppingCode() {
         // DOWN
        // if above the bottom lane, is on a hop point (can hop) and has pressed down in the last .1 seconds...
        if(this.frog.y < 525 && this.canHop && this.pressedDown) {
            this.hopPoint.x = this.frog.x
            this.hopPoint.y = this.frog.y + 150
            this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
            this.canHop = false
        }
        // UP
        // if below the top lane, is on a hop point (can hop) and has pressed down in the last .1 seconds...
        if(this.frog.y > 75 && this.canHop && this.pressedUp) {
            this.hopPoint.x = this.frog.x
            this.hopPoint.y = this.frog.y - 150
            this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
            this.canHop = false
        }

        // check to see if frog has reached hop point
        const tolerance = 20;

        const distance = Phaser.Math.Distance.BetweenPoints(this.frog, this.hopPoint)
  
        if (this.frog.body.speed > 0)
        {
  
            if (distance < tolerance)
            {
                this.frog.body.reset(this.hopPoint.x, this.hopPoint.y)
                this.waitAfterHopTime = this.time.delayedCall(50, () => { 
                    this.canHop = true
                })
            }
        }
    }

    attackCode(){
        // attack code
        if(this.canHop && this.pressedAtk) {
            this.attack.setPosition(this.frog.x + 75, this.frog.y).setActive(true)

            this.inputBufferTimeAtk = this.time.delayedCall(100, () => {
                this.attack.setPosition(-300, 0) // remove sprite from canvas until called again
            })

            this.pressedAtk = false
        }
    }

    eatCode() {
        // eating code
        if(this.canHop && !this.dFlyEaten && this.pressedEat) {
            this.eat.setPosition(this.frog.x + 150, this.frog.y).setActive(true)
            this.time.delayedCall(100, () => { // wait 1 tenth of a second
                this.eat.setPosition(-300, 0) // remove sprite from canvas until called again

            })
            this.pressedEat = false
        }

        else if (this.canHop && this.dFlyEaten && this.pressedEat) {
            this.addFrogProjectile()
            this.dFlyEaten = false
            this.pressedEat = false
        }
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
        //console.log('rats!')
    }

    addDFly() {

        this.dFlyRandom = Phaser.Math.Between(0, 3)

        if(this.dFlyRandom == 0){
            this.dFlyPos.y = 75
        }
        else if(this.dFlyRandom == 1) {
            this.dFlyPos.y = 225
        }
        else if(this.dFlyRandom == 2) {
            this.dFlyPos.y = 375
        }
        else if(this.dFlyRandom == 3) {
            this.dFlyPos.y = 525
        }

        this.dFly = new DFly(this, this.dFlySpeed, this.dFlyPos.y).setScale(0.5)

        this.dFlyGroup.add(this.dFly)
    }

    addFrogProjectile() {

        this.frogProjectile = new FrogProjectile(this, this.frogProjectileSpeed, this.frog.x, this.frog.y).setScale(0.5)
        this.frogProjectileGroup.add(this.frogProjectile)
    }

    dFlyCollision(frog, DFly) {
        // console.log('dragon flew by')
    }

    eatDFlyCollision(eat, dFly) {
        // console.log('projectile hit')
        this.dFlyEaten = true
        dFly.destroy()
    }

    frogProjectileEnemyCollision(frogProjectile, enemy) {
        frogProjectile.destroy() // can turn this off to make it go through enemies!
        enemy.destroy()
    }

    attackRatCollision(attack, rat) {

        // console.log('rat down!')

        // Destroy the rat
        rat.destroy()

    }

    castleEnemyCollision(castle, enemy) {
        this.castleHP --
        this.castleText.text = this.castleHP
        enemy.destroy()
        if(this.castleHP < 1) {
            //console.log('game over')
            this.time.delayedCall(1000, () => { this.scene.start('gameOverScene', this.timer) })
        }
    }

    addTime() {
        if(this.castleHP > 0 ){
            this.timer++
            this.timerText.text = this.timer
            //console.log(this.timer)
        }
    }
}

