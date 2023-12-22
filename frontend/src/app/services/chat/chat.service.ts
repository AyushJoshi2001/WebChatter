import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Chat } from '../../Utils/interfaces/Chat';
import { chatRoutes } from '../../Utils/routes/chatRoutes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat$ = new BehaviorSubject<Chat | null>(null);
  private selectedChat = this.selectedChat$.asObservable();
  constructor(
    private http: HttpClient
  ) { }

  getSelectedChat(): Observable<Chat|null> {
    return this.selectedChat;
  }

  setSelectedChat(data: Chat){
    this.selectedChat$.next(data);
  }

  fetchAllChats(): Observable<Chat[]> {
    let route = chatRoutes.FETCH_ALL_CHATS;
    return this.http.get<Chat[]>(route);
  }

  accessIndividualChat(payload: any): Observable<Chat> {
    let route = chatRoutes.ACCESS_INDIVIDUAL_CHAT;
    return this.http.post<Chat>(route, payload);
  }

  createGroupChat(payload: any): Observable<Chat[]> {
    let route = chatRoutes.CREATE_GROUP_CHAT;
    return this.http.post<Chat[]>(route, payload);
  }
}
