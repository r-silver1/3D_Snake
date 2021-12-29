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
        const max_val = 10;
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
//             let conflictCheck = this.checkConflicts(newShape, shapesArray, i, scene)
            let conflictCheck = this.checkConflicts(newShape, shapesArray, shapesArray.length, scene)
            // todo if this while loop commented, no bad spinning
            while(conflictCheck == true){
                console.log("true hit")
                let new_pos = this.generatePosition(max_diam)
                newShape.geometry.translate(-newShape.position[0],
                                            -newShape.position[1],
                                            -newShape.position[2]
                                            )
                newShape.geometry.translate(new_pos[0],
                                            new_pos[1],
                                            new_pos[2]
                                            )
                newShape.position = new_pos
//                 conflictCheck = this.checkConflicts(newShape, shapesArray, i, scene)
                conflictCheck = this.checkConflicts(newShape, shapesArray, shapesArray.length, scene)

            }
            shapesArray.push(newShape)
            scene.add(newShape.shapeObj)
            //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
            //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection/Bounding_volume_collision_detection_with_THREE.js
//             console.log(newShape.boxHelper.material)
            scene.add(newShape.boxHelper)
        }
    }

    public generatePosition(max_diam:number): number[] {
        let sizeMultiplier = 4
        let min_bound = max_diam*4
        let horzAngle = Math.random()*360.0
        let vertAngle = Math.random()*360.0
        min_bound = min_bound/2 + Math.random()*min_bound/2
        let horz_min_bound = min_bound * Math.cos(vertAngle)
//         let ranVec = new THREE.Vector3(min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), min_bound*Math.sin(horzAngle))
        let ranVec = new THREE.Vector3(horz_min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), horz_min_bound*Math.sin(horzAngle))
        let pos = [ranVec.x, ranVec.y, ranVec.z]
        return pos

    }

    norm_range(a:number, b:number, min:number, max:number, x:number): number {
        return a + ((x-min)/(max-min))*(b-a)
    }

    checkConflicts(asteroid: any, shapesArray: any[], index: number, scene: THREE.Scene) : boolean {
        let checkBool = false;
        for(let j = 0; j<index; j++){
            let other = shapesArray[j]
//             checkBool = asteroid.checkOtherConflict(other)
            let thisBool = asteroid.checkOtherConflict(other)
//             if(checkBool == true){
            if(thisBool == true){
                checkBool = true;
                scene.remove(asteroid.boxHelper)
                scene.remove(other.boxHelper)
                asteroid.changeBoxHelperCol(0xFF0000)
                other.changeBoxHelperCol(0xFF0000)
                scene.add(asteroid.boxHelper)
                scene.add(other.boxHelper)
//                 break
            }

        }
        if(checkBool == false){
            scene.remove(asteroid.boxHelper)
            asteroid.changeBoxHelperCol(0x0000FF)
            scene.add(asteroid.boxHelper)
        }
        return checkBool
    }

}
