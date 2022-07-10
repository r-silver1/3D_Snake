import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { RandomShapeClass } from '../classes/random-shape-class.model'
import { environment } from '../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class ObjBuilderService {

    constructor() { }

    // todo here take boxhelpers as param
    public initBoxes(shapesArray: any, scene:THREE.Scene, boxHelpers:boolean, directionHelpers:boolean): void {
        for(let i = 0; i<environment.max_asteroids; i++){


            // blueCol/greenCol: change color of asteroid based on position in list of all asteroids
            //  the higher the index, the more intense the color
            // todo new logic enviro var
            const blueCol = 255 - Math.floor(THREE.MathUtils.mapLinear(i, 0, environment.max_asteroids, 20, 60))
            const greenCol = 215 -Math.floor(THREE.MathUtils.mapLinear(i, 0, environment.max_asteroids, 20, 100));
            const redCol = 140 - Math.floor(THREE.MathUtils.mapLinear(i, 0, environment.max_asteroids, 20, 30));
            let material = new THREE.MeshPhongMaterial({
                                     color: new THREE.Color('rgb('+redCol+','+greenCol+','+blueCol+')'),
//                                      side: THREE.DoubleSide
                                    side: THREE.FrontSide
                              })
            // todo new logic using environment var for radius
            let box_rad = THREE.MathUtils.mapLinear(i, 0, environment.max_asteroids, environment.min_asteroid_radius, environment.max_asteroid_radius)
            // todo new logic use environment var for max radius
//             let pos = this.generatePosition(environment.max_asteroid_radius)
            let pos = this.generatePosition(environment.asteroid_distance_modifier)
            // use this to change complexity of asteroids; higher values -> more triangles

            const minPointsBound = 9;
            const maxPointsBound = 15;
            // todo new logic enviro var
            const maxPoints = Math.floor(THREE.MathUtils.mapLinear(i, 0, environment.max_asteroids, minPointsBound, maxPointsBound))
//             let newShape = new RandomShapeClass(material, box_rad, pos, maxPoints)
            let newShape = new RandomShapeClass(material, box_rad, pos, maxPoints, boxHelpers)

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
                // todo new logic use environment var
                let new_diam = environment.max_asteroid_radius * 1.1

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
    checkLaserCollisions(shapesArray: any[], scene: THREE.Scene, boxHelpers: boolean) : any {
        // todo new logic use environment file
//         let laserGroup = scene.getObjectByName("laserGroup")
        // todo new logic only hit this in start or mode name 2
        if(environment.postGameMode == ""){
            let laserGroup = scene.getObjectByName(environment.laserGroupName)
            if(laserGroup != undefined){
                // todo new logic button hits
                let buttonGroup = scene.getObjectByName(environment.buttonGroupName)
                laserGroup.children.forEach( (laser, index) => {
                    if(environment.gameStart == true){
                        for (let i = 0; i<shapesArray.length; i++){
                            // @ts-ignore
                            if(laser.geometry.boundingSphere != undefined){
                                let hitCheck = shapesArray[i].checkPointConflict(laser.position)
                                if(hitCheck == true){
                                    // new logic: break asteroid into smaller chunks
                                    this.blowUpAsteroid(shapesArray, i, scene, boxHelpers)
                                    // delete asteroid removes from scene
                                    shapesArray[i].deleteAsteroid()
                                    // todo splice necessary here because splicing array, not children object
                                    shapesArray.splice(i, 1)
                                    i-=1

                                    // new logic delete using laser function and splice group
                                    laser.userData.deleteLaser()
                                    // todo new logic: no splice, avoid error deleting all lasers on hit, remove parent delete
                                }
                            }
                        }
                    }
//                     if(buttonGroup != undefined && environment.postGameMode == ""){
                    if(buttonGroup != undefined){
                        buttonGroup.children.forEach( (child:any, i:number) => {
                            if(child.userData.checkPointConflict != undefined){
                                let retConf = child.userData.checkPointConflict(laser.position)
                                if(retConf == true){
                                    // todo use env var not "START" hardcode
                                    if(child.userData.message == environment.startString){
                                        environment.gameStart = true
                                        child.userData.deleteText()

                                        // @ts-ignore
//                                             buttonGroup.children.splice(0, i)

                                        laser.userData.deleteLaser()
                                        // todo new logic: no splice, avoid error deleting all lasers on hit
                                    }
                                }
                            }
                        })
                    }

                })
            }
        }
    }

    checkLaserKeyboardCollisions(scene: THREE.Scene) :any {
        let laserGroup = scene.getObjectByName(environment.laserGroupName)
        let buttonGroup = scene.getObjectByName(environment.buttonGroupName)
        if(laserGroup != undefined){
            laserGroup.children.forEach( (laser, index) => {
                if(buttonGroup != undefined){
                    buttonGroup.children.forEach( (child:any, i:number) => {
                        if(child.userData.checkPointConflict != undefined){
                            let retConf = child.userData.checkPointConflict(laser.position)
                            if(retConf == true){
                                // todo new logic test for "ENTER message"
                                if(child.userData.message == environment.enterString){
                                    // after enter hit hit new environment
                                    environment.postGameMode = environment.modeName4
                                    return
                                }else if(child.userData.message == environment.playAgainString){
                                    // refresh page
                                    environment.scoreboardObject[0] = 3
                                    environment.postGameMode = environment.modeName4
                                    return
                                }else if(child.userData.message == environment.deleteString){
                                    environment.currWordEntry = environment.currWordEntry.slice(0, environment.currWordEntry.length-1)
                                    return
                                }
                                // logic if length current name over max then splice first char off
                                if(environment.currWordEntry.length >= environment.maxEntryLength){
                                    environment.currWordEntry = environment.currWordEntry.slice(1, environment.currWordEntry.length-1)
                                }
                                environment.currWordEntry += child.userData.message
                            }
                        }
                    })
                }

            })
        }
    }

    blowUpAsteroid(shapesArray: any[], index: number, scene:THREE.Scene, boxHelpers: boolean) : any {
        // get asteroid from array
        let asteroid = shapesArray[index]

        // todo new logic increment user score
        environment.userScore += parseInt(asteroid.shapeObj.userData.points)

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
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, old_color.g*1.25, old_color.g),
                THREE.MathUtils.mapLinear(Math.random(), 0, 1, old_color.b*1.4, old_color.b)
            )

            // generate material for new asteroid
            let material = new THREE.MeshPhongMaterial({
                color: new_color,
                side: THREE.FrontSide
            })

            // create asteroid with smaller radius than previous, between .45 and .75 previous
            // todo use min here to avoid Nan scores
            let box_rad = THREE.MathUtils.mapLinear(i, 0, num_new_asteroids-1, asteroid.radius*.20, asteroid.radius*.40)
            // todo new logic use environment asteroid size
            if(box_rad >= environment.min_asteroid_radius){
                // create new asteroid object
//                 let new_asteroid_gen = new RandomShapeClass(material, box_rad, asteroid.position, asteroid.maxPoints-1)
                // todo new logic boxHelpersBool for now pass false
                let new_asteroid_gen = new RandomShapeClass(material, box_rad, asteroid.position, asteroid.maxPoints-1, boxHelpers)

                // copy information on direction, current angle etc to line up with old position
                new_asteroid_gen.thetaNow = asteroid.thetaNow
                new_asteroid_gen.direction = asteroid.getDirection()

                // create a new push direction with random values but based on old
                new_asteroid_gen.setPushDir([
                    THREE.MathUtils.mapLinear(Math.random(), 0, 1, -20, 30+asteroid.pushDir.x),
                    THREE.MathUtils.mapLinear(Math.random(), 0, 1, -1, 1+asteroid.pushDir.y),
                    THREE.MathUtils.mapLinear(Math.random(), 0, 1, -20, 30+asteroid.pushDir.z),
                ])

                // copy old position but also change position slightly to reduce overlap
                new_asteroid_gen.shapeObj.position.copy(asteroid.shapeObj.position)
                new_asteroid_gen.shapeObj.position.x += Math.random() * asteroid.radius
                new_asteroid_gen.shapeObj.position.y += Math.random() * asteroid.radius
                new_asteroid_gen.shapeObj.position.z += Math.random() * asteroid.radius

                scene.add(new_asteroid_gen.shapeObj)
                shapesArray.push(new_asteroid_gen)
            }
        }
    }


}
