import { Component, OnInit } from '@angular/core';
import {OrgaService} from "../../orga.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile_pic_url: any;
  private token: string;
  private username: string;
  private idOrga: string;
  team: any;
  mail: any;
  phone: any;

  constructor(private _orgaService: OrgaService) {
    this.token = localStorage.getItem('token');
    this.username = localStorage.getItem('username');
    this.idOrga = localStorage.getItem('idOrga');
    this.team = 'Admin';
    this.phone = '06 45 86 08 97';

    this._orgaService.passToken(this.token);

    this._orgaService.getOrga(this.idOrga).subscribe(ret => {
      let data = JSON.parse(JSON.stringify(ret));
      console.log(data);
      this.profile_pic_url = data.orga.profile_pic_url;
      this.mail = data.orga.mail;
    });
  }

  ngOnInit() {
  }

}
