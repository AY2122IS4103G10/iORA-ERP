/**
 * REST API connections
 */
import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

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

export const voucherApi = {
  issue(id) {
    return axios.put(`${REST_ENDPOINT}voucher/issue/${id}`);
  },
  redeem(id) {
    return axios.put(`${REST_ENDPOINT}voucher/redeem/${id}`);
  },
};

export const sitesApi = {
  getAll() {
    return axios
      .get(`${REST_ENDPOINT}sam/viewSites?storeTypes=&country=&company=`)
  },

  getASite(id) {
    return axios
      .get(`${REST_ENDPOINT}admin/viewSite/${id}`)
  },
};
