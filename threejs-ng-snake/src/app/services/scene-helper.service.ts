import { Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { TurretControls } from '../js/TurretControls'
import { LaserRay } from '../classes/laser-ray'
import * as THREE from 'three';

import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SceneHelperService {
    private targetAxes: any;
    private checked: boolean;
    public clicked: boolean;

    constructor() {
        this.checked = false
        this.targetAxes = undefined
        this.clicked = false
     }

    private generateStarPosition(min_rad:number): THREE.Vector3 {
        let vertAngle = THREE.MathUtils.degToRad(THREE.MathUtils.mapLinear(Math.random(), 0, 1, 0, 360.0))
        let horzAngle = THREE.MathUtils.degToRad(THREE.MathUtils.mapLinear(Math.random(), 0, 1, 0, 360.0))
        let ranVec = new THREE.Vector3(Math.cos(vertAngle)*Math.cos(horzAngle), Math.sin(vertAngle), Math.sin(horzAngle)*Math.cos(vertAngle))
        ranVec.normalize()
        ranVec.setLength(min_rad+Math.random()*min_rad)
        ranVec.setLength(THREE.MathUtils.mapLinear(Math.random(), 0, 1, min_rad, min_rad*1.5))
        return ranVec
    }

    public initStars(scene:THREE.Scene, camera_position:THREE.Vector3) : void {
        const verts = []
        const sizes = []
        const num_stars = 10000
        const min_pos_radius = camera_position.length()
        const starSprite = new THREE.TextureLoader().load('assets/disc.png');

        const min_star_size = .002
        const max_star_size = .01
        for(let i = 0; i<num_stars; i++){
            let temp_vec = this.generateStarPosition(min_pos_radius)
            verts.push(temp_vec.x, temp_vec.y, temp_vec.z)
            let star_size = THREE.MathUtils.mapLinear(Math.random(), 0, 1, min_star_size, max_star_size)
            // modifier: goal: closer stars are smaller size
            let temp_dist_modifier = (temp_vec.distanceTo(camera_position)/min_pos_radius)**2
            sizes.push(star_size*temp_dist_modifier)
//             sizes.push(star_size)
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
//         geo.setAttribute('size', new THREE.Float32BufferAttribute( [.2], 1))
        geo.setAttribute('size', new THREE.Float32BufferAttribute( sizes, 1))
//         const material = new THREE.PointsMaterial({color: new THREE.Color('rgb(255, 255, 255)')})
        const material = new THREE.PointsMaterial({size: .1, map:starSprite, transparent: true, alphaTest: .2})
        const points = new THREE.Points(geo, material)
        scene.add(points)


    }

    public initLights(scene:THREE.Scene, dirHelperBool:boolean) : void {
        // light
        {
            const colorAmb = new THREE.Color('rgb(204,243,251)');
            const intensity = .5;
            const ambLight = new THREE.AmbientLight(colorAmb, intensity);
            scene.add(ambLight);
            //           this.scene.add(ambLight);
        }

        // light 2
        // todo make class variables or add names?
        {
//             const colorDir = new THREE.Color('rgb(255,200,255)');
            const colorDir = new THREE.Color('rgb(243,233,155)');
            const intensityDir = .8;
            const lightDir = new THREE.DirectionalLight(colorDir, intensityDir);
            lightDir.position.set(3, 2, 3);
            lightDir.target.position.set(0, 0, 0);
            scene.add(lightDir);
            //           this.scene.add(lightDir);
            if(dirHelperBool == true){
                const lightDirHelper = new THREE.DirectionalLightHelper(lightDir)
                scene.add(lightDirHelper);
            }
            //           this.scene.add(lightDirHelper);
        }
    }

    public initFog(scene:THREE.Scene) : void {
        // fog
        {
            const color = new THREE.Color('rgb(34,32,50)')
            const near = 1;
//             const far = 21;
            const far = 16;
            scene.fog = new THREE.Fog(color, near, far);
            scene.background = color;
        }
    }

    public initCameras(scene:THREE.Scene, camera:THREE.PerspectiveCamera): void {
//         camera.position.z = 8;
// //         camera.position.z = 5;
//         camera.position.x = 0;
//         camera.position.y = 1.2;
        // todo use new environmental variable for this
        camera.position.x = environment.cameraPos.x;
        camera.position.y = environment.cameraPos.y;
        camera.position.z = environment.cameraPos.z;
        camera.name = "turretCamera"
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

//     public initReticuleSprite(scene:THREE.Scene, camera:THREE.PerspectiveCamera){
    public initReticuleSprite(scene:THREE.Scene, camera:THREE.PerspectiveCamera, controls:any){
        const sprite_uri = ".\\assets\\reticule_small_lens_color.png"
        let sprite_map = new THREE.TextureLoader().load(sprite_uri)
        let material = new THREE.SpriteMaterial({map: sprite_map,
                                                color: 0xffffff,
                                                transparent: true,
                                                opacity: .7
                                                })
        let reticule_sprite = new THREE.Sprite(material)
        reticule_sprite.scale.set(.075, .075, 1)
//         reticule_sprite.scale.set(.1, .1, 1)

        reticule_sprite.position.copy(camera.position)
        reticule_sprite.lookAt(camera.position)
        reticule_sprite.translateZ(-1)

        reticule_sprite.name = "reticule"
        scene.add(reticule_sprite)
    }

    public updateReticuleSprite(scene:THREE.Scene, camera:THREE.PerspectiveCamera, targetPosition:any) {
        let reticule_sprite : any = scene.getObjectByName('reticule')
        reticule_sprite.position.copy(camera.position)
        reticule_sprite.lookAt(camera.position)
        let targetAxes = new THREE.Vector3().copy(targetPosition).sub(camera.position)
//         reticule_sprite.translateOnAxis(targetAxes, 1)
        reticule_sprite.translateOnAxis(targetAxes, .25)
        reticule_sprite.setRotationFromEuler(camera.rotation)


    }

    public updateClickedTrue(scene: THREE.Scene){
        if(this.checked == true && this.clicked == false){
            // todo new logic check if charged before setting clicked true
            if(LaserRay.checkIfCharged() == true){
                this.clicked = true
            }
//             let laser:any = scene.getObjectByName("blueLaser")
//             laser.visible = true
        }
    }

    // todo new logic: generalize group creation
//     public initLaserGroup(scene:THREE.Scene){
    public initSceneGroup(scene:THREE.Scene, name:string){
        let laserGroup = new THREE.Group()
//         laserGroup.name = "laserGroup"
        laserGroup.name = name
        scene.add(laserGroup)
    }

//     public initLaser(scene:THREE.Scene){
    // todo new logic add target when creating laser to add to user data in mesh
    public initLaser(scene:THREE.Scene, targetAxes:THREE.Vector3){
        let camera = scene.getObjectByName("turretCamera")
        let blueLaser = new LaserRay(camera, targetAxes)
        // todo new logic use environment variable for laser group
//         let laserGroup = scene.getObjectByName("laserGroup")
        let laserGroup = scene.getObjectByName(environment.laserGroupName)
        if(laserGroup!=undefined){
            laserGroup.add(blueLaser.laserSprite)
        }
    }

    public updateLaser(scene:THREE.Scene, controlsTarget:any){
        let camera = scene.getObjectByName("turretCamera")
        if(camera != undefined && controlsTarget != undefined){
            // todo break this into new function inside laser?
            if(this.checked == false){
                this.checked = true
            }
//             if(this.checked == true && this.clicked == true){
            // todo new logic game start
//             if(this.checked == true && this.clicked == true && environment.gameStart == true){
            if(this.checked == true && this.clicked == true){
                let targetAxes = new THREE.Vector3().copy(controlsTarget).sub(camera.position).normalize()
                // create laser and add to group
                this.initLaser(scene, targetAxes)
                // set clicked to false TODO add cooldown
                this.clicked = false
                // todo new logic: set laser depleted
                LaserRay.setDepleted()
            }

        }
        // todo new logic use environment variable for group name
        let laserGroup = scene.getObjectByName(environment.laserGroupName)
        if(laserGroup != undefined){
            if(camera != undefined){
                const maxLaserDist = camera.position.length() * 1.2
                laserGroup.children.forEach( (blueLaser, index) => {
                    blueLaser.userData.updateLaserPosition()
                    // calculate laser distance and compare to camera, remove laser after travel distance is camera
                    //  position length or longer
                    if(blueLaser.userData.getLaserTravelDistance(camera) >= maxLaserDist){
                        blueLaser.userData.deleteLaser()
                    }
                })
            }
        }
    }



}
