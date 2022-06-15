import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { environment } from '../environments/environment'


@Injectable({
    providedIn: 'root'
})
export class FontBuilderService {
    public loader: FontLoader;
    constructor() {
        this.loader = new FontLoader();
    }

//     public deleteFont() : void {
//     }

    // todo new logic no longer take in scene, return object
    public addFont(msg: string, scene:THREE.Scene, sceneGroupName: string) : void {
//     public addFont(msg: string) : void {
        // text
        // https://threejs.org/examples/?q=text#webgl_geometry_text_shapes
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html
        // todo new logic add font uri to environment
//         const fontUri = '..\\assets\\helvetiker_regular.typeface.json'
//         const fontUri = '..\\assets\\Gravity_Bold.json'
//         this.loader.load(fontUri, font => {
        this.loader.load(environment.fontUri, font => {
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

//             textGeo.computeBoundingBox();

            // do some logic for move center of text using bounding box
            const text = new THREE.Mesh(textGeo, matLite);
            // todo new logic dispose like with laser ray
            textGeo.dispose()
            matLite.dispose()

//             text.name = 'wordName';
            text.position.z = 1;
//             text.position.y = .5;
            text.position.y = 1;
//             text.position.x = -.5;
            text.position.x = -1;
//             scene.add(text);
//             let textBox = new THREE.BoxHelper(text, fontColor)
//             scene.add(textBox)
            // todo might be unecessary but storing font color
            text.userData.fontColor = fontColor
            let wordGroup = scene.getObjectByName(sceneGroupName)
            if(wordGroup != undefined){
                wordGroup.add(text)
            }

        });
    }

}
