import { Component,ViewChild, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Chat } from '../../../Utils/interfaces/Chat';
import { ChatService } from '../../../services/chat/chat.service';
import { Message } from '../../../Utils/interfaces/Message';
import { User } from '../../../Utils/interfaces/User';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../../../services/message/message.service';
import { AppService } from '../../../services/app/app.service';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, OnDestroy {
  @ViewChild('loadMore') loadMore!: ElementRef;
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
  messagePageNo: number = 1;
  messagePageSize: number = 10;
  messageAdditionalOffset: number = 0;
  noMoreMessageFound: boolean = false;
  newMessage: string = '';
  currentDate: number = 0;
  observer!: IntersectionObserver|null;
  allChats: Chat[] = [];
  sideNavOpened: boolean = false;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private appService: AppService,
    private socketService: SocketService
  ) { }
  
  ngOnInit(): void {
    this.currentDate = new Date().setHours(0, 0, 0, 0);
    this.getUser();
    this.getSelectedChat();
    this.fetchAllChats();
  }

  ngOnDestroy(): void {
    console.log("running...................")
    if(this.observer) {
      this.observer.unobserve(this.loadMore.nativeElement);
    }
  }

  toggleSideNav() {
    this.appService.setToggleSideNav(!this.sideNavOpened);
  }

  getToggleSideNav() {
    this.appService.getToggleSideNav().subscribe(
      (response: boolean) => {
        this.sideNavOpened = response;
      }
    )
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data: User|null) => {
        if(data) {
          this.user = data;
          setTimeout(() => {
            this.getMessageFromSocket();
          });
        }
      }
    )
  }

  // reset all data variables when chat changes
  getSelectedChat() {
    this.chatService.getSelectedChat().subscribe(
      (data: Chat|null) => {
        if(data) {
          this.messages = [];
          this.observer = null;
          this.selectedChat = data;
          this.messagePageNo = 1;
          this.newMessage = '';
          this.messageAdditionalOffset = 0;
          this.getMessage();
        }
      }
    )
  }

  getChatName(): string {
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
        this.updateChatLocally(response);
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
    this.chatService.getAllChats().subscribe(
      (response: Chat[]) => {
        this.allChats = response;
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  updateChatLocally(updatedChat: Chat) {
    if(this.allChats.length>0) {
      for(let i=0; i<this.allChats.length; i++) {
        if(this.allChats[i]._id===updatedChat._id) {
          this.allChats[i] = updatedChat;
          this.chatService.setAllChats(this.allChats);
        }
      }
    }
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

  sendMessage(event: Event) {
    event.preventDefault();
    let payload = {
      chatId: this.selectedChat?._id,
      content: this.newMessage
    }
    this.socketService.sendMessage(payload);
    this.newMessage = '';
    // this.messageService.sendMessage(payload).subscribe(
    //   (response: Message) => {
    //     this.newMessage = '';
    //     this.messages = [response, ...this.messages];
    //   },
    //   (error: HttpErrorResponse) => {
    //     this.openSnackBar(error?.error, 'Ok');
    //   }
    // )
  }

  getMessage() {
    let payload = {
      chatId: this.selectedChat?._id,
      pageNo: this.messagePageNo,
      pageSize: this.messagePageSize,
      // if new message added through socket then we have to increase the offset
      // so that same message should not fetch again.
      additionalOffset: this.messageAdditionalOffset
    }
    this.messageService.getMessage(payload).subscribe(
      (response: Message[]) => {
        if(response.length===0) {
          this.noMoreMessageFound = true;
        } else {
          this.noMoreMessageFound = false;
        }
        this.messages.push(...response);
        if(!this.observer && this.messages.length>0) {
          setTimeout(() => {
            this.intersectionObserver();
            if(this.observer) {
              this.observer.observe(this.loadMore.nativeElement);
            }
          }, 0);
        }
      },
      (error: HttpErrorResponse) => {
        this.openSnackBar(error?.error, 'Ok');
      }
    )
  }

  getMessageFromSocket() {
    this.socketService.getMessageFromSocket().subscribe(
      (response: any) => {
        if(response) {
          this.messages.splice(0, 0, response);
          this.messageAdditionalOffset++;
        }
      }
    )
  }

  getInMilli(date: Date): number {
    if(!date) return 0;
    let d = new Date(date).getTime();
    return d;
  }

  intersectionObserver() {
    let options = {
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.increaseMessagePageNo();
      }
    }, options);
  }

  increaseMessagePageNo() {
    this.messagePageNo++;
    this.getMessage();
  }
}
