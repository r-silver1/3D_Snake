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
        const max_val = 99;
        // todo add some color variation
        //         let material = new THREE.MeshPhongMaterial({
        //                         color: new THREE.Color('rgb(159,226,221)')
        //                     })
        for(let i = min_val; i<max_val+1; i++){
            const blueCol = Math.floor(this.norm_range(120, 255, min_val, max_val, i));
            const greenCol = Math.floor(this.norm_range(0, 255, min_val, max_val, i));
            let material = new THREE.MeshPhongMaterial({
            //                                     color: new THREE.Color('rgb(159,226,'+Math.floor(this.norm_range(120, 255, min_val, max_val, i))+')')
                                     color: new THREE.Color('rgb(159,'+greenCol+','+blueCol+')'),
                                     side: THREE.DoubleSide
                              })
            let box_rad = this.norm_range(min_diam, max_diam, min_val, max_val, i)
            let pos = this.generatePosition(max_diam)
            let newShape = new RandomShapeClass(material, box_rad, pos)
            let box_temp = newShape.makeInstance()
            scene.add(box_temp)
            shapesArray.push(box_temp)
            let boxHelper = new THREE.BoxHelper(box_temp, 0x0000FF)
            //comment this to remove bounding boxes
            scene.add(boxHelper)
//             let boxBB = new THREE.Box3()
//             boxBB.setFromObject(box_temp)
//             let boxMesh = new THREE.Mesh(boxBB, material)
//             scene.add(boxMesh)
        }
    }

    public generatePosition(max_diam:number): number[] {
        let min_bound = max_diam*4
        let horzAngle = Math.random()*360.0
        let vertAngle = Math.random()*360.0
        let ranVec = new THREE.Vector3(min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), min_bound*Math.sin(horzAngle))
        let pos = [ranVec.x, ranVec.y, ranVec.z]
        return pos

    }

    norm_range(a:number, b:number, min:number, max:number, x:number): number {
        return a + ((x-min)/(max-min))*(b-a)
    }

}
