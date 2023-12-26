import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private isDesktop$ = new BehaviorSubject<boolean>(window.innerWidth>800);
  private isDesktop = this.isDesktop$.asObservable();
  private toggleSideNav$ = new BehaviorSubject<boolean>(true);
  private toggleSideNav = this.toggleSideNav$.asObservable();

  constructor() { }

  getIsDesktop(): Observable<boolean> {
    return this.isDesktop;
  }

  setIsDesktop(data: boolean) {
    this.isDesktop$.next(data);
  }

  getToggleSideNav() {
    return this.toggleSideNav;
  }
  
  setToggleSideNav(data: boolean){
    this.toggleSideNav$.next(data);
  }
}
