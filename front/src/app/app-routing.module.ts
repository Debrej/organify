import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginViewComponent} from "./login-view/login-view.component";
import {TestViewComponent} from "./test-view/test-view.component";
import {FormSigninViewComponent} from "./form-signin-view/form-signin-view.component";
import {DashboardViewComponent} from "./dashboard-view/dashboard-view.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: 'login', component: LoginViewComponent},
  { path: 'test', component: TestViewComponent},
  { path: 'signIn', component: FormSigninViewComponent},
  { path: 'dashboard', component: DashboardViewComponent,
    children: [
      { path: '', component: DashboardComponent}
    ]
  },
  { path: 'tasks', component: DashboardViewComponent,
    children: [
      { path: '', component: TestViewComponent}
    ]
  },
  { path: 'shifts', component: DashboardViewComponent,
    children: [
      { path: '', component: TestViewComponent}
    ]
  },
  { path: 'affectation', component: DashboardViewComponent,
    children: [
      { path: '', component: TestViewComponent}
    ]
  },
  { path: 'settings', component: DashboardViewComponent,
    children: [
      { path: '', component: TestViewComponent}
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
