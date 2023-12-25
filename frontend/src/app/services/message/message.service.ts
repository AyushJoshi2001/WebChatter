import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../Utils/interfaces/Message';
import { messageRoutes } from '../../Utils/routes/messageRoutes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(payload: any): Observable<Message> {
    let route = messageRoutes.SEND_MESSAGES;
    return this.http.post<Message>(route, payload);
  }

  getMessage(payload: any): Observable<Message[]> {
    let route = messageRoutes.GET_MESSAGES;
    route = route.replace(':CHAT_ID', payload.chatId);
    route = route.replace(':PAGE_NO', payload.pageNo);
    route = route.replace(':PAGE_SIZE', payload.pageSize);
    return this.http.get<Message[]>(route);
  }
}
