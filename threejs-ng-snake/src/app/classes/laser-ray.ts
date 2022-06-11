import * as THREE from 'three';
// import BufferGeometryUtils from '../js/BufferGeometryUtils'
import * as BFUTILS from '../js/BufferGeometryUtils'


export class LaserRay {
//     private texture_uri: any = ".\\assets\\crazier_greens.png"
    private texture_uri: any = ".\\assets\\crazier_greens_2.png"
    // todo new logic: recharge time milliseconds
    private static rechargeTime: number = 200
    private static charged: boolean = true
    private static lastShot: number = -1

    public texture: any;
    public laserMat: any;
    public laserGeo: any;
    public laserSprite: any;
    public laserSpriteCombined: any;
    public name: any;

    public upHelper: any;

    constructor(camera: any, targetAxes: any){
        const topRadius = .004;
        const bottomRadius = .0005;
        const height = .1;
        const segments = 20;
        this.texture = new THREE.TextureLoader().load(this.texture_uri)
//         this.laserMat = new THREE.SpriteMaterial({
        this.laserMat = new THREE.MeshBasicMaterial({
            map: this.texture,
//             blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .25
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
        // todo new logic user data target axes
        this.laserSprite.userData.targetAxes = targetAxes

        // todo : new logic use arrow function versus static function
        this.laserSprite.userData.updateLaserPosition = () => {
            this.laserSprite.position.add(this.laserSprite.userData.targetAxes.setLength(.08))
        }

        this.laserSprite.userData.getLaserTravelDistance = (camera: any) => {
            return this.laserSprite.position.distanceTo(camera.position)
        }

        this.laserSprite.userData.deleteLaser = () => {
            // @ts-ignore
            this.laserSprite.geometry.dispose()
            // @ts-ignore
            this.laserSprite.material.dispose()
            this.laserSprite.removeFromParent()
        }


        // todo must uncomment for helpers
//         this.upHelper = new THREE.ArrowHelper(this.laserSprite.up, new THREE.Vector3(0,0,0), 1, new THREE.Color('rgb(0, 200, 200)'))
//         this.upHelper.name = "laserUpHelper"

//         let temp_vec = new THREE.Vector3().copy(this.laserSprite.position)
//         temp_vec.sub(camera.position)
//         this.laserSprite.rotateX(temp_vec.angleTo(new THREE.Vector3(1,0,0)))
//         console.log(temp_vec.angleTo(new THREE.Vector3(1,0,0)))
//         this.laserSprite.rotateX(3)


//         this.laserSprite.rotateX(5)

    }

    static checkIfCharged() : any{
//         console.log(this.rechargeTime)
//         console.log(typeof new Date().valueOf())
        if(this.charged == true){
            return true
        }else if((new Date().valueOf() - this.lastShot) >= this.rechargeTime){
            this.charged = true;
        }

        return this.charged

    }

    static setDepleted() :any {
        this.charged = false
        this.lastShot = new Date().valueOf()
    }

//     static updateLaserPosition(laserSprite:any){
//         laserSprite.position.add(laserSprite.userData.targetAxes.setLength(.08))
//     }
//     todo : deprecated
//     static updateLaserSprite(camera:any, laserSprite:any, controlsTarget:any) {
//         laserSprite.position.copy(camera.position)
//         let target_axis = new THREE.Vector3().copy(controlsTarget).sub(camera.position).normalize()
//
//     }





}
