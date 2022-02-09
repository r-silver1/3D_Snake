import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { WordApiService } from '../word-api.service';
// import { FormBuilder } from '@angular/forms'
import { ObjBuilderService } from '../services/obj-builder.service'
import { SceneHelperService } from '../services/scene-helper.service'
import { FontBuilderService } from '../services/font-builder.service'

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
    public controls: any;
    public wordGet: any;
    public axesHelper: THREE.AxesHelper;
    public gridHelper: THREE.GridHelper;
    public clock: THREE.Clock;

//     // todo here all arrows: just helpers
//     public controlArrow: any;
//     public posArrow: any;
//     public oldArrow: any;
//     public addArrow: any;

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

//
//         // todo helpers below: all arrows only ... could be added separate function
//         // todo new helper logic
//         this.controlArrow.setLength(this.controls.targetCopy.length(),
//                                     this.controlArrow.headLength,
//                                     .15)
//         this.controlArrow.setDirection(this.controls.targetCopy.normalize())
//         // todo below: just calculation using angle target vector and Y axis
//         let Yval = this.controls.targetCopy.y
//         let radTheta = Math.acos(Yval/this.controls.targetCopy.length())
//         let thetaY = THREE.MathUtils.radToDeg(radTheta)
//         console.log("radTheta: " + radTheta)
//         console.log("thetaY: " + thetaY)
//
//         let addPos = new THREE.Vector3()
//         addPos.copy(this.controls.object.position)
// //         addPos.add(this.controls.preAddCopy)
//         this.scene.remove(this.addArrow)
//         let addLength = addPos.length()
// //         console.log("here")
// //         console.log(this.controls.preAddCopy)
//         this.addArrow = new THREE.ArrowHelper(
//                                 addPos.normalize(),
//                                 new THREE.Vector3(this.controls.preAddCopy.x-1, this.controls.preAddCopy.y, this.controls.preAddCopy.z),
//                                 addLength,
//                                 new THREE.Color('rgb(100, 100, 100)')
//
//         )
//         this.addArrow.setLength(addLength)
//         this.scene.add(this.addArrow)
//
//         this.oldArrow.setLength(this.controls.preAddCopy.length(),
//                                 this.controls.preAddCopy.headLength,
//                                 .15)
//         this.oldArrow.setDirection(this.controls.preAddCopy.normalize())
//         let posCopy = new THREE.Vector3(0,0,0)
//         posCopy.copy(this.controls.object.position)
//         posCopy.normalize()
//         this.posArrow.setLength(this.controls.object.position.length()*.95,
//                                 this.posArrow.headLength,
//                                 .08
//         )
//         this.posArrow.setDirection(posCopy)

        // main logic asteroids
        // todo move this to obj service, use object methods
        this.shapesArray.forEach((asteroid:any, index:any) => {
//             https://dustinpfister.github.io/2021/05/20/threejs-buffer-geometry-rotation/
            // using rotateY or rotateX to rotate geometry, handles boxhelper more smoothly
//             this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene)
            let tempPos = asteroid.position;
            // todo make helper for translate
            asteroid.geometry.translate(-tempPos[0], -tempPos[1], -tempPos[2])
            let rotation = .01 + .02*((this.shapesArray.length-index)/this.shapesArray.length)
            asteroid.geometry.rotateY(rotation)
            asteroid.geometry.rotateZ(rotation/5)
            asteroid.geometry.translate(tempPos[0], tempPos[1], tempPos[2])
            asteroid.shapeObj.rotateY(rotation/10)
            // update box helper, or box helper won't change in size with rotation etc
            asteroid.updateBoxHelper()
            this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene)

        })
        this.render_all()
        requestAnimationFrame(this.animate);
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

        // todo below: controls helpers: could be moved to separate function
        // helper arrow target
//         const origin = new THREE.Vector3(-1,0,0)
//         const length = this.controls.targetCopy.length()
//         this.controlArrow = new THREE.ArrowHelper(this.controls.targetCopy.normalize(), origin, length, new THREE.Color('rgb(150, 0,0)'))
//         this.scene.add(this.controlArrow)
//         // helper arrow position controls
//         let posCopy = new THREE.Vector3(0,0,0)
//         posCopy.copy(this.controls.object.position)
//         posCopy.normalize()
//         console.log(posCopy)
//         this.posArrow = new THREE.ArrowHelper(
//                                 posCopy,
//                                 origin,
//                                 this.controls.object.position.length(),
//                                 new THREE.Color('rgb(0, 100, 150)'))
//         this.scene.add(this.posArrow)
//         let oldLength = this.controls.preAddCopy.length()
//         let preAddCache = new THREE.Vector3()
//         preAddCache.copy(this.controls.preAddCopy)
//         this.oldArrow = new THREE.ArrowHelper(this.controls.preAddCopy.normalize(), origin, oldLength, new THREE.Color('rgb(0, 240,0)'))
//         this.scene.add(this.oldArrow)
//         let addPos = new THREE.Vector3()
//         addPos.copy(posCopy).add(preAddCache)
//         let addLength = addPos.length()
//         this.addArrow = new THREE.ArrowHelper(
//                                 addPos.normalize(),
//                                 new THREE.Vector3(preAddCache.x, preAddCache.y, preAddCache.z),
//                                 addLength,
//                                 new THREE.Color('rgb(100, 100, 100)')
//
//         )
//         this.scene.add(this.addArrow)



        // main logic
        this.window_set_size();
        this.window_size_listener();

        this.builderService.initBoxes(this.shapesArray, this.scene)

        requestAnimationFrame(this.animate);
  }

}
