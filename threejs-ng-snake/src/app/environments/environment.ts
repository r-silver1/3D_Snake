import { Vector3 } from "three"

export const environment = {
    // production: built in to environment threejs
    production: false,
    // gamestart: determine to display timer
    gameStart: false,
    // fonts for words
    fontUri: '..\\assets\\helvetiker_regular.typeface.json',
    // wordtest group: demo name on top, asteroid demo title
    wordGroupName: "wordTestGroup",
    wordGroupPos: new Vector3(-2,2,0),
    // timer word object
    timeWordGroupName: "timerGroup",
    timerGroupPos: new Vector3(.25,1,0),
    // user score for asteroids
    userScore: 0,
    scoreGroupName: "wordScoreGroup",
    scoreGroupPos: new Vector3(.25,0,0),
    // laser group
    laserGroupName: "laserGroup",
    // asteroid global params
    min_asteroid_radius: .06,
    max_asteroid_radius: .35,
    max_asteroids: 100,

    // todo testing this, limit rotation speed if faster system
    // higher values slow asteroids
    rotationFramerate: 15
}
//         const fontUri = '..\\assets\\Gravity_Bold.json'
