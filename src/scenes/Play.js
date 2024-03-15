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
        this.frogProjectileSpeed = 500
        this.blocked = false
        this.atkDmg = 100
        this.spitDmg = 100

        // hop points
        this.hopPoint = new Phaser.Math.Vector2()
        this.canHop = true
        
        //lily pads
        this.laneOne = false
        this.laneTwo = false
        this.laneThree = false
        this.laneFour = false

        this.laneOneY = 200
        this.laneTwoY = 300
        this.laneThreeY = 400
        this.laneFourY = 500

        // hop buffer
        this.pressedDown = false
        this.pressedUp = false
        this.inputBufferTimeUp = 0
        this.inputBufferTimeDown = 0

        // attack buffer
        this.pressedAtk = false
        this.inputBufferTimeAtk = 0
        this.attacking = false
        
        // eat buffer
        this.pressedEat = false
        this.inputBufferTimeEat = 0
        this.eatAnim = true
        this.spitAnim = false
        this.eating = false

        // rat
        this.ratSpeed = -125
        this.ratSpawnDelay = 3000
        this.ratStartSpawnDelay = 1000
        this.ratPos = new Phaser.Math.Vector2()
        this.ratRandom = 0
        this.whichRat = 0
        //elite rats
        this.ratEliteRandom
        this.elite = false
        this.eliteCanSpawn = false
        //purple rats
        this.purpleRandom
        this.purple = false
        this.purpleCanSpawn = false
        // rat king
        this.king = false
        this.kingCanSpawn = false

        // dragon fly 
        this.dFlySpeed = -200
        this.dFlySpawnDelay = 8000
        this.dFlyStartSpawnDelay = 3000
        this.dFlyPos = new Phaser.Math.Vector2()
        this.dFlyRandom = 0
        this.tempDFly = 0
        this.dFlyEaten = false

        // castle
        this.castleHP = 10
        this.castleBars = ['0HP','1HP','2HP','3HP','4HP','5HP','6HP','7HP','8HP','9HP','10HP']

        //knock back variable
        this.baseKnockBackForce = 25
        this.knockBackForce = 25

        //eat knock
        this.eatKnock = 15
        this.eatKnocked = false

        // xp
        this.currentXP = 0
        this.xpNeed = 10

        //levels
        this.currentLevel = 1

        //pause
        this.paused = false

        //skill menu
        this.selectionOne = true
        this.selectionTwo = false
        this.selectionThree = false

        //projectile skill
        this.projectileTierOne = false
        this.enemiesHit = 0
        this.enemiesCanHit = 0

        //increase range skill
        this.attackOffSet = 75
        this.atkRangeTier = 1

        //depth 
        this.laneDepthMod 
    }

    create(menuScene){
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()
        
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        //this.add.bitmapText(centerX, 500, 'TH', 'Press (W) and (S) to Hop').setScale(0.75).setDepth(40).setOrigin(0.5)
        //this.add.bitmapText(centerX, 500, 'TH', 'Press (D) to Attack').setScale(0.75).setDepth(40).setOrigin(0.5)
    
        this.castleHpBar = this.add.sprite(centerX, centerY, this.castleBars[10]).setDepth(1)

        // background and foreground
        this.add.sprite(centerX, centerY, 'bg')
        this.add.sprite(centerX, centerY, 'fg').setDepth(30)


        // lilypad sprite
        this.lilyPad = this.add.sprite(245, this.laneOneY, 'lilypad').setScale(0.65)
        this.lilyPad = this.add.sprite(230, this.laneTwoY, 'lilypad').setScale(0.65)
        this.lilyPad = this.add.sprite(215, this.laneThreeY, 'lilypad').setScale(0.65)
        this.lilyPad = this.add.sprite(200, this.laneFourY, 'lilypad').setScale(0.65)

        // castle sprite
        this.castle = this.physics.add.sprite(50, game.config.height - 175, 'castle').setScale(0.9)
        this.castle.setImmovable()
        this.castle.setSize(75, 250)
        this.castle.alpha = 0
        this.castleTwo = this.physics.add.sprite(100, 200, 'castle').setScale(0.9)
        this.castleTwo.setImmovable()
        this.castleTwo.setSize(75, 250)
        this.castleTwo.alpha = 0

        this.castleGroup = this.add.group()
        this.castleGroup.add(this.castle)
        this.castleGroup.add(this.castleTwo)

        //fake castle for flash fx
        this.fakeCastle = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'fakecastle')

        //creation of frog and its properties
        this.frog = this.physics.add.sprite(230, 290, 'frogeat').setOrigin(0.5).setScale(0.5)
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
        /*
        this.time.delayedCall(this.ratStartSpawnDelay, () => { 
            this.addRat()
        })*/

        // set up dragonfly group
        this.dFlyGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        /*
        this.time.delayedCall(this.dFlyStartSpawnDelay, () => { 
            this.addDFly()
        })*/

        //set up frog projectile group
        this.frogProjectileGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })

        // Create the attack sprite, but set it initially inactive
         this.attack = this.physics.add.sprite(-300, 0, 'atk').setOrigin(0.5).setActive(false).setAlpha(0.5)
         this.attack.setSize(150, 50)

         // Handle overlap between attack and rat
         this.physics.add.overlap(this.attack, this.ratGroup, this.attackRatCollision, null, this)
         this.physics.add.overlap(this.attack, this.dFlyGroup, this.attackDFlyCollision, null, this)
        // create the eat sprite, but set it initially inactive
         this.eat = this.physics.add.sprite(-300, 0, 'tongue').setOrigin(0.5).setActive(false)
         this.eat.setSize(300, 75)

        // Handle overlap between eat and dFly
         this.physics.add.overlap(this.eat, this.dFlyGroup, this.eatDFlyCollision, null, this)
         this.physics.add.overlap(this.eat, this.ratGroup, this.eatRatCollision, null, this)

         //create destroy all sprite
         this.destroyAll = this.physics.add.sprite(-3000, 3000).setOrigin(0.5)
         this.destroyAll.setSize(1200, 600)

         this.physics.add.overlap(this.destroyAll, this.ratGroup, this.destroyEnemies, null, this)
         this.physics.add.overlap(this.destroyAll, this.dFlyGroup, this.destroyEnemies, null, this)

        // challenge timer that increases spawn rate of enemies and dFlys
        this.challengeTimer = this.time.addEvent({
            delay: 7500,
            callback: this.addChallenge,
            callbackScope: this,
            loop: true
        })

        this.time.delayedCall(30000, () => { // after 15 seconds elite enemies can spawn
            this.eliteCanSpawn = true
            console.log('elite can spawn')
        })

        this.time.delayedCall(90000, () => { // after 60 seconds purple enemies can spawn
            this.purpleCanSpawn = true
            //console.log('purple can spawn')
        })

        this.time.delayedCall(180000, () => { // after 60 seconds purple enemies can spawn
            this.ratSpawnTimer.remove()
            this.dFlySpawnTimer.remove()
            this.gameTimer.remove()
            this.challengeTimer.remove()

            menuScene.bgMusic.destroy()
            this.sound.play('winsound')
            this.destroyAll.setPosition(centerX, centerY)
        })

        this.time.delayedCall(184000, () => { // after 60 seconds purple enemies can spawn
            this.destroyAll.setPosition(-3000, -3000)
            this.bossMusic = this.sound.add('bossmusic', {volume: 1, loop: true})
            this.bossMusic.play()
        })

        this.time.delayedCall(193000, () => { // after 180 seconds purple enemies can spawn //193000
            this.kingCanSpawn = true
            this.ratKing = new Rat(this, this.ratSpeed, this.ratPos.y, this.laneY, 3).setOrigin(0.5, 1)
            this.ratKing.anims.play('ratkingrun').setSize(200,180)
            this.ratGroup.add(this.ratKing)
            this.ratKing.setDepth(2 + this.laneDepthMod)
            console.log('king can spawn')

            // spawn enemies every X seconds
            this.ratSpawnTimer = this.time.addEvent({
                delay: this.ratSpawnDelay,
                callback: this.addRat,
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
        })

        // spawn enemies every X seconds
        this.ratSpawnTimer = this.time.addEvent({
            delay: this.ratSpawnDelay,
            callback: this.addRat,
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
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }

        this.timerText = this.add.text(game.config.width/2, 0, this.timer, timeConfig).setOrigin(0.5, 0)
        //this.castleText = this.add.text(100, 0, this.castleHP, timeConfig).setOrigin(0.5, 0)
        this.levelText = this.add.text(860, 0, 'LVL: ' + this.currentLevel, timeConfig).setOrigin(0.5, 0)
        this.xpText = this.add.text(860, 50, this.currentXP + '/' + this.xpNeed, timeConfig).setOrigin(0.5, 0)

        this.anims.create({
            key: 'eat',
            frameRate: 16,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:1,
                end: 2
            })
        })

        this.anims.create({
            key: 'idle',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:0,
                end: 0
            })
        })

        this.anims.create({
            key: 'eaten',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:1,
                end: 1
            })
        })

        this.anims.create({
            key: 'swing',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:3,
                end: 3
            })
        })

        this.anims.create({
            key: 'eatswing',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:4,
                end: 4
            })
        })

        this.anims.create({
            key: 'hop',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:5,
                end: 5
            })
        })

        this.anims.create({
            key: 'block',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('frogeat', {
                start:6,
                end: 6
            })
        })

        this.anims.create({
            key: 'ratrunning',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ratrun', {
                start:0,
                end: 1
            })
        })

        this.anims.create({
            key: 'eliteratrunning',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('eliteratrun', {
                start:0,
                end: 1
            })
        })

        this.anims.create({
            key: 'purpleratrun',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('purplerat', {
                start:0,
                end: 1
            })
        })

        this.anims.create({
            key: 'ratkingrun',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ratking', {
                start:0,
                end: 1
            })
        })

        // eat/spit animation prototype
        this.frog.on('animationcomplete', function () {
            if(this.eatAnim) {
                this.eat.setPosition(this.frog.x + 150, this.frog.y +10).setActive(true)
                this.time.delayedCall(100, () => { // wait 1 tenth of a second
                    this.eat.setPosition(-300, 0) // remove sprite from canvas until called again
                    if(this.dFlyEaten){
                        this.frog.anims.play('eaten')
                        //this.canHop = true // testing to see locked in place
                    }
                    else{
                        this.frog.anims.play('idle')
                        //this.canHop = true // testing to see locked in place
                    }

                    this.eating = false
                })
            }
            else if(this.spitAnim){
                this.addFrogProjectile()
                this.time.delayedCall(50, () => { // wait 1 tenth of a second
                    this.frog.anims.play('idle')
                    this.eating = false
                })
            }
        }, this)

        // rain sound + tilesprite
        this.rainLoop = this.sound.add('rainloop', {volume: 0.25})
        this.rainLoop.loop = true
        this.rainLoop.play()
        this.rain = this.add.tileSprite(0, 0, 960, 600,
            'rain').setOrigin(0,0)
    }

    update() {
        if(!this.paused){
            // rain
            this.rain.tilePositionY -= 7

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
                this.inputBufferTimeAtk = this.time.delayedCall(200, () => { 
                    this.pressedAtk = false
                })
            }
            
            // eat input
            if(Phaser.Input.Keyboard.JustDown(cursors.left) || Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.pressedEat = true
                this.inputBufferTimeEat = this.time.delayedCall(200, () => {
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
            this.eatSpitCode()// runs eat/spit code
            this.collisions()// runs collisions
            this.xpCode() // runs xp code
            }
        else if(this.paused) {

            // highlight text
            if(this.selectionOne){
                this.skillThreeText.setColor('#FFFFFF')
                this.skillTwoText.setColor('#FFFFFF')
                this.skillOneText.setColor('#43d637')
            }

            else if(this.selectionTwo){
                this.skillOneText.setColor('#FFFFFF')
                this.skillThreeText.setColor('#FFFFFF')
                this.skillTwoText.setColor('#43d637')
            }

            else if(this.selectionThree){
                this.skillOneText.setColor('#FFFFFF')
                this.skillTwoText.setColor('#FFFFFF')
                this.skillThreeText.setColor('#43d637')
                
            }

            if(Phaser.Input.Keyboard.JustDown(keyUP) && !this.selectionOne){
                if(this.selectionTwo) {
                    this.selectionTwo = false
                    this.selectionOne = true
                }
                else if(this.selectionThree) {
                    this.selectionThree = false
                    this.selectionTwo = true
                }
            }
            else if(Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.selectionThree){
                if(this.selectionTwo) {
                    this.selectionTwo = false
                    this.selectionThree = true
                }
                else if(this.selectionOne) {
                    this.selectionOne = false
                    this.selectionTwo = true
                }
            }

            if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
                if(this.selectionOne){
                    this.projectileSkill()
                }
    
                else if(this.selectionTwo){
                    this.increaseAttackRange()
                }
    
                else if(this.selectionThree){
                    this.increaseDamage()
                }

                this.upgradeText.destroy()
                this.skillOneText.destroy()
                this.skillTwoText.destroy()
                this.skillThreeText.destroy()

                this.paused = false
                this.physics.resume()
            }


        }
        
        
    }

    collisions() {
        // collisions
        this.physics.world.collide(this.frog, this.ratGroup, this.ratCollision, null, this) // rat vs frog
        this.physics.world.collide(this.frog, this.dFlyGroup, this.dFlyCollision, null, this) // dragon fly vs frog
        this.physics.world.collide(this.frogProjectileGroup, this.ratGroup, this.frogProjectileEnemyCollision, null, this) //frog projectile vs enemy
        this.physics.world.collide(this.frogProjectileGroup, this.dFlyGroup, this.attackDFlyCollision, null, this) //frog projectile vs dFly
        this.physics.world.collide(this.castleGroup, this.ratGroup, this.castleEnemyCollision, null, this) //castle vs rat
        this.physics.world.collide(this.castleGroup, this.dFlyGroup, this.castleEnemyCollision, null, this) //castle vs dragon fly
    }

    keyDownCode() {
        this.pressedUp = false
        this.pressedDown = true

        this.inputBufferTimeDown = this.time.delayedCall(125, () => { 
            this.pressedDown = false
        })
    }

    keyUpCode() {
        this.pressedDown = false
        this.pressedUp = true

        this.inputBufferTimeUp = this.time.delayedCall(125, () => { 
            this.pressedUp = false
        })
    }

    hoppingCode() {
        // DOWN
        // if above the bottom lane, is on a hop point (can hop) and has pressed down in the last .1 seconds...
        if(this.frog.y < 475 && this.canHop && this.pressedDown && !this.eating) {
            this.hopPoint.x = this.frog.x - 15
            this.hopPoint.y = this.frog.y + 100
            this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
            this.canHop = false
            this.frog.anims.play('hop')
            this.sound.play('hopsound')
        }
        // UP
        // if below the top lane, is on a hop point (can hop) and has pressed down in the last .1 seconds...
        if(this.frog.y > 200 && this.canHop && this.pressedUp && !this.eating) {
            this.hopPoint.x = this.frog.x + 15
            this.hopPoint.y = this.frog.y - 100
            this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
            this.canHop = false
            this.frog.anims.play('hop')
            this.sound.play('hopsound')
        }

        // check to see if frog has reached hop point
        const tolerance = 20

        const distance = Phaser.Math.Distance.BetweenPoints(this.frog, this.hopPoint)
  
        if (this.frog.body.speed > 0)
        {
  
            if (distance < tolerance)
            {
                // reset anims
                if(!this.dFlyEaten && !this.blocked){
                    this.frog.anims.play('idle')
                }
                else if(this.dFlyEaten && !this.blocked) {
                    this.frog.anims.play('eaten')
                }
                else if(this.blocked) {
                    this.frog.anims.play('block')
                }

                this.eating = false //when you hop before completing eat anim, set to eating to false

                this.frog.body.reset(this.hopPoint.x, this.hopPoint.y)
                this.waitAfterHopTime = this.time.delayedCall(75, () => { 
                    this.canHop = true
                })
            }
        }
    }

    attackCode(){
        // attack code
        if(this.canHop && this.pressedAtk && !this.attacking && !this.eating) {
            //console.log('attacked')
            this.attacking = true
            this.attack.setPosition(this.frog.x + this.attackOffSet, this.frog.y).setActive(true)
            if(!this.dFlyEaten){
                this.frog.anims.play('swing')
                this.sound.play('swingsound')
            }
            else {
                this.frog.anims.play('eatswing')
                this.sound.play('swingsound')
            }
            
            this.inputBufferTimeAtk = this.time.delayedCall(100, () => {
                this.attack.setPosition(-300, 0) // remove sprite from canvas until called again
                if(!this.dFlyEaten){
                    this.frog.anims.play('idle')
                    this.inputBufferTimeAtk = this.time.delayedCall(100, () => {
                        this.attacking = false
                    })
                    
                }
                else {
                    this.frog.anims.play('eaten')
                    this.inputBufferTimeAtk = this.time.delayedCall(100, () => {
                        this.attacking = false
                    })
                }
            })

            this.pressedAtk = false
        }
    }

    eatSpitCode() {
        // eating code
        if(this.canHop && !this.dFlyEaten && this.pressedEat && !this.attacking) {
            this.eating = true
            this.spitAnim = false
            this.eatAnim = true
            this.frog.anims.play('eat')
            this.sound.play('eatsound', {volume: 1.5})
            this.pressedEat = false
        }
        //spit code
        else if (this.canHop && this.dFlyEaten && this.pressedEat && !this.attacking) {
            this.eating = true
            this.eatAnim = false
            this.spitAnim = true
            this.frog.anims.play('eat')
            this.sound.play('spitsound', {volume: 1.75})
            this.dFlyEaten = false
            this.pressedEat = false
        }
    }

    addRat() {
        if(!this.paused){
            this.ratRandom = Phaser.Math.Between(0, 3)

            if(this.ratRandom == 0){
                this.ratPos.y = this.laneOneY + 20
                this.laneY = this.ratPos.y
                this.laneDepthMod = 0
            }
            else if(this.ratRandom == 1) {
                this.ratPos.y = this.laneTwoY + 20
                this.laneY = this.ratPos.y
                this.laneDepthMod = 4
            }
            else if(this.ratRandom == 2) {
                this.ratPos.y = this.laneThreeY + 20
                this.laneY = this.ratPos.y
                this.laneDepthMod = 8
            }
            else if(this.ratRandom == 3) {
                this.ratPos.y = this.laneFourY + 20
                this.laneY = this.ratPos.y
                this.laneDepthMod = 12
            }
            
            if(this.eliteCanSpawn && !this.purpleCanSpawn){
                this.ratEliteRandom = Phaser.Math.Between(0, 2) // 1/4 chance of spawning in an elite rat
                if(this.ratEliteRandom == 2){
                    this.whichRat = 1
                }
                else {
                    this.whichRat = 0
                }
            }
            else if(this.purpleCanSpawn){
                console.log('canpurple')
                this.purpleRandom = Phaser.Math.Between(0, 4) // 1/4 chance of spawning in a purple rat
                this.ratEliteRandom = Phaser.Math.Between(0, 1) // 1/2 chance of spawning in an elite rat
                if(this.purpleRandom == 4){
                    this.whichRat = 2
                    console.log('purple')
                }
                else if(this.ratEliteRandom == 1){
                    this.whichRat = 1
                    console.log('elite')
                }
                else{
                    this.whichRat = 0
                    console.log('base')
                }
            }

            this.rat = new Rat(this, this.ratSpeed, this.ratPos.y, this.laneY, this.whichRat).setScale(0.5).setOrigin(0.5, 1)
    
            this.ratGroup.add(this.rat)
    
            if(this.whichRat == 0){
                this.rat.anims.play('ratrunning')
                this.rat.setDepth(5 + this.laneDepthMod)
            }
            else if(this.whichRat == 1){
                this.rat.anims.play('eliteratrunning').setScale(0.6)
                this.rat.setDepth(4 + this.laneDepthMod)
            }
            else if(this.whichRat == 2){
                this.rat.anims.play('purpleratrun').setScale(0.75).setSize(256,128)
                this.rat.setDepth(3 + this.laneDepthMod)
            }

            this.whichRat = 0
        }

    }

    ratCollision(frog, rat) {

        if(!this.blocked && !this.eating) {
            this.blocked = true
            this.frog.anims.play('block')
            this.knockBackForce = this.baseKnockBackForce * 3
            if(rat.isKing){
                this.knockBackForce = this.baseKnockBackForce * 15
            }
            this.knockBack(rat)

            this.time.delayedCall(150, () => { // wait 1 tenth of a second
                if(this.dFlyEaten && !this.eating){
                    this.frog.anims.play('eaten')
                }
                else if(!this.eating){
                    this.frog.anims.play('idle')
                }
                this.blocked = false
            })
        }

    }

    addDFly() {
        if(!this.paused){
            this.dFlyRandom = Phaser.Math.Between(0, 3)

            if(this.dFlyRandom == 0){
                this.dFlyPos.y = this.laneOneY - 30
                this.laneY = this.dFlyPos.y
            }
            else if(this.dFlyRandom == 1) {
                this.dFlyPos.y = this.laneTwoY - 30
                this.laneY = this.dFlyPos.y
            }
            else if(this.dFlyRandom == 2) {
                this.dFlyPos.y = this.laneThreeY - 30
                this.laneY = this.dFlyPos.y
            }
            else if(this.dFlyRandom == 3) {
                this.dFlyPos.y = this.laneFourY - 30
                this.laneY = this.dFlyPos.y
            }
    
            this.dFly = new DFly(this, this.dFlySpeed, this.dFlyPos.y, this.laneY).setScale(0.75).setDepth(18)
    
            this.dFlyGroup.add(this.dFly)
        }

    }

    addFrogProjectile() {

        this.frogProjectile = new FrogProjectile(this, this.frogProjectileSpeed, this.frog.x + 32, this.frog.y - 10).setScale(0.35)
        this.frogProjectileGroup.add(this.frogProjectile)
    }

    dFlyCollision(frog, DFly) {
        // console.log('dragon flew by')
    }

    eatDFlyCollision(eat, dFly) {
        // console.log('projectile hit')
        if(!this.dFlyEaten){
            this.dFlyEaten = true
            dFly.setVelocityX(0)
            this.time.delayedCall(100, () => { dFly.destroy(), this.currentXP++, this.updateXP()})
        }

    }

    eatRatCollision(eat, rat) {
        if(!rat.eatKnocked) {
            this.eatKnockBack(rat)
            rat.eatKnocked = true
        }
    }
    attackDFlyCollision(eat, fly) {
        if(!fly.atkKnocked) {
            this.eatKnockBack(fly)
            fly.atkKnocked = true
        }
    }

    frogProjectileEnemyCollision(frogProjectile, enemy) {
        if(!enemy.spitHit){

            //console.log(enemy.hp)
            if(enemy.hit == false && !enemy.spitHit){
                enemy.hp -= this.spitDmg
                
                enemy.spitHit = true
                enemy.spitHitTimer()
    
                enemy.hit = true
                enemy.hitTimer()

                this.sound.play('hitsound', {volume: 0.5})
                this.enemyFlash(enemy)
            }

            if(this.enemiesHit >= this.enemiesCanHit){
                frogProjectile.destroy() // can turn this off to make it go through enemies!
                this.enemiesHit = 0
            }
            else {
                this.enemiesHit++
            }
        }
    }

    attackRatCollision(attack, rat) {
        //console.log(rat.hp)
        if(rat.hit == false){
            // Destroy the rat
            this.sound.play('hitsound', {volume: 0.5})
            this.enemyFlash(rat)
            rat.hp -= this.atkDmg
            rat.hit = true
            rat.hitTimer()
        }

    }

    castleEnemyCollision(castle, enemy) {
        if(!enemy.died){ // if enemy hasn't already hit castle to prevent from multi triggers
            if(this.castleHP > 0) {
                this.castleHP --
                this.castleHpBar = this.add.sprite(centerX, centerY, this.castleBars[this.castleHP]).setDepth(1)
                if(enemy.isKing){
                    this.castleHP = 0
                }
            }
            
            //this.castleText.text = this.castleHP
    
            enemy.knockBack(true)
            
            if(this.castleHP < 1) {
                this.time.delayedCall(1000, () => { this.scene.start('gameOverScene', this.timer) })
            }

            this.castleFlash()
        }

    }

    enemyFlash(enemy) {
        enemy.setTintFill(0xffffff)
        if(!enemy.isGettingDestroyed){
            this.knockBack(enemy)
        }
        this.time.delayedCall(75, () => {
            enemy.clearTint()
        })
    }

    castleFlash(){
        this.fakeCastle.setTintFill(0xffffff)
        this.time.delayedCall(50, () => {
            this.fakeCastle.clearTint()
        })
    }

    addChallenge() {
        if(!this.paused){
            // spawn faster
            if(this.dFLySpawnDelay > 1300){
                this.dFlySpawnDelay -= 300
                this.dFlySpawnTimer.delay = this.dFlySpawnDelay
            }
            if(this.ratSpawnDelay > 400) {
                this.ratSpawnDelay -= 125
                this.ratSpawnTimer.delay = this.ratSpawnDelay
            }
        }
    }

    addTime() {
        if(this.castleHP > 0 && !this.paused){
            this.timer++
            this.timerText.text = this.timer
            //console.log(this.timer)
        }
    }

    knockBack(enemy) {
        if(!enemy.knockedBack){
            enemy.knockedBack = true
            enemy.setVelocityX(0)
            enemy.knockBack(false)
        }

    }

    eatKnockBack(enemy) {
         this.randomize = Phaser.Math.Between(0, 1)
         if(this.randomize == 0) {
            this.eatKnockDir = -1
            enemy.goUp = true
         }
         else{
            this.eatKnockDir = 1
            enemy.goUp = false
         }

        this.tweens.add({
            targets: enemy,
            y: enemy.y + (this.eatKnock * this.eatKnockDir),
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                enemy.eatKnocked = false
                enemy.atkknocked = false
            }
        })
    }

    xpCode() {
        if(this.currentXP >= this.xpNeed) {
            //console.log('level up')
            this.currentLevel++
            this.levelText.text = 'LVL: ' + this.currentLevel
            this.currentXP = 0
            this.updateXP()
            this.xpNeed *= 1.5
            this.skillScreen()
            
        }
    }

    updateXP() {
        this.xpText.text = this.currentXP + '/' + this.xpNeed
    }

    skillScreen() {

        let skillConfig = {
            frontFamily: 'Courier',
            fontSize: '32px',
            //backgroundColor: 'rgba(128, 128, 128, 0.15)',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 500
        }

        //pause game
        this.paused = true
        this.physics.pause()

        // add text
        this.upgradeText = this.add.text(game.config.width/2, game.config.height/2 - 200, 'Choose Your Upgrade', skillConfig).setOrigin(0.5).setDepth(19)
        this.skillOneText = this.add.text(game.config.width/2, game.config.height/2 - 100, 'Spit Through ' + (this.enemiesCanHit + 1) + ' Enemies', skillConfig).setOrigin(0.5).setDepth(19)
        this.skillTwoText = this.add.text(game.config.width/2, game.config.height/2, 'Increase Attack Range', skillConfig).setOrigin(0.5).setDepth(19)
        this.skillThreeText = this.add.text(game.config.width/2, game.config.height/2 + 100, 'Increase All Damage', skillConfig).setOrigin(0.5).setDepth(19)
    }

    projectileSkill() {
        //console.log('projectile skill')
        this.projectileTierOne = true
        this.enemiesCanHit++
    }

    increaseAttackRange(){
        this.attack.scaleX *= 1.2
        this.attackOffSet *= 1.2
        this.atkRangeTier ++
    }

    increaseDamage() {
        this.atkDmg *= 1.5
        this.spitDmg *= 1.5
    }

    destroyEnemies(sprite, enemy) {
        if(!enemy.isKing){
            enemy.isGettingDestroyed = true
            this.enemyFlash(enemy)
            enemy.knockBack(true)
            console.log('kill them all')
        }

    }

    theKingHasFallen(ratking){

        console.log('the king has fallen')
        this.ratSpawnTimer.remove()
        this.dFlySpawnTimer.remove()
        this.gameTimer.remove()
        this.challengeTimer.remove()


        this.bossMusic.destroy()

        this.ratKing.anims.msPerFrame = 90

        // ingame timer
        this.ratFlashTimer = this.time.addEvent({
            delay: 400,
            callback: this.ratFlash,
            callbackScope: this,
            repeat: 3,
            
        })

        this.time.delayedCall(3200, () => {
            this.ratKing.setTintFill(0xffffff)
            this.time.delayedCall(75, () => {
                this.sound.play('hitsound', {volume: 0.5})
                this.ratKing.destroy()
                this.bgMusic = this.sound.add('music', {volume: 1, loop: true})
                this.bgMusic.play()

                this.credits()
            })


        })
    }

    ratFlash(){
        console.log('hi')
        this.ratKing.setTintFill(0xffffff)
        this.time.delayedCall(75, () => {
            this.ratKing.clearTint()
        })

        this.sound.play('hitsound', {volume: 0.5})

        this.destroyAll.setPosition(-3000, -3000)
    }

    credits(){
        //credits stuff
    }
}

