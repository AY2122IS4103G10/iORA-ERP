/**
 * REST API connections
 */
import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint";

// const accessToken = localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : "";

// axios.defaults.baseURL = REST_ENDPOINT;

// export const axiosPrivate = axios.create({
//   baseUrl: REST_ENDPOINT,
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true
// });

// axiosPrivate.interceptors.request.use(
//   config => {
//       if (!config.headers['Authorization']) {
//           config.headers['Authorization'] = `Bearer ${accessToken}`
//       }
//       return config;
//   }, (error) => Promise.reject(error)
// )

// axiosPrivate.interceptors.response.use(
//   response => response,
//   async (error) => {
//       const prevRequest = error?.config;
//       if (error?.response?.status === 403 && !prevRequest?.sent) {
//           prevRequest.sent = true;
//           const tokenResponse = await axiosPublic.get("/api/refreshToken", {
//             withCredentials: true,
//           });
//           const newAccessToken = tokenResponse.data.accessToken;
//           prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return axiosPrivate(prevRequest);
//       }
//       return Promise.reject(error);
//   }
// )

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
  deleteCompany(id) {
    return axios.delete(`${REST_ENDPOINT}admin/deleteCompany?id=${id}`);
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
  delete(id) {
    return axios.delete(`${REST_ENDPOINT}admin/deleteVendor?id=${id}`);
  },
};

export const stockLevelApi = {
  editStock(toUpdate, siteId) {
    return axios.post(
      `${REST_ENDPOINT}warehouse/editStock/${siteId}`,
      toUpdate
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
  completeOrder(order, siteId) {
    return axios.put(
      `${REST_ENDPOINT}store/stockTransfer/complete/${siteId}`,
      order
    );
  },
};

export const authApi = {
  login(username, password) {
    return axios.get(
      `${REST_ENDPOINT}auth/empLogin?username=${username}&password=${password}`
    );
  },
  // loginJwt(credentials) {
  //   return axios.post('/auth/login', credentials);
  // }
};

export const posApi = {
  getOrders(siteId) {
    return axios.get(`${REST_ENDPOINT}store/customerOrder/${siteId}`);
  },
  addProductToLineItems(rfidsku, lineItems) {
    return axios.post(`${REST_ENDPOINT}store/customerOrder/add/${rfidsku}`, lineItems);
  },
  removeProductFromLineItems(rfidsku, lineItems) {
    return axios.post(`${REST_ENDPOINT}store/customerOrder/remove/${rfidsku}`, lineItems);
  },
  calculatePromotions(lineItems) {
    return axios.post(`${REST_ENDPOINT}store/customerOrder/calculate`, lineItems);
  }
};

export const employeeApi = {
  getEmployee(employeeId) {
    return axios.get(`${REST_ENDPOINT}admin/viewEmployee?id=${employeeId}`);
  },
  deleteEmployee(employeeId) {
    return axios.delete(
      `${REST_ENDPOINT}admin/deleteEmployee?id=${employeeId}`
    );
  },
  enableEmployee(employeeId) {
    return axios.put(`${REST_ENDPOINT}admin/enableEmployee?id=${employeeId}`);
  },
  disableEmployee(employeeId) {
    return axios.put(`${REST_ENDPOINT}admin/disableEmployee?id=${employeeId}`);
  },
};

export const customerApi = {
  blockCustomer(customerId) {
    return axios.put(`${REST_ENDPOINT}sam/customer/block/${customerId}`);
  },
  unblockCustomer(customerId) {
    return axios.put(`${REST_ENDPOINT}sam/customer/unblock/${customerId}`);
  },
};

export const departmentApi = {
  getDepartment(id) {
    return axios.get(`${REST_ENDPOINT}admin/viewDepartment?id=${id}`);
  },
  deleteDepartment(id) {
    return axios.delete(`${REST_ENDPOINT}admin/deleteDepartment?id=${id}`);
  },
};

export const productApi = {
  searchProductsBySku(sku) {
    return axios.get(`${REST_ENDPOINT}sam/product?sku=${sku}`);
  },
};
