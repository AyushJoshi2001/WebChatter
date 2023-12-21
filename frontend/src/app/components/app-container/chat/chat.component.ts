import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../Utils/interfaces/User';
import { UserService } from '../../../services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  
  searchResults: User[] = [];
  searchKey: string = '';
  userSearchPageNo: number = 1;
  userSearchPageSize: number = 10;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      
  }

  logout() {
    this.authService.logout();
  }
  
  openDialog(context: any) {
    const dialogRef = this.dialog.open(context, {
      disableClose: true,
      height: '80vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      // action after close.
      this.resetData();
    });
  }

  resetData() {
    this.searchResults = [];
    this.searchKey = '';
  }

  onSearchKeyChange() {
    this.fetchUsers();
  }

  fetchUsers() {
    if(!this.searchKey) {
      this.searchResults = [];
      return;
    }

    const payload = {
      searchKey: this.searchKey,
      pageNo: this.userSearchPageNo,
      pageSize: this.userSearchPageSize
    }
    this.userService.getUsers(payload).subscribe(
      (response: User[]) => {
        this.searchResults = response;
        console.log(this.searchResults);
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
