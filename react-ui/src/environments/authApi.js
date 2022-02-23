import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

export const authApi = {
  async login(username, password) {
    const response = await axios.post(
      `${REST_ENDPOINT}auth/empLogin?username=${username}&password=${password}`,
      {
        username,
        password,
      }
    );
    response.data.id &&
      localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  },
  logout() {
    localStorage.removeItem("user");
  },
};
