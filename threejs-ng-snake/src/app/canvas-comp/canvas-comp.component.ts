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
//     public loader: FontLoader;
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
//         this.loader = new FontLoader();
//         this.addFont("Hello\nWorld")
        this.fontService.addFont("Hello\nWorld", this.scene)
        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);
    }



//     addFont(msg: string) : void {
//         // text
//         // https://threejs.org/examples/?q=text#webgl_geometry_text_shapes
//         // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html
//         const fontUri = '..\\assets\\helvetiker_regular.typeface.json'
//         this.loader.load(fontUri, font => {
//             const fontColor = new THREE.Color('rgb(0, 255, 0)');
//             const matLite = new THREE.MeshBasicMaterial({
//                 color: fontColor,
//                 transparent: true,
//                 opacity: .5,
//                 side: THREE.DoubleSide
//             });
//             const message = msg
//             const shape = font.generateShapes(message, .2);
//             const textGeo = new THREE.ShapeGeometry(shape);
//             textGeo.computeBoundingBox();
//             // do some logic for move center of text using bounding box
//             const text = new THREE.Mesh(textGeo, matLite);
//             text.name = 'wordName';
//             text.position.z = 1;
//             text.position.y = .5;
//             text.position.x = -.5;
//             this.scene.add(text);
//         });
//     }


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
        if (elapsed % 3000 == 0 && textObj!=undefined){
            this.getWordApi()
            // todo this shouldn't be a global probably
            if(this.wordGet!=undefined){
                this.scene.remove(textObj)
                this.fontService.addFont(this.wordGet, this.scene)
            }

        }
        // todo move this to obj service, use object methods
        this.shapesArray.forEach((cube:any, index:any) => {
            let rotation = elapsed/(50*index)
            cube.rotation.y = rotation
            cube.rotation.z = rotation/10
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
        // @ts-ignore
        const HEIGHT = document.getElementById('mainCanvas').clientHeight;
        // @ts-ignore
        const WIDTH = document.getElementById('mainCanvas').clientWidth;
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
            logarithmicDepthBuffer: true,
            canvas: document.querySelector('canvas.draw') as HTMLCanvasElement

        });
        this.renderer.shadowMap.enabled = true
    // @ts-ignore
        this.renderer.setClearColor(this.scene.fog.color)
        this.sceneService.initCameras(this.scene, this.camera)
        this.controls = this.sceneService.initControls(this.scene, this.camera)
        this.window_set_size();
        this.window_size_listener();
        this.builderService.initBoxes(this.shapesArray, this.scene)

        requestAnimationFrame(this.animate);
  }

}
