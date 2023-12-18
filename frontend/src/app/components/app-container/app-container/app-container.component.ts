import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../Utils/interfaces/User';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.css'
})
export class AppContainerComponent implements OnInit {
  
  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.getProfile();
  }

  getProfile() {
    this.userService.getProfile().subscribe(
      (res: User) => {
        console.log(res);
        this.userService.setUser(res);
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error.error, 'Ok')
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
