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

//     // todo here all arrows: just helpers
    private cameraHelpers: boolean = false;
    public controlArrow: any;
    public posArrow: any;
    public oldArrow: any;
    public addArrow: any;

    // helper bool box helpers render material
    private boxHelpers: boolean = false;
    // helper bool for rotation and direction helper arrows
    private directionHelpers: boolean = false;
    //
    private axesHelperBool: boolean = false;
    private gridHelperBool: boolean = false;
    //
    private lightDirHelper: boolean = false;

    //fps helper
    public stats: any;

    // todo this just test helper for movement
    public pushDirVec: THREE.Vector3 = new THREE.Vector3(1, 1, 1)

    private laserTest: boolean = false;

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
//         this.fontService.addFont("Hello\nWorld", this.scene)
        this.fontService.addFont("Asteroids 3D\nDemo", this.scene)

        this.clock = new THREE.Clock()

        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);



    }


    // @ts-ignore
    animate(timestamp): FrameRequestCallback {
        // controls update: necessary for damping orbit controls

        // note: controls target, useful
        if (this.start === -1){
            this.start = timestamp;
            this.last = timestamp;
        }
        const elapsed = timestamp - this.start;
        // https://threejs.org/examples/?q=Controls#misc_controls_fly
        const delta = this.clock.getDelta()
        let controlsTarget = this.controls.update(delta)
        if(controlsTarget != undefined){
            this.sceneService.updateReticuleSprite(this.scene, this.camera, controlsTarget)
        }

        // testing laser
        if (elapsed > 3000){
            this.laserTest = true
        }
        if (this.laserTest == true){
            this.sceneService.updateLaser(this.scene, controlsTarget)
        }

        //     https://dustinpfister.github.io/2021/05/12/threejs-object3d-get-by-name/
        const textObj = this.scene.getObjectByName('wordName');
        /*note todo here: trying to set word based on API response; probably need to create new shape if can't find attribue to change
        in console log*/
        if (elapsed % 1500 == 0 && textObj!=undefined){
            this.getWordApi()
            // todo this shouldn't be a global probably
            if(this.wordGet!=undefined){
                this.scene.remove(textObj)
                this.fontService.addFont(this.wordGet, this.scene)
            }

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
        // todo move this to obj service, use object methods
        const upVec = new THREE.Vector3(1, 0, 0);

        // todo this just test helper for movement
        let addBool = false;
        if(elapsed >= 1 && elapsed % 4000 == 0){
            addBool = true;
            this.pushDirVec.multiplyScalar(-1)
        }

        this.shapesArray.forEach((asteroid:any, index:any) => {
//             https://dustinpfister.github.io/2021/05/20/threejs-buffer-geometry-rotation/
            let tempPos = asteroid.position;
            // todo make helper for translate
            let elapsed_modifier = (timestamp-this.last) *.00009
            let rotation = elapsed_modifier + elapsed_modifier*((this.shapesArray.length-index)/this.shapesArray.length)

            // todo should make local rotation an internal asteroid function if going to change on collision
            asteroid.shapeObj.rotateY(rotation)
            asteroid.shapeObj.rotateZ(rotation/5)

//             const transX = (index % 10)*.001 + .01
//             const transZ = (index % 10)*.001 + .01

            // set asteroid direction, also update rotation helper if necessary
            asteroid.setAsteroidDirection()
            // update box helper, or box helper won't change in size with rotation etc
            asteroid.updateBoxHelper()

            this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene, this.boxHelpers)

            // todo this just test helper for movement
//             if(addBool == true){
//                 asteroid.setPushDir([this.pushDirVec.x*Math.random(), this.pushDirVec.y*Math.random(), this.pushDirVec.z*Math.random()])
// //                 console.log(asteroid.dirTest)
//
//             }
        });
        this.builderService.checkLaserCollisions(this.shapesArray, this.scene);
        this.render_all();
        this.stats.update();
        requestAnimationFrame(this.animate);
        this.last = timestamp;
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
        console.log(canvas)
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: false,
//             canvas: document.querySelector('canvas.draw') as HTMLCanvasElement
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

        this.sceneService.initLaser(this.scene)

        // main logic
        this.window_set_size();
        this.window_size_listener();
//         this.builderService.initBoxes(this.shapesArray, this.scene, this.boxHelpers)
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


