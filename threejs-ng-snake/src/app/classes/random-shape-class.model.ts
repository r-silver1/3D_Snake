import * as THREE from 'three';


// https://www.typescriptlang.org/docs/handbook/interfaces.html
// https://www.cloudhadoop.com/angular-model-class-interface/
export class RandomShapeClass {
    private material: THREE.MeshPhongMaterial;
    private radius: number;
    private position: number[];
//     private geometry: THREE.BoxGeometry;
    private geometry: THREE.BufferGeometry;

    constructor(material: THREE.MeshPhongMaterial,
                radius: number, position: number[]){
            this.material = material;
            // enable this option to show wireframe view
//             this.material.wireframe=true;
            this.radius = radius;
            this.position = position;
//             this.geometry = new THREE.BoxGeometry(radius, radius, radius)
//             this.geometry = this.makeGeometry(radius)
            //temp
            let maxPoints = 6
            this.geometry = this.makeRandomGeometry(maxPoints, radius)
//             this.geometry = this.makeTempGeometry(maxPoints, radius)
    }


    // https://sites.math.washington.edu/~king/coursedir/m445w04/notes/vector/coord.html
//     makeCircle(index:number, maxPoints:number, radius:number, yIndex:number) : Float32Array[] {
    makeCircle(index:number, maxPoints:number, radius:number, yIndex:number) : number[] {
        // 0 <= index < maxPoints - 1
        const pointsNum: number = maxPoints - index
//         const circleRadius: number = radius/(index+1)
        const circleRadius: number = radius * ((maxPoints-(index))/maxPoints)
//         let circlePointsMat: Float32Array[] = [];
        let circlePointsMat: Array<any> = []
        let last: number = 0.0
        let thetaDiff: number = 360.0/maxPoints
        for (let i = 0; i < maxPoints; i++) {
            // random value between last generated angle and theta increment
            let theta:number = last + (Math.random() * (thetaDiff))
            if(i == 0){
                theta = 0;
            }else if(i == maxPoints-1){
                theta = 360;
            }
//             let theta:number = last + ((thetaDiff))
            last += thetaDiff
//             let iX:number = Math.cos(theta) * circleRadius;
            let iX:number = Math.cos(this.thetaToRad(theta)) * circleRadius;
            let iZ:number = Math.sin(this.thetaToRad(theta)) * circleRadius;
//             circlePointsMat.push(new Float32Array([iX, yIndex, iZ]))
            circlePointsMat.push([iX, yIndex, iZ])

        }
        return circlePointsMat;
    }

//     makeCirclesArrays(maxPoints: number, radius:number) : THREE.BufferGeometry {
    makeCirclesArrays(maxPoints: number, radius:number, bottomFlag:boolean) : Array<any> {
        let numCircles = maxPoints - 1;
        // smaller number, taller asteroid, vice versa
        let heightSquisher : number = .75
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
            maxPoints -= 1;

        }
        return circles;

    }

// //     generateBufferFromArr()
//     pushPoint(arrPoints: Array<any>, bufferGeo: number[]) : void {
//         bufferGeo.concat()
//     }

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
//         let currObjArr = new Float32Array()
        let currObjArr:number[] = []
        for(let i = 0; i < circlesPointsArr.length-1; i++){
//             console.log(circlesPointsArr)
            currObjArr = this.pushTwoCircles(circlesPointsArr[i], circlesPointsArr[i+1], currObjArr)
        }
        let bottomPointsArr = this.makeCirclesArrays(maxPoints, radius, true);
        bottomPointsArr[0] = circlesPointsArr[0]
        for(let i = 0; i < bottomPointsArr.length-1; i++){
//             console.log(circlesPointsArr)
            currObjArr = this.pushTwoCircles(bottomPointsArr[i], bottomPointsArr[i+1], currObjArr)
        }
        let geometry = new THREE.BufferGeometry();
        console.log(currObjArr)
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(currObjArr), 3));
        geometry.computeVertexNormals();
        return geometry
    }

    thetaToRad(deg:number): number {
        return (Math.PI*deg)/180.0
    }

//     //todo temp: remove
//     makeTempGeometry(maxPoints: number, radius:number): THREE.BufferGeometry {
//         let bottomDif: number = 360.0/5.0;
//         let bottomPoints: Array<any> = []
//         let theta = 0;
//         for(let i = 0; i < 5; i ++){
//             let iX:number = Math.cos(this.thetaToRad(theta)) * radius;
//             let iZ:number = Math.sin(this.thetaToRad(theta)) * radius;
//             bottomPoints.push([iX, 0, iZ])
//             theta+=bottomDif
//         }
//         console.log("bottom")
//         console.log(bottomPoints)
//
//         let topPoints: Array<any> = []
//         let topDiff: number = 360/4.0
//         theta = 0;
//         for(let i = 0; i < 4; i++){
//             let iX:number = Math.cos(this.thetaToRad(theta)) * radius
//             let iZ:number = Math.sin(this.thetaToRad(theta)) * radius
//             topPoints.push([iX, radius/2, iZ])
//             theta+=topDiff
//         }
//         console.log("top")
//         console.log(topPoints)
//
//         const vertices = new Float32Array([
//             bottomPoints[0][0], bottomPoints[0][1], bottomPoints[0][2],
//             topPoints[0][0], topPoints[0][1], topPoints[0][2],
//             bottomPoints[1][0], bottomPoints[1][1], bottomPoints[1][2],
//
//             topPoints[0][0], topPoints[0][1], topPoints[0][2],
//             bottomPoints[1][0], bottomPoints[1][1], bottomPoints[1][2],
//             topPoints[1][0], topPoints[1][1], topPoints[1][2],
//
//             bottomPoints[1][0], bottomPoints[1][1], bottomPoints[1][2],
//             topPoints[1][0], topPoints[1][1], topPoints[1][2],
//             bottomPoints[2][0], bottomPoints[2][1], bottomPoints[2][2],
//
//             topPoints[1][0], topPoints[1][1], topPoints[1][2],
//             bottomPoints[2][0], bottomPoints[2][1], bottomPoints[2][2],
//             topPoints[2][0], topPoints[2][1], topPoints[2][2],
//         ])
//         let geometry = new THREE.BufferGeometry();
//         geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
//         geometry.computeVertexNormals();
//         return geometry
//     }

    // https://threejs.org/docs/index.html#api/en/core/BufferGeometry.groups
    // https://dustinpfister.github.io/2021/04/22/threejs-buffer-geometry/
    makeGeometry(radius:number) : THREE.BufferGeometry {
        radius/=2
        const vertices = new Float32Array([
            //front
            -radius, -radius, radius,
            radius, -radius, radius,
            radius, radius, radius,

            radius, radius, radius,
            -radius, radius, radius,
            -radius, -radius, radius,

            //back
            -radius, -radius, -radius,
            radius, -radius, -radius,
            radius, radius, -radius,

            radius, radius, -radius,
            -radius, radius, -radius,
            -radius, -radius, -radius,

            // top
            -radius, radius, radius,
            radius, radius, radius,
            radius, radius, -radius,

            radius, radius, -radius,
            -radius, radius, -radius,
            -radius, radius, radius,


            //bottom
            -radius, -radius, radius,
            radius, -radius, radius,
            radius, -radius, -radius,

            radius, -radius, -radius,
            -radius, -radius, -radius,
            -radius, -radius, radius,

            //left
            -radius, -radius, radius,
            -radius, radius, radius,
            -radius, radius, -radius,

            -radius, radius, -radius,
            -radius, -radius, -radius,
            -radius, -radius, radius,

            //right
            radius, -radius, radius,
            radius, radius, radius,
            radius, radius, -radius,

            radius, radius, -radius,
            radius, -radius, -radius,
            radius, -radius, radius


        ])
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        return geometry
    }

    makeInstance(): THREE.Mesh {
        const shape = new THREE.Mesh(this.geometry, this.material);
//         const shape = new THREE.Points(this.geometry,
//                             new THREE.PointsMaterial({
//                                 color: THREE.Color('rgb(255, 0, 0)'),
//                                 size: 0.5
//
//                             })
//                         )
        shape.castShadow = true;
        shape.receiveShadow = true;
        //add to g_scene to be rendered
        //       this.scene.add(shape);
//         scene.add(shape);
        //set position of shape
        const vertices = this.position;
        shape.position.x = vertices[0];
        shape.position.y = vertices[1];
        shape.position.z = vertices[2];
        return shape;
    }

}
