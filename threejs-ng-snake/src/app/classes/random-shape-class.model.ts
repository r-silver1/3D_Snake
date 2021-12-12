import * as THREE from 'three';


// https://www.typescriptlang.org/docs/handbook/interfaces.html
// https://www.cloudhadoop.com/angular-model-class-interface/
export class RandomShapeClass {
    private material: THREE.MeshPhongMaterial;
    private radius: number;
    private position: number[];
    private geometry: THREE.BoxGeometry;

    constructor(material: THREE.MeshPhongMaterial,
                radius: number, position: number[]){
            this.material = material;
            this.radius = radius;
            this.position = position;
            this.geometry = new THREE.BoxGeometry(radius, radius, radius)
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
