/**
 * REST API connections
 */
import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

const SERVER_URL = "";

export const productsApi = {
  getAll() {
    return axios.get(`${REST_ENDPOINT}models`);
  },
  get(modelId) {
    return axios.get(`${REST_ENDPOINT}models/${modelId}`);
  },
  create(model) {
    return axios.post(`${REST_ENDPOINT}models`, model)
  },
  update(model) {
    return axios.put(`${REST_ENDPOINT}models`, model)
  },
  delete(modelId) {
    return axios.delete(`${REST_ENDPOINT}models/${modelId}`);
  },
};