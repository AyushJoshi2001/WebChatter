import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth-container/login/login.component';
import { RegisterComponent } from './components/auth-container/register/register.component';
import { HomeComponent } from './components/app-container/home/home.component';

export const routes: Routes = [
  {path: '', redirectTo: 'app', pathMatch: 'full'},
  {
    path: 'auth',
    children: [
      {path: '', redirectTo:'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent, pathMatch: 'full'},
      {path: 'register', component: RegisterComponent, pathMatch: 'full'}
    ]
  },
  {
    path: 'app',
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent, pathMatch: 'full'}
    ]
  }
];
