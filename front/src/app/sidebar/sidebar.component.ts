import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() sidebar: any;
  @Input() menuIcon: any;
  @Input() searchBarContainer: any;

  constructor(private _renderer: Renderer2, private _router: Router) { }

  ngOnInit() {
  }

  closeSidebar() {
    this.sidebar.close();
    this._renderer.setStyle(this.menuIcon, 'display', 'flex');
    this._renderer.setStyle(this.searchBarContainer, 'width', '97%');
  }

  dashboard() {
    this._router.navigate(['/', 'dashboard']);
  }

  tasks() {
    this._router.navigate(['/', 'tasks']);
  }

  shifts() {
    this._router.navigate(['/', 'shifts']);
  }

  affectation() {
    this._router.navigate(['/', 'affectation']);
  }

  settings() {
    this._router.navigate(['/', 'settings']);
  }
}
