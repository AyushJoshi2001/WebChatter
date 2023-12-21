import { Chat } from "./Chat"
import { User } from "./User"

export interface Message {
  sender: User,
  content: string,
  chatInfo: Chat,
  createdAt: Date
}