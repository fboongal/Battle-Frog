'use strict'

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [ Menu, Play, GameOver ]
}

let game = new Phaser.Game(config)

let centerX = game.config.width/2
let centerY = game.config.height/2
let w = game.config.width
let h = game.config.height

let cursors

let keyUP
let keyDOWN
let keyLEFT
let keyRIGHT
let keyMENU
let keyRESTART
let keySPACE