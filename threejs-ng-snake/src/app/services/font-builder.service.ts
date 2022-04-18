import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FontLoader } from 'three/src/loaders/FontLoader';



@Injectable({
    providedIn: 'root'
})
export class FontBuilderService {
    public loader: FontLoader;
    constructor() {
        this.loader = new FontLoader();
    }

    public addFont(msg: string, scene:THREE.Scene) : void {
        // text
        // https://threejs.org/examples/?q=text#webgl_geometry_text_shapes
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html
        const fontUri = '..\\assets\\helvetiker_regular.typeface.json'
//         const fontUri = '..\\assets\\Gravity_Bold.json'
        this.loader.load(fontUri, font => {
            const fontColor = new THREE.Color('rgb(0, 255, 0)');
            const matLite = new THREE.MeshBasicMaterial({
                color: fontColor,
                transparent: true,
                opacity: .5,
                side: THREE.DoubleSide,
            });
            const message = msg
//             const shape = font.generateShapes(message, .2);
            const shape = font.generateShapes(message, .5);
            const textGeo = new THREE.ShapeGeometry(shape);
            textGeo.computeBoundingBox();
            // do some logic for move center of text using bounding box
            const text = new THREE.Mesh(textGeo, matLite);
            text.name = 'wordName';
            text.position.z = 1;
//             text.position.y = .5;
            text.position.y = 1;
//             text.position.x = -.5;
            text.position.x = -1;
            scene.add(text);
        });
    }

}
