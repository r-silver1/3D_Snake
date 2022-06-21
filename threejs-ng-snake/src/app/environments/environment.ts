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
    timerGroupPos: new Vector3(-.25,0,0),
    // user score for asteroids
    userScore: 0,
    scoreGroupName: "wordScoreGroup",
    scoreGroupPos: new Vector3(-.25,1,0),
    // laser group
    laserGroupName: "laserGroup",
    // asteroid global params
    min_asteroid_radius: .06,
    max_asteroid_radius: .35,
    max_asteroids: 100,

    // todo testing this, limit rotation speed if faster system
    // higher values slow asteroids
    rotationFramerate: 12,
    keyRefreshRate: 50,

    // todo new logic button group with fonts
    buttonGroupName: "buttonGroup",
    buttonGroupPos: new Vector3(-.25, -1, 0),
    // .5 under timer
//     nameDisplayPos: new Vector3(-.25,-1,0),

    // post_game_mode : avoid if statements using environment
    // Undefined, TimesUp, Entry, Scoreboard
    postGameMode: "",
    modeName1: "TimesUp",
    modeName2: "Entry",
    modeName3: "Scoreboard",

    // todo new logic word alphabet
    keysAlphabet: String.fromCharCode(...Array(123).keys()).slice(65, 91) + String.fromCharCode(...Array(123).keys()).slice(48, 58)
}

//         const fontUri = '..\\assets\\Gravity_Bold.json'
