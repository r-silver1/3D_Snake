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
        controls.constrainVertical = true;
        controls.verticalMin = 1*Math.PI/8
//         controls.verticalMin = 1
        controls.verticalMax = 7*Math.PI/8
//         controls.verticalMax = 3.14
        return controls

    }

    public initCameraHelpers(scene:THREE.Scene, controls:TurretControls, controlArrow:THREE.ArrowHelper, posArrow:THREE.ArrowHelper, oldArrow: THREE.ArrowHelper, addArrow:THREE.ArrowHelper) : THREE.ArrowHelper[] {
        // helper arrow target
        const origin = new THREE.Vector3(-1,0,0)
        const length = controls.targetCopy.length()
        controlArrow = new THREE.ArrowHelper(controls.targetCopy.normalize(), origin, length, new THREE.Color('rgb(150, 0,0)'))
        scene.add(controlArrow)
        // helper arrow position controls
        let posCopy = new THREE.Vector3(0,0,0)
        posCopy.copy(controls.object.position)
        posCopy.normalize()

        posArrow = new THREE.ArrowHelper(
                                posCopy,
                                origin,
                                controls.object.position.length(),
                                new THREE.Color('rgb(0, 100, 150)'))
        scene.add(posArrow)
        let oldLength = controls.preAddCopy.length()
        let preAddCache = new THREE.Vector3()
        preAddCache.copy(controls.preAddCopy)
        oldArrow = new THREE.ArrowHelper(controls.preAddCopy.normalize(), origin, oldLength, new THREE.Color('rgb(0, 240,0)'))
        scene.add(oldArrow)
        let addPos = new THREE.Vector3()
        addPos.copy(posCopy).add(preAddCache)
        let addLength = addPos.length()
        addArrow = new THREE.ArrowHelper(
                                addPos.normalize(),
                                new THREE.Vector3(preAddCache.x, preAddCache.y, preAddCache.z),
                                addLength,
                                new THREE.Color('rgb(100, 100, 100)')

        )
        scene.add(addArrow)
        return [controlArrow, posArrow, oldArrow, addArrow]
    }

    public updateCameraHelpers(scene:THREE.Scene, controls:TurretControls, controlArrow:THREE.ArrowHelper, posArrow:THREE.ArrowHelper, oldArrow: THREE.ArrowHelper, addArrow:THREE.ArrowHelper) : THREE.ArrowHelper[] {
        // todo helpers below: all arrows only ... could be added separate function
        // todo new helper logic

        controlArrow.setLength(controls.targetCopy.length(),
                                    // @ts-ignore
                                    controlArrow.headLength,
                                    .15)
        controlArrow.setDirection(controls.targetCopy.normalize())
        // todo below: just calculation using angle target vector and Y axis
        let Yval = controls.targetCopy.y
        let radTheta = Math.acos(Yval/controls.targetCopy.length())
        let thetaY = THREE.MathUtils.radToDeg(radTheta)
//         console.log("radTheta: " + radTheta)
//         console.log("thetaY: " + thetaY)

        let addPos = new THREE.Vector3()
        addPos.copy(controls.object.position)
        scene.remove(addArrow)
        let addLength = addPos.length()
        addArrow = new THREE.ArrowHelper(
                                addPos.normalize(),
                                new THREE.Vector3(controls.preAddCopy.x-1, controls.preAddCopy.y, controls.preAddCopy.z),
                                addLength,
                                new THREE.Color('rgb(100, 100, 100)')

        )
        addArrow.setLength(addLength)
        scene.add(addArrow)

        oldArrow.setLength(controls.preAddCopy.length(),
                                // @ts-ignore
                                controls.preAddCopy.headLength,
                                .15)
        oldArrow.setDirection(controls.preAddCopy.normalize())
        let posCopy = new THREE.Vector3(0,0,0)
        posCopy.copy(controls.object.position)
        posCopy.normalize()

        posArrow.setLength(controls.object.position.length()*.95,
                                // @ts-ignore
                                posArrow.headLength,
                                .08
        )
        posArrow.setDirection(posCopy)
        return [controlArrow, posArrow, oldArrow, addArrow]
    }

}
