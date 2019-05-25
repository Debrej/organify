import {Component, OnInit, ViewChild, Renderer2, ElementRef} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {OrgaService} from "../orga.service";

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {
  token: any;
  username: any;
  idOrga: any;

  @ViewChild('profileMenu') profileMenu: ElementRef;
  @ViewChild('searchBar') searchBar: ElementRef;
  profile_pic_url: any;

  constructor(private _renderer: Renderer2, private _authService: AuthService, private _router: Router, private _orgaService: OrgaService) {
    this.token = localStorage.getItem('token');
    this.username = localStorage.getItem('username');
    this.idOrga = localStorage.getItem('idOrga');

    this._orgaService.passToken(this.token);

    this._orgaService.getOrga(this.idOrga).subscribe(ret => {
      let data = JSON.parse(JSON.stringify(ret));
      console.log(data);
      this.profile_pic_url = data.orga.profile_pic_url;
    });
  }

  ngOnInit() {
  }

  toggleProfilePopUp() {
    if(this.profileMenu.nativeElement.style.display == 'none'){
      this._renderer.setStyle(this.profileMenu.nativeElement, 'display', 'flex');
    }
    else{
      this._renderer.setStyle(this.profileMenu.nativeElement, 'display', 'none');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this._authService.logout(this.token).subscribe(ret => {
      let data = JSON.parse(JSON.stringify(ret));
      if (data.status === 0){
        this._router.navigate(['/', 'login']);
      }
    });
  }

  closeProfilePopUp() {
    this._renderer.setStyle(this.profileMenu.nativeElement, 'display', 'none');
  }

  searchBarClick() {
    this.closeProfilePopUp();
    this.searchBar.nativeElement.focus();
  }

  mainClick() {
    this.closeProfilePopUp();
  }
}
