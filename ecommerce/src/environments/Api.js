import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint.js";
export const authApi = {
  login(username, password) {
    return axios.get(
      `${REST_ENDPOINT}auth/empLogin?username=${username}&password=${password}`
    );
  },
};