import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Chat } from '../../../Utils/interfaces/Chat';
import { ChatService } from '../../../services/chat/chat.service';
import { Message } from '../../../Utils/interfaces/Message';
import { User } from '../../../Utils/interfaces/User';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private dialog: MatDialog
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
  }
}
