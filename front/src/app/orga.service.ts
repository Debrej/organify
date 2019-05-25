import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettings} from "./appSettings.config";

@Injectable({
  providedIn: 'root'
})
export class OrgaService {
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
  }
  }

  getOrga(idOrga){
    return this.http.get(this.url + "orga/" + idOrga, this.httpOptions);
  }

  constructor(private http: HttpClient) {  }
}
