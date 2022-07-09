import { Component, OnInit } from '@angular/core';
// todo new logic refresh
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { WordApiService } from '../word-api.service';
// import { FormBuilder } from '@angular/forms'
import { ObjBuilderService } from '../services/obj-builder.service'
import { SceneHelperService } from '../services/scene-helper.service'
import { FontBuilderService } from '../services/font-builder.service'
import { ScoreboardHelperService } from '../services/scoreboard-helper.service'
import { PostGameHelperService } from '../services/post-game-helper.service'

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
//     private gameStopTime = 0

    //
//     private sceneService: any = undefined;

    constructor(private wordService: WordApiService,
                private builderService: ObjBuilderService,
                private sceneService: SceneHelperService,
                private fontService: FontBuilderService,
                private scoreboardService: ScoreboardHelperService,
                private postGameHelper: PostGameHelperService,
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


        // logic for timer, game going on, only update timer every second
        if((elapsed-this.lastSecondStart) > 950 && environment.postGameMode == ""){
            let timerGroupObj = this.scene.getObjectByName(environment.timeWordGroupName)
            if(timerGroupObj != undefined){
                if(environment.gameStart == true){
                    this.timerElapsed += 1
                    timerGroupObj.children.forEach((child:any, i:number) => {
                        if(child.userData.deleteText != undefined){
                            child.userData.deleteText()
                        }
                    })
                    timerGroupObj.children = []
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
                    this.timerElapsed+=1

                }
            }

        }

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

        let scoreGroup = this.scene.getObjectByName(environment.scoreGroupName)
        if(scoreGroup != undefined && this.userScorePrev != environment.userScore && environment.gameStart == true){
            this.userScorePrev = environment.userScore
            scoreGroup.children.forEach((child:any, i:number) => {
                if(child.userData.deleteText != undefined){
                    child.userData.deleteText()
                }
            })
            scoreGroup.children = []
            this.fontService.addFont(String(environment.userScore), this.scene, environment.scoreGroupName, environment.scoreGroupPos, environment.largeFontSize)
        }

        // logic arrow helpers
        if(this.cameraHelpers == true){
            let [cA, pA, oA, aA] = this.sceneService.updateCameraHelpers(this.scene, this.controls, this.controlArrow, this.posArrow, this.oldArrow, this.addArrow)
            this.controlArrow = cA;
            this.posArrow = pA;
            this.oldArrow = oA;
            this.addArrow = aA;
        }

        // main logic asteroids
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

        if(environment.postGameMode != ""){
            this.postGameHelper.postGameRouter(this.scene, timestamp, this.builderService, this.scoreboardService, this.fontService)
        }

        // update laser: init new, set depleted, check max distance and delete
        this.sceneService.updateLaser(this.scene, controlsTarget)
        this.builderService.checkLaserCollisions(this.shapesArray, this.scene, this.boxHelpers);
        this.render_all();
        this.stats.update();
        requestAnimationFrame(this.animate);
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


