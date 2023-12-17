import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { authRoutes } from '../../Utils/routes/authRoutes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  registerUser(payload: any) {
    let route = authRoutes.REGISTER_USER;
    return this.http.post(route, payload);
  }

  loginUser(payload: any) {
    let route = authRoutes.LOGIN_USER;
    return this.http.post(route, payload);
  }
}
