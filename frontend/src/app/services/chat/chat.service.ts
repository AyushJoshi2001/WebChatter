import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../Utils/interfaces/Chat';
import { chatRoutes } from '../../Utils/routes/chatRoutes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }

  fetchAllChats(): Observable<Chat[]> {
    let route = chatRoutes.FETCH_ALL_CHATS;
    return this.http.get<Chat[]>(route);
  }

  accessIndividualChat(payload: any): Observable<Chat> {
    let route = chatRoutes.ACCESS_INDIVIDUAL_CHAT;
    return this.http.post<Chat>(route, payload);
  }
}
