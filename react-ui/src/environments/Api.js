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
    return axios.get(`${REST_ENDPOINT}admin/viewCompany?id=${id}`);
  },
};

export const procurementApi = {
  acceptOrder(orderId, siteId) {
    return axios.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/accept/${orderId}/${siteId}`
    );
  },
  cancelOrder(orderId, siteId) {
    return axios.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/cancel/${orderId}/${siteId}`
    );
  },
  fulfillOrder(siteId, order) {
    return axios.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/fulfil/${siteId}`,
      order
    );
  },
  shipOrder(siteId, order) {
    return axios.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/ship/${siteId}`,
      order
    );
  },
};

export const vendorApi = {
  search(keyword) {
    return axios.get(`${REST_ENDPOINT}admin/viewVendors?search=${keyword}`);
  },
  generateItems(sku, quantity) {
    return axios.post(
      `${REST_ENDPOINT}sam/productItem/generate/${sku}/${quantity}`
    );
  },
};

export const stockTransferApi = {
  cancelOrder(orderId, siteId) {
    return axios.delete(
      `${REST_ENDPOINT}store/stockTransfer/cancel/${orderId}/${siteId}`
    );
  },
  editOrder(order, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/update/${siteId}`,
      order
    );
  },
  confirmOrder(orderId, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/confirm/${orderId}/${siteId}`
    );
  },
  rejectOrder(orderId, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/reject/${orderId}/${siteId}`
    );
  },
  readyOrder(order, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/ready/${siteId}`,
      order
    );
  },
  deliverOrder(order, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/deliver/${siteId}`,
      order
    );
  },
  completeOrder(orderId, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/complete/${orderId}/${siteId}`
    );
  },
};

export const authApi = {
  login(username, password) {
    return axios.get(
      `${REST_ENDPOINT}auth/empLogin?username=${username}&password=${password}`
    );
  },
};

export const posApi = {
  getOrders(siteId) {
    return axios.get(`${REST_ENDPOINT}/store/customerOrder/${siteId}`);
  },
};

export const employeeApi = {
  getEmployee(employeeId) {
    return axios.get(`${REST_ENDPOINT}admin/viewEmployee?id=${employeeId}`);
  },
  deleteEmployee(employeeId) {
    return axios.delete(`${REST_ENDPOINT}admin/deleteEmployee?id=${employeeId}`)
  }
};
