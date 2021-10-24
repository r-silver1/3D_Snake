import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordApiService {

  constructor(private httpClient: HttpClient) { }

  public getWord(){
    return this.httpClient.get('http://localhost:5000/word-api');
  }

}

