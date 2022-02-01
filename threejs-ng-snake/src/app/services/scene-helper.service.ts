import { Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { TurretControls } from '../js/TurretControls'
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
            const intensityDir = .6;
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
//             const far = 15;
            const far = 12;
            scene.fog = new THREE.Fog(color, near, far);
            scene.background = color;
        }
    }

    public initCameras(scene:THREE.Scene, camera:THREE.PerspectiveCamera): void {
        camera.position.z = 6;
        camera.position.x = 0;
        camera.position.y = 1;
        scene.add(camera);
    }

    public initControls(scene:THREE.Scene, camera:THREE.PerspectiveCamera): TurretControls{
        const domElement = document.querySelector('canvas.draw') as HTMLCanvasElement;
        //         https://en.threejs-university.com/2021/09/16/easily-moving-the-three-js-camera-with-orbitcontrols-and-mapcontrols/
        //         https://threejs.org/docs/#examples/en/controls/OrbitControls
        //first person controls and configuration
        let controls = new TurretControls(camera, domElement)
        controls.lookSpeed =.35
        controls.lookAt(0,1,0)

        controls.constrainVertical = true;
        controls.verticalMin = Math.PI/4
        controls.verticalMax = 3*Math.PI/4
        return controls

    }

}
