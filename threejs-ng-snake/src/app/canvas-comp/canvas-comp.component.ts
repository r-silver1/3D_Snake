import { Component, OnInit } from '@angular/core';
// todo new logic refresh
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { WordApiService } from '../word-api.service';
// import { FormBuilder } from '@angular/forms'
import { ObjBuilderService } from '../services/obj-builder.service'
import { SceneHelperService } from '../services/scene-helper.service'
import { FontBuilderService } from '../services/font-builder.service'
import { ScoreboardHelperService } from '../services/scoreboard-helper.service'

import { Stats } from '../js/stats'

import { environment } from '../environments/environment'

@Component({
    selector: 'app-canvas-comp',
    templateUrl: './canvas-comp.component.html',
    styles: [
    ]
})


export class CanvasCompComponent implements OnInit {
    public word_form: any;
    public scene: THREE.Scene;
    public shapesArray: any = []
    public camera: THREE.PerspectiveCamera;
    public renderer: any;
    public start: any;
//     public last: any;
    public controls: any;
    public wordGet: any;
    // THREE.AxesHelper
    public axesHelper: any;
    // THREE.GridHelper
    public gridHelper: any;

    public clock: THREE.Clock;

    public controlArrow: any;
    public posArrow: any;
    public oldArrow: any;
    public addArrow: any;
    //fps helper
    public stats: any;

    // todo here all arrows: just helpers
    private cameraHelpers: boolean = false;
    // helper bool box helpers render material
    private boxHelpers: boolean = false;
    // helper bool for rotation and direction helper arrows
    private directionHelpers: boolean = false;
    //
    private axesHelperBool: boolean = false;
    private gridHelperBool: boolean = false;
    //
    private lightDirHelper: boolean = false;

    private laserTest: boolean = false;

    // todo timer
    private lastSecondStart = 0
    private timerElapsed = 0
    private timerMax = 46
    private userScorePrev = -1

    // todo new logic rotation timing
    private lastRotationStart = 0

    // todo new logic refresh timing
    private lastKeyRefresh = 0

    // todo new logic game stop time
    private gameStopTime = 0

    //
//     private sceneService: any = undefined;

    constructor(private wordService: WordApiService,
                private builderService: ObjBuilderService,
                private sceneService: SceneHelperService,
                private fontService: FontBuilderService,
                private scoreboardService: ScoreboardHelperService,
                // new logic refresh
                private router: Router,
                private location: Location
                ) {

        this.scene = new THREE.Scene();

        // HELPERS:
        const axesSize = 10
        const centerColor = new THREE.Color('rgb(0, 0, 255)')
        if(this.axesHelperBool == true){
            this.axesHelper = new THREE.AxesHelper(axesSize)
            const zColor = new THREE.Color('rgb(0, 50, 100)')
            this.axesHelper.setColors(centerColor, zColor, centerColor)
            this.scene.add(this.axesHelper)
        }
        if(this.gridHelperBool == true){
            this.gridHelper = new THREE.GridHelper(axesSize, axesSize, centerColor);
            this.scene.add(this.gridHelper)
        }

        // MAIN CAMERA
        this.camera = new THREE.PerspectiveCamera(60, 800 / 600);
        // START: USED FOR TIMING
        this.start = -1;
        // INITIALIZE LIGHTS AND FOG
        this.sceneService.initLights(this.scene, this.lightDirHelper)
        this.sceneService.initFog(this.scene)

        // INITIAL TEXT AND BUTTON OBJECTS
        // title group
        this.sceneService.initSceneGroup(this.scene, environment.wordGroupName)
        this.fontService.addFont(environment.titleString, this.scene, environment.wordGroupName, environment.wordGroupPos, environment.largeFontSize)
        // timer group
        this.sceneService.initSceneGroup(this.scene, environment.timeWordGroupName)
        // score group
        this.sceneService.initSceneGroup(this.scene, environment.scoreGroupName)
        // start button
        this.sceneService.initSceneGroup(this.scene, environment.buttonGroupName)
        this.fontService.addFont(environment.startString, this.scene, environment.buttonGroupName, environment.buttonGroupPos, environment.smallFontSize)

        // CLOCK OBJECT FOR DELTA
        this.clock = new THREE.Clock()

        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);
    }


    // @ts-ignore
    animate(timestamp): FrameRequestCallback {
        // INITIALIZE TIME OBJECTS IN ANIMATION LOOP
        // start object: used to calculate elapsed time
        if (this.start === -1){
            this.start = timestamp;
            this.lastSecondStart = timestamp
            this.lastRotationStart = timestamp
            this.lastKeyRefresh = timestamp
//             this.last = timestamp;
        }
        const elapsed = timestamp - this.start;
        const delta = this.clock.getDelta()

        // controls update: necessary for damping orbit controls
        // note: controls target, useful
        let controlsTarget = this.controls.update(delta)

        // logic for updating controls reticule, target is a sprite
        if(controlsTarget != undefined){
            this.sceneService.updateReticuleSprite(this.scene, this.camera, controlsTarget)
        }



        if((elapsed-this.lastSecondStart) > 900 && environment.postGameMode == ""){
            let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
            if(timerGroupObj != undefined){
                if(environment.gameStart == true){
                    this.timerElapsed += 1
    //                 timerGroupObj.children.forEach((child:any) => {
    //                     child.userData.deleteText()
    //                 })
                    // todo new logic splice
                    timerGroupObj.children.forEach((child:any, i:number) => {
                        if(child.userData.deleteText != undefined){
                            child.userData.deleteText()
                        }
                        // todo splice not be necessary
                        // @ts-ignore
    //                     timerGroupObj.children.splice(i, 1)
                    })
                    timerGroupObj.children = []
                    // todo new logic
            //                 this.fontService.addFont(this.wordGet, this.scene)
                    if(this.timerMax-this.timerElapsed != 0){
                        this.fontService.addFont(String(this.timerMax-this.timerElapsed), this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                    }
                    this.lastSecondStart = timestamp
                }
                if(this.timerMax - this.timerElapsed <= 0 && environment.gameStart == true){
                    environment.gameStart = false
                    environment.postGameMode = environment.modeName1
                    timerGroupObj.children.forEach((child:any) => {
                        child.userData.deleteText()
                    })
                    timerGroupObj.children = []
    //                 this.fontService.addFont("Time's up!!", this.scene, environment.timeWordGroupName, environment.timerGroupPos)
                    this.timerElapsed+=1

                }
            }

        }
        // todo new logic refresh keys
//         if((timestamp-this.lastKeyRefresh) > environment.keyRefreshRate){
        // todo new logic only need two mdoes for refresh wireframe
//         if((environment.postGameMode == "" || environment.postGameMode == environment.modeName3 || environment.postGameMode == environment.modeName4) && (timestamp-this.lastKeyRefresh > environment.keyRefreshRate)){
        // todo new logic exclude game mode 3 gameplay else refresh
        if(environment.postGameMode != environment.modeName2 && (timestamp-this.lastKeyRefresh) > environment.keyRefreshRate){
            this.lastKeyRefresh = timestamp
            // todo new logic refresh button color
            let buttonGroup = this.scene.getObjectByName(environment.buttonGroupName)
            if(buttonGroup != undefined){
                buttonGroup.children.forEach( (child:any) => {
                    if(child.userData.refreshTextWireframe != undefined){
                        child.userData.refreshTextWireframe()
                    }
                })
            }
        }

        if(environment.postGameMode != ""){
            if(this.gameStopTime == 0){
                this.gameStopTime = timestamp
            }
            // timesUp mode
            if(environment.postGameMode == environment.modeName1){
                let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                if(timerGroupObj != undefined){
                    this.fontService.addFont("Time's up!!", this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                }
                // Entry mode
                environment.postGameMode = environment.modeName2
            }

            // todo new logic environment mode
//             else if(timestamp - this.gameStopTime > 2000){
            if(timestamp - this.gameStopTime > 2000){

                if(environment.postGameMode == environment.modeName2){
                    let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                    if(timerGroupObj != undefined){
                        timerGroupObj.children.forEach((child:any, i:number)=>{

                            child.userData.deleteText()
                            // @ts-ignore
                            // todo logic avoid whole block
                            this.gameStopTime = -1
                        })
                        // todo logic add enter name group
                        this.fontService.addFont(environment.nameEntryString, this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                        // create keyboard
                        let maxChars = Math.floor(environment.keysAlphabet.length/4)
                        let curX = environment.buttonGroupPos.x + (maxChars*.25*environment.buttonGroupPos.x)
                        let curY = environment.buttonGroupPos.y

                        // todo new logic add play again button
                        // todo new logic using env var not "PLAY AGAIN" hardcode
                        this.fontService.addFont(environment.playAgainString, this.scene, environment.buttonGroupName, new THREE.Vector3(environment.timerGroupPos.x - environment.smallFontSize*7, environment.timerGroupPos.y + environment.smallFontSize*2, environment.buttonGroupPos.z*.85), environment.xSmallFontSize*.80)

                        environment.keysAlphabet.forEach((characterVal:string, index:any) => {
                            if(index > 0 && index % maxChars == 0){
                                curX = environment.buttonGroupPos.x + (maxChars*.25*environment.buttonGroupPos.x)
                                curY -= environment.xSmallFontSize * 2.5
                            }
                            this.fontService.addFont(characterVal, this.scene, environment.buttonGroupName, new THREE.Vector3(environment.buttonGroupPos.x+curX, environment.buttonGroupPos.y+curY, environment.buttonGroupPos.z), environment.xSmallFontSize)
                            curX += environment.xSmallFontSize * 2.5

                        })
                        // todo new enter button logic
                        curY -= environment.xSmallFontSize * 2.5
                        curX/=2
                        // todo new logic user env var not "ENTER" hardcode
                        this.fontService.addFont(environment.enterString, this.scene, environment.buttonGroupName, new THREE.Vector3(environment.buttonGroupPos.x+curX, environment.buttonGroupPos.y+curY, environment.buttonGroupPos.z), environment.xSmallFontSize)

                        // mode 3 scoreboard
                        environment.postGameMode = environment.modeName3
                    }
                }
                if(environment.postGameMode == environment.modeName3){
                    // todo new logic check keyboard collide
                    this.builderService.checkLaserKeyboardCollisions(this.scene)
                    //
                    let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                    if(timerGroupObj != undefined){
                        // todo logic only refresh these if necessary
                        timerGroupObj.children.forEach((child:any, i:number)=>{
                            // todo new logic check if message beginning == NAME:
                            if(child.userData.message != undefined && child.userData.message.substr(0, 5) == environment.nameEntryString.substr(0, 5) && child.userData.message.slice(6, child.userData.message.length) != environment.currWordEntry){
                                if(child.userData.deleteText != undefined){
                                    child.userData.deleteText()
                                }
                                // @ts-ignore
//                                 timerGroupObj.children.splice(i, 1)
                                this.fontService.addFont(environment.nameEntryString + environment.currWordEntry, this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                                return
                            }
                        })

                    }

                    //

                }

                if(environment.postGameMode == environment.modeName4){
                    let buttonGroup = this.scene.getObjectByName(environment.buttonGroupName)
                    if(buttonGroup != undefined && buttonGroup.children.length!=0 && environment.scoreboardObject[0] != 2){
                        buttonGroup.children.forEach( (child:any, i:number) => {
                            if(child.userData.deleteText != undefined){
                                child.userData.deleteText()
                            }
                        })
                        // todo make new function for get scoreboard api
                    }
                    // todo here temporary logic might not want to use this method of first element scoreboard
                    // todo also added logic make sure button group cleared before switching, weird bug with empty name enter causing O and N keys to remain
                    //@ts-ignore
                    if(environment.scoreboardObject[0] == -1 && buttonGroup.children.length == 0){
                        // posting score
                        this.scoreboardService.postScoreHelper(environment.currWordEntry, environment.userScore)
                        environment.scoreboardObject = [-2]
                    }else if(environment.scoreboardObject[0] == -2){
                        // getting scoreboard
                        this.scoreboardService.getScoreBoardHelper()
                        let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                        if(timerGroupObj != undefined){
                            timerGroupObj.children.forEach((child:any, i:number)=>{
                                if(child.userData.deleteText != undefined){
                                    child.userData.deleteText()
                                }
                            })
                        }
                        let scoreGroup = this.scene.getObjectByName(environment.scoreGroupName)
                        if(scoreGroup != undefined){
                            scoreGroup.children.forEach((child:any, i:number) => {
                                if(child.userData.deleteText != undefined){
                                    child.userData.deleteText()
                                }
                            })
                        }
                    }else if(environment.scoreboardObject[0] == 1){
                        // this: scoreboard object [0] == 1, displaying scoreboard
                        let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                        if(timerGroupObj != undefined){
                            if(timerGroupObj.children.length != 0){
                                timerGroupObj.children.forEach((child:any, i:number)=>{
                                    if(child.userData.deleteText != undefined){
                                        child.userData.deleteText()
                                    }
                                })
                            }
                        }
                        // todo new logic only put in high score if length 0
                        //@ts-ignore
                        if(timerGroupObj.children.length == 0){
                            environment.scoreboardObject[0] = 2

                        }

                    // todo new logic
                    // block after here: scoreboard object 0 == 2, displaying scoreboard
                    }else if(environment.scoreboardObject[0] == 2){
                        if(environment.timeStampDisplay == -1){
                            // - 2000 to display faster
                            environment.timeStampDisplay = timestamp - 2500
                            // todo add msg "HIGH SCORES" using environment var not hard code
                            this.fontService.addFont(environment.highScoresString, this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                            // todo add msg "PLAY AGAIN" using environment var not hard code
                            this.fontService.addFont(environment.playAgainString, this.scene, environment.buttonGroupName, new THREE.Vector3(environment.timerGroupPos.x - environment.smallFontSize*7, environment.timerGroupPos.y + environment.smallFontSize*2, environment.buttonGroupPos.z*.85), environment.xSmallFontSize*.80)
                        }

//                         let scoresList = environment.scoreboardObject[1]
                        //@ts-ignore
                        if(environment.scoreStartIndex < environment.scoreboardObject[1].length && timestamp - environment.timeStampDisplay > 3000){
                            let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                            if(timerGroupObj != undefined){
                                if(timerGroupObj.children.length != 0){
                                    timerGroupObj.children.forEach((child:any, i:number)=>{
                                        // todo new logic avoid high score string update
                                        if(child.userData.deleteText != undefined && child.userData.message != environment.highScoresString){
                                            child.userData.deleteText()
                                        }
                                    })
                                }
                            }
                            // todo new logic only put in high score if length 0
                            //@ts-ignore
                            // todo add msg "HIGH SCORES" using environment var not hard code
                            let curY = environment.timerGroupPos.y
                            curY -= environment.largeFontSize*2
                            let scoresList = environment.scoreboardObject[1]
                            // todo new logic try to avoid not deleting, cant check if == 0 because high scores object with 2 objects in children list
                            //@ts-ignore
                            if(timerGroupObj.children.length <= 2){
                                //@ts-ignore
                                scoresList.slice(environment.scoreStartIndex, environment.scoreStartIndex+environment.scoreSliceAmt).forEach((scoreInfo: Array<any>, i:number) => {
                                    const nameVal = scoreInfo[1]
                                    const scoreVal = scoreInfo[2]
                                    // todo new logic incorporate score start index
                                    const scoreMsg = String(i+1+environment.scoreStartIndex) + " " + nameVal + ":    " + scoreVal
                                    curY -= environment.smallFontSize * 2
                                    this.fontService.addFont(scoreMsg, this.scene, environment.timeWordGroupName, new THREE.Vector3(environment.timerGroupPos.x, environment.timerGroupPos.y+curY, environment.timerGroupPos.z), environment.smallFontSize)
                                })
                                // new logic time of displaying last scores
                                environment.timeStampDisplay = timestamp
                                // new logic update scoreStartIndex
                                environment.scoreStartIndex += environment.scoreSliceAmt
                            }

                        }
                        this.builderService.checkLaserKeyboardCollisions(this.scene)

                    }else if (environment.scoreboardObject[0] == 3){
                        this.refreshPagePlayAgain()
                    }

                }
            }


        }

        let scoreGroup = this.scene.getObjectByName(environment.scoreGroupName)
        if(scoreGroup != undefined && this.userScorePrev != environment.userScore && environment.gameStart == true){
            this.userScorePrev = environment.userScore
//             scoreGroup.children.forEach((child:any) => {
//                 child.userData.deleteText()
//             })
//             todo new logic splice
            scoreGroup.children.forEach((child:any, i:number) => {
                if(child.userData.deleteText != undefined){
                    child.userData.deleteText()
                }
                //@ts-ignore
//                 scoreGroup.children.splice(i, 1)
            })
            scoreGroup.children = []
            this.fontService.addFont(String(environment.userScore), this.scene, environment.scoreGroupName, environment.scoreGroupPos, environment.largeFontSize)
        }

//         this.secondsElapsed = timestamp - this.lastSecondStart


        // logic arrow helpers
        if(this.cameraHelpers == true){
            let [cA, pA, oA, aA] = this.sceneService.updateCameraHelpers(this.scene, this.controls, this.controlArrow, this.posArrow, this.oldArrow, this.addArrow)
            this.controlArrow = cA;
            this.posArrow = pA;
            this.oldArrow = oA;
            this.addArrow = aA;
        }

        // main logic asteroids
        // todo move this to obj service, use object methods
        // todo this just test helper for movement
        if(timestamp-this.lastRotationStart > environment.rotationFramerate){
            this.lastRotationStart = timestamp
            // spin each asteroid and rotate around center y axis
            this.shapesArray.forEach((asteroid:any, index:any) => {
                // todo new logic here using asteroid user data spin, now set using min and max vars for radius and spin
                asteroid.shapeObj.rotateY(asteroid.shapeObj.userData.spin)
                asteroid.shapeObj.rotateZ(asteroid.shapeObj.userData.spin/5)
                // set asteroid direction, also update rotation helper if necessary
                asteroid.setAsteroidDirection()
                // update box helper, or box helper won't change in size with rotation etc
                asteroid.updateBoxHelper()

                this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene, this.boxHelpers)

            });
        }


        // update laser: init new, set depleted, check max distance and delete
        this.sceneService.updateLaser(this.scene, controlsTarget)
//         if(environment.gameStart == true){
        this.builderService.checkLaserCollisions(this.shapesArray, this.scene);
//         }
        this.render_all();
        this.stats.update();
        requestAnimationFrame(this.animate);
//         this.last = timestamp;
//         console.log(typeof timestamp)
    }

    refreshPagePlayAgain() : void{
//         this.router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
//             console.log(decodeURI(this.location.path()))
//             this.router.navigate([decodeURI(this.location.path())])
//         })
//         location.reload()
        window.location.reload()
        // must set scoreboard object to avoid looping and reloading multiple times
        environment.scoreboardObject[0] = 4
    }

    getWordApi() : void {
        this.wordService.getWord().subscribe(data => {
            let jsonPickleStr = JSON.stringify(data);
            let jsonPickle = JSON.parse(jsonPickleStr);
            let pickleWord = jsonPickle.pickle_time
            this.wordGet = pickleWord
        })
    }

    // todo new logic post word API

    window_set_size(): void {
        //https://r105.threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        const pixelRatio = window.devicePixelRatio;
        // @ts-ignore
        const HEIGHT = document.getElementById('mainCanvas').clientHeight * pixelRatio;
        // @ts-ignore
        const WIDTH = document.getElementById('mainCanvas').clientWidth * pixelRatio;
        this.renderer.setSize(WIDTH, HEIGHT);
        this.camera.aspect = WIDTH / HEIGHT;
        this.camera.updateProjectionMatrix();
    }

    window_size_listener(): void {
        window.addEventListener('resize', () => {
            this.window_set_size();
        });
    }

    render_all(): void {
        this.renderer.render(this.scene, this.camera);
    }



    ngOnInit(): void {
        let canvas = document.querySelector('canvas.draw') as HTMLCanvasElement
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: false,
            canvas: canvas

        });

        this.renderer.shadowMap.enabled = true
        // @ts-ignore
        this.renderer.setClearColor(this.scene.fog.color)
        //https://stackoverflow.com/questions/15409321/super-sample-antialiasing-with-threejs
        //https://r105.threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        // set pixel ratio not recommended
//         this.renderer.setPixelRatio(window.devicePixelRatio*1.25)

        this.sceneService.initCameras(this.scene, this.camera)

        this.sceneService.initStars(this.scene, this.camera.position)

        this.controls = this.sceneService.initControls(this.scene, this.camera)

        this.sceneService.initReticuleSprite(this.scene, this.camera, this.controls)

        // todo new logic grouping lasers
        // todo new logic renaming this and using generalized name
//         this.sceneService.initLaserGroup(this.scene)
        this.sceneService.initSceneGroup(this.scene, environment.laserGroupName)

        // main logic
        this.window_set_size();
        this.window_size_listener();

        // todo : logic init asteroids, don't need to pass in anything but scene after using scene group logic
        this.builderService.initBoxes(this.shapesArray, this.scene, this.boxHelpers, this.directionHelpers)

        // arrow helper logic
        if(this.cameraHelpers == true){
            this.controls.cameraHelpers = true;
            let [cA, pA, oA, aA]  = this.sceneService.initCameraHelpers(this.scene, this.controls, this.controlArrow, this.posArrow, this.oldArrow, this.addArrow)
            this.controlArrow = cA;
            this.posArrow = pA;
            this.oldArrow = oA;
            this.addArrow = aA;
        }

        //fps helper logic
        // https://subscription.packtpub.com/book/web-development/9781783981182/1/ch01lvl1sec15/determining-the-frame-rate-for-your-scene
        {
            // @ts-ignore
            this.stats = new Stats();
            this.stats.setMode(0);
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '5vh';
            this.stats.domElement.style.top = "80vh";
            document.body.appendChild( this.stats.domElement );

        }

        /* Mouse clicking handling */
        canvas.addEventListener('click', (evt) => this.sceneService.updateClickedTrue(this.scene))

        requestAnimationFrame(this.animate);
  }

}


