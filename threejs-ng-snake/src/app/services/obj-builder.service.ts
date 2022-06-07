import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { RandomShapeClass } from '../classes/random-shape-class.model'

@Injectable({
    providedIn: 'root'
})
export class ObjBuilderService {

    constructor() { }

    // todo here take boxhelpers as param
    public initBoxes(shapesArray: any, scene:THREE.Scene, boxHelpers:boolean, directionHelpers:boolean): void {
        // min_radius: minimum size asteroids to be generated
        const min_radius = .06
        // max_radius: maximum radius for an asteroid
//         const max_radius = .26
        const max_radius = .35
        // max_val: max number of asteroids to generate; min val 1
//         const max_val = 150;
        const max_val = 100;

        for(let i = 0; i<max_val; i++){


            // blueCol/greenCol: change color of asteroid based on position in list of all asteroids
            //  the higher the index, the more intense the color
//             const blueCol = Math.floor(this.norm_range(120, 255, 0, max_val, i));
            const blueCol = Math.floor(THREE.MathUtils.mapLinear(i, 0, max_val, 60, 255))
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

            // todo shapesArray will be gotten rid of
            shapesArray.push(newShape)
            // todo we want to add to group not scene
            scene.add(newShape.shapeObj)
            if(boxHelpers == true){
                scene.add(newShape.boxHelper)
            }

            // todo why adding to scene before checking conflicts
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
            // todo change this with directionBool
            if(directionHelpers){
                scene.add(newShape.initRotationHelper());
                scene.add(newShape.initDirectionHelper());
            }

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

    // todo new logic here check collisions
    checkLaserCollisions(shapesArray: any[], scene: THREE.Scene) : any {
//         let laser:any = scene.getObjectByName("blueLaser")
//         if(laser != undefined){
        let laserGroup = scene.getObjectByName("laserGroup")
        if(laserGroup != undefined){
            laserGroup.children.forEach( (laser) => {
                for (let i = 0; i<shapesArray.length; i++){
                    // @ts-ignore
                    if(laser.geometry.boundingSphere != undefined){
                        let hitCheck = shapesArray[i].checkPointConflict(laser.position)
                        if(hitCheck == true){
                            // new logic: break asteroid into smaller chunks
                            this.blowUpAsteroid(shapesArray, i, scene)
                            // delete asteroid removes from scene
                            shapesArray[i].deleteAsteroid()
                            shapesArray.splice(i, 1)
                            i-=1
                            // todo break this into different laser function
                            // @ts-ignore
                            laser.geometry.dispose()
                            // @ts-ignore
                            laser.material.dispose()
                            laser.removeFromParent()


                        }
                    }
                }

            })
        }
    }

    blowUpAsteroid(shapesArray: any[], index: number, scene:THREE.Scene) : any {
        // get asteroid from array
        let asteroid = shapesArray[index]

        // set min and max number of asteroids generated by explosion
        let min_new_asteroids = 3
        let max_new_asteroids = 5
        let num_new_asteroids = Math.floor(THREE.MathUtils.mapLinear(Math.random(), 0, 1, min_new_asteroids, max_new_asteroids))

        // loop through and create number of asteroids between min and max
        for(let i = 0; i < num_new_asteroids; i++){
            // get old color, going to decrease red green and blue to make darker (because smaller)
            let old_color = asteroid.material.color

            // generate color using old values and decreasing
            let new_color = new THREE.Color(
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, old_color.r*.95, old_color.r),
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, old_color.g*.6, old_color.g),
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, old_color.b*.5, old_color.b)
            )

            // generate material for new asteroid
            let material = new THREE.MeshPhongMaterial({
                color: new_color,
                side: THREE.FrontSide
            })

            // create asteroid with smaller radius than previous, between .45 and .75 previous
            let box_rad = THREE.MathUtils.mapLinear(i, 0, num_new_asteroids-1, asteroid.radius*.45, asteroid.radius*.75)

            // create new asteroid object
            let new_asteroid_gen = new RandomShapeClass(material, box_rad, asteroid.position, asteroid.maxPoints-1)

            // copy information on direction, current angle etc to line up with old position
            new_asteroid_gen.thetaDif = asteroid.thetaDif
            new_asteroid_gen.thetaNow = asteroid.thetaNow
            new_asteroid_gen.direction = asteroid.getDirection()

            // create a new push direction with random values but based on old
            new_asteroid_gen.pushDir = new THREE.Vector3(
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, -2, 1+asteroid.pushDir.x),
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, .1, .2+asteroid.pushDir.y),
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, -2, 2+asteroid.pushDir.z),
            )
//             new_asteroid_gen.pushDir = new THREE.Vector3(
//                 Math.random(),
//                 Math.random(),
//                 Math.random()
//             )

            // copy old position but also change position slightly to reduce overlap
            new_asteroid_gen.shapeObj.position.copy(asteroid.shapeObj.position)
            new_asteroid_gen.shapeObj.position.x += asteroid.radius*.5 + Math.random() * asteroid.radius
            new_asteroid_gen.shapeObj.position.y += asteroid.radius*.5 + Math.random() * asteroid.radius
            new_asteroid_gen.shapeObj.position.z += asteroid.radius*.5 + Math.random() * asteroid.radius

            scene.add(new_asteroid_gen.shapeObj)
            shapesArray.push(new_asteroid_gen)
        }
    }


}
