import * as THREE from 'three';


// https://www.typescriptlang.org/docs/handbook/interfaces.html
// https://www.cloudhadoop.com/angular-model-class-interface/
export class RandomShapeClass {
    private material: THREE.MeshPhongMaterial;
    private radius: number;
    private position: number[];
    private geometry: THREE.BufferGeometry;
    public shapeObj: THREE.Mesh;
    public boxHelper: THREE.BoxHelper;
    public boxGeo: THREE.Box3;

    constructor(material: THREE.MeshPhongMaterial,
                radius: number, position: number[]){
            this.material = material;
            this.radius = radius;
            this.position = position;
            let maxPoints = 12
            this.geometry = this.makeRandomGeometry(maxPoints, radius)

            this.shapeObj = new THREE.Mesh(this.geometry, this.material);
            //         const this.shapeObj = new THREE.Points(this.geometry,
            //                             new THREE.PointsMaterial({
            //                                 color: THREE.Color('rgb(255, 0, 0)'),
            //                                 size: 0.5
            //
            //                             })
            //                         )
            this.shapeObj.castShadow = true;
            this.shapeObj.receiveShadow = true;
            //set position of this.shapeObj
            const vertices = this.position;
            this.shapeObj.position.x = vertices[0];
            this.shapeObj.position.y = vertices[1];
            this.shapeObj.position.z = vertices[2];


//             this.boxHelper = new THREE.BoxHelper(this.shapeObj, 0x0000FF)
//             this.makeBoxHelper(0x0000FF);
            this.boxHelper = this.makeBoxHelper(0x0000FF)
            this.shapeObj.add(this.boxHelper)
//             this.boxGeo = new THREE.Box3()
//             this.boxGeo.setFromObject(this.boxHelper)
            this.boxGeo = this.makeBoxGeo();

    }


    // https://sites.math.washington.edu/~king/coursedir/m445w04/notes/vector/coord.html
    makeCircle(index:number, maxPoints:number, radius:number, yIndex:number) : number[] {
        // 0 <= index < maxPoints - 1
        const pointsNum: number = maxPoints - index
        const circleRadius1: number = radius * (pointsNum/maxPoints)
        const circleRadius2: number = Math.sqrt(Math.pow(radius, 2) - Math.pow(yIndex, 2))
        // todo here: could do weighted average
        let circleRadius = ((circleRadius1*.3)+(circleRadius2*.7))
//         circleRadius*= ((maxPoints-index)/maxPoints)
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
//         const shape = new THREE.Points(this.geometry,
//                             new THREE.PointsMaterial({
//                                 color: THREE.Color('rgb(255, 0, 0)'),
//                                 size: 0.5
//
//                             })
//                         )
//         shape.castShadow = true;
//         shape.receiveShadow = true;
//         //set position of shape
//         const vertices = this.position;
//         shape.position.x = vertices[0];
//         shape.position.y = vertices[1];
//         shape.position.z = vertices[2];
//         return shape;
        return this.shapeObj
    }


    updateBoxHelper() : void {
//         console.log(this.shapeObj.position.x)
//         if(this.shapeObj.position.x == NaN || this.shapeObj.position.y == NaN || this.shapeObj.position.z == NaN){
//             console.log("HEREE!!!!")
//         }
        this.boxHelper.update()
        this.boxGeo.setFromObject(this.boxHelper)
    }

    changeBoxHelperCol(hexCol:number) : void {
        this.shapeObj.remove(this.boxHelper)
        this.boxHelper = this.makeBoxHelper(hexCol)
        this.shapeObj.add(this.boxHelper)
//             this.boxGeo = new THREE.Box3()
//             this.boxGeo.setFromObject(this.boxHelper)
        this.boxGeo = this.makeBoxGeo();
    }

    makeBoxHelper(newColorHex : number) : THREE.BoxHelper{
        return new THREE.BoxHelper(this.shapeObj, newColorHex)
    }

    makeBoxGeo() : THREE.Box3 {
        let tempBox = new THREE.Box3();
        tempBox.setFromObject(this.boxHelper);
        return tempBox
    }

}
