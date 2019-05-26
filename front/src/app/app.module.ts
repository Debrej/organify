import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SidebarModule } from "ng-sidebar";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { FormLoginComponent } from './form-login/form-login.component';
import { PhotoLoginComponent } from './photo-login/photo-login.component';
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { LoginViewComponent } from './login-view/login-view.component';
import { TestViewComponent } from './test-view/test-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormSigninComponent } from './form-signin/form-signin.component';
import { FormSigninViewComponent } from './form-signin-view/form-signin-view.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { TasksComponent } from './dashboard/tasks/tasks.component';
import { TeamComponent } from './dashboard/team/team.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    FormLoginComponent,
    PhotoLoginComponent,
    LoginViewComponent,
    TestViewComponent,
    FormSigninComponent,
    FormSigninViewComponent,
    DashboardViewComponent,
    SidebarComponent,
    DashboardComponent,
    ProfileComponent,
    TasksComponent,
    TeamComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    SidebarModule.forRoot()
  ],
  providers: [
    AuthService,
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
