class Guide extends Phaser.Scene {
    constructor() {
        super('guideScene')
    }

    create() {
        this.add.image(centerX, centerY, 'guide')

        this.anims.create({
            key: 'swing',
            frameRate: 3,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('attack', {
                start:0,
                end: 1
            })
        })

        this.anims.create({
            key: 'guidetongue',
            frameRate: 3,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('eat', {
                start:0,
                end: 1
            })
        })

        this.anims.create({
            key: 'guideblock',
            frameRate: 3,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('block', {
                start:0,
                end: 1
            })
        })
        
        this.anims.create({
            key: 'guiderat',
            frameRate: 3,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ratrun', {
                start:0,
                end: 1
            })
        })

        this.frogAttack = this.physics.add.sprite(150, 100, 'attack').setOrigin(0.5)
        this.frogTongue = this.physics.add.sprite(150, 300, 'eat').setOrigin(0.5)
        this.frogBlock = this.physics.add.sprite(150, 500, 'block').setOrigin(0.5)

        this.frogAttack.anims.play('swing').setScale(1.25)
        this.frogTongue.anims.play('guidetongue').setScale(1.25)
        this.frogBlock.anims.play('guideblock').setScale(1.25)

        this.rat = this.physics.add.sprite(750, 100, 'ratrun').setOrigin(0.5)
        this.dfly = this.physics.add.sprite(750, 300, 'dfly').setOrigin(0.5)

        this.rat.anims.play('guiderat').setScale(1)
    }
}