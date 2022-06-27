import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class ScoreboardHelperService {
  constructor(private httpClient: HttpClient) { }

  private getScoreBoard(){
    return this.httpClient.get('http://localhost:5000/scoreboard_api/get_scoreboard', {
    //     return this.httpClient.get('http://localhost:8081/pickle-api', {
        withCredentials: true,
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'charset': 'UTF-8'
        })
    });
  }

  public getScoreBoardHelper(){
//     https://stackoverflow.com/a/49605311/10432596
    this.getScoreBoard().subscribe(data => {
        let scoreBoardGet = JSON.parse(JSON.stringify(data))
        environment.scoreboardObject = [1, scoreBoardGet]
    })
  }

  private postScore(name: String, score: number){
//     return this.httpClient.post('http://localhost:5000/scoreboard_api/post_score', {
//     //     return this.httpClient.get('http://localhost:8081/pickle-api', {
//         withCredentials: true,
//         nameVal: name,
//         scoreVal: score,
//         headers: new HttpHeaders({
//             'Content-Type': 'application/json',
//             'charset': 'UTF-8'
//         })
//     });
    return this.httpClient.post('http://localhost:5000/scoreboard_api/post_score', {
    //     return this.httpClient.get('http://localhost:8081/pickle-api', {
        nameVal: name,
        scoreVal: score
    });
  }

  public postScoreHelper(name: String, score:number){
    this.postScore(name, score).subscribe(data => {
//         console.log("data")
//         console.log(data)
    })
  }

}
