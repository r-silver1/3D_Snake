import * as THREE from 'three';
import { environment } from '../environments/environment'

// https://www.typescriptlang.org/docs/handbook/interfaces.html
// https://www.cloudhadoop.com/angular-model-class-interface/
export class RandomShapeClass {
    private material: THREE.MeshPhongMaterial;
    private radius: number;
    public position: number[];
    public worldRadius: number;

    public direction: THREE.Vector3;
    public thetaNow: number;
    public thetaDif: number;

    public directionHelper: any;

    public rotationHelper: any;

    public geometry: THREE.BufferGeometry;
    private maxPoints: number;
    public shapeObj: THREE.Mesh;
    public boxHelper: any;
    public boxGeo: any;
    public conflictHit: boolean;
    // helper for displaying direction or no
    public directionBool: boolean;

    // todo : pushDir, potential to add to userData
    public pushDir = new THREE.Vector3(0,0,0)

    // static members
    static blueColor: THREE.Color = new THREE.Color('rgb(0,120,255)')
    static redColor: THREE.Color = new THREE.Color('rgb(255,120,0)')
    static minScore = 1
    static maxScore = 20000
    // todo new logic base score to have as minimum
    static baseScore = Math.sqrt(RandomShapeClass.maxScore)/5


    // todo here take box colors bool as param
    constructor(material: THREE.MeshPhongMaterial,
                radius: number, position: number[],
                maxPoints: number, boxHelpersBool: boolean){
            // todo : material passed into constructor; ideal?
            this.material = material;
            // todo : material and radius : two fields to add userdata
            this.radius = radius;

            this.position = position;
            this.maxPoints = maxPoints
            this.geometry = this.makeRandomGeometry(maxPoints, radius)

            // todo necessary for vertices const here? also could have helper
            // to translate given simple pos input
            let posVec = new THREE.Vector3(this.position[0], this.position[1], this.position[2])
            let posLength = posVec.length();

            // todo shapeObj : where to add userdata
            this.shapeObj = new THREE.Mesh(this.geometry, this.material);
            //todo new logic dispose of this
            this.geometry.dispose()
            this.material.dispose()

            // todo new logic score
//             this.shapeObj.userData.points = RandomShapeClass.maxScore - THREE.MathUtils.mapLinear(this.radius, environment.min_asteroid_radius, environment.max_asteroid_radius, RandomShapeClass.minScore, RandomShapeClass.maxScore)
            // todo new logic use base score + inverse sqrt function
            this.shapeObj.userData.points = RandomShapeClass.baseScore + (Math.sqrt(RandomShapeClass.maxScore) + -(Math.sqrt(THREE.MathUtils.mapLinear(this.radius, environment.min_asteroid_radius, environment.max_asteroid_radius, RandomShapeClass.minScore, RandomShapeClass.maxScore)+1)))
            // todo new logic asteroid spin
            this.shapeObj.userData.spin = (environment.max_asteroid_spin*1.1) - THREE.MathUtils.mapLinear(this.radius, environment.min_asteroid_radius, environment.max_asteroid_radius, environment.min_asteroid_spin, environment.max_asteroid_spin)
//             this.shapeObj.userData.points = THREE.MathUtils.mapLinear(this.radius, environment.min_asteroid_radius, environment.max_asteroid_radius, RandomShapeClass.minScore, RandomShapeClass.maxScore)

//             this.geometry.translate(vertices[0], vertices[1], vertices[2])
            // todo should be no reason translate in constructor
            this.shapeObj.translateOnAxis(posVec.normalize(), posLength)

            this.shapeObj.castShadow = true;
            this.shapeObj.receiveShadow = true;

            this.worldRadius = 0;
            this.direction = new THREE.Vector3()
            this.thetaNow = 0;
            this.thetaDif = 0;

            this.initDirectionTheta()

            // boolean flag display direction helper or no ( DEPRECATED )
            this.directionBool = false;


            // conflictHit: used to determine box color, red or green
            this.conflictHit = false;

            // make a box helper, passing in false boolean because no initial conflict
            this.shapeObj.userData.boxHelpers = boxHelpersBool
            if(boxHelpersBool){
                this.boxHelper = this.makeBoxHelper(false)
            }else{
                this.boxHelper = undefined
            }
            // also make box geometry used for conflict checking
            this.boxGeo = this.makeBoxGeo();


    }

    initDirectionTheta() {
        let shapeObjXZ = new THREE.Vector3().copy(this.shapeObj.position)
        // project vector shape position on plane; used to find rotation angle around y axis
        shapeObjXZ.projectOnPlane(new THREE.Vector3(0, 1, 0))
        // worldRadius : length of vector projected
        // todo worldRadius : potential userdata field
        this.worldRadius = shapeObjXZ.length()

        this.direction = new THREE.Vector3()

        // theta now : angle from projected position vector to x axis
        // todo theta now : potential add to userdata
        this.thetaNow = shapeObjXZ.angleTo(new THREE.Vector3(1, 0, 0));
        // angle To: finds shortest
        if(shapeObjXZ.z < 0 ){
            this.thetaNow *= -1;
        }

        // theta dif:
        this.thetaDif = -.0001/this.radius + -.001
    }

    getDirection() : THREE.Vector3 {
        return this.direction
    }

//     updateDirectionTheta(){
//         let shapeObjXZ = new THREE.Vector3().copy(this.shapeObj.position)
//         shapeObjXZ.projectOnPlane(new THREE.Vector3(0, 1, 0))
//         this.worldRadius = shapeObjXZ.length()
//         this.thetaNow = shapeObjXZ.angleTo(new THREE.Vector3(1, 0, 0));
//         // angle To: finds shortest
//         if(shapeObjXZ.z < 0 ){
//             this.thetaNow *= -1;
//         }
//     }


    // https://sites.math.washington.edu/~king/coursedir/m445w04/notes/vector/coord.html
    makeCircle(index:number, maxPoints:number, radius:number, yIndex:number) : number[] {
        // 0 <= index < maxPoints - 1
        const pointsNum: number = maxPoints - index;
        // coneMultiplier:set to 1 and sphereMultiplier to 0 for cone
        const coneMultiplier = .5;
        // coneRadius: equation to trace out edges cone
        const coneRadius: number = radius * (pointsNum/maxPoints);
        // sphereMultiplier:set to 1 and coneMultiplier to 0 for orb
        const sphereMultiplier = 1.0-coneMultiplier;
        const sphereRadius: number = Math.sqrt(Math.pow(radius, 2) - Math.pow(yIndex, 2));
        let circleRadius = ((coneRadius*coneMultiplier)+(sphereRadius*sphereMultiplier))
        //uncomment for hourglass
//         const circleRadius: number = radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(yIndex, 2))
        let circlePointsMat: Array<any> = []
        let last: number = 0.0
        let thetaDiff: number = 360.0/pointsNum
        for (let i = 0; i < pointsNum; i++) {
            // random value between last generated angle and theta increment
            let theta:number = last + (Math.random() * (thetaDiff))
            if(i == 0){
                theta = 0;
            }else if(i == pointsNum-1){
                theta = 360;
            }
            last += thetaDiff
//             let iX:number = Math.cos(this.thetaToRad(theta)) * circleRadius;
            let iX:number = Math.cos(THREE.MathUtils.degToRad(theta)) * circleRadius
//             let iZ:number = Math.sin(this.thetaToRad(theta)) * circleRadius;
            let iZ:number = Math.sin(THREE.MathUtils.degToRad(theta)) * circleRadius
            circlePointsMat.push([iX, yIndex, iZ])

        }
        return circlePointsMat;
    }

    makeCirclesArrays(maxPoints: number, radius:number, bottomFlag:boolean) : Array<any> {
        let numCircles = maxPoints - 1;
        // smaller number, taller asteroid, vice versa
//         let heightSquisher : number = 1
//         let yStep = radius / (heightSquisher*numCircles);
        let yStep = radius / numCircles
        let yIndex = 0;
        if(bottomFlag == true){
            yStep *= -1;
        }
        let circles = new Array(numCircles)
        for (let i = 0; i < numCircles; i++) {
            let currCircle = this.makeCircle(i, maxPoints, radius, yIndex)
            circles[i] = currCircle
            yIndex += yStep;

        }
        return circles;

    }


    pushTwoCircles(circleOne: Array<any>, circleTwo: Array<any>, bufferArr: number[]) : number[] {
        let indxOne = 0;
        let indxTwo = 0;
        let indxBool = true;
        const numPoints = circleOne.length;
        while(indxOne < numPoints-1){
            if(indxBool){
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                indxOne++;
                bufferArr = bufferArr.concat(circleOne[indxOne]);
            }else{
                indxTwo++;
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo-1]);
            }
            indxBool = !indxBool
        }
        bufferArr.concat(circleTwo[circleTwo.length-1])
        bufferArr.concat(circleOne[circleOne.length-1])
        bufferArr.concat(circleTwo[0])

        bufferArr.concat(circleOne[circleOne.length-1])
        bufferArr.concat(circleTwo[0])
        bufferArr.concat(circleOne[0])

        return bufferArr
    }

    pushBottomCircles(circleOne: Array<any>, circleTwo: Array<any>, bufferArr: number[]) : number[] {
        let indxOne = 0;
        let indxTwo = 0;
        let indxBool = true;
        const numPoints = circleOne.length;
        // could shorten logic by breaking this part into separate function for both and merging
        while(indxOne < numPoints-1){
            if(indxBool){
                indxOne++;
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                bufferArr = bufferArr.concat(circleOne[indxOne-1]);
            }else{
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                indxTwo++;
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
            }
            indxBool = !indxBool
        }
        bufferArr.concat(circleTwo[circleTwo.length-1])
        bufferArr.concat(circleOne[circleOne.length-1])
        bufferArr.concat(circleTwo[0])

        bufferArr.concat(circleOne[circleOne.length-1])
        bufferArr.concat(circleTwo[0])
        bufferArr.concat(circleOne[0])

        return bufferArr
    }

    makeRandomGeometry(maxPoints: number, radius: number) : THREE.BufferGeometry {
        radius/=1.2
        let circlesPointsArr = this.makeCirclesArrays(maxPoints, radius, false);
        let currObjArr:number[] = []
        for(let i = 0; i < circlesPointsArr.length-2; i++){
            currObjArr = this.pushTwoCircles(circlesPointsArr[i], circlesPointsArr[i+1], currObjArr)
        }
        let bottomPointsArr = this.makeCirclesArrays(maxPoints, radius, true);
        bottomPointsArr[0] = circlesPointsArr[0]
        for(let i = 0; i < bottomPointsArr.length-2; i++){
            currObjArr = this.pushBottomCircles(bottomPointsArr[i], bottomPointsArr[i+1], currObjArr)
        }
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(currObjArr), 3));
        geometry.computeVertexNormals();
        return geometry
    }


    // https://threejs.org/docs/index.html#api/en/core/BufferGeometry.groups
    // https://dustinpfister.github.io/2021/04/22/threejs-buffer-geometry/
    makeInstance(scene: THREE.Scene): THREE.Mesh {
        const shape = new THREE.Mesh(this.geometry, this.material);
        return this.shapeObj
    }


    updateBoxHelper() : void {
        if(this.shapeObj.userData.boxHelpers == true){
            this.boxHelper.update()
        }
        this.boxGeo.setFromObject(this.shapeObj, true)
    }

    makeBoxGeo() : THREE.Box3 {
        let tempBox = new THREE.Box3();
        tempBox.setFromObject(this.shapeObj);
        return tempBox
    }

    // todo here reference bool box helper to make or not
    changeBoxHelperCol(checkBool: boolean) : void {
        if(this.shapeObj.userData.boxHelpers == true){
            this.boxHelper.material.dispose()
            this.boxHelper.geometry.dispose()
            this.boxHelper = this.makeBoxHelper(checkBool)
        }
        this.boxGeo = this.makeBoxGeo();
    }

    deleteAsteroid(){
        if(this.shapeObj.userData.boxHelpers == true){
            this.boxHelper.material.dispose()
            this.boxHelper.geometry.dispose()
            this.boxHelper.removeFromParent()
        }
        this.shapeObj.geometry.dispose()
        this.shapeObj.removeFromParent()

    }



    makeBoxHelper(checkBool: boolean) : THREE.BoxHelper{
        let colChoice = RandomShapeClass.blueColor
        if(checkBool == true){
             colChoice = RandomShapeClass.redColor
        }
        return new THREE.BoxHelper(this.shapeObj, colChoice)
    }

    updatePushOnBump(other:RandomShapeClass) {
        let otherTemp = new THREE.Vector3(this.shapeObj.position.x - other.shapeObj.position.x,
                                          this.shapeObj.position.y - other.shapeObj.position.y,
                                          this.shapeObj.position.z - other.shapeObj.position.z,
                                          )
        this.pushDir.add(otherTemp.multiplyScalar(1))
        otherTemp.multiplyScalar(-1)
        other.pushDir.add(otherTemp)
    }

    checkOtherConflict(other:RandomShapeClass):boolean{
        let boxCheck = this.boxGeo.intersectsBox(other.boxGeo)
        // todo movement push: make other function not called here?
        if(boxCheck == true){
            this.updatePushOnBump(other)
        }
        return boxCheck
    }

    checkPointConflict(point:THREE.Vector3):boolean{
        return this.boxGeo.containsPoint(point)
    }

    setAsteroidDirection() {
        // vector position one theta increment up
        this.thetaNow += this.thetaDif
        // direction: vector one thetadif rotation more around y axis; next position asteroid should be
        this.direction.set(this.worldRadius * Math.cos(this.thetaNow), this.shapeObj.position.y, (this.worldRadius*.9)*Math.sin(this.thetaNow))
//         // find difference between new position and current position; direction vector
        this.direction.add(new THREE.Vector3().copy(this.shapeObj.position).multiplyScalar(-1))

        // pushdir: the "bounce" between asteroids; only present if bounce happens
        if(this.pushDir.length() > .01){
            let newPushVec = new THREE.Vector3().copy(this.pushDir).multiplyScalar(.01)
            this.direction.add(newPushVec)
            this.pushDir.add(newPushVec.multiplyScalar(-1))
        }

        // direction: at this point, literally the vector with direction and magnitude equal to what should be pushed
        this.shapeObj.position.add(this.direction)

        if(this.directionBool == true){
            this.updateRotationHelper(this.direction)
            this.updateDirectionHelper(this.direction)
        }
    }

    initRotationHelper() {
        this.directionBool = true;
        this.position = [this.shapeObj.position.x, this.shapeObj.position.y, this.shapeObj.position.z]
//         const arrowLen = .5;
        const arrowLen = this.radius * 2
        const arrowCol = new THREE.Color('rgb(200, 0, 40)');
        const arrowPos = new THREE.Vector3(this.position[0], this.position[1], this.position[2])
        this.rotationHelper = new THREE.ArrowHelper(this.shapeObj.up, arrowPos, arrowLen, arrowCol)
        return this.rotationHelper;
    }
    //https://threejs.org/docs/#api/en/core/BufferGeometry
    //https://threejs.org/docs/#api/en/core/Object3D
    //https://computergraphics.stackexchange.com/questions/10362/threejs-updating-an-objects-matrix-doesnt-change-its-position-and-rotation-pa
    updateRotationHelper(transVec: THREE.Vector3) {
        this.rotationHelper.setRotationFromEuler(this.shapeObj.rotation)
        this.rotationHelper.position.add(transVec)
        this.rotationHelper.position.setComponent(1, this.shapeObj.position.y)
    }

    initDirectionHelper() {
        this.directionBool = true;
        this.position = [this.shapeObj.position.x, this.shapeObj.position.y, this.shapeObj.position.z]
//         const arrowLen = .5;
        const arrowLen = this.radius*2
        const arrowCol = new THREE.Color('rgb(0, 200, 40)');
        const arrowPos = new THREE.Vector3(this.position[0], this.position[1], this.position[2])
        this.directionHelper = new THREE.ArrowHelper(this.direction, arrowPos, arrowLen, arrowCol)
        return this.directionHelper;
    }

    updateDirectionHelper(transVec: THREE.Vector3) {
        const dirCopy = new THREE.Vector3()
        dirCopy.copy(this.direction).normalize()
        this.directionHelper.setDirection(dirCopy)
        this.directionHelper.position.add(transVec)
    }

    setWorldRadius(newRad: number){
        this.worldRadius = newRad
    }

    getWorldRadius() {
        return this.worldRadius
    }

    setPushDir(numList: number[]) {
        this.pushDir.x = numList[0]
        this.pushDir.y = numList[1]
        this.pushDir.z = numList[2]
    }

    getPushDir() : THREE.Vector3 {
        return this.pushDir
    }






}
