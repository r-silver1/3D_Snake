import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PostGameHelperService {

    constructor() { }

    public postGameRouter(scene: THREE.Scene, timestamp:number, builderService: any, scoreboardService:any, fontService: any){
        if(environment.gameStopTime == 0){
            environment.gameStopTime = timestamp
        }
        // timesUp mode
        if(environment.postGameMode == environment.modeName1){
            this.timesUpLogic(scene, fontService)
        }

        if(timestamp - environment.gameStopTime > 2000){
            if(environment.postGameMode == environment.modeName2){
                this.displayKeyboardLogic(scene, fontService)
            }
            if(environment.postGameMode == environment.modeName3){
                this.nameInputLogic(scene, fontService, builderService)
            }

            if(environment.postGameMode == environment.modeName4){
                this.postScoreLogic(scene, builderService, fontService, scoreboardService, timestamp)
            }
        }


    }

    private timesUpLogic(scene: THREE.Scene, fontService: any){
        let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
        if(timerGroupObj != undefined){
            fontService.addFont("Time's up!!", scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
        }
        // Entry mode
        environment.postGameMode = environment.modeName2
    }

    private displayKeyboardLogic(scene: THREE.Scene, fontService:any){
        let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
        if(timerGroupObj != undefined){
            timerGroupObj.children.forEach((child:any, i:number)=>{
                child.userData.deleteText()
                environment.gameStopTime = -1
            })
            // todo logic add enter name group
            fontService.addFont(environment.nameEntryString, scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
            // create keyboard
            let maxChars = Math.floor(environment.keysAlphabet.length/4)
            let curX = environment.buttonGroupPos.x + (maxChars*.25*environment.buttonGroupPos.x)
            let curY = environment.buttonGroupPos.y

            // todo new logic add play again button
            // todo new logic using env var not "PLAY AGAIN" hardcode
            fontService.addFont(environment.playAgainString, scene, environment.buttonGroupName, new THREE.Vector3(environment.timerGroupPos.x - environment.smallFontSize*7, environment.timerGroupPos.y + environment.smallFontSize*2, environment.buttonGroupPos.z*.85), environment.xSmallFontSize*.80)

            environment.keysAlphabet.forEach((characterVal:string, index:any) => {
                if(index > 0 && index % maxChars == 0){
                    curX = environment.buttonGroupPos.x + (maxChars*.25*environment.buttonGroupPos.x)
                    curY -= environment.xSmallFontSize * 2.5
                }
                fontService.addFont(characterVal, scene, environment.buttonGroupName, new THREE.Vector3(environment.buttonGroupPos.x+curX, environment.buttonGroupPos.y+curY, environment.buttonGroupPos.z), environment.xSmallFontSize)
                curX += environment.xSmallFontSize * 2.5

            })
            // todo new enter button logic
            curY -= environment.xSmallFontSize * 2.5
            curX/=2
            // todo new logic user env var not "ENTER" hardcode
            fontService.addFont(environment.enterString, scene, environment.buttonGroupName, new THREE.Vector3(environment.buttonGroupPos.x+curX, environment.buttonGroupPos.y+curY, environment.buttonGroupPos.z), environment.xSmallFontSize)
            fontService.addFont(environment.deleteString, scene, environment.buttonGroupName, new THREE.Vector3(environment.buttonGroupPos.x-curX, environment.buttonGroupPos.y+curY, environment.buttonGroupPos.z), environment.xSmallFontSize)

            // mode 3 scoreboard
            environment.postGameMode = environment.modeName3
        }
    }

    private nameInputLogic(scene: THREE.Scene, fontService: any, builderService: any){
        // todo new logic check keyboard collide
        builderService.checkLaserKeyboardCollisions(scene)
        //
        let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
        if(timerGroupObj != undefined){
            // todo logic only refresh these if necessary
            timerGroupObj.children.forEach((child:any, i:number)=>{
                // todo new logic check if message beginning == NAME:
                if(child.userData.message != undefined && child.userData.message.substr(0, 5) == environment.nameEntryString.substr(0, 5) && child.userData.message.slice(6, child.userData.message.length) != environment.currWordEntry){
                    if(child.userData.deleteText != undefined){
                        child.userData.deleteText()
                    }
                    // @ts-ignore
    //                                 timerGroupObj.children.splice(i, 1)
                    fontService.addFont(environment.nameEntryString + environment.currWordEntry, scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
                    return
                }
            })

        }

        //

    }

    private postScoreLogic(scene:THREE.Scene, builderService:any, fontService:any, scoreboardService:any, timestamp: number){
        let buttonGroup = scene.getObjectByName(environment.buttonGroupName)
        if(buttonGroup != undefined && buttonGroup.children.length!=0 && environment.scoreboardObject[0] != 2){
            buttonGroup.children.forEach( (child:any, i:number) => {
                if(child.userData.deleteText != undefined && child.userData.message != environment.playAgainString){
                    child.userData.deleteText()
                }
            })
            // todo make new function for get scoreboard api
        }
        // todo here temporary logic might not want to use this method of first element scoreboard
        // todo also added logic make sure button group cleared before switching, weird bug with empty name enter causing O and N keys to remain
        //@ts-ignore
        if(environment.scoreboardObject[0] == -1 && buttonGroup.children.length <= 2){
            // post score and set scoreboard object [0] -2
            this.scoreBoardPostLogic(scoreboardService)
        }else if(environment.scoreboardObject[0] == -2){
            // get scoreboard, which sets scoreboard object [0] 1
            this.getScoreBoardLogic(scene, scoreboardService)
        }else if(environment.scoreboardObject[0] == 1){
            // ensure that all old text is deleted prepare for showing high scores, then set scoreboard object [0] 2
            this.deleteOldTextLogic(scene)
        // todo new logic
        // block after here: scoreboard object 0 == 2, displaying scoreboard
        }else if(environment.scoreboardObject[0] == 2){
            // update high scores based on timestamp, looping through, also watch for play again to set scoreboard object [0] 3
            this.displayAndUpdateScores(scene, builderService, fontService, timestamp)
        }else if (environment.scoreboardObject[0] == 3){
            this.refreshPagePlayAgain()
        }

    }

    private scoreBoardPostLogic(scoreboardService:any){
        // posting score
        scoreboardService.postScoreHelper(environment.currWordEntry, environment.userScore)
        environment.scoreboardObject = [-2]
    }

    private getScoreBoardLogic(scene:THREE.Scene, scoreboardService:any){
        // getting scoreboard
        scoreboardService.getScoreBoardHelper()
//         let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
//         if(timerGroupObj != undefined){
//             timerGroupObj.children.forEach((child:any, i:number)=>{
//                 if(child.userData.deleteText != undefined){
//                     child.userData.deleteText()
//                 }
//             })
//         }
//         let scoreGroup = scene.getObjectByName(environment.scoreGroupName)
//         if(scoreGroup != undefined){
//             scoreGroup.children.forEach((child:any, i:number) => {
//                 if(child.userData.deleteText != undefined){
//                     child.userData.deleteText()
//                 }
//             })
//         }
    }

    private deleteOldTextLogic(scene: THREE.Scene){
        // this: scoreboard object [0] == 1, displaying scoreboard
        let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
        if(timerGroupObj != undefined){
            if(timerGroupObj.children.length != 0){
                timerGroupObj.children.forEach((child:any, i:number)=>{
                    if(child.userData.deleteText != undefined && child.userData.message != environment.highScoresString){
                        child.userData.deleteText()
                    }
                })
            }
        }
        // todo new logic only put in high score if length 0
        //@ts-ignore
//         if(timerGroupObj.children.length == 0){
        if(timerGroupObj.children.length <= 2){
            environment.scoreboardObject[0] = 2

        }

    }

    private displayAndUpdateScores(scene:THREE.Scene, builderService:any, fontService:any, timestamp:number){
        let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
        //@ts-ignore
        if(timerGroupObj.children.length == 0 || environment.timeStampDisplay == -1){
            // - 2000 to display faster
            environment.timeStampDisplay = timestamp
            environment.timeStampDisplay -= 2000
            // todo add msg "HIGH SCORES" using environment var not hard code
            fontService.addFont(environment.highScoresString, scene, environment.timeWordGroupName, environment.timerGroupPos, environment.largeFontSize)
//             // todo add msg "PLAY AGAIN" using environment var not hard code
//             fontService.addFont(environment.playAgainString, scene, environment.buttonGroupName, new THREE.Vector3(environment.timerGroupPos.x - environment.smallFontSize*7, environment.timerGroupPos.y + environment.smallFontSize*2, environment.buttonGroupPos.z*.85), environment.xSmallFontSize*.80)
        }

        //@ts-ignore
        if(environment.scoreStartIndex < environment.scoreboardObject[1].length && timestamp - environment.timeStampDisplay > 4000){
//                 let timerGroupObj = scene.getObjectByName(environment.timeWordGroupName)
            if(timerGroupObj != undefined){
                if(timerGroupObj.children.length != 0){
                    timerGroupObj.children.forEach((child:any, i:number)=>{
                        // todo new logic avoid high score string update
                        if(child.userData.deleteText != undefined && child.userData.message != environment.highScoresString){
                            child.userData.deleteText()
                        }
                    })
                }
            }
            // todo new logic only put in high score if length 0
            //@ts-ignore
            // todo add msg "HIGH SCORES" using environment var not hard code
            let curY = environment.timerGroupPos.y
            curY -= environment.largeFontSize*2
            let scoresList = environment.scoreboardObject[1]
            // todo new logic try to avoid not deleting, cant check if == 0 because high scores object with 2 objects in children list
            //@ts-ignore
            if(timerGroupObj.children.length <= 2){
                //@ts-ignore
                scoresList.slice(environment.scoreStartIndex, environment.scoreStartIndex+environment.scoreSliceAmt).forEach((scoreInfo: Array<any>, i:number) => {
                    const nameVal = scoreInfo[1]
                    const scoreVal = scoreInfo[2]
                    // todo new logic incorporate score start index
                    const scoreMsg = String(i+1+environment.scoreStartIndex) + " " + nameVal + ":    " + scoreVal
                    curY -= environment.smallFontSize * 2
                    fontService.addFont(scoreMsg, scene, environment.timeWordGroupName, new THREE.Vector3(environment.timerGroupPos.x, environment.timerGroupPos.y+curY, environment.timerGroupPos.z), environment.smallFontSize)
                })
                // new logic time of displaying last scores
                environment.timeStampDisplay = timestamp
                // new logic update scoreStartIndex
                environment.scoreStartIndex += environment.scoreSliceAmt
                // @ts-ignore
                if(environment.scoreStartIndex >= environment.scoreboardObject[1].length){
                    environment.scoreStartIndex = 0
                }
            }

        }
        builderService.checkLaserKeyboardCollisions(scene)


    }

    public refreshPagePlayAgain() : void{
       window.location.reload()
       // must set scoreboard object to avoid looping and reloading multiple times
       environment.scoreboardObject[0] = 4
    }

}
