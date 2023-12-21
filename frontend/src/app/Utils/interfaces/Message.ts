import { Chat } from "./Chat"
import { User } from "./User"

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chatInfo: Chat;
  createdAt: Date
}