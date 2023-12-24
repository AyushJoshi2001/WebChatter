import { BASE_URL } from "../../../assets/constant";
const baseUrl = BASE_URL + '/api/user';

export const userRoutes = {
  'GET_PROFILE': baseUrl + '/getProfile',
  'GET_USERS': baseUrl + '/search?searchKey=:SEARCH_KEY&pageNo=:PAGE_NO&pageSize=:PAGE_SIZE',
  'UPDATE_USER': baseUrl + '/update'
}