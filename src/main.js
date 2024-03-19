//Created by Alex Beteta & Franchesca Boongaling
//Citations:
// https://freesound.org/people/balloonhead/sounds/362330/ (Evil Laugh Sound)
// https://freesound.org/people/Patrick_Corra/sounds/633119/ (Ambient Sound)
// https://freesound.org/people/SGAK/sounds/467777/ (Thunder Sound)
// https://freesound.org/people/Rubaoliva/sounds/624645/ (Rain Loop)
// Trash Hand found from https://www.dafont.com/trashhand.font by Luce Avérous
//
//Technical Components:
// Physics System
// Animation Manager
// Tween Manager
// Timers
// Text Objects
//
//Polish & Style:
// Credits at the end of the game go under the castle! (utilizng depth)
// Boss sequence with thunder and music transition (use of tweens and timers)
// Making original sounds and music!
// Beautiful, cohesive art!
// Upgrade and level system! (systems within systems)
// UI!
// Handwritten font to match original source material!(Menu Title, Game Over Text)
// Interactive tutorial!
//


'use strict'

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [ Menu, Play, Guide, GameOver ]
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