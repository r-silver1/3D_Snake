import { Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneHelperService {

    constructor() { }
    public initLights(scene:THREE.Scene) : void {
        // light
        {
            const colorAmb = new THREE.Color('rgb(247,255,246)');
            const intensity = .4;
            const ambLight = new THREE.AmbientLight(colorAmb, intensity);
            scene.add(ambLight);
            //           this.scene.add(ambLight);
        }

        // light 2
        // todo make class variables or add names?
        {
            const colorDir = new THREE.Color('rgb(191,208,212)');
            const intensityDir = 1;
            const lightDir = new THREE.DirectionalLight(colorDir, intensityDir);
            lightDir.position.set(3, 2, 3);
            lightDir.target.position.set(0, 0, 0);
            scene.add(lightDir);
            //           this.scene.add(lightDir);
            const lightDirHelper = new THREE.DirectionalLightHelper(lightDir)
            scene.add(lightDirHelper);
            //           this.scene.add(lightDirHelper);
        }
    }

    public initFog(scene:THREE.Scene) : void {
        // fog
        {
            const color = new THREE.Color('rgb(54,52,70)')
            const near = 1;
            const far = 15;
            scene.fog = new THREE.Fog(color, near, far);
            //           this.scene.fog = new THREE.Fog(color, near, far);
            // this.scene.fog = new THREE.FogExp2('#787570', .1);
            scene.background = color;
            //           this.scene.background = color;
        }
    }

    public initCameras(scene:THREE.Scene, camera:THREE.PerspectiveCamera): void {
        camera.position.z = 6;
        camera.position.x = -2.5;
        camera.position.y = 4;
//         camera.position.z = 3.0;
//         camera.position.x = 0.0;
//         camera.position.y = 0.0;
        scene.add(camera);
    }

    public initControls(scene:THREE.Scene, camera:THREE.PerspectiveCamera): OrbitControls{
        const domElement = document.querySelector('canvas.draw') as HTMLCanvasElement;
        //         https://en.threejs-university.com/2021/09/16/easily-moving-the-three-js-camera-with-orbitcontrols-and-mapcontrols/
        //         https://threejs.org/docs/#examples/en/controls/OrbitControls
        let controls = new OrbitControls(camera, domElement);
//       this.controls = new OrbitControls(this.camera, domElement);
        // disable right click pan
        // note: target updates with pan
        controls.enablePan = false;
//         this.controls.enablePan = false;
        // constrain zoom
        controls.minDistance = 2;
        controls.maxDistance = 12;
//         this.controls.minDistance = 2;
//         this.controls.maxDistance = 10;
        // damping to make it feel better
//         this.controls.enableDamping = true;
//         this.controls.dampingFactor = .01;
//         this.scene.add(this.camera);
        controls.enableDamping = true;
        controls.dampingFactor = .01;
        return controls

    }

}
