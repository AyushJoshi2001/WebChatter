import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Chat } from '../../../Utils/interfaces/Chat';
import { ChatService } from '../../../services/chat/chat.service';
import { Message } from '../../../Utils/interfaces/Message';
import { User } from '../../../Utils/interfaces/User';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {

  messages: Message[] = [];
  selectedChat: Chat|null = null;
  user: User|null = null;
  individualChatUser: User|null = null;
  groupDetailsEdit: boolean = false;
  newGroupName: string = '';

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.getUser();
    this.getSelectedChat();
  }

  toggleSideNav() {
    this.userService.setToggleSideNav();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data: User|null) => {
        if(data) {
          this.user = data;
        }
      }
    )
  }

  getSelectedChat() {
    this.chatService.getSelectedChat().subscribe(
      (data: Chat|null) => {
        if(data) {
          this.selectedChat = data;
        }
      }
    )
  }

  getChatName(): string{
    if(!this.selectedChat) return '';

    if(!this.selectedChat.isGroupChat) {
      for(let participant of this.selectedChat.participants) {
        if(this.user?._id !== participant._id) {
          return participant.name;
        }
      }
    }

    return this.selectedChat.chatName;
  }

  openParticipantProfile(context: any) {
    if(this.selectedChat && !this.selectedChat.isGroupChat) {
      for(let participant of this.selectedChat.participants) {
        if(this.user?._id !== participant._id) {
          this.individualChatUser = participant;
        }
      }
    }
    const dialogRef = this.dialog.open(context, {
      disableClose: true,
      height: 'auto'
    }); 
    
    dialogRef.afterClosed().subscribe(result => {
      // action after close.
      this.resetData();
    });
  }

  resetData() {
    this.newGroupName = '';
  }

  editGroupDetails() {
    this.groupDetailsEdit = !this.groupDetailsEdit;
    if(this.selectedChat) {
      this.newGroupName = this.selectedChat.chatName;
    }
  }

  updateGroup() {
    let payload = {
      chatName: this.newGroupName,
      groupChatImg: this.selectedChat?.groupImg,
      chatId: this.selectedChat?._id
    }
    this.chatService.updateGroupChat(payload).subscribe(
      (response: Chat) => {
        this.chatService.setSelectedChat(response);
        this.fetchAllChats();
        this.groupDetailsEdit = false;
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
        this.chatService.setAllChats(response);
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }
}
