import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettings} from './appSettings.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = AppSettings.API_ENDPOINT;

  getToken(mail, pwd){
    return this.http.post(this.url + "login", {"mail": mail, "pwd": pwd});
  }

  createOrga(first_name, last_name, mail, pwd){
    return this.http.post(this.url + "orga", {"first_name": first_name, "last_name": last_name, "mail": mail, "pwd": pwd});
  }

  logout(token){
    return this.http.post(this.url + "logout", {"token": token});
  }

  constructor(private http: HttpClient) { }
}
