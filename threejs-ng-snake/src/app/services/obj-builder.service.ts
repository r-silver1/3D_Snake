import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { RandomShapeClass } from '../classes/random-shape-class.model'

@Injectable({
    providedIn: 'root'
})
export class ObjBuilderService {

    constructor() { }

    public initBoxes(shapesArray: any, scene:THREE.Scene): void {
        const min_diam = .025
        const max_diam = .6
        const min_val = 0;
        const max_val = 75;
        for(let i = min_val; i<max_val; i++){
            const blueCol = Math.floor(this.norm_range(120, 255, min_val, max_val, i));
            const greenCol = Math.floor(this.norm_range(0, 255, min_val, max_val, i));
            let material = new THREE.MeshPhongMaterial({
                                     color: new THREE.Color('rgb(159,'+greenCol+','+blueCol+')'),
                                     side: THREE.DoubleSide
                              })
            let box_rad = this.norm_range(min_diam, max_diam, min_val, max_val, i)
            let pos = this.generatePosition(max_diam)
            // todo in future use this to change complexity of oids
//             const maxPoints = 12
            const maxPoints = Math.floor(this.norm_range(9, 14, min_val, max_val, i))
            let newShape = new RandomShapeClass(material, box_rad, pos, maxPoints)
            shapesArray.push(newShape)
            scene.add(newShape.shapeObj)
            //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
            //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection/Bounding_volume_collision_detection_with_THREE.js
//             console.log(newShape.boxHelper.material)
            newShape.changeBoxHelperCol(0xFF0000)
            scene.add(newShape.boxHelper)
        }
    }

    public generatePosition(max_diam:number): number[] {
        let min_bound = max_diam*5
        let horzAngle = Math.random()*360.0
        let vertAngle = Math.random()*360.0
        let horz_min_bound = min_bound * Math.cos(vertAngle)
//         let ranVec = new THREE.Vector3(min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), min_bound*Math.sin(horzAngle))
        let ranVec = new THREE.Vector3(horz_min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), horz_min_bound*Math.sin(horzAngle))
        let pos = [ranVec.x, ranVec.y, ranVec.z]
        return pos

    }

    norm_range(a:number, b:number, min:number, max:number, x:number): number {
        return a + ((x-min)/(max-min))*(b-a)
    }

}
