import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../Utils/interfaces/User';
import { UserService } from '../../../services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../../services/chat/chat.service';
import { Chat } from '../../../Utils/interfaces/Chat';
import { AppService } from '../../../services/app/app.service';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  
  user: User|null = null;
  searchResults: User[] = [];
  searchKey: string = '';
  userSearchPageNo: number = 1;
  userSearchPageSize: number = 10;
  chats: Chat[] = [];
  selectedChat: Chat|undefined;
  newGroupName: string = '';
  newGroupParticipants: User[] = [];
  noMoreResultsFound: boolean = false;
  profileEdit: boolean = false;
  newName: string = '';
  isDesktop: boolean = false;
  sideNavOpened: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private chatService: ChatService,
    private appService: AppService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getAllChats();
    this.fetchAllChats();
    this.getSelectedChat();
    this.getIsDesktop();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data: User|null) => {
        if(data) {
          this.user = data;
          setTimeout(() => {
            this.getchatUpdatesFromSocket();
          })
        }
      }
    )
  }
  logout() {
    this.socketService.leaveUserRoom(this.user?._id);
    this.authService.logout();
  }

  getIsDesktop() {
    this.appService.getIsDesktop().subscribe(
      (response: boolean) => {
        this.isDesktop = response;
      }
    )
  }

  getToggleSideNav() {
    this.appService.getToggleSideNav().subscribe(
      (response: boolean) => {
        this.sideNavOpened = response;
      }
    )
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
    this.newGroupName = '';
    this.newGroupParticipants = [];
    this.noMoreResultsFound = false;
    this.userSearchPageNo = 1;
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
        console.log(error?.error);
        // this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  getAllChats() {
    this.chatService.getAllChats().subscribe(
      (data: Chat[]) => {
        this.chats = data;
      }
    )
  }

  selectChat(chat: Chat) {
    if(this.selectedChat?._id!==chat._id) {
      if(this.selectedChat) {
        this.socketService.leaveChatRoom(this.selectedChat._id);
      }
      this.socketService.joinChatRoom(chat._id);
      this.chatService.setSelectedChat(chat);
      
      this.chats.forEach((chat1) => {
        if(chat1._id == chat._id) {
          if(!this.isChatSeen(chat1, this.user?._id)) {
            chat1.seen.push(this.user!._id);
            this.updateChatSeenStatus(chat1._id);
          }
        }
      })
    }
    if(!this.isDesktop) {
      this.appService.setToggleSideNav(false);
    }
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
          if(this.selectedChat?._id!==chat._id) {
            this.socketService.leaveChatRoom(this.selectedChat?._id);
            this.socketService.joinChatRoom(chat._id);
            this.chatService.setSelectedChat(chat);
          }
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
        (response: Chat) => {
          this.chats = [response, ...this.chats];
          if(this.selectedChat?._id!==response._id) {
            this.socketService.leaveChatRoom(this.selectedChat?._id);
            this.socketService.joinChatRoom(response._id);
            this.chatService.setSelectedChat(response);
          }
        },
        (error: HttpErrorResponse) => {
          this.openSnackBar(error?.error, 'Ok');
        }
      )
    }
  }

  addParticipantsInNewGroupChat(newUser: User) {
    for(let user of this.newGroupParticipants) {
      if(user._id === newUser._id) {
        return;
      }
    }
    this.newGroupParticipants.push(newUser);
  }

  removeNewGroupParticipants(newUser: User) {
    this.newGroupParticipants = this.newGroupParticipants.filter(user => user._id !== newUser._id);
  }

  loadMoreSearchResults() {
    this.userSearchPageNo++;
    this.fetchUsers();
  }

  createGroupChat() {
    if(!this.newGroupName || this.newGroupName.length<3) {
      this.openSnackBar('Group Name must be atleast 3 character.', 'Ok');
      return;
    }
    if(!this.newGroupParticipants || this.newGroupParticipants.length<2) {
      this.openSnackBar('Please select atleast 2 participants.', 'Ok');
      return;
    }

    if(this.user) {
      this.newGroupParticipants.push(this.user);
    } 
    let payload = {
      groupMembers: this.newGroupParticipants,
      groupName: this.newGroupName
    }
    this.chatService.createGroupChat(payload).subscribe(
      (response: Chat[]) => {
        this.dialog.closeAll();
        this.fetchAllChats();
        if(response && response.length>0) {
          if(this.selectedChat?._id!==response[0]._id) {
            this.socketService.leaveChatRoom(this.selectedChat?._id);
            this.socketService.joinChatRoom(response[0]._id);
            this.chatService.setSelectedChat(response[0]);
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  openProfileDialog(context: any) {
    const dialogRef = this.dialog.open(context, {
      disableClose: true,
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      // action after close.
      this.resetProfileDialog();
    });
  }

  editProfile() {
    this.profileEdit = !this.profileEdit;
    if(this.user?.name) {
      this.newName = this.user.name;
    }
  }

  updateProfile() {
    let payload = {
      name: this.newName,
      profileImg: this.user?.profileImg
    }
    this.userService.updateProfile(payload).subscribe(
      (response: User) => {
        this.userService.setUser(response);
        this.profileEdit = false;
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  resetProfileDialog() {
    this.profileEdit = false;
    this.newName = '';
  }

  getchatUpdatesFromSocket() {
    this.socketService.getchatUpdatesFromSocket().subscribe(
      (response: any) => {
        if(response) {
          console.log('chat update => ', response);
          for(let i=0; i<this.chats.length; i++) {
            if(this.chats[i]._id === response?.chatId) {
              let updatedChat = this.chats[i];
              updatedChat.latestMessage.content = response?.content;
              updatedChat.latestMessage.createdAt = response?.updatedAt;
              updatedChat.updatedAt = response?.updatedAt;
              if(this.selectedChat?._id != response?.chatId) {
                updatedChat.seen = [];
              } else {
                this.updateChatSeenStatus(updatedChat._id);
              }
              if(i!=0) {
                // move updatedChat at top
                this.chats.splice(i,1);
                this.chats.splice(0,0, updatedChat);
              }
            }
          }
        }
      }
    )
  }

  updateChatSeenStatus(chatId: any) {
    this.chatService.updateChatSeenStatus(chatId).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  isChatSeen(chat: any, userId: any) {
    for(let id of chat?.seen) {
      if(id == userId) {
        return true;
      }
    }
    return false;
  }
}
