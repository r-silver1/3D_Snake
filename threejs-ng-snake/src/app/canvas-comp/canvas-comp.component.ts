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
        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);
    }


    // @ts-ignore
    animate(timestamp): FrameRequestCallback {
        // controls update: necessary for damping orbit controls
        this.controls.update()
//         console.log(this.controls.target)
        if (this.start === -1){
            this.start = timestamp;
        }
        const elapsed = timestamp - this.start;
        //     https://dustinpfister.github.io/2021/05/12/threejs-object3d-get-by-name/
        const textObj = this.scene.getObjectByName('wordName');
        /*note todo here: trying to set word based on API response; probably need to create new shape if can't find attribue to change
        in console log*/
//         if (elapsed % 180 == 0 && textObj!=undefined){
        if (elapsed % 1500 == 0 && textObj!=undefined){
            this.getWordApi()
            // todo this shouldn't be a global probably
            if(this.wordGet!=undefined){
                this.scene.remove(textObj)
                this.fontService.addFont(this.wordGet, this.scene)
            }

        }
        // todo move this to obj service, use object methods
//         this.shapesArray.forEach((cube:any, index:any) => {
        this.shapesArray.forEach((asteroid:any, index:any) => {
//             https://dustinpfister.github.io/2021/05/20/threejs-buffer-geometry-rotation/
            // using rotateY or rotateX to rotate geometry, handles boxhelper more smoothly
//             this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene)
            let tempPos = asteroid.position;
//             asteroid.shapeObj.position.x = 0
//             asteroid.shapeObj.position.y = 0
//             asteroid.shapeObj.position.z = 0
            // todo make helper for translate
            asteroid.geometry.translate(-tempPos[0], -tempPos[1], -tempPos[2])
            let rotation = .04*((this.shapesArray.length-index)/this.shapesArray.length)
            asteroid.geometry.rotateY(rotation)
            asteroid.geometry.rotateZ(rotation/5)
            asteroid.geometry.translate(tempPos[0], tempPos[1], tempPos[2])
            asteroid.shapeObj.rotateY(rotation/10)
//             asteroid.shapeObj.position.x = tempPos[0]
//             asteroid.shapeObj.position.y = tempPos[1]
//             asteroid.shapeObj.position.z = tempPos[2]
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
        this.window_set_size();
        this.window_size_listener();

        this.builderService.initBoxes(this.shapesArray, this.scene)

        requestAnimationFrame(this.animate);
  }

}
