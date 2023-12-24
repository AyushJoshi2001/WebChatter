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
  searchResults: User[] = [];
  searchKey: string = '';
  userSearchPageNo: number = 1;
  userSearchPageSize: number = 10;
  noMoreResultsFound: boolean = false;

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

  openParticipantProfileFromGroupChat(context: any, user: User) {
    this.openParticipantProfile(context);
    this.individualChatUser = user;
  }

  resetData() {
    this.newGroupName = '';
    this.userSearchPageNo = 1;
    this.searchResults = [];
    this.searchKey = '';
    this.individualChatUser = null;
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

  onSearchKeyChange() {
    this.userSearchPageNo = 1;
    this.searchResults = [];
    this.fetchUsers();
  }

  fetchUsers() {
    if(!this.searchKey) {
      return;
    }

    const payload = {
      searchKey: this.searchKey,
      pageNo: this.userSearchPageNo,
      pageSize: this.userSearchPageSize
    }
    this.userService.getUsers(payload).subscribe(
      (response: User[]) => {
        this.searchResults.push(...response);
        if(response.length===0) {
          this.noMoreResultsFound = true;
        } else {
          this.noMoreResultsFound = false;
        }
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  loadMoreSearchResults() {
    this.userSearchPageNo++;
    this.fetchUsers();
  }

  openDialog(context: any) {
    const dialogRef = this.dialog.open(context, {
      disableClose: true,
      height: '80vh',
      width: '30rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      // action after close.
      this.resetData();
    });
  }

  removeParticipant(oldUser: User) {
    let payload = {
      groupId: this.selectedChat?._id,
      userId: oldUser._id
    }
    this.chatService.removeParticipantFromGroup(payload).subscribe(
      (response: Chat) => {
        this.chatService.setSelectedChat(response);
        this.fetchAllChats();
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  addParticipant(newUser: User) {
    let payload = {
      groupId: this.selectedChat?._id,
      userId: newUser._id
    }
    this.chatService.addParticipantToGroup(payload).subscribe(
      (response: Chat) => {
        this.chatService.setSelectedChat(response);
        this.fetchAllChats();
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }
}
