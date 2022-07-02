import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// https://stackoverflow.com/questions/53341497/flask-session-not-persisting-between-requests-for-angular-app

export class WordApiService {

  constructor(private httpClient: HttpClient) { }

  public getWord(){
      return this.httpClient.get('http://localhost:5000/pickle-api', {
//     return this.httpClient.get('http://localhost:8081/pickle-api', {
          withCredentials: true,
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'charset': 'UTF-8'
          })
      });
  }


}

