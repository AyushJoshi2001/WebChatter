import { Message } from "./Message"
import { User } from "./User"

export interface Chat {
  chatName: string,
  isGroupChat: boolean,
  participants: User[],
  latestMessage: Message,
  groupAdmin: User,
  createdAt: Date,
  updatedAt: Date
}