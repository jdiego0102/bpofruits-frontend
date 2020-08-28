import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PredioComponent } from './modules/predio/predio.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { CheckLoginGuard } from './shared/guards/check-login.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: 'admin',
        component: DashboardComponent,
        // canActivate: [CheckLoginGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [CheckLoginGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [CheckLoginGuard],
      },
      {
        path: 'predio',
        component: PredioComponent,
        // canActivate: [CheckLoginGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
