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

        // base rat
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

        //eat knock back variable
        this.eatKnock = 15
        this.eatKnocked = false

        // xp
        this.currentXP = 0
        this.xpNeed = 5

        //frog levels
        this.currentLevel = 1

        //pause for power up screen
        this.powerUpScreen = false

        //pause for game over screen
        this.gameOver = false

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

        //timers
        this.spawnElites = false
        this.spawnPurples = false
        this.fakeWin = false
        this.thunder = false
        this.spawnRatKing = false

        //game end
        this.gameEnd = false

        //tutorial
        //hopping
        this.hasHoppedUp = false
        this.hasHoppedDown = false
        this.hasHoppedNext = false
        //attacking
        this.hasAttacked = false
        this.hasAttackedNext = false
        //attack rat
        this.hasAttackedRat = false
        this.hasAttackedRatNext = false
        //eating
        this.hasEaten = false
        this.hasEatenNext = false
        //eat bug
        this.hasEatenBug = false
        this.hasEatenBugNext = false
        //spit out and hit rat with bug
        this.hasSpitAndHitRat = false
        this.hasSpitAndHitRatNext = false
        //block 
        this.hasBlocked = false
        this.hasBlockedNext = false

        this.tutorialEnd = false
    }

    create(menuScene, fromMenu){

        this.theMenuScene = menuScene //get menu scene reference

        //play ambient sound
        this.ambiSounds = this.sound.add('ambi', {volume: 0.5, loop: true})
        this.ambiSounds.play()

        //make variable bg music
        this.menuMusic = this.theMenuScene.bgMusic
        //play bg music if game was reset from play instead of menu
        if(!this.theMenuScene.musicPlayed){
            this.menuMusic.play()
            console.log(this.theMenuScene.musicPlayed)
        }
        else{
            this.theMenuScene.musicPlayed = false
        }

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()
        //set up WASD, Space, and menu keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyMENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyRESTART = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // background and foreground
        this.bgImage = this.add.sprite(centerX, centerY, 'bg')
        this.add.sprite(centerX, centerY, 'fg').setDepth(20)
        this.night = this.add.sprite(centerX, centerY, 'night').setAlpha(0)

        // lilypad sprite
        this.lilyPad = this.add.sprite(245, this.laneOneY+10, 'lilypad').setScale(0.9)
        this.lilyPad = this.add.sprite(230, this.laneTwoY+10, 'lilypad').setScale(0.9)
        this.lilyPad = this.add.sprite(215, this.laneThreeY+10, 'lilypad').setScale(0.9)
        this.lilyPad = this.add.sprite(200, this.laneFourY+10, 'lilypad').setScale(0.9)

        // two castle objects to act as collisions for 'fake' caste sprite
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

        //create castle HP bar sprite
        this.castleHpBar = this.add.sprite(centerX, centerY, this.castleBars[10]).setDepth(1)

        //fake castle for flash fx
        this.fakeCastle = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'fakecastle').setDepth(5)

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

        // set up dragonfly group
        this.dFlyGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })

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

         // if not a tutorial...
        if(!menuScene.tutorial){
            // challenge timer that increases spawn rate of enemies and dFlys
            this.challengeTimer = this.time.addEvent({
                delay: 7500,
                callback: this.addChallenge,
                callbackScope: this,
                loop: true
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
        }

        else{
            //tutorial things
            this.tutTexts = ['Press (W) and (S) to Hop Up and Down the Lily Pads', 
            'Press (D) to Attack',
            'Press (D) to Attack the Rat',
            'Press (A) to Eat', 
            'Press (A) to Eat the Bug',
            'Press (A) Again to Spit Out the Bug and Hit the Rat',
            'Let a Rat Run Into You to Block them, Knocking Them Back',
            'Tutorial Complete! Press (M) to go to Menu'
            ]
            this.tutTextsPos = 0
            this.tutText = this.add.bitmapText(centerX, 530, 'wTH', this.tutTexts[this.tutTextsPos] ).setOrigin(0.5, 0.5).setScale(0.6).setDepth(50)
            
        }

        // ingame timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.addTime,
            callbackScope: this,
            loop: true
        })

        // in game play UI (timer, level, & xp)
        this.xpNeed = Math.ceil(this.xpNeed)
        this.timerText = this.add.bitmapText(centerX, 0, 'wTH', this.timer).setOrigin(0.5, 0).setScale(0.7)
        this.levelText = this.add.bitmapText(860, 0, 'wTH', 'LVL: ' + this.currentLevel).setOrigin(0.5, 0).setScale(0.7)
        this.xpText = this.add.bitmapText(860, 50, 'wTH', this.currentXP + '/' + this.xpNeed).setOrigin(0.5, 0).setScale(0.7)


        //create all the animations!
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

        
        this.anims.create({
            key: 'dance',
            frameRate: 24,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('dancerat', {
                start:0,
                end: 226
            })
        })

        //secret!
        this.dancingRat = this.add.sprite(centerX, centerY).setAlpha(0)
        this.dancingRat.anims.play('dance')

        // eat/spit animations
        this.frog.on('animationcomplete', function () {
            if(this.eatAnim) { //if the player is eating...
                this.eat.setPosition(this.frog.x + 150, this.frog.y +10).setActive(true)
                this.time.delayedCall(100, () => { // wait 1 tenth of a second
                    this.eat.setPosition(-300, 0) // remove sprite from canvas until called again
                    if(this.dFlyEaten){
                        this.frog.anims.play('eaten')
                    }
                    else{
                        this.frog.anims.play('idle')
                    }

                    this.eating = false
                })
            }
            else if(this.spitAnim){ // if the player is spitting...
                this.addFrogProjectile()
                this.time.delayedCall(50, () => { // wait 1 tenth of a second
                    this.frog.anims.play('idle')
                    this.eating = false
                })
            }
        }, this)

        // rain sound + tilesprite set up
        this.rain = this.add.tileSprite(0, 0, 960, 600,
        'rain').setOrigin(0,0).setDepth(18).setAlpha(0)


    }

    update() {
        //return to menu by pressing M if the game is over or the tutorial is over
        if((this.gameEnd || this.tutorialEnd)){
            if( Phaser.Input.Keyboard.JustDown(keyMENU)){
                this.menuMusic.stop()
                this.scene.start('menuScene')
            }

            if( Phaser.Input.Keyboard.JustDown(keyRESTART)){
                this.scene.stop('playScene')
                this.scene.start('playScene')
            }

        }
        //tutorial code
        this.hopTut()

        // if this isn't the tutorial...
        if(!this.theMenuScene.tutorial){
            //set up enemy spawn timers
            if(this.timer == 30 && !this.spawnElites){ // after 30 seconds begin to spawn elites
                this.eliteCanSpawn = true
                this.spawnElites = true
            }

            if(this.timer == 90 && !this.spawnPurples){ // after 90 seconds begin to spawn purples
                this.purpleCanSpawn = true
                this.spawnPurples = true
            }

            if(this.timer == 180 && !this.fakeWin){ // after 180 seconds spawn begin boss sequence
                // remove spawn timers
                this.ratSpawnTimer.remove()
                this.dFlySpawnTimer.remove()
                this.gameTimer.remove()
                this.challengeTimer.remove()

                this.menuMusic.stop()
                this.sound.play('hitsound')
                this.sound.play('winsound')
                this.destroyAll.setPosition(centerX, centerY) // destroy all remaining rats
                this.fakeWin = true

                // after 4 seconds, thunder strikes, boss music begins
                this.time.delayedCall(4000, () => {
                    this.destroyAll.setPosition(-3000, -3000)
                    this.time.delayedCall(4000, () => {
                        this.bossMusic = this.sound.add('bossmusic', {volume: 1, loop: true})
                        this.bossMusic.play()
                    })
                    this.ThunderWhiteOut()
                })

                //spawn in the rat king after 10 seconds
                this.time.delayedCall(10000, () => {
                    this.kingCanSpawn = true
                    this.ratKing = new Rat(this, this.ratSpeed, 420, 420, 3).setOrigin(0.5, 1)
                    this.ratKing.anims.play('ratkingrun').setSize(200,160)
                    this.ratGroup.add(this.ratKing)
                    this.ratKing.setDepth(10)

                    // resume the enemy spawners!
                    this.ratSpawnTimer = this.time.addEvent({
                        delay: this.ratSpawnDelay,
                        callback: this.addRat,
                        callbackScope: this,
                        loop: true
                    })

                    // spawn dFlys every x seconds
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
            }
        }
        
        // if neither in the power up screen or is game over...
        if(!this.powerUpScreen && !this.gameOver){

            //make rain fall
            this.rain.tilePositionY -= 7

            // hop input
            if(Phaser.Input.Keyboard.JustDown(cursors.down) || Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                
                //tutorial stuff
                if(this.theMenuScene.tutorial && !this.hasHoppedNext){
                    this.hasHoppedDown = true
                }

                this.keyDownCode()
            }

            else if(Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(keyUP)) {
                //tutorial stuff
                if(this.theMenuScene.tutorial && !this.hasHoppedNext){
                    this.hasHoppedUp = true
                }
                this.keyUpCode()
            }

            // attack input
            if(Phaser.Input.Keyboard.JustDown(cursors.right) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                //TUTORIAL STUFF START
                if(this.theMenuScene.tutorial && !this.hasAttacked && this.hasHoppedNext){ // if this is tutorial and hasn't pressed attack yet and has done hopping tutorial...
                    this.attackTut()
                }
                
                this.pressedAtk = true
                this.inputBufferTimeAtk = this.time.delayedCall(200, () => { // input is still true 200 miliseconds
                    this.pressedAtk = false
                })
            }
            
            // eat input
            if(Phaser.Input.Keyboard.JustDown(cursors.left) || Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                //tutorial
                if(this.theMenuScene.tutorial && !this.hasEaten  && this.hasHoppedNext && this.hasAttackedNext && this.hasAttackedRatNext){
                    this.eatTut()
                }

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

        else if(this.powerUpScreen) { // if in power up screen...

                // Highlight upgrade UI
                if(this.selectionOne){
                    this.skillThreeUI.setAlpha(0) // set non selected alphas to zero, seleted alpha to one
                    this.skillTwoUI.setAlpha(0)
                    this.skillOneUI.setAlpha(1)

                if(this.arText.setAlpha(0)) {
                    this.arRedText.setAlpha(1)
                    this.prRedText.setAlpha(0)
                    this.plRedText.setAlpha(0)

                    this.prText.setAlpha(1)
                    this.plText.setAlpha(1)
                }
            }
                else if(this.selectionTwo){
                    this.skillOneUI.setAlpha(0)
                    this.skillThreeUI.setAlpha(0)
                    this.skillTwoUI.setAlpha(1)

                if(this.prText.setAlpha(0)) {
                    this.arRedText.setAlpha(0)
                    this.prRedText.setAlpha(1)
                    this.plRedText.setAlpha(0)

                    this.arText.setAlpha(1)
                    this.plText.setAlpha(1)
                }
            }
                else if(this.selectionThree){
                    this.skillOneUI.setAlpha(0)
                    this.skillTwoUI.setAlpha(0)
                    this.skillThreeUI.setAlpha(1)

                 if(this.plText.setAlpha(0)) {
                    this.arRedText.setAlpha(0)
                    this.prRedText.setAlpha(0)
                    this.plRedText.setAlpha(1)

                    this.arText.setAlpha(1)
                    this.prText.setAlpha(1)
                    }
                }

            if(Phaser.Input.Keyboard.JustDown(keyUP) && !this.selectionOne){
                if(this.selectionTwo) {
                    this.selectionTwo = false
                    this.selectionOne = true
                    this.arText.setAlpha(0)
                }
                else if(this.selectionThree) {
                    this.selectionThree = false
                    this.selectionTwo = true
                    this.prText.setAlpha(0)
                }
            }
            else if(Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.selectionThree){
                if(this.selectionTwo) {
                    this.selectionTwo = false
                    this.selectionThree = true
                    this.plText.setAlpha(0)
                }
                else if(this.selectionOne) {
                    this.selectionOne = false
                    this.selectionTwo = true
                    this.prText.setAlpha(0)
                }
            }

            if(Phaser.Input.Keyboard.JustDown(keySPACE)) { // on space press...
                if(this.selectionOne){
                    this.increaseAttackRange()
                }
    
                else if(this.selectionTwo){
                    this.projectileSkill()
                }
    
                else if(this.selectionThree){
                    this.increaseDamage()
                }

                this.upgradeUI.destroy()
                this.skillOneUI.destroy()
                this.skillTwoUI.destroy()
                this.skillThreeUI.destroy()

                for(var i = this.upgTextUI.length - 1; i > -1; i--){ // for each element in this array, while i is greater than -1, subtract 1 from i (alex did this part)
                    
                    this.upgTextUI[i].destroy()
                } 

                // resume game
                this.powerUpScreen = false 
                this.physics.resume()
            }
        }  
    }

    collisions() {
        // collisions
        this.physics.world.collide(this.frog, this.ratGroup, this.ratCollision, null, this) // rat vs frog
        //this.physics.world.collide(this.frog, this.dFlyGroup, this.dFlyCollision, null, this) // dragon fly vs frog
        this.physics.world.collide(this.frogProjectileGroup, this.ratGroup, this.frogProjectileRatCollision, null, this) //frog projectile vs enemy
        this.physics.world.collide(this.frogProjectileGroup, this.dFlyGroup, this.attackDFlyCollision, null, this) //frog projectile vs dFly
        this.physics.world.collide(this.castleGroup, this.ratGroup, this.castleEnemyCollision, null, this) //castle vs rat
        this.physics.world.collide(this.castleGroup, this.dFlyGroup, this.castleEnemyCollision, null, this) //castle vs dragon fly
    }

    keyDownCode() {
        this.pressedUp = false
        this.pressedDown = true

        this.inputBufferTimeDown = this.time.delayedCall(125, () => {  // input buffer for hopping
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
        // if above the bottom lane, is on a hop point (can hop) and has pressed down in the last .125 seconds...
        if(this.frog.y < 475 && this.canHop && this.pressedDown && !this.eating) {
            this.hopPoint.x = this.frog.x - 15
            this.hopPoint.y = this.frog.y + 100
            this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)// move frog towards next lily pad
            this.canHop = false
            this.frog.anims.play('hop')
            this.sound.play('hopsound')
        }
        // UP
        // if below the top lane, is on a hop point (can hop) and has pressed down in the last .125 seconds...
        if(this.frog.y > 200 && this.canHop && this.pressedUp && !this.eating) {
            this.hopPoint.x = this.frog.x + 15
            this.hopPoint.y = this.frog.y - 100
            this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity) // move frog towards next lily pad
            this.canHop = false
            this.frog.anims.play('hop')
            this.sound.play('hopsound')
        }

        // check to see if frog has reached hop point
        const tolerance = 30

        const distance = Phaser.Math.Distance.BetweenPoints(this.frog, this.hopPoint)
  
        if (this.frog.body.speed > 0)
        {
  
            if (distance < tolerance) // if frog has reached lily pad posiiton...
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

                this.frog.body.reset(this.hopPoint.x, this.hopPoint.y) // reset movement to make frog stop at this point
                this.waitAfterHopTime = this.time.delayedCall(75, () => { //wait briefly after landing before allowing to hop again
                    this.canHop = true
                })
            }
        }
    }

    attackCode(){
        // attack code
        //if has landed on lily pad, is not already attack and is not eating...
        if(this.canHop && this.pressedAtk && !this.attacking && !this.eating) {
            this.attacking = true
            this.attack.setPosition(this.frog.x + this.attackOffSet, this.frog.y).setActive(true) // sets collider infront of frog to deal damage
            if(!this.dFlyEaten){ // if tummy is not full do this anim
                this.frog.anims.play('swing')
                this.sound.play('swingsound')
            }
            else { //else do this anim
                this.frog.anims.play('eatswing')
                this.sound.play('swingsound')
            }
            
            this.inputBufferTimeAtk = this.time.delayedCall(100, () => { //after .1 secs, remove attack collider
                this.attack.setPosition(-300, 0) 
                if(!this.dFlyEaten){ // return to idle anim
                    this.frog.anims.play('idle')
                    this.inputBufferTimeAtk = this.time.delayedCall(100, () => {
                        this.attacking = false
                    })
                    
                }
                else {
                    this.frog.anims.play('eaten') //return to full anim
                    this.inputBufferTimeAtk = this.time.delayedCall(100, () => {
                        this.attacking = false
                    })
                }
            })

            this.pressedAtk = false // succesfully attacked so safe to turn off pressed atk
            
        }
    }

    eatSpitCode() {
        // EAT code
        //if has landed on lily pad, is NOT full, and is not attack and has input eat...
        if(this.canHop && !this.dFlyEaten && this.pressedEat && !this.attacking) {
            this.eating = true
            this.spitAnim = false
            this.eatAnim = true
            this.frog.anims.play('eat')
            this.sound.play('eatsound', {volume: 1.5})
            this.pressedEat = false
        }
        //SPIT code
         //if has landed on lily pad, IS full, and is not attack and has input eat...
        else if (this.canHop && this.dFlyEaten && this.pressedEat && !this.attacking) {
            this.eating = true
            this.eatAnim = false
            this.spitAnim = true
            this.frog.anims.play('eat')
            this.sound.play('spitsound', {volume: 2})
            this.dFlyEaten = false
            this.pressedEat = false
        }
    }

    addRat() {
        //i game is not paused or game over
        if(!this.powerUpScreen && !this.gameOver){

            //randomly choose lane for rat to spawn in
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
            
            //if elites can spawn...
            if(this.eliteCanSpawn && !this.purpleCanSpawn){
                this.ratEliteRandom = Phaser.Math.Between(0, 2) // 1/4 chance of spawning in an elite rat
                if(this.ratEliteRandom == 2){
                    this.whichRat = 1
                }
                else {
                    this.whichRat = 0
                }
            }
            // if purples can spawn...
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

            //create the rat
            this.rat = new Rat(this, this.ratSpeed, this.ratPos.y, this.laneY, this.whichRat).setScale(0.5).setOrigin(0.5, 1)
            // add the rat to the group
            this.ratGroup.add(this.rat)
    
            //play rat run anim depending on which rat is chosen
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
        // if the frog isn't already blocking and not currently eating
        if(!this.blocked && !this.eating) {
            //TUTORIAL
            if(this.theMenuScene.tutorial && !this.hasBlocked &&this.hasHoppedNext && this.hasAttackedNext && this.hasAttackedRatNext && this.hasEatenNext && this.hasEatenBug && this.hasSpitAndHitRatNext){
                this.blockTut()
            }

            
            this.blocked = true
            this.frog.anims.play('block')
            this.knockBackForce = this.baseKnockBackForce * 3 // send this enemy back by this force
            if(rat.isKing){ //if the enemy blocked is the rat king...
                this.knockBackForce = this.baseKnockBackForce * 17 // send rat king much farther back on block
                this.sound.play('kingblock', {volume: 1.75})
            }
            else {
                this.sound.play('blocksound', {volume: 1.75})
            }
            this.knockBack(rat) // knock back the rat

            this.time.delayedCall(150, () => { // wait 1 tenth of a second before returning to idle or full anim
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
        // if paused
        if(!this.powerUpScreen && !this.gameOver){
            this.dFlyRandom = Phaser.Math.Between(0, 3) // chose fly lane

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
    
            //create fly
            this.dFly = new DFly(this, this.dFlySpeed, this.dFlyPos.y, this.laneY).setScale(0.75).setDepth(18)
    
            this.dFlyGroup.add(this.dFly)
        }

    }

    addFrogProjectile() {
        //create frog spit
        this.frogProjectile = new FrogProjectile(this, this.frogProjectileSpeed, this.frog.x + 32, this.frog.y - 10).setScale(0.35)
        this.frogProjectileGroup.add(this.frogProjectile)
    }

    dFlyCollision(frog, DFly) {
        //does nothing for now
    }

    eatDFlyCollision(eat, dFly) {
        // if not already full
        if(!this.dFlyEaten){
            //TUTORIAL STUFF
            if(this.theMenuScene.tutorial && !this.hasEatenBug && this.hasHoppedNext && this.hasAttackedNext && this.hasAttackedRatNext && this.hasEatenNext){
                this.eatBugTut()
                console.log('eatBugTut done')
            }
            
            //freeze the fly for a moment before deleting it and adding it to belly
            this.dFlyEaten = true
            dFly.setVelocityX(0)
            this.time.delayedCall(100, () => { dFly.destroy(), this.currentXP++, this.updateXP()})
        }

    }

    eatRatCollision(eat, rat) {
        //if frog trys eating rat
        if(!rat.eatKnocked) {
            this.eatKnockBack(rat) //knock the rat to the side
            rat.eatKnocked = true
        }
    }
    attackDFlyCollision(eat, fly) {
        //if frog trys attack fly
        if(!fly.atkKnocked) {
            this.eatKnockBack(fly) // knock fly to the side
            fly.atkKnocked = true
        }
    }

    frogProjectileRatCollision(frogProjectile, enemy) {
        if(!enemy.spitHit){  //if the enemy hasn't been recently hit by spit...

            //TUTORIAL
            if(this.theMenuScene.tutorial && !this.hasSpitAndHitRat &&this.hasHoppedNext && this.hasAttackedNext && this.hasAttackedRatNext && this.hasEatenNext && this.hasEatenBugNext){
                this.spitAndHitRatTut()
            }
            
            // subtract hp from enemy if not hit recently
            if(enemy.hit == false && !enemy.spitHit){
                enemy.hp -= this.spitDmg
                
                enemy.spitHit = true
                enemy.spitHitTimer()
    
                enemy.hit = true
                enemy.hitTimer()

                this.sound.play('hitsound', {volume: 0.5})
                this.enemyFlash(enemy)
            }

            //if player has no more piercing hits destroy the projectile
            if(this.enemiesHit >= this.enemiesCanHit){
                frogProjectile.destroy() // can turn this off to make it go through enemies!
                this.enemiesHit = 0
            }
            else { //else if player has invested in piercing, dont destroy projectil yet
                this.enemiesHit++
            }
        }
    }

    attackRatCollision(attack, rat) {
        //if the rat hasn't been hit recently
        if(rat.hit == false){
            //TUTORIAL
            if(this.theMenuScene.tutorial && !this.hasAttackedRat && this.hasHoppedNext && this.hasAttackedNext){
                this.attackRatTut()
            }
            //TUTORIAL
            if(this.hasSpitAndHitRatNext || this.hasEatenBug){
                this.addRat()
            }
            
            //sound fx and subtract health
            this.sound.play('hitsound', {volume: 0.5})
            this.enemyFlash(rat)
            rat.hp -= this.atkDmg
            rat.hit = true
            rat.hitTimer()
        }

    }

    castleEnemyCollision(castle, enemy) {
        if(!enemy.died){ // if enemy hasn't already hit castle to prevent multi triggers
            if(this.castleHP > 0) {
                this.castleHP --
                this.castleHpBar = this.add.sprite(centerX, centerY, this.castleBars[this.castleHP]).setDepth(1)
                if(enemy.isKing){
                    this.castleHP = 0
                }
            }
    
            enemy.knockBack(true) // knock back enemies on castle hit
            
            if(this.castleHP < 1) { // if castle health is 0 game over
                this.sound.play('ratlaugh')
                this.GameOver()
            }

            this.castleFlash() // light up castle for hit feedback
        }

    }

    GameOver(ratKing){
        if(!this.scene.isActive('gameOverScene'))
            this.time.delayedCall(1000, () => { 
                if(ratKing){
                    this.bossMusic.stop()
                    this.bossMusic.destroy()
                }
                this.physics.pause()
                this.scene.run('gameOverScene', this.timer) // run the game over scene over the play scene
            })

        this.gameOver = true
    }

    enemyFlash(enemy) {
        enemy.setTintFill(0xffffff) // set enemy tint to white
        if(!enemy.isGettingDestroyed){
            this.knockBack(enemy) //knock back the enemy
        }
        this.time.delayedCall(75, () => {
            enemy.clearTint() //clear the white tint after .075 seconds
        })
    }

    castleFlash(){
        // castle flashes white when hit
        this.fakeCastle.setTintFill(0xffffff)
        this.time.delayedCall(50, () => {
            this.fakeCastle.clearTint()
        })
    }

    addChallenge() {
        //when not paused, increase spawn rate of both rats and flys
        if(!this.powerUpScreen && !this.gameOver){
            // spawn faster
            if(this.dFLySpawnDelay > 1300){
                this.dFlySpawnDelay -= 300
                this.dFlySpawnTimer.delay = this.dFlySpawnDelay
            }
            if(this.ratSpawnDelay > 500) {
                this.ratSpawnDelay -= 125
                this.ratSpawnTimer.delay = this.ratSpawnDelay
            }

            console.log('add challenge')
            console.log(this.ratSpawnDelay)
        }
    }

    addTime() {
        //if game not paused or game over, increase timer
        if(this.castleHP > 0 && !this.powerUpScreen && !this.gameOver){
            this.timer++
            this.timerText.text = this.timer
        }
    }

    knockBack(enemy) { //knocking back enemy here actually knocks them back in their class
        if(!enemy.knockedBack){
            enemy.knockedBack = true
            enemy.setVelocityX(0)
            enemy.knockBack(false) // the actual knock back
        }

    }

    eatKnockBack(enemy) {
         this.randomize = Phaser.Math.Between(0, 1) // choose either up or down
         if(this.randomize == 0) {
            this.eatKnockDir = -1
            enemy.goUp = true
         }
         else{
            this.eatKnockDir = 1
            enemy.goUp = false
         }

        //tween enemy movement either up or down to make it look like the enemy is dodging
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
        //when xp reaches xp need
        if(this.currentXP >= this.xpNeed) {
            //level up and choose an upgrade
            this.currentLevel++
            this.levelText.text = 'LVL: ' + this.currentLevel
            this.currentXP = 0
            this.xpNeed *= 1.5
            this.xpNeed = Math.ceil(this.xpNeed)
            this.updateXP()
            this.skillScreen()
            
        }
    }

    updateXP() {
        this.xpText.text = this.currentXP + '/' + this.xpNeed
    }

    skillScreen() {

        //pause game
        this.powerUpScreen = true
        this.physics.pause()

        //add UI
        this.upgradeUI = this.add.image(centerX, centerY, 'upgradeUI').setOrigin(0.5).setDepth(19).setScale(1)
        this.skillOneUI = this.add.image(centerX, centerY, 'tSelect').setOrigin(0.5).setDepth(20)
        this.skillTwoUI = this.add.image(centerX, centerY, 'mSelect').setOrigin(0.5).setDepth(29)
        this.skillThreeUI = this.add.image(centerX, centerY, 'bSelect').setOrigin(0.5).setDepth(20)
        
        this.upgTextUI = [
            this.arText = this.add.bitmapText(centerX, 275, 'TH', 'Increase Attack Range').setDepth(20).setScale(0.7).setOrigin(0.5),
            this.prText = this.add.bitmapText(centerX, 372, 'TH', 'Pierce Enemies').setDepth(20).setScale(0.7).setOrigin(0.5),
            this.plText = this.add.bitmapText(centerX, 472, 'TH', 'Increase All Damage').setDepth(20).setScale(0.7).setOrigin(0.5),

            this.arRedText = this.add.bitmapText(centerX, 275, 'rTH', 'Increase Attack Range').setDepth(20).setScale(0.7).setOrigin(0.5).setAlpha(0),
            this.prRedText = this.add.bitmapText(centerX, 372, 'rTH', 'Pierce Enemies').setDepth(20).setScale(0.7).setOrigin(0.5).setAlpha(0),
            this.plRedText = this.add.bitmapText(centerX, 472, 'rTH', 'Increase All Damage').setDepth(20).setScale(0.7).setOrigin(0.5).setAlpha(0)
        ]

    }

    //SKILLS
    projectileSkill() { // allows projectiles to go through enemies
        this.projectileTierOne = true
        this.enemiesCanHit++
    }

    increaseAttackRange(){ //increases the attack collider reach
        this.attack.scaleX *= 1.2
        this.attackOffSet *= 1.2
        this.atkRangeTier ++
    }

    increaseDamage() { // increases both spit dmg and atk dmg
        this.atkDmg *= 1.5
        this.spitDmg *= 1.5
    }

    destroyEnemies(sprite, enemy) { 
        if(!enemy.isKing){
            enemy.isGettingDestroyed = true
            this.enemyFlash(enemy)
            enemy.knockBack(true)
        }

    }

    theKingHasFallen(ratking){ // when the king is defeated
        //remove the timers
        this.ratSpawnTimer.remove()
        this.dFlySpawnTimer.remove()
        this.gameTimer.remove()
        this.challengeTimer.remove()

        this.bossMusic.destroy() // stop boss music

        this.ratKing.anims.msPerFrame = 70 // make the boss go a lil crazy

        this.ratFlashTimer = this.time.addEvent({ // make the rat king flash a few times before dying
            delay: 400,
            callback: this.ratFlash,
            callbackScope: this,
            repeat: 3
        })

        this.time.delayedCall(2000, () => {
            this.sound.play('screech', {volume: 0.4})//screech sound
            this.whiteOut.setAlpha(0)
            this.tweens.addCounter({ // screen white out when boss is dying
                from: 0,
                to: 1,
                duration: 3000,
                onUpdate: tween =>
                    {
                    const val = tween.getValue()
                    this.whiteOut.setAlpha(val) 
                    }
                }
            )
        })

        this.time.delayedCall(4500, () => { 
            this.ratKing.setTintFill(0xffffff)
            this.time.delayedCall(75, () => {
                this.sound.play('hitsound', {volume: 0.5})
                this.ratKing.destroy() // officially destroy rat king
                
                this.time.delayedCall(1000, () => { // reset weather
                    this.sound.play('winsound')
                    this.rainLoop.stop()
                    this.rain.setAlpha(0)
                    this.night.setAlpha(0)
                    this.tweens.addCounter({ // return from screen white out
                        from: 1,
                        to: 0,
                        duration: 1000,
                        onUpdate: tween =>
                            {
                            const val = tween.getValue()
                            this.whiteOut.setAlpha(val) 
                            }
                        }
                    )
                })

                this.time.delayedCall(4000, () => { // begin the credits
                    this.menuMusic.play()
                    this.credits()
                })
                
            })


        })
    }

    ratFlash(){ //makes the rat king flash white
        this.ratKing.setTintFill(0xffffff)
        this.time.delayedCall(75, () => {
            this.ratKing.clearTint()
        })

        this.sound.play('hitsound', {volume: 0.4})

        this.destroyAll.setPosition(-3000, -3000)
    }

    credits(){
        // fade health bar UI
        this.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 2000,
            onUpdate: tween =>
                {
                const val = tween.getValue()
                this.castleHpBar.setAlpha(val) 
                }
            }
        )
        // credit text
        let devCreditsText = 'Developed by Alex Beteta & Franchesca Boongaling          Special Thanks to Nathan Altice, Nate Laffan, Ruby Hirsch, Ishan Gupta, and Jennie Le          Thank You for Playing!'
        let devCredits = this.add.bitmapText(1100, centerY, 'wTH', devCreditsText).setScale(1.25).setDepth(4).setOrigin(0, 0.5)
        this.physics.add.existing(devCredits)
        devCredits.body.setVelocityX(-150)
        let menuText = this.add.bitmapText(1600, centerY, 'wTH', 'Press (M) to go to Menu').setScale(1.2).setDepth(4).setOrigin(0.42, 0.5)
        let resetText = this.add.bitmapText(1600, centerY + 200, 'wTH', 'Press (R) to go to Reset').setScale(1.2).setDepth(4).setOrigin(0.42, 0.5)
        let endGameText = []
        endGameText.push(resetText, menuText)
        this.time.delayedCall(36000, () => { //after credits have scrolled send out the menu prompt
            this.tweens.add({
                targets: endGameText,
                x: centerX,
                ease: 'Linear',
                duration: 8000
            })

            this.gameEnd = true
        })

    }

    ThunderWhiteOut(){ // for cool thunder/lightning effect
        this.sound.play('thunder')
        this.whiteOut = this.add.sprite(centerX, centerY, 'bg').setDepth(80).setAlpha(0)
        this.whiteOut.setSize(960, 600)
        this.whiteOut.setTintFill(0xffffff)
        this.whiteOut.setAlpha(1)
        
        //go quickly between screen white out and not for a lightning effect
        this.time.delayedCall(75, () => { //

            this.whiteOut.setAlpha(0)
        })

        this.time.delayedCall(150, () => {
            //this.whiteOut.setTintFill(0xffffff)
            this.whiteOut.setAlpha(1)
        })

        this.time.delayedCall(225, () => {
            this.whiteOut.setAlpha(0)
        })

        this.time.delayedCall(300, () => {
            this.whiteOut.setAlpha(1)
        })

        this.time.delayedCall(500, () => { // fade back to normal
            this.rainLoop = this.sound.add('rainloop', {volume: 0.25})
            this.rainLoop.loop = true
            this.rainLoop.play()
            this.rain.setAlpha(1)
            //this.dancingRat.setAlpha(1)
            this.night.setAlpha(0.15).setDepth(50)
            this.tweens.addCounter({
                from: 1,
                to: 0,
                duration: 2000,
                onUpdate: tween =>
                {
                    const value = tween.getValue()
                    this.whiteOut.setAlpha(value)
                    //this.dancingRat.setAlpha(value)
                }
            })
            this.whiteOut.setAlpha(0)
        })
    }

    //
    // TUTORIAL THINGS
    //
    hopTut(){
        if(this.theMenuScene.tutorial && !this.hasHoppedNext){ // if this is the tutorial and hasn't hopped both ways...
            if(this.hasHoppedDown && this.hasHoppedUp){
                //check mark and sound go here
                this.time.delayedCall(1000, () => {
                    if(!this.hasHoppedNext){
                        console.log('timedelay')
                        this.tutTextsPos++ //increase text array number
                        this.tutText.text = this.tutTexts[this.tutTextsPos] // set next text based on text array number
                        this.hasHoppedNext = true // set has hopped to true so player can't alter anything with another hop
                    }
                })
            }
        }

    }
    
    attackTut(){
        //check and sound here
        this.time.delayedCall(1000, () => { 
            if(!this.hasAttackedNext){
                this.tutTextsPos++ //increase text array number
                this.tutText.text = this.tutTexts[this.tutTextsPos] // set next text based on text array number
                this.hasAttackedNext = true // set has hopped to true so player can't alter anything with another hop
                this.addRat()
            }
        })
        this.hasAttacked = true //cant call this function again
    }

    attackRatTut(){
        this.time.delayedCall(1000, () => { 
            if(!this.hasAttackedRatNext){
                this.tutTextsPos++ //increase text array number
                this.tutText.text = this.tutTexts[this.tutTextsPos] // set next text based on text array number
                this.hasAttackedRatNext = true
            }
        })
        this.hasAttackedRat = true //cant call this function again

    }

    eatTut(){
        this.time.delayedCall(1000, () => { 
            if(!this.hasEatenNext){
                this.tutTextsPos++ //increase text array number
                this.tutText.text = this.tutTexts[this.tutTextsPos]
                this.hasEatenNext = true
                this.addDFly()
                console.log('eat tut done')
            }
        })
        this.hasEaten = true //cant call this function again
    }

    eatBugTut(){
        this.time.delayedCall(1000, () => { 
            if(!this.hasEatenBugNext){
                this.tutTextsPos++ //increase text array number
                this.tutText.text = this.tutTexts[this.tutTextsPos]
                this.hasEatenBugNext = true
                this.addRat()
            }
        })
        this.hasEatenBug = true //cant call this function again
    }

    spitAndHitRatTut(){
        this.time.delayedCall(1000, () => { 
            if(!this.hasSpitAndHitRatNext){
                this.tutTextsPos++ //increase text array number
                this.tutText.text = this.tutTexts[this.tutTextsPos]
                this.hasSpitAndHitRatNext = true
                this.addRat()
                console.log('addrat')
            }
        })
        this.hasSpitAndHitRat = true //cant call this function again
    }

    blockTut(){
        this.time.delayedCall(1000, () => { 
            if(!this.hasBlockedNext){
                this.tutTextsPos++ //increase text array number
                this.tutText.text = this.tutTexts[this.tutTextsPos]
                this.hasBlockedNext = true
                this.tutorialEnd = true
            }
        })
        this.hasBlocked = true //cant call this function again
    }
}



