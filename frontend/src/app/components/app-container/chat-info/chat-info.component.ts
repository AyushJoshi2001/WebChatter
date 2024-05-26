import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../../../Utils/interfaces/Chat';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../Utils/interfaces/User';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.css'
})
export class ChatInfoComponent implements OnInit {
  @Input() chat: Chat|undefined;
  userProfile: User|undefined;
  currentDate: number = 0;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().setHours(0, 0, 0, 0);
    this.getUserProfile();
  }

  getUserProfile() {
    this.userService.getUser().subscribe(
      (data: User|null) => {
        if(data) {
          this.userProfile = data;
        }
      }
    )
  }

  getChatName() {
    if(this.chat) {
      if(this.chat.isGroupChat) {
        return this.chat.chatName;
      } else {
        if(this.userProfile) {
          for(let user of this.chat.participants) {
            if(user._id !== this.userProfile._id) {
              return user.name;
            }
          }
        } 
      }
    }
    return '';
  }

  getChatImg() {
    if(this.chat) {
      if(this.chat.isGroupChat) {
        return this.chat.groupImg;
      } else {
        if(this.userProfile) {
          for(let user of this.chat.participants) {
            if(user._id !== this.userProfile._id) {
              return user.profileImg;
            }
          }
        } 
      }
    }
    return '';
  }
  
  getInMilli(date: Date): number {
    if(!date) return 0;
    let d = new Date(date).getTime();
    return d;
  }

  isChatSeen(chat: any) {
    for(let id of chat?.seen) {
      if(id == this.userProfile?._id) {
        return true;
      }
    }
    return false;
  }
}
