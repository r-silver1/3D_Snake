import * as THREE from 'three';


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

//     public pushDir = new THREE.Vector3(-2, 1, 2)
//     public pushDir = new THREE.Vector3(Math.random(), Math.random(), Math.random())
    public pushDir = new THREE.Vector3(0,0,0)

    // static members
    static blueColor: THREE.Color = new THREE.Color('rgb(0,120,255)')
    static redColor: THREE.Color = new THREE.Color('rgb(255,120,0)')

    // todo here take box colors bool as param
    constructor(material: THREE.MeshPhongMaterial,
                radius: number, position: number[],
                maxPoints: number){
            this.material = material;
            this.radius = radius;
            this.position = position;
            this.maxPoints = maxPoints
            this.geometry = this.makeRandomGeometry(maxPoints, radius)
            // todo necessary for vertices const here? also could have helper
            // to translate given simple pos input
            let posVec = new THREE.Vector3(this.position[0], this.position[1], this.position[2])
            let posLength = posVec.length();
            this.shapeObj = new THREE.Mesh(this.geometry, this.material);
//             this.geometry.translate(vertices[0], vertices[1], vertices[2])
            this.shapeObj.translateOnAxis(posVec.normalize(), posLength)
            this.shapeObj.castShadow = true;
            this.shapeObj.receiveShadow = true;

            this.worldRadius = 0;
            this.direction = new THREE.Vector3()
            this.thetaNow = 0;
            this.thetaDif = 0;

            this.initDirectionTheta()


            // conflictHit: used to determine box color, red or green
            this.conflictHit = false;

            // make a box helper, passing in false boolean because no initial conflict
            this.boxHelper = this.makeBoxHelper(false)
            // also make box geometry used for conflict checking
            this.boxGeo = this.makeBoxGeo();


    }

    initDirectionTheta() {
        let shapeObjXZ = new THREE.Vector3().copy(this.shapeObj.position)
        shapeObjXZ.projectOnPlane(new THREE.Vector3(0, 1, 0))
        this.worldRadius = shapeObjXZ.length()

        this.direction = new THREE.Vector3()
        this.thetaNow = shapeObjXZ.angleTo(new THREE.Vector3(1, 0, 0));

        // angle To: finds shortest
        if(shapeObjXZ.z < 0 ){
            this.thetaNow *= -1;
        }

        this.thetaDif = -.0001/this.radius + -.001
    }

    getDirection() : THREE.Vector3 {
        return this.direction
    }

    updateDirectionTheta(){
        let shapeObjXZ = new THREE.Vector3().copy(this.shapeObj.position)
        shapeObjXZ.projectOnPlane(new THREE.Vector3(0, 1, 0))
        this.worldRadius = shapeObjXZ.length()
        this.thetaNow = shapeObjXZ.angleTo(new THREE.Vector3(1, 0, 0));
        // angle To: finds shortest
        if(shapeObjXZ.z < 0 ){
            this.thetaNow *= -1;
        }
    }


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
        this.boxHelper.update()
//         delete this.boxGeo;
//         this.boxGeo = null;
//         this.boxGeo = this.makeBoxGeo()
//             this.boxGeo.setFromObject(this.boxHelper)
        this.boxGeo.setFromObject(this.shapeObj, true)
//         this.boxGeo.position = this.shapeObj.position;
//         this.boxGeo.rotation = this.shapeObj.rotation;
    }

    makeBoxGeo() : THREE.Box3 {
        let tempBox = new THREE.Box3();
//         tempBox.setFromObject(this.boxHelper);
        tempBox.setFromObject(this.shapeObj);
        return tempBox
    }

    // todo here reference bool box helper to make or not
    changeBoxHelperCol(checkBool: boolean) : void {
        this.boxHelper.material.dispose()
        this.boxHelper.geometry.dispose()
        this.boxHelper = this.makeBoxHelper(checkBool)
        this.boxGeo = this.makeBoxGeo();
    }

    makeBoxHelper(checkBool: boolean) : THREE.BoxHelper{
        let colChoice = RandomShapeClass.blueColor
        if(checkBool == true){
             colChoice = RandomShapeClass.redColor
        }
        return new THREE.BoxHelper(this.shapeObj, colChoice)
    }

    updatePushOnBump(other:RandomShapeClass) {
//         console.log(other.getDirection())
        let otherTemp = new THREE.Vector3().copy(other.getDirection())
//         this.pushDir.add(other.getDirection().multiplyScalar(15))
        this.pushDir.add(otherTemp.normalize().multiplyScalar(1))
//         other.setPushDir([this.direction.x*6, this.direction.y*6, this.direction.z*6])
//         this.setPushDir([otherTemp.x*6, otherTemp.y*6, otherTemp.z*6])
    }

    checkOtherConflict(other:RandomShapeClass):boolean{
        let boxCheck = this.boxGeo.intersectsBox(other.boxGeo)

        // todo movement push: make other function not called here?
        if(boxCheck == true){
            this.updatePushOnBump(other)
//             other.updatePushOnBump(this)
        }
        return boxCheck
    }

    setAsteroidDirection() {
//         let backupY = this.shapeObj.position.y
//         this.thetaNow += this.thetaDif
//         this.thetaNow %= (2*Math.PI)

//         this.worldRadius = this.shapeObj.position.length()
        // vector position one theta increment up
        this.thetaNow += this.thetaDif
        this.direction.set(this.worldRadius * Math.cos(this.thetaNow), this.shapeObj.position.y, (this.worldRadius*.9)*Math.sin(this.thetaNow))
//         // find difference between new position and current position; direction vector
        this.direction.add(new THREE.Vector3().copy(this.shapeObj.position).multiplyScalar(-1))

//         this.updateDirectionTheta()
// //         this.direction.set(-this.worldRadius*Math.sin(this.thetaNow), 0, this.worldRadius*Math.cos(this.thetaNow)).normalize().multiplyScalar(-.001/this.radius)
//         this.direction.set(-this.worldRadius*Math.sin(this.thetaNow), 0, this.worldRadius*Math.cos(this.thetaNow))
        if(this.pushDir.length() > .01){
            let newPushVec = new THREE.Vector3().copy(this.pushDir).multiplyScalar(.01)
            this.direction.add(newPushVec)
            this.pushDir.add(newPushVec.multiplyScalar(-1))
        }

        this.shapeObj.position.add(this.direction)
//         this.shapeObj.position.setComponent(1, backupY)
        this.updateRotationHelper(this.direction)
        this.updateDirectionHelper(this.direction)
    }

    initRotationHelper() {
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
