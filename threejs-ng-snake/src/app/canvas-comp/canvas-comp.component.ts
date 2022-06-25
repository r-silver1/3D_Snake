import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { WordApiService } from '../word-api.service';
// import { FormBuilder } from '@angular/forms'
import { ObjBuilderService } from '../services/obj-builder.service'
import { SceneHelperService } from '../services/scene-helper.service'
import { FontBuilderService } from '../services/font-builder.service'

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
    public last: any;
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
    private timerMax = 3
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
                private fontService: FontBuilderService
                ) {
        this.scene = new THREE.Scene();
//         this.sceneService = sceneService
        const axesSize = 10
        const centerColor = new THREE.Color('rgb(0, 0, 255)')
        if(this.axesHelperBool == true){
        // todo new logic axes and grid; could be modularized
        // https://danni-three.blogspot.com/2013/09/threejs-helpers.html
            this.axesHelper = new THREE.AxesHelper(axesSize)
            const zColor = new THREE.Color('rgb(0, 50, 100)')
            this.axesHelper.setColors(centerColor, zColor, centerColor)
            this.scene.add(this.axesHelper)
        }

        if(this.gridHelperBool == true){
            this.gridHelper = new THREE.GridHelper(axesSize, axesSize, centerColor);
            this.scene.add(this.gridHelper)
        }



        this.camera = new THREE.PerspectiveCamera(60, 800 / 600);
        this.start = -1;
        this.sceneService.initLights(this.scene, this.lightDirHelper)
        this.sceneService.initFog(this.scene)

        //for font


        // todo new logic font
        this.sceneService.initSceneGroup(this.scene, environment.wordGroupName)
//         this.fontService.addFont("Asteroids 3D\nDemo", this.scene)
        // todo no longer pass in font, rely on scene group
        this.fontService.addFont("Asteroids 3D Demo", this.scene, environment.wordGroupName, environment.wordGroupPos, environment.largeFontSize)

        // todo new logic timer font group
        this.sceneService.initSceneGroup(this.scene, environment.timeWordGroupName)
//         this.fontService.addFont(String(this.timerMax-1), this.scene, environment.timeWordGroupName, environment.timerGroupPos)

        // todo new logic score gorup
        this.sceneService.initSceneGroup(this.scene, environment.scoreGroupName)
//         this.fontService.addFont(String(environment.userScore), this.scene, environment.scoreGroupName, environment.scoreGroupPos)


        // todo comment or uncomment to include start testing button
        this.sceneService.initSceneGroup(this.scene, environment.buttonGroupName)
        this.fontService.addFont("START", this.scene, environment.buttonGroupName, environment.buttonGroupPos, environment.smallFontSize)


        this.clock = new THREE.Clock()

        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);



    }


    // @ts-ignore
    animate(timestamp): FrameRequestCallback {
        if (this.start === -1){
            this.start = timestamp;
            this.last = timestamp;
        }
        const elapsed = timestamp - this.start;
        // https://threejs.org/examples/?q=Controls#misc_controls_fly
        // controls update: necessary for damping orbit controls
        // note: controls target, useful
        const delta = this.clock.getDelta()
        let controlsTarget = this.controls.update(delta)
        if(controlsTarget != undefined){
            this.sceneService.updateReticuleSprite(this.scene, this.camera, controlsTarget)
        }

        this.sceneService.updateLaser(this.scene, controlsTarget)

        //     https://dustinpfister.github.io/2021/05/12/threejs-object3d-get-by-name/
        // todo new logic modularize this some
//         const textObj = this.scene.getObjectByName('wordName');
        // todo new logic using groups

        // todo new logic timer
        let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
        if(this.lastSecondStart == 0){
            this.lastSecondStart = timestamp
        }
        if(this.lastRotationStart == 0){
            this.lastRotationStart = timestamp
        }
        if(this.lastKeyRefresh == 0){
            this.lastKeyRefresh = timestamp
        }

        // todo move this outside loop
//         if(this.timerElapsed == 0){
//             environment.gameStart = true
//         }
        if((elapsed-this.lastSecondStart) > 950 && timerGroupObj != undefined){
            if(environment.gameStart == true){
                this.timerElapsed += 1
                timerGroupObj.children.forEach((child:any) => {
                    child.userData.deleteText()
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
        // todo new logic refresh keys
//         if((timestamp-this.lastKeyRefresh) > environment.keyRefreshRate){
        // todo new logic only need two mdoes for refresh wireframe
        if((environment.postGameMode == "" || environment.postGameMode == environment.modeName3 || environment.postGameMode == environment.modeName4) && (timestamp-this.lastKeyRefresh > environment.keyRefreshRate)){
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

        // here: logic for game over and enter name prompt
//         if(this.timerElapsed > 0 && environment.gameStart == false && this.gameStopTime >= 0){
        // todo new logic here for game mode
        if(environment.postGameMode != ""){
            if(this.gameStopTime == 0){
                this.gameStopTime = timestamp
//                 if(timerGroupObj != undefined && timerGroupObj.children.length == 0){
//                     this.fontService.addFont("Time's up!!", this.scene, environment.timeWordGroupName, environment.timerGroupPos)
//                 }
            }
            // timesUp mode
            if(environment.postGameMode == environment.modeName1){
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
                    if(timerGroupObj != undefined){
                        timerGroupObj.children.forEach((child:any, i:number)=>{

                            child.userData.deleteText()
                            // @ts-ignore
                            timerGroupObj.children.splice(i, 1)


                            // todo logic avoid whole block
                            this.gameStopTime = -1
                        })
                        // todo logic add enter name group
                        this.fontService.addFont("Name: ", this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
//                         console.log(environment.keysAlphabet.slice(65, 91))
//                         console.log(environment.keysAlphabet.slice(48, 58))

                        // create keyboard
                        let maxChars = Math.floor(environment.keysAlphabet.length/4)
                        let curX = environment.buttonGroupPos.x + (maxChars*.25*environment.buttonGroupPos.x)
                        let curY = environment.buttonGroupPos.y
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
                        this.fontService.addFont("ENTER", this.scene, environment.buttonGroupName, new THREE.Vector3(environment.buttonGroupPos.x+curX, environment.buttonGroupPos.y+curY, environment.buttonGroupPos.z), environment.xSmallFontSize)




                        // mode 3 scoreboard
                        environment.postGameMode = environment.modeName3
                    }
                }
                if(environment.postGameMode == environment.modeName3){
                    // todo new logic check keyboard collide
                    this.builderService.checkLaserKeyboardCollisions(this.scene)
                    //
//                     let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
                    if(timerGroupObj != undefined){
                        // todo logic only refresh these if necessary
                        timerGroupObj.children.forEach((child:any, i:number)=>{
                            if(child.userData.message != undefined && child.userData.message.substr(0, 5) == "Name:" && child.userData.message.slice(6, child.userData.message.length) != environment.currWordEntry){
                                if(child.userData.deleteText != undefined){
                                    child.userData.deleteText()
                                }
                                // @ts-ignore
                                timerGroupObj.children.splice(i, 1)
                                this.fontService.addFont("Name: " + environment.currWordEntry, this.scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                                return
                            }
                        })

                    }

                    //

                }

                if(environment.postGameMode == environment.modeName4){
                    let buttonGroup = this.scene.getObjectByName(environment.buttonGroupName)
                    if(buttonGroup != undefined && buttonGroup.children.length!=0){
                        buttonGroup.children.forEach( (child:any, i:number) => {
                            if(child.userData.deleteText != undefined){
                                child.userData.deleteText()
                            }
                            // @ts-ignore
                            buttonGroup.children.splice(0, i)
                        })
                        console.log(environment.currWordEntry)
                        console.log(environment.userScore)

                    }
                }
            }


        }

        let scoreGroup = this.scene.getObjectByName(environment.scoreGroupName)
        if(scoreGroup != undefined && this.userScorePrev != environment.userScore && environment.gameStart == true){
            this.userScorePrev = environment.userScore
            scoreGroup.children.forEach((child:any) => {
                child.userData.deleteText()
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
            this.shapesArray.forEach((asteroid:any, index:any) => {
                // todo : move this to a call for the asteroids group, and then loop through each
                //   function will take in rotation,
    //             https://dustinpfister.github.io/2021/05/20/threejs-buffer-geometry-rotation/
                let tempPos = asteroid.position;
                // todo make helper for translate

                let elapsed_modifier = (timestamp-this.last) *.00009
                let rotation = elapsed_modifier + elapsed_modifier*((this.shapesArray.length-index)/this.shapesArray.length)

                // todo should make local rotation an internal asteroid function if going to change on collision
                asteroid.shapeObj.rotateY(rotation)
                asteroid.shapeObj.rotateZ(rotation/5)

                // set asteroid direction, also update rotation helper if necessary
                asteroid.setAsteroidDirection()
                // update box helper, or box helper won't change in size with rotation etc
                asteroid.updateBoxHelper()

                this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene, this.boxHelpers)

            });
        }



//         if(environment.gameStart == true){
        this.builderService.checkLaserCollisions(this.shapesArray, this.scene);
//         }
        this.render_all();
        this.stats.update();
        requestAnimationFrame(this.animate);
        this.last = timestamp;
//         console.log(typeof timestamp)
    }



    getWordApi() : void {
        this.wordService.getWord().subscribe(data => {
            let jsonPickleStr = JSON.stringify(data);
            let jsonPickle = JSON.parse(jsonPickleStr);
            let pickleWord = jsonPickle.pickle_time
            this.wordGet = pickleWord
        })
    }

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


