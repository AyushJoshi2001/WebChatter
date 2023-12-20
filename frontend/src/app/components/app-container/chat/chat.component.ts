import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
      
  }

  logout() {
    this.authService.logout();
  }
  
}
