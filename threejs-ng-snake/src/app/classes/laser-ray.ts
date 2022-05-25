import * as THREE from 'three';
// import BufferGeometryUtils from '../js/BufferGeometryUtils'
import * as BFUTILS from '../js/BufferGeometryUtils'


export class LaserRay {
    private texture_uri: any = ".\\assets\\crazier_greens.png"
    public texture: any;
    public laserMat: any;
    public laserGeo: any;
    public laserSprite: any;
    public laserSpriteCombined: any;
    public name: any;

    public upHelper: any;

    constructor(camera: any){
        const topRadius = .003;
        const bottomRadius = .0075;
        const height = .6;
        const segments = 20;
        this.texture = new THREE.TextureLoader().load(this.texture_uri)
//         this.laserMat = new THREE.SpriteMaterial({
        this.laserMat = new THREE.MeshBasicMaterial({
            map: this.texture,
//             blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .3
        })
        this.laserGeo = new THREE.CylinderGeometry(topRadius, bottomRadius, height, segments)
        // move center down?
        this.laserGeo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -height/2, 0))
        // rotate 90deg x axis
        this.laserGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(90)))

        this.laserSprite = new THREE.Mesh(this.laserGeo, this.laserMat)
        this.laserGeo.dispose()
        this.laserMat.dispose()

//         this.laserSprite.position.set(0, 1.2, 7.5)
        this.laserSprite.position.copy(camera.position)
        // this should move out of camera view?
        this.laserSprite.z -= 1

        this.upHelper = new THREE.ArrowHelper(this.laserSprite.up, new THREE.Vector3(0,0,0), 1, new THREE.Color('rgb(0, 200, 200)'))
        this.upHelper.name = "laserUpHelper"

//         let temp_vec = new THREE.Vector3().copy(this.laserSprite.position)
//         temp_vec.sub(camera.position)
//         this.laserSprite.rotateX(temp_vec.angleTo(new THREE.Vector3(1,0,0)))
//         console.log(temp_vec.angleTo(new THREE.Vector3(1,0,0)))
//         this.laserSprite.rotateX(3)


//         this.laserSprite.rotateX(5)

    }

    static updateLaserSprite(camera:any, laserSprite:any, controlsTarget:any) {
        laserSprite.position.copy(camera.position)
//         laserSprite.setRotationFromEuler(camera.rotation)
//         laserSprite.up = controlsTarget
//         laserSprite.lookAt(0,0,0)
//         laserSprite.lookAt(camera.position)
//         laserSprite.position.y += .05

//         let temp = new THREE.Vector3().copy(controlsTarget).sub(camera.position).add(laserSprite.position)
//         console.log(temp)
//         laserSprite.setRotationFromEuler(new THREE.Euler().setFromVector3(temp.sub(controlsTarget)))
        let target_axis = new THREE.Vector3().copy(controlsTarget).sub(camera.position).normalize()
//         laserSprite.translateOnAxis(target_axis, -.17)
//         laserSprite.position.add(target_axis)



    }



}
