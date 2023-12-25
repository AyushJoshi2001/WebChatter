import { BASE_URL } from "../../../assets/constant";

const baseUrl = BASE_URL + '/api/message';

export const messageRoutes = {
  'SEND_MESSAGES': baseUrl + '/',
  'GET_MESSAGES': baseUrl + '/:CHAT_ID?pageNo=:PAGE_NO&pageSize=:PAGE_SIZE'
}