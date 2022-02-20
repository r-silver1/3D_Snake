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


    public axesHelper: THREE.AxesHelper;
    public gridHelper: THREE.GridHelper;
    public clock: THREE.Clock;

//     // todo here all arrows: just helpers
    private cameraHelpers: boolean = false;
    public controlArrow: any;
    public posArrow: any;
    public oldArrow: any;
    public addArrow: any;

    // helper bool box helpers render material
    private boxHelpers: boolean = true;

    //fps helper
    public stats: any;

    constructor(private wordService: WordApiService,
                private builderService: ObjBuilderService,
                private sceneService: SceneHelperService,
                private fontService: FontBuilderService
                ) {
        this.scene = new THREE.Scene();
        // todo new logic axes and grid; could be modularized
//         https://danni-three.blogspot.com/2013/09/threejs-helpers.html
        const axesSize = 10
        this.axesHelper = new THREE.AxesHelper(axesSize)
        const centerColor = new THREE.Color('rgb(0, 0, 255)')
        const zColor = new THREE.Color('rgb(0, 50, 100)')
        this.axesHelper.setColors(centerColor, zColor, centerColor)
        this.gridHelper = new THREE.GridHelper(axesSize, axesSize, centerColor);
        this.scene.add(this.axesHelper)
        this.scene.add(this.gridHelper)

        this.camera = new THREE.PerspectiveCamera(60, 800 / 600);
        this.start = -1;
        this.sceneService.initLights(this.scene)
        this.sceneService.initFog(this.scene)
        //for font
        this.fontService.addFont("Hello\nWorld", this.scene)

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
        this.controls.update(delta)
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
        this.shapesArray.forEach((asteroid:any, index:any) => {
//             https://dustinpfister.github.io/2021/05/20/threejs-buffer-geometry-rotation/
            // using rotateY or rotateX to rotate geometry, handles boxhelper more smoothly
//             this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene)
            let tempPos = asteroid.position;
            // todo make helper for translate
//             asteroid.geometry.translate(-tempPos[0], -tempPos[1], -tempPos[2])
//             let rotation = .005 + .01*((this.shapesArray.length-index)/this.shapesArray.length)
//             asteroid.geometry.rotateY(rotation)
//             asteroid.geometry.rotateZ(rotation/5)
//             asteroid.geometry.translate(tempPos[0], tempPos[1], tempPos[2])
            let elapsed_modifier = (timestamp-this.last) *.00007
            let rotation = elapsed_modifier + elapsed_modifier*((this.shapesArray.length-index)/this.shapesArray.length)
//             asteroid.shapeObj.translateOnAxis(asteroid.shapeObj.position.normalize(),-asteroid.position.length)
//             asteroid.shapeObj.rotateOnWorldAxis( upVec, rotation )
            if(index == 5){
                console.log(asteroid.shapeObj.position)
            }
            asteroid.shapeObj.rotateY(rotation)
            asteroid.shapeObj.rotateZ(rotation/2)

            const transX = (index % 10)*.001 + .01
            const transZ = (index % 10)*.001 + .01
//             asteroid.shapeObj.translateX(transX)
//             asteroid.shapeObj.translateZ(transZ)
            const transVec = new THREE.Vector3(transX, 0, transZ)
            asteroid.shapeObj.position.add(transVec)
//             asteroid.shapeObj.translateOnAxis(asteroid.shapeObj.worldToLocal(new THREE.Vector3(1, 0, 0)), transX)

//             asteroid.shapeObj.translate(tempPos[0], tempPos[1], tempPos[2])
//             asteroid.shapeObj.translateOnAxis(asteroid.shapeObj.position.normalize(),asteroid.position.length)
//             asteroid.shapeObj.rotateY(rotation/10)

            // update box helper, or box helper won't change in size with rotation etc
            asteroid.updateBoxHelper()
            this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene, this.boxHelpers)

            // rotation helper update
//             this.scene.remove(asteroid.rotationHelper)
            asteroid.updateRotationHelper(transVec)
//             this.scene.add(asteroid.rotationHelper)
        })
        this.render_all()
        this.stats.update()
        requestAnimationFrame(this.animate);
        this.last = timestamp
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
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: false,
            canvas: document.querySelector('canvas.draw') as HTMLCanvasElement

        });
        this.renderer.shadowMap.enabled = true
        // @ts-ignore
        this.renderer.setClearColor(this.scene.fog.color)
        //https://stackoverflow.com/questions/15409321/super-sample-antialiasing-with-threejs
        //https://r105.threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        // set pixel ratio not recommended
//         this.renderer.setPixelRatio(window.devicePixelRatio*1.25)
        this.sceneService.initCameras(this.scene, this.camera)
        this.controls = this.sceneService.initControls(this.scene, this.camera)

        // main logic
        this.window_set_size();
        this.window_size_listener();
        this.builderService.initBoxes(this.shapesArray, this.scene, this.boxHelpers)

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

        requestAnimationFrame(this.animate);
  }

}


