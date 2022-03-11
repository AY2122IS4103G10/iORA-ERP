/**
 * REST API connections
 */
import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

let axiosPrivate = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosPrivate.defaults.headers.common["Authorization"] =
    localStorage.getItem("accessToken");
}

export const axiosPublic = axios.create();

export const api = {
  getAll(path) {
    return axiosPrivate.get(`${REST_ENDPOINT}${path}`);
  },
  get(path, id) {
    return axiosPrivate.get(`${REST_ENDPOINT}${path}/${id}`);
  },
  create(path, item) {
    return axiosPrivate.post(`${REST_ENDPOINT}${path}`, item);
  },
  update(path, item) {
    return axiosPrivate.put(`${REST_ENDPOINT}${path}`, item);
  },
  delete(path, id) {
    return axiosPrivate.delete(`${REST_ENDPOINT}${path}/${id}`);
  },
};

export const voucherApi = {
  issue(id) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/voucher/issue/${id}`);
  },
  redeem(id) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/voucher/redeem/${id}`);
  },
};

export const sitesApi = {
  searchByType(siteType) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/viewSites/${siteType}?country=&company=`
    );
  },
  getAll() {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/viewSites/all`);
  },

  getASite(id) {
    return axiosPrivate.get(`${REST_ENDPOINT}admin/viewSite/${id}`);
  },
  deleteSite(id) {
    return axiosPrivate.delete(`${REST_ENDPOINT}admin/deleteSite?siteId=${id}`);
  },
};

export const companyApi = {
  getCompany(id) {
    return axiosPrivate.get(`${REST_ENDPOINT}admin/viewCompany?id=${id}`);
  },
  deleteCompany(id) {
    return axiosPrivate.delete(`${REST_ENDPOINT}admin/deleteCompany?id=${id}`);
  },
};

export const procurementApi = {
  acceptOrder(orderId, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/accept/${orderId}/${siteId}`
    );
  },
  cancelOrder(orderId, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/cancel/${orderId}/${siteId}`
    );
  },
  fulfillOrder(siteId, order) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/fulfil/${siteId}`,
      order
    );
  },
  shipOrder(siteId, order) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/ship/${siteId}`,
      order
    );
  },
};

export const vendorApi = {
  search(keyword) {
    return axiosPrivate.get(`${REST_ENDPOINT}admin/viewVendors?search=${keyword}`);
  },
  generateItems(sku, quantity) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}sam/productItem/generate/${sku}/${quantity}`
    );
  },
  delete(id) {
    return axiosPrivate.delete(`${REST_ENDPOINT}admin/deleteVendor?id=${id}`);
  },
};

export const stockLevelApi = {
  editStock(toUpdate, siteId) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}warehouse/editStock/${siteId}`,
      toUpdate
    );
  },
};

export const stockTransferApi = {
  cancelOrder(orderId, siteId) {
    return axiosPrivate.delete(
      `${REST_ENDPOINT}store/stockTransfer/cancel/${orderId}/${siteId}`
    );
  },
  editOrder(order, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/update/${siteId}`,
      order
    );
  },
  confirmOrder(orderId, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/confirm/${orderId}/${siteId}`
    );
  },
  rejectOrder(orderId, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/reject/${orderId}/${siteId}`
    );
  },
  readyOrder(order, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/ready/${siteId}`,
      order
    );
  },
  deliverOrder(order, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/deliver/${siteId}`,
      order
    );
  },
  completeOrder(order, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/complete/${siteId}`,
      order
    );
  },
};

export const authApi = {
  login(username, password) {
    return axiosPublic.get(
      `${REST_ENDPOINT}auth/empLogin?username=${username}&password=${password}`
    );
  },
  loginJwt(credentials) {
    return axiosPublic.post(`${REST_ENDPOINT}auth/login`, credentials);
  },
  postLoginJwt(accessToken) {
    return axiosPublic.get(`${REST_ENDPOINT}auth/postLogin`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },
  refreshTokenJwt(refreshToken) {
    return axiosPublic.get(`${REST_ENDPOINT}auth/refreshToken`, {
      headers: {
        Authorization: "Bearer " + refreshToken,
      },
    });
  },
};

export const posApi = {
  getOrders(siteId) {
    return axiosPrivate.get(`${REST_ENDPOINT}store/customerOrder/${siteId}?orderId=`);
  },
  addProductToLineItems(rfidsku, lineItems) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/add/${rfidsku}`,
      lineItems
    );
  },
  removeProductFromLineItems(rfidsku, lineItems) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/remove/${rfidsku}`,
      lineItems
    );
  },
  calculatePromotions(lineItems) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/calculate`,
      lineItems
    );
  },
};

export const employeeApi = {
  getEmployee(employeeId) {
    return axiosPrivate.get(`${REST_ENDPOINT}admin/viewEmployee?id=${employeeId}`);
  },
  deleteEmployee(employeeId) {
    return axiosPrivate.delete(
      `${REST_ENDPOINT}admin/deleteEmployee?id=${employeeId}`
    );
  },
  enableEmployee(employeeId) {
    return axiosPrivate.put(`${REST_ENDPOINT}admin/enableEmployee?id=${employeeId}`);
  },
  disableEmployee(employeeId) {
    return axiosPrivate.put(`${REST_ENDPOINT}admin/disableEmployee?id=${employeeId}`);
  },
};

export const customerApi = {
  blockCustomer(customerId) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/customer/block/${customerId}`);
  },
  unblockCustomer(customerId) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/customer/unblock/${customerId}`);
  },
};

export const departmentApi = {
  getDepartment(id) {
    return axiosPrivate.get(`${REST_ENDPOINT}admin/viewDepartment?id=${id}`);
  },
  deleteDepartment(id) {
    return axiosPrivate.delete(`${REST_ENDPOINT}admin/deleteDepartment?id=${id}`);
  },
};

export const productApi = {
  searchProductsBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/product?sku=${sku}`);
  },
};

export const onlineOrderApi = {
  getAll() {
    return axios.get(`${REST_ENDPOINT}sam/onlineOrder?orderId=`)
  },
  get(orderId) {
    return axios.get(`${REST_ENDPOINT}sam/onlineOrder?orderId=${orderId}`)
  },
  getAllBySite(siteId) {
    return axios.get(`${REST_ENDPOINT}sam/onlineOrder/${siteId}?orderId=`)
  }
}

export const orderApi = {
  getAll() {
    return axios.get(`${REST_ENDPOINT}store/customerOrder?orderId=`)
  },
  get(orderId) {
    return axios.get(`${REST_ENDPOINT}store/customerOrder/view/${orderId}`)
  },
}
