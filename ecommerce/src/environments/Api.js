import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint.js";

export const api = {
  getAll(path) {
    return axios.get(`${REST_ENDPOINT}${path}`);
  },
  get(path, id) {
    return axios.get(`${REST_ENDPOINT}${path}/${id}`);
  },
  create(path, item) {
    return axios.post(`${REST_ENDPOINT}${path}`, item);
  },
  update(path, item) {
    return axios.put(`${REST_ENDPOINT}${path}`, item);
  },
  delete(path, id) {
    return axios.delete(`${REST_ENDPOINT}${path}/${id}`);
  },
};

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

export const listingApi = {
  getListing(line, tag) {
    return axios.get(
      `${REST_ENDPOINT}sam/model/tag/${line}/${tag}`
    );
  }
}
