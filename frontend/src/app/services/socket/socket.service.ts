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
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem(AUTH_TOKEN);
  }

  sendMessage(payload: any) {
    this.socket.emit('new-message', payload);
  }

  getMessageFromSocket() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('recieved-new-message', (data: any) => {
        observer.next(data);
      });

      // Define teardown logic for the observable
      return () => {
        // This function is called when the observable is unsubscribed from
        // Disconnect the socket to clean up resources
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
