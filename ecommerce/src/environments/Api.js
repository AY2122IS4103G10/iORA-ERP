import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint.js";
export const authApi = {
  login(email, password) {
    return axios.get(
      `${REST_ENDPOINT}online/login?email=${email}&password=${password}`
    );
  },
  register(user) {
    return axios.post(`${REST_ENDPOINT}online/register`, user);
  },
};
