import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {

  messages: any[] = [];
  
  constructor(
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
      
  }

  toggleSideNav() {
    this.userService.setToggleSideNav();
  }
}
