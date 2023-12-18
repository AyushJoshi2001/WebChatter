import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { authRoutes } from '../../Utils/routes/authRoutes';
import { Observable } from 'rxjs';
import { User } from '../../Utils/interfaces/User';
import { AUTH_TOKEN } from '../../../assets/constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  registerUser(payload: any) : Observable<User> {
    let route = authRoutes.REGISTER_USER;
    return this.http.post<User>(route, payload);
  }

  loginUser(payload: any) : Observable<string> {
    let route = authRoutes.LOGIN_USER;
    return this.http.post<string>(route, payload);
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN);
    this.router.navigateByUrl('auth/login');
    window.location.reload();
  }
}
