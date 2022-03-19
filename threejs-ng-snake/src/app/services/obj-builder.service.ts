import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { RandomShapeClass } from '../classes/random-shape-class.model'

@Injectable({
    providedIn: 'root'
})
export class ObjBuilderService {

    constructor() { }

    // todo here take boxhelpers as param
    public initBoxes(shapesArray: any, scene:THREE.Scene, boxHelpers:boolean): void {
        // min_radius: minimum size asteroids to be generated
        const min_radius = .06
        // max_radius: maximum radius for an asteroid
//         const max_radius = .26
        const max_radius = .28
        // max_val: max number of asteroids to generate; min val 1
//         const max_val = 150;
        const max_val = 150;

        for(let i = 0; i<max_val; i++){
            // todo below: functionality for color, material, box radius, position, maxpoints,
            //  should be moved to helper functions inside service

            // todo norm_range: same function definition elsewhere? make global helper?

            // blueCol/greenCol: change color of asteroid based on position in list of all asteroids
            //  the higher the index, the more intense the color
//             const blueCol = Math.floor(this.norm_range(120, 255, 0, max_val, i));
            const blueCol = Math.floor(THREE.MathUtils.mapLinear(i, 0, max_val, 120, 255))
//             const greenCol = Math.floor(this.norm_range(0, 255, 0, max_val, i));
            const greenCol = Math.floor(THREE.MathUtils.mapLinear(i, 0, max_val, 0, 255));
            let material = new THREE.MeshPhongMaterial({
                                     color: new THREE.Color('rgb(100,'+greenCol+','+blueCol+')'),
//                                      side: THREE.DoubleSide
                                    side: THREE.FrontSide
                              })

            let box_rad = THREE.MathUtils.mapLinear(i, 0, max_val, min_radius, max_radius)
            let pos = this.generatePosition(max_radius)
            // use this to change complexity of asteroids; higher values -> more triangles

            const minPointsBound = 9;
            const maxPointsBound = 15;
//             const maxPoints = Math.floor(this.norm_range(minPointsBound, maxPointsBound, 0, max_val, i))
            const maxPoints = Math.floor(THREE.MathUtils.mapLinear(i, 0, max_val, minPointsBound, maxPointsBound))
            let newShape = new RandomShapeClass(material, box_rad, pos, maxPoints)

            // todo: helper function static inside shape to accept scene param, add shape and helper?
            shapesArray.push(newShape)
            scene.add(newShape.shapeObj)
            if(boxHelpers == true){
                scene.add(newShape.boxHelper)
            }

            // todo initial conflict checking/placement: could be made into helper
            // function accepting scene, shape array, index, shape
            let conflictCheck = this.checkConflicts(newShape, shapesArray, i, scene, boxHelpers)
            // if conflict found in initial placing of asteroid, loop through all asteroids
            // to find a new position free of collisions
            while(conflictCheck == true){
                // each time, increase radius before generating position to reduce conflict likelihood
                let new_diam = max_radius * 1.1
                let new_pos = this.generatePosition(new_diam)
                // todo translate geometry: could be helper function inside shape taking pos as input

                // todo here same as constructor, edit
                let posVec = new THREE.Vector3(newShape.position[0], newShape.position[1], newShape.position[2])
                let posLength = posVec.length();
                newShape.shapeObj.translateOnAxis(posVec.normalize(), posLength)
                let newVec = new THREE.Vector3(new_pos[0], new_pos[1], new_pos[2])
                let newLength = newVec.length();
                newShape.shapeObj.translateOnAxis(newVec.normalize(), newLength)

                scene.remove(newShape.boxHelper)
                newShape.changeBoxHelperCol(false)
                if(boxHelpers == true){
                    scene.add(newShape.boxHelper)
                }
                newShape.initDirectionTheta()

                conflictCheck = this.checkConflicts(newShape, shapesArray, i, scene, boxHelpers)
            }
            scene.add(newShape.initRotationHelper());
            scene.add(newShape.initDirectionHelper());

        }
    }

    public generatePosition(max_radius:number): number[] {
        // todo make this based on distance to camera not size of radius
        let min_bound = max_radius*17
        let horzAngle = THREE.MathUtils.degToRad(Math.random()*360.0)
        // new: constrain vertical angle to make an asteroid "belt" effect
        let vertAngle = THREE.MathUtils.degToRad(Math.random()*30)
        min_bound = min_bound*.9 + Math.random()*(min_bound*.1)
        let horz_min_bound = min_bound * Math.cos(vertAngle)
        let ranVec = new THREE.Vector3(horz_min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), horz_min_bound*Math.sin(horzAngle))
        let pos = [ranVec.x, ranVec.y, ranVec.z]
        return pos

    }

    //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection/Bounding_volume_collision_detection_with_THREE.js
    // todo move into asteroid class? or other helper class?
    checkConflicts(asteroid: any, shapesArray: any[], index: number, scene: THREE.Scene, boxHelpers:boolean) : boolean {
        let checkBool = false;
        for(let j = 0; j<index; j++){
            let other = shapesArray[j]
            let thisBool = asteroid.checkOtherConflict(other)

            if(thisBool){
                asteroid.conflictHit = true;
                other.conflictHit = true;
                checkBool = true;
                if(boxHelpers == true){
                    scene.remove(asteroid.boxHelper)
                    asteroid.changeBoxHelperCol(true)
                    scene.add(asteroid.boxHelper)

                    scene.remove(other.boxHelper)
                    other.changeBoxHelperCol(true)
                    scene.add(other.boxHelper)
                }
            }

        }
        if(checkBool == false){
//             let tempGoodAstBool = asteroid.conflictHit
            asteroid.conflictHit = false;
            if(boxHelpers){
                scene.remove(asteroid.boxHelper)
                asteroid.changeBoxHelperCol(false)
                scene.add(asteroid.boxHelper)
            }
        }
        return checkBool
    }

}
