import { Vector3 } from "three"

interface scoreObject {
    status: String,
    scoreDict: Array<any>
}

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
    timerGroupPos: new Vector3(-.25,.5,0),
    // user score for asteroids
    userScore: 0,
    scoreGroupName: "wordScoreGroup",
    scoreGroupPos: new Vector3(-.25,1.4,0),
    // laser group
    laserGroupName: "laserGroup",
    // asteroid global params
    min_asteroid_radius: .06,
    max_asteroid_radius: .35,
    max_asteroids: 100,

    // todo testing this, limit rotation speed if faster system
    // higher values slow asteroids
    rotationFramerate: 9,
    keyRefreshRate: 200,

    // todo new logic button group with fonts
    buttonGroupName: "buttonGroup",
    buttonGroupPos: new Vector3(-.25, .25, 5),
    // .5 under timer
//     nameDisplayPos: new Vector3(-.25,-1,0),

    // post_game_mode : avoid if statements using environment
    // Undefined, TimesUp, Entry, Scoreboard
    postGameMode: "",
    modeName1: "TimesUp",
    modeName2: "EntryStart",
    modeName3: "NameEntrykeyboard",
    modeName4: "Scoreboard",

    // todo new logic word alphabet for keyboard
    keysAlphabet: (String.fromCharCode(...Array(123).keys()).slice(65, 91) + String.fromCharCode(...Array(123).keys()).slice(48, 58)).split(''),

    // todo new logic big and small font size
    largeFontSize: .4,
    smallFontSize: .25,
    xSmallFontSize: .15,

    // todo new logic camera pos
    cameraPos: new Vector3(0, 1.2, 8),

    // todo new logic currWord
    currWordEntry: "",
    maxEntryLength: 8,
    scoreboardObject: [-1, undefined]
}

//         const fontUri = '..\\assets\\Gravity_Bold.json'
