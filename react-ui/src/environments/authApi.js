import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

export const authApi = {
  async login({ email, password }) {
    const response = await axios
      .post(`${REST_ENDPOINT}login`, {
        email,
        password,
      });
    response.data.accessToken &&
      localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  },
  logout() {
    localStorage.removeItem("user");
  },
};
