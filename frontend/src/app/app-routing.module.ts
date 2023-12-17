import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth-container/login/login.component';
import { RegisterComponent } from './components/auth-container/register/register.component';
import { HomeComponent } from './components/app-container/home/home.component';
import { AuthContainerComponent } from './components/auth-container/auth-container/auth-container.component';

const routes: Routes = [
  {path: '', redirectTo: 'app', pathMatch: 'full'},
  {
    path: 'auth',
    component: AuthContainerComponent,
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
