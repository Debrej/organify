import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { FormLoginComponent } from './form-login/form-login.component';
import { PhotoLoginComponent } from './photo-login/photo-login.component';
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { RouterModule, Routes} from "@angular/router";
import { LoginViewComponent } from './login-view/login-view.component';
import { TestViewComponent } from './test-view/test-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormSigninComponent } from './form-signin/form-signin.component';
import { FormSigninViewComponent } from './form-signin-view/form-signin-view.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginViewComponent},
  { path: 'test', component: TestViewComponent},
  { path: 'signIn', component: FormSigninViewComponent},
  { path: 'dashboard', component: DashboardViewComponent},
  { path: '', component: LoginViewComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    FormLoginComponent,
    PhotoLoginComponent,
    LoginViewComponent,
    TestViewComponent,
    FormSigninComponent,
    FormSigninViewComponent,
    DashboardViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [
    AuthService,
    CookieService
  ],
  bootstrap: [
    AppComponent,
    FormLoginComponent,
    PhotoLoginComponent,
    LoginViewComponent,
    TestViewComponent
  ]
})
export class AppModule { }
