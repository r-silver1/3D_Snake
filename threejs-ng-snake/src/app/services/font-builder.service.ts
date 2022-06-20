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
    public addFont(msg: string, scene:THREE.Scene, sceneGroupName: string, positionScale: THREE.Vector3) : void {
//     public addFont(msg: string) : void {
        // text
        // https://threejs.org/examples/?q=text#webgl_geometry_text_shapes
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html
        // todo new logic add font uri to environment
//         const fontUri = '..\\assets\\helvetiker_regular.typeface.json'
//         const fontUri = '..\\assets\\Gravity_Bold.json'
//         this.loader.load(fontUri, font => {
        this.loader.load(environment.fontUri, font => {
            const fontColor = new THREE.Color('rgb(0, 200, 200)');
            const matLite = new THREE.MeshBasicMaterial({
                color: fontColor,
                transparent: true,
                opacity: .5,
                side: THREE.DoubleSide,
                wireframe: true
            });
            const message = msg
//             const shape = font.generateShapes(message, .2);
            const shape = font.generateShapes(message, .5);
            const textGeo = new THREE.ShapeGeometry(shape);

//             textGeo.computeBoundingBox();

            // do some logic for move center of text using bounding box
            const text = new THREE.Mesh(textGeo, matLite);


//             text.name = 'wordName';
            // new logic use scale
            text.position.x = positionScale.x;
//             text.position.y = .5;
            text.position.y = positionScale.y;
//             text.position.x = -.5;
            text.position.z = positionScale.z;
//             scene.add(text);
//             let textBox = new THREE.BoxHelper(text, fontColor)
//             scene.add(textBox)
            // todo might be unecessary but storing font color
            text.userData.fontColor = fontColor

            let matBox = new THREE.MeshBasicMaterial().copy(matLite)
            let boxHelper = new THREE.Box3().setFromObject(text)
//             console.log(boxHelper)
            const boxWidth = (boxHelper.max.x-boxHelper.min.x)
            const boxHeight = boxHelper.max.y-boxHelper.min.y
            const boxDepth = boxHelper.max.z-boxHelper.min.z
            let boxGeo = new THREE.BoxGeometry(
                boxWidth,
                boxHeight,
                boxDepth
            )
//             let boxGeo = new THREE.BoxGeometry().copy(boxHelper.geometry)
            matBox.color.b+=.5
            matBox.color.g-=.5
            matBox.transparent = true
            matBox.opacity = .3
            let boxMesh = new THREE.Mesh(boxGeo, matBox)
//             boxMesh.position.copy(text.position)
            boxGeo.scale(1.5, 1.4, 1)
            // todo slight tweaks to line up better
            boxMesh.position.x = (positionScale.x + boxWidth/2) *1.1
            boxMesh.position.y = (positionScale.y + boxHeight/2)
            boxMesh.position.z = (positionScale.z + boxDepth/2) - .5

            // todo new logic move this into userdata
            text.userData.boxMesh = boxMesh
            matBox.dispose()
            boxGeo.dispose()

            // todo new logic dispose like with laser ray
            textGeo.dispose()
            matLite.dispose()



            // new logic - userdata function
            text.userData.deleteText = () => {
                text.geometry.dispose()
                text.material.dispose()
                text.removeFromParent()
            }

            // new logic - laser collision
            text.userData.checkPointConflict = (point:THREE.Vector3) => {
                // @ts-ignore
                if(text.geometry.boundingSphere.containsPoint(point)){
                    text.material.wireframe = false
                    text.userData.boxMesh.material.wireframe = false
                }
            }
            // todo new logic refresh wireFrame
            text.userData.refreshTextWireframe = () => {
                text.material.wireframe = true
                text.userData.boxMesh.material.wireframe = true
            }

            let wordGroup = scene.getObjectByName(sceneGroupName)
            if(wordGroup != undefined){
                wordGroup.add(text)
                wordGroup.add(boxMesh)
            }

        });
    }

}
