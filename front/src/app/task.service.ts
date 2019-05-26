import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettings} from "./appSettings.config";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private token: any;
  private httpOptions: any;

  private url = AppSettings.API_ENDPOINT;

  passToken(token){
    this.token = token;
    let tokenStr = 'Bearer ' + this.token;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': tokenStr
      })
    };
  }

  getTask(idTask){
    return this.http.get(this.url + 'task/' + idTask, this.httpOptions)
  }

  getTaskShift(idTask){
    return this.http.get(this.url + 'task/shift/' + idTask, this.httpOptions)
  }

  getTaskOrgaAssigned(idTask){
    return this.http.get(this.url + 'task/orga/assigned/' + idTask, this.httpOptions)
  }

  getTaskAll(){
    return this.http.get(this.url + 'task/all', this.httpOptions);
  }

  constructor(private http: HttpClient) {}
}
