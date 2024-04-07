import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../Utils/interfaces/User';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AUTH_TOKEN } from '../../../../assets/constant';
import { AppService } from '../../../services/app/app.service';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.css'
})
export class AppContainerComponent implements OnInit {
  sideNavOpened: boolean = false;

  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private appService: AppService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void { 
    this.initCalls();
  }

  initCalls() {
    if(localStorage.getItem(AUTH_TOKEN)) {
      this.getProfile();
      this.getToggleSideNav();
    }
    else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    if(innerWidth<=800) {
      this.appService.setIsDesktop(false);
    } else {
      this.appService.setIsDesktop(true);
    }
    if(!this.sideNavOpened) {
      this.appService.setToggleSideNav(true);
    }
  }

  getToggleSideNav() {
    this.appService.getToggleSideNav().subscribe(
      (response: boolean) => {
        this.sideNavOpened = response;
      }
    )
  }

  getProfile() {
    this.userService.getProfile().subscribe(
      (res: User) => {
        this.userService.setUser(res);
        this.initializeSocket(res._id);
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error.error, 'Ok');
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }

  initializeSocket(userId: any) {
    this.socketService.initializeSocket(userId);
  }
}
