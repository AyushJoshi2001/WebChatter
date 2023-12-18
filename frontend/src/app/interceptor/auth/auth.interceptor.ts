import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { AUTH_TOKEN } from '../../../assets/constant';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
        this.authService.logout();
    }
    return throwError(() => err);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!(request.url.includes('login') || request.url.includes('register'))) {
      let token = localStorage.getItem(AUTH_TOKEN);
      if(token) {
        token = JSON.parse(token);
      }
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError(err => this.handleAuthError(err))
    );
  }
}
