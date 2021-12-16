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
            this.radius = radius;
            this.position = position;
//             this.geometry = new THREE.BoxGeometry(radius, radius, radius)
//             this.geometry = this.makeGeometry(radius)
            //temp
            let maxPoints = 5
            this.geometry = this.makeRandomGeometry(maxPoints, radius)
    }


    // https://sites.math.washington.edu/~king/coursedir/m445w04/notes/vector/coord.html
//     makeCircle(index:number, maxPoints:number, radius:number, yIndex:number) : Float32Array[] {
    makeCircle(index:number, maxPoints:number, radius:number, yIndex:number) : number[] {
        // 0 <= index < maxPoints - 1
        const pointsNum: number = maxPoints - index
        const circleRadius: number = radius/(index+1)
//         let circlePointsMat: Float32Array[] = [];
        let circlePointsMat: Array<any> = []
        let last: number = 0.0
        let thetaDiff: number = 360.0/maxPoints
        for (let i = 0; i < maxPoints; i++) {
            // random value between last generated angle and theta increment
            let theta:number = last + (Math.random() * (thetaDiff))
            last += thetaDiff
            let iX:number = Math.cos(theta) * circleRadius;
            let iZ:number = Math.sin(theta) * circleRadius;
//             circlePointsMat.push(new Float32Array([iX, yIndex, iZ]))
            circlePointsMat.push([iX, yIndex, iZ])

        }
        return circlePointsMat;
    }

//     makeCirclesArrays(maxPoints: number, radius:number) : THREE.BufferGeometry {
    makeCirclesArrays(maxPoints: number, radius:number) : Array<any> {
        let numCircles = maxPoints - 1;
        let yStep = radius / numCircles;
//         let index = 0;
        let yIndex = 0;
        let circles = new Array(numCircles)
        for (let i = 0; i < numCircles; i++) {
            let currCircle = this.makeCircle(i, maxPoints, radius, yIndex)
//             circles.push(currCircle)
            circles[i] = currCircle
            yIndex += yStep;
            maxPoints -= 1;
        }
    //         return new THREE.BufferGeometry()
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
        return bufferArr
    }

    makeRandomGeometry(maxPoints: number, radius: number) : THREE.BufferGeometry {
        let circlesPointsArr = this.makeCirclesArrays(maxPoints, radius);
//         let currObjArr = new Float32Array()
        let currObjArr:number[] = []
        for(let i = 0; i < circlesPointsArr.length-1; i++){
//             console.log(circlesPointsArr)
            currObjArr = this.pushTwoCircles(circlesPointsArr[i], circlesPointsArr[i+1], currObjArr)
        }
        let geometry = new THREE.BufferGeometry();
//         console.log(currObjArr)
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(currObjArr), 3));
        geometry.computeVertexNormals();
        return geometry
    }

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
