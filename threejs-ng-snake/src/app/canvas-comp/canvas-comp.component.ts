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
//     public geometry: THREE.BoxGeometry;
    public shapesArray: any = []
//     public mesh: THREE.Mesh;
//     public material: THREE.MeshPhongMaterial;
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

        // geometry
//         this.geometry = new THREE.BoxGeometry(1, 1, 1);
//         this.material = new THREE.MeshPhongMaterial({color: new THREE.Color('rgb(159,226,221)')})
//         this.mesh = new THREE.Mesh(this.geometry, this.material);
//         this.mesh.position.y = 1
//         this.mesh.name = 'test_box';

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
        this.camera.position.z = 3;
        this.camera.position.x = .5;
        this.camera.position.y = 1;
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


    initBoxes(): void {
//         for(let i = 0; i<100){
//         }
        let boxGeo = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshPhongMaterial({
            color: new THREE.Color('rgb(159,226,221)')
        })
        let pos = [0, 1, 0]
        let boxShape = this.makeInstance(boxGeo, material, pos)
        this.shapesArray.push(boxShape)

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
            //       console.log(textObj)
            //       this.scene.children.forEach(obj => {
            //           console.log(obj)
            //       })
            console.log("in elapsed")
            this.getWordApi()
            // todo this shouldn't be a global probably
            if(this.wordGet!=undefined){
                this.scene.remove(textObj)
                this.addFont(this.wordGet)
            }

        }

//         testCube.rotation.y += .01;
//         // @ts-ignore
//         testCube.rotation.z += .005;
        this.shapesArray.forEach((cube:any, ndx:any) => {
            console.log("NDX: \n"+ndx)
            let speed = 1 + ndx * .1
            let rotation = speed * elapsed/1500
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
//             let pickleDate = new Date(jsonPickle.pickle_time);
            let pickleWord = jsonPickle.pickle_time
//             this.wordGet = pickleDate.toLocaleTimeString();
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
