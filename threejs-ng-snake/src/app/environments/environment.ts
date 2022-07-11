import { Vector3 } from "three"

interface scoreObject {
    status: String,
    scoreDict: Array<any>
}

export const environment = {
    // production: built in to environment threejs
    production: false,
    // gamestart: determine to display timer
    timerStart: false,
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
    keyRefreshRate: 200,
    // todo new logic button group with fonts
    buttonGroupName: "buttonGroup",
    //     buttonGroupPos: new Vector3(-.25, .25, 5),
    // todo new logic moving keys closer and smaller
    buttonGroupPos: new Vector3(-.25, .35, 6),

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
    smallFontSize: .2,
    xSmallFontSize: .1,

    // todo new logic currWord
    currWordEntry: "",
    maxEntryLength: 8,
    scoreboardObject: [-1, undefined],
    // todo new logic limit number of high scores displayed
    scoreStartIndex: 0,
    scoreSliceAmt: 10,
    timeStampDisplay: -1,

    // todo new logic avoid hardcoding strings
    titleString: "Asteroids 3D",
    nameEntryString: "NAME: ",
    highScoresString: "HIGH SCORES",
    playAgainString: "PLAY AGAIN",
    startString: "START",
    enterString: "ENTER",
    deleteString: "DEL",

    // asteroid global params
    min_asteroid_radius: .02,
    max_asteroid_radius: .3,
    asteroid_distance_modifier: .35,
    // rotation on own axis
    min_asteroid_spin: .006,
    max_asteroid_spin: .02,
    max_asteroids: 100,

    // todo testing this, limit rotation speed if faster system
    // higher values slow asteroids
    rotationFramerate: 7,

    // todo new logic camera pos
    cameraPos: new Vector3(0, 1.2, 8),

    // todo new logic move post-game vars here
    gameStopTime: 0,
    // scoreboard service
//     scoreboard_post_url: 'http://localhost:3004/scoreboard_api/post_score',
//     scoreboard_get_url: 'http://localhost:3004/scoreboard_api/get_scoreboard'
    scoreboard_post_url: 'http://gamesapi.robertsilver.codes/scoreboard_api/post_score',
    scoreboard_get_url: 'http://gamesapi.robertsilver.codes/scoreboard_api/get_scoreboard'


}

//         const fontUri = '..\\assets\\Gravity_Bold.json'
