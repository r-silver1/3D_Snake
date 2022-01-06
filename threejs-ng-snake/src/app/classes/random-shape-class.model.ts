import * as THREE from 'three';


// https://www.typescriptlang.org/docs/handbook/interfaces.html
// https://www.cloudhadoop.com/angular-model-class-interface/
export class RandomShapeClass {
    private material: THREE.MeshPhongMaterial;
    private radius: number;
    public position: number[];
    public geometry: THREE.BufferGeometry;
    private maxPoints: number;
    public shapeObj: THREE.Mesh;
//     public boxHelper: THREE.BoxHelper;
//     public boxGeo: THREE.Box3;
    public boxHelper: any;
    public boxGeo: any;
    public conflictHit: boolean;

    // static members
    static blueColor: THREE.Color = new THREE.Color('rgb(0,120,255)')
    static redColor: THREE.Color = new THREE.Color('rgb(255,120,0)')

    constructor(material: THREE.MeshPhongMaterial,
                radius: number, position: number[],
                maxPoints: number){

            this.material = material;
            this.radius = radius;
            this.position = position;

            this.maxPoints = maxPoints
            this.geometry = this.makeRandomGeometry(maxPoints, radius)
            // this makes bad orbit
            const vertices = this.position;
            this.geometry.translate(vertices[0], vertices[1], vertices[2])
            this.shapeObj = new THREE.Mesh(this.geometry, this.material);
            this.shapeObj.castShadow = true;
            this.shapeObj.receiveShadow = true;

            // conflictHit: used to determine box color, red or green
            this.conflictHit = false;

            //set position of this.shapeObj
//             this.boxHelper = this.makeBoxHelper(RandomShapeClass.blueColor)
            this.boxHelper = this.makeBoxHelper(false)
//             this.shapeObj.add(this.boxHelper)
            this.boxGeo = this.makeBoxGeo();


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
            let iX:number = Math.cos(this.thetaToRad(theta)) * circleRadius;
            let iZ:number = Math.sin(this.thetaToRad(theta)) * circleRadius;
            circlePointsMat.push([iX, yIndex, iZ])

        }
        return circlePointsMat;
    }

    makeCirclesArrays(maxPoints: number, radius:number, bottomFlag:boolean) : Array<any> {
        let numCircles = maxPoints - 1;
        // smaller number, taller asteroid, vice versa
        let heightSquisher : number = 1
        let yStep = radius / (heightSquisher*numCircles);
        let yIndex = 0;
        if(bottomFlag == true){
            yStep *= -1;
        }
        let circles = new Array(numCircles)
        for (let i = 0; i < numCircles; i++) {
            let currCircle = this.makeCircle(i, maxPoints, radius, yIndex)
            circles[i] = currCircle
            yIndex += yStep;
//             maxPoints -= 1;

        }
        return circles;

    }


    pushTwoCircles(circleOne: Array<any>, circleTwo: Array<any>, bufferArr: number[]) : number[] {
        let indxOne = 0;
        let indxTwo = 0;
        let indxBool = true;
        //circle1 should be longer circle; circle2 should have one less entry
        const numPoints = circleOne.length;
        while(indxOne < numPoints-1){
            if(indxBool){
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                indxOne++;
                bufferArr = bufferArr.concat(circleOne[indxOne]);
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
            currObjArr = this.pushTwoCircles(bottomPointsArr[i], bottomPointsArr[i+1], currObjArr)
        }
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(currObjArr), 3));
        geometry.computeVertexNormals();
        return geometry
    }

    thetaToRad(deg:number): number {
        return (Math.PI*deg)/180.0
    }


    // https://threejs.org/docs/index.html#api/en/core/BufferGeometry.groups
    // https://dustinpfister.github.io/2021/04/22/threejs-buffer-geometry/
    makeInstance(scene: THREE.Scene): THREE.Mesh {
        const shape = new THREE.Mesh(this.geometry, this.material);
        return this.shapeObj
    }


    updateBoxHelper() : void {
        this.boxHelper.update()
//         this.boxGeo.setFromObject(this.boxHelper)
        delete this.boxGeo;
        this.boxGeo = null;
        this.boxGeo = this.makeBoxGeo()
    }

//     changeBoxHelperCol(hexCol:number) : void {
//     changeBoxHelperCol(hexCol:THREE.Color) : void {
    changeBoxHelperCol(checkBool: boolean) : void {
//         this.shapeObj.remove(this.boxHelper)
//         delete this.boxHelper
//         this.boxHelper = null
//         this.boxHelper.dispose()
        this.boxHelper.material.dispose()
        this.boxHelper.geometry.dispose()
//         if(this.conflictHit){
//             this.boxHelper = this.makeBoxHelper(RandomShapeClass.redColor)
//         }else if(this.conflictHit == false){
//             this.boxHelper = this.makeBoxHelper(RandomShapeClass.blueColor)
//         }

        this.boxHelper = this.makeBoxHelper(checkBool)
//         this.shapeObj.add(this.boxHelper)
//         delete this.boxGeo
//         this.boxGeo = null
//         this.boxGeo.dispose()
//         this.boxGeo.material.dispose()
        //https://r105.threejsfundamentals.org/threejs/lessons/threejs-cleanup.html
//         if(this.boxGeo.material !== undefined){
//             this.boxGeo.material.dispose()
//         }
        this.boxGeo = this.makeBoxGeo();
    }

//     makeBoxHelper(newColorHex : number) : THREE.BoxHelper{
//     makeBoxHelper(newColorHex : THREE.Color) : THREE.BoxHelper{
    makeBoxHelper(checkBool: boolean) : THREE.BoxHelper{
        let colChoice = RandomShapeClass.blueColor
//         if(this.conflictHit){
        if(checkBool){
             colChoice = RandomShapeClass.redColor
        }
        return new THREE.BoxHelper(this.shapeObj, colChoice)
//         return new THREE.BoxHelper(this.shapeObj, newColorHex)
    }

    makeBoxGeo() : THREE.Box3 {
        let tempBox = new THREE.Box3();
        tempBox.setFromObject(this.boxHelper);
        return tempBox
    }

    checkOtherConflict(other:RandomShapeClass):boolean{
        let boxCheck = this.boxGeo.intersectsBox(other.boxGeo)
//         if(boxCheck){
//             this.conflictHit = true;
//             other.conflictHit = true;
//         }
//         console.log("BOX CHECK " + boxCheck)
        return boxCheck
    }

}
