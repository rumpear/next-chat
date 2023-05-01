export type TFriendRequests = string[];

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface IChat {
  id: string;
  messages: IMessage[];
}
export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
