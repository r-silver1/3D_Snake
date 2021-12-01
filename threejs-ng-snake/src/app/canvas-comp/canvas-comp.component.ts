import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { WordApiService } from '../word-api.service';
// import { FormBuilder } from '@angular/forms'


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
    public loader: FontLoader;
    public wordGet: any;

    constructor(private wordService: WordApiService) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 800 / 600);
        this.start = -1;
        this.initLights()
        this.initFog()
        //for font
        this.loader = new FontLoader();
        this.addFont("Hello\nWorld")
        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);
    }

    initLights() : void {
        // light
        {
            const colorAmb = new THREE.Color('rgb(247,255,246)');
            const intensity = .4;
            const ambLight = new THREE.AmbientLight(colorAmb, intensity);
            this.scene.add(ambLight);
        }

        // light 2
        // todo make class variables or add names?
        {
            const colorDir = new THREE.Color('rgb(191,208,212)');
            const intensityDir = 1;
            const lightDir = new THREE.DirectionalLight(colorDir, intensityDir);
            lightDir.position.set(3, 2, 3);
            lightDir.target.position.set(0, 0, 0);
            this.scene.add(lightDir);
            const lightDirHelper = new THREE.DirectionalLightHelper(lightDir)
            this.scene.add(lightDirHelper);
        }
    }

    initFog() : void {
        // fog
        {
            const color = new THREE.Color('rgb(54,52,70)')
            const near = 1;
            const far = 15;
            this.scene.fog = new THREE.Fog(color, near, far);
            // this.scene.fog = new THREE.FogExp2('#787570', .1);
            this.scene.background = color;
        }
    }

    init_cameras(): void {
        this.camera.position.z = 6;
        this.camera.position.x = -2.5;
        this.camera.position.y = 4;
        const domElement = document.querySelector('canvas.draw') as HTMLCanvasElement
        this.controls = new OrbitControls(this.camera, domElement)
        this.scene.add(this.camera);
    }

    addFont(msg: string) : void {
        // text
        // https://threejs.org/examples/?q=text#webgl_geometry_text_shapes
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html
        const fontUri = '..\\assets\\helvetiker_regular.typeface.json'
        this.loader.load(fontUri, font => {
            const fontColor = new THREE.Color('rgb(0, 255, 0)');
            const matLite = new THREE.MeshBasicMaterial({
                color: fontColor,
                transparent: true,
                opacity: .5,
                side: THREE.DoubleSide
            });
            const message = msg
            const shape = font.generateShapes(message, .2);
            const textGeo = new THREE.ShapeGeometry(shape);
            textGeo.computeBoundingBox();
            // do some logic for move center of text using bounding box
            const text = new THREE.Mesh(textGeo, matLite);
            text.name = 'wordName';
            text.position.z = 1;
            text.position.y = .5;
            text.position.x = -.5;
            this.scene.add(text);
        });
    }


    norm_range(a:number, b:number, min:number, max:number, x:number): number {
        return a + ((x-min)/(max-min))*(b-a)
    }

    initBoxes(): void {
        const min_diam = .025
        const max_diam = .6
        const min_val = 0;
        const max_val = 99;
        // todo add some color variation
        let material = new THREE.MeshPhongMaterial({
                        color: new THREE.Color('rgb(159,226,221)')
                    })
        for(let i = min_val; i<max_val+1; i++){
            let box_rad = this.norm_range(min_diam, max_diam, min_val, max_val, i)
            let newGeo = new THREE.BoxGeometry(box_rad, box_rad, box_rad)
            let min_bound = max_diam*4
            let horzAngle = Math.random()*360.0
            let vertAngle = Math.random()*360.0
            let ranVec = new THREE.Vector3(min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), min_bound*Math.sin(horzAngle))
            let pos = [ranVec.x, ranVec.y, ranVec.z]
            let box_temp = this.makeInstance(newGeo, material, pos)
            this.shapesArray.push(box_temp)
        }
//         let boxGeo = new THREE.BoxGeometry(.2, .2, .2);
//         let material = new THREE.MeshPhongMaterial({
//             color: new THREE.Color('rgb(159,226,221)')
//         })
//         let pos = [0, 0, 0]
//         let boxShape = this.makeInstance(boxGeo, material, pos)
//         this.shapesArray.push(boxShape)

    }

    makeInstance(geometry: any, material: any, vertices: any[]): THREE.Mesh{
        const shape = new THREE.Mesh(geometry, material);
        shape.castShadow = true;
        shape.receiveShadow = true;
        //add to g_scene to be rendered
        this.scene.add(shape);
        //set position of shape
        shape.position.x = vertices[0];
        shape.position.y = vertices[1];
        shape.position.z = vertices[2];
        return shape;
    }

    // @ts-ignore
    animate(timestamp): FrameRequestCallback {
        if (this.start === -1){
            this.start = timestamp;
        }
        const elapsed = timestamp - this.start;
//         const testCube = this.scene.getObjectByName('test_box');
        //     https://dustinpfister.github.io/2021/05/12/threejs-object3d-get-by-name/
        const textObj = this.scene.getObjectByName('wordName');
        /*note todo here: trying to set word based on API response; probably need to create new shape if can't find attribue to change
        in console log*/
//         if (elapsed % 180 == 0 && textObj!=undefined){
        if (elapsed % 3000 == 0 && textObj!=undefined){
            console.log("in elapsed")
            this.getWordApi()
            // todo this shouldn't be a global probably
            if(this.wordGet!=undefined){
                this.scene.remove(textObj)
                this.addFont(this.wordGet)
            }

        }

        this.shapesArray.forEach((cube:any, index:any) => {
            console.log("index: \n"+index)
//             let speed = 1 + index * .1
//             let rotation = speed * elapsed/1500
//             let rotation = elapsed/2000
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
//         this.scene.add(this.mesh);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            canvas: document.querySelector('canvas.draw') as HTMLCanvasElement

        });
        this.renderer.shadowMap.enabled = true
    // @ts-ignore
        this.renderer.setClearColor(this.scene.fog.color)
        this.init_cameras();
        this.window_set_size();
        this.window_size_listener();
        this.initBoxes();

        requestAnimationFrame(this.animate);
  }

}
