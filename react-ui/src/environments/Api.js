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
    return axios.put(`${REST_ENDPOINT}sam/voucher/issue/${id}`);
  },
  redeem(id) {
    return axios.put(`${REST_ENDPOINT}sam/voucher/redeem/${id}`);
  },
};

export const sitesApi = {
  searchByType(siteType) {
    return axios.get(
      `${REST_ENDPOINT}sam/viewSites/${siteType}?country=&company=`
    );
  },
  getAll() {
    return axios.get(`${REST_ENDPOINT}sam/viewSites/all`);
  },

  getASite(id) {
    return axios.get(`${REST_ENDPOINT}admin/viewSite/${id}`);
  },
  deleteSite(id) {
    return axios.delete(`${REST_ENDPOINT}admin/deleteSite?siteId=${id}`);
  },
};

export const companyApi = {
  getCompany(id) {
    return axios.get(`${REST_ENDPOINT}admin/viewCompanies?id=${id}`);
  },
};

export const authApi = {
  login(username, password) {
    return axios.get(
      `${REST_ENDPOINT}auth/empLogin?username=${username}&password=${password}`
    );
  },
};
