import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../Utils/interfaces/User';
import { UserService } from '../../../services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../../services/chat/chat.service';
import { Chat } from '../../../Utils/interfaces/Chat';

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
  chats: Chat[] = [];
  selectedChat: Chat|undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.fetchAllChats();
    this.getSelectedChat();
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

  fetchAllChats() {
    this.chatService.fetchAllChats().subscribe(
      (response: Chat[]) => {
        this.chats = response;
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  selectChat(chat: Chat) {
    this.chatService.setSelectedChat(chat);
  }

  getSelectedChat() {
    this.chatService.getSelectedChat().subscribe(
      (response: any) => {
        this.selectedChat = response;
      }
    )
  }

  accessIndividualChat(user: User) {
    this.dialog.closeAll();
    let isChatAvaliable: boolean = false;
    for(let chat of this.chats) {
      if(chat.isGroupChat) continue;
      for(let participant of chat.participants) {
        if(participant._id===user._id) {
          this.chatService.setSelectedChat(chat);
          isChatAvaliable = true;
          break;
        }
      }
      if(isChatAvaliable) break;
    }
    if(!isChatAvaliable) {
      let payload = {
        'userId': user._id
      }
      this.chatService.accessIndividualChat(payload).subscribe(
        (resonse: Chat) => {
          this.chats = [resonse, ...this.chats];
          this.chatService.setSelectedChat(resonse);
        },
        (error: HttpErrorResponse) => {
          this.openSnackBar(error?.error, 'Ok');
        }
      )
    }
  }
}
