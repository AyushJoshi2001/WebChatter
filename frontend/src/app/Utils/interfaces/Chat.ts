import { Message } from "./Message"
import { User } from "./User"

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  groupImg: string;
  participants: User[];
  latestMessage: Message;
  groupAdmin: User;
  createdAt: Date;
  updatedAt: Date;
  seen: string[];
}