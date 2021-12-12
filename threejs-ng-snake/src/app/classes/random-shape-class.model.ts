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
            this.geometry = this.makeGeometry(radius)
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
