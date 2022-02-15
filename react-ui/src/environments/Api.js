/**
 * REST API connections
 */
import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

export const productsApi = {
  getAll() {
    return axios
      .get(`${REST_ENDPOINT}model`);
  },
  get(modelId) {
    return axios.get(`${REST_ENDPOINT}model/${modelId}`);
  },
  create(model) {
    return axios.post(`${REST_ENDPOINT}model`, model);
  },
  update(model) {
    return axios.put(`${REST_ENDPOINT}model`, model);
  },
  delete(modelId) {
    return axios.delete(`${REST_ENDPOINT}model/${modelId}`);
  },
};
