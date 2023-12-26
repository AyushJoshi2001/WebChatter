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

  getUsers(payload: any): Observable<User[]> {
    let route = userRoutes.GET_USERS;
    route = route.replace(':SEARCH_KEY', payload?.searchKey);
    route = route.replace(':PAGE_NO', payload?.pageNo);
    route = route.replace(':PAGE_SIZE', payload?.pageSize);
    return this.http.get<User[]>(route); 
  }

  updateProfile(payload: any): Observable<User> {
    let route = userRoutes.UPDATE_USER;
    return this.http.put<User>(route, payload); 
  }
}
