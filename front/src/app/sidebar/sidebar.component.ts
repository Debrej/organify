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

  @ViewChild('dashboardButton') dashboardButton: ElementRef;
  @ViewChild('tasksButton') tasksButton: ElementRef;
  @ViewChild('shiftsButton') shiftsButton: ElementRef;
  @ViewChild('affectButton') affectButton: ElementRef;
  @ViewChild('settingsButton') settingsButton: ElementRef;

  constructor(private _renderer: Renderer2, private _router: Router) { }

  ngOnInit() {
    switch(this._router.url.substr(1, this._router.url.length)){
      case 'dashboard':
        this.dashboardButton.nativeElement.className = 'sidebar-button focus';
        break;

      case 'tasks':
        this.tasksButton.nativeElement.className = 'sidebar-button focus';
        break;

      case 'shifts':
        this.shiftsButton.nativeElement.className = 'sidebar-button focus';
        break;

      case 'affectation':
        this.affectButton.nativeElement.className = 'sidebar-button focus';
        break;

      case 'settings':
        this.settingsButton.nativeElement.className = 'sidebar-button focus';
        break;
    }
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
