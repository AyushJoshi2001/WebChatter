import { BASE_URL } from "../../../assets/constant";
const baseUrl = BASE_URL + '/api/auth';

export const authRoutes = {
  'REGISTER_USER': baseUrl + '/register',
  'LOGIN_USER': baseUrl + '/login'
}
