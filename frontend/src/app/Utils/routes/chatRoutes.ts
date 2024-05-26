import { BASE_URL } from "../../../assets/constant";
const baseUrl = BASE_URL + '/api/chat';

export const chatRoutes = {
  'FETCH_ALL_CHATS' : baseUrl,
  'ACCESS_INDIVIDUAL_CHAT' : baseUrl,
  'CREATE_GROUP_CHAT' : baseUrl + '/createGroup',
  'UPDATE_GROUP_CHAT' : baseUrl + '/update',
  'ADD_PARTICIPANT_TO_GROUP_CHAT' : baseUrl + '/add',
  'REMOVE_PARTICIPANT_FROM_GROUP_CHAT' : baseUrl + '/remove',
  'UPDATE_CHAT_SEEN_STATUS' : baseUrl + '/update/seen?chatId=:CHAT_ID'
}