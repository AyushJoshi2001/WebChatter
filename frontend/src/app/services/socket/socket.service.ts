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

  initializeSocket(userId: any): void {
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

    this.joinUserRoom(userId);
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem(AUTH_TOKEN);
  }

  sendMessage(data: { chatId: any, content: string }) {
    if(this.socket) {
      this.socket.emit('new-message', data);
    }
  }

  getMessageFromSocket(): Observable<any> {
    return new Observable<any>((observer) => {
      if (!this.socket) {
        observer.error('Socket is not initialized');
        observer.complete();
        return;
      }
  
      const receivedMessageHandler = (data: any) => {
        observer.next(data);
      };
  
      if(this.socket) {
        this.socket.on('received-new-message', receivedMessageHandler);
      }
  
      // Define teardown logic for the observable
      return () => {
        // Unsubscribe from the event when the observable is unsubscribed
        this.socket.off('received-new-message', receivedMessageHandler);
      };
    });
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

  joinUserRoom(userId: any) {
    if(this.socket) {
      this.socket.emit('join-user-room', userId);
    }
  }

  leaveUserRoom(userId: any) {
    if(this.socket) {
      this.socket.emit('leave-user-room', userId);
    }
  }

  getchatUpdatesFromSocket(): Observable<any> {
    return new Observable<any>((observer) => {
      if (!this.socket) {
        observer.error('Socket is not initialized');
        observer.complete();
        return;
      }
  
      const chatUpdatesHandler = (data: any) => {
        observer.next(data);
      };
  
      if(this.socket) {
        this.socket.on('chat-update', chatUpdatesHandler);
      }
  
      // Define teardown logic for the observable
      return () => {
        // Unsubscribe from the event when the observable is unsubscribed
        this.socket.off('chat-update', chatUpdatesHandler);
      };
    });
  }
}
