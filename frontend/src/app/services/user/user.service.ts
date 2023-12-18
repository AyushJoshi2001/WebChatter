import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../Utils/interfaces/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userRoutes } from '../../Utils/routes/userRoutes';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataObs$ = new BehaviorSubject<User | null>(null);
  private userDataObs = this.userDataObs$.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getUser() {
    return this.userDataObs;
  }
  setUser(data: User){
    this.userDataObs$.next(data);
  }

  getProfile() : Observable<User> {
    let route = userRoutes.GET_PROFILE;
    return this.http.get<User>(route);
  }
}
