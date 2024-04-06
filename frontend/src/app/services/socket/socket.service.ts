import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { AUTH_TOKEN } from '../../../assets/constant';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  
  constructor() { }

  initializeSocket(): void {
    let token = this.getTokenFromLocalStorage();
    if(token) {
      token = JSON.parse(token);
    }
    this.socket = io('http://localhost:8080', { extraHeaders: { 'Authorization': `Bearer ${token}` } });
  
    this.socket.on('get-new-message', (data: any) => {
      console.log('Received new message:', data);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('connect_timeout', (timeout: any) => {
      console.error('Socket connection timeout:', timeout);
    });
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem(AUTH_TOKEN);
  }

  sendMessage(data: { chatId: any, content: string }) {
    if(this.socket) {
      this.socket.emit('new-message', data);
    }
  }

  getMessageFromSocket() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      if(this.socket) {
        this.socket.on('recieved-new-message', (data: any) => {
          observer.next(data);
        });
      }

      // Define teardown logic for the observable
      return () => {
        // This function is called when the observable is unsubscribed from
        // Disconnect the socket to clean up resources
        this.socket.disconnect();
      };
    });
    return observable;
  }
  
  joinChatRoom(chatId: any) {
    if(this.socket) {
      this.socket.emit('join-chat-room', chatId);
    }
  }

  leaveChatRoom(chatId: any) {
    if(this.socket) {
      this.socket.emit('leave-chat-room', chatId);
    }
  }
}
