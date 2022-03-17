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
  issue(code, id) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/voucher/issue/${code}/${id}`);
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
  getSiteSAM(id) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/viewSite/${id}`);
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
  deleteOrder(orderId, siteId) {
    return axiosPrivate.delete(
      `${REST_ENDPOINT}sam/procurementOrder/delete/${orderId}/${siteId}`
    );
  },
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
  manufactureOrder(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/manu/${orderId}`
    );
  },
  pickPack(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/pickpack/${orderId}`
    );
  },
  scanItem(orderId, barcode) {
    return axiosPrivate.patch(
      `${REST_ENDPOINT}manufacturing/procurementOrder/scan/${orderId}?barcode=${barcode}`
    );
  },
  shipOrder(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/ship/${orderId}`
    );
  },
  shipMultiple(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/shipMultiple/${orderId}`
    );
  },
  scanReceive(orderId, barcode) {
    return axiosPrivate.patch(
      `${REST_ENDPOINT}warehouse/procurementOrder/scan/${orderId}?barcode=${barcode}`
    );
  },
};

export const vendorApi = {
  search(keyword) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}admin/viewVendors?search=${keyword}`
    );
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
  editStock(sku, qty, siteId) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}warehouse/editStock/${siteId}/${sku}/${qty}`
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
  pickPack(orderId, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/pickpack/${orderId}/${siteId}`
    );
  },
  scanItem(orderId, barcode) {
    return axiosPrivate.patch(
      `${REST_ENDPOINT}store/stockTransfer/scanFrom/${orderId}?barcode=${barcode}`
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

export const employeeApi = {
  getEmployee(employeeId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}admin/viewEmployee?id=${employeeId}`
    );
  },
  deleteEmployee(employeeId) {
    return axiosPrivate.delete(
      `${REST_ENDPOINT}admin/deleteEmployee?id=${employeeId}`
    );
  },
  enableEmployee(employeeId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}admin/enableEmployee?id=${employeeId}`
    );
  },
  disableEmployee(employeeId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}admin/disableEmployee?id=${employeeId}`
    );
  },
};

export const customerApi = {
  blockCustomer(customerId) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/customer/block/${customerId}`);
  },
  unblockCustomer(customerId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}sam/customer/unblock/${customerId}`
    );
  },
};

export const departmentApi = {
  getDepartment(id) {
    return axiosPrivate.get(`${REST_ENDPOINT}admin/viewDepartment?id=${id}`);
  },
  deleteDepartment(id) {
    return axiosPrivate.delete(
      `${REST_ENDPOINT}admin/deleteDepartment?id=${id}`
    );
  },
};

export const productApi = {
  searchProductBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/product?sku=${sku}`);
  },
  searchProductsBySku(skus) {
    return axiosPrivate.post(`${REST_ENDPOINT}sam/products`, skus);
  },
  getModelBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/model/name/${sku}`);
  },
};

export const onlineOrderApi = {
  getAll() {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/onlineOrder?orderId=`);
  },
  get(orderId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/onlineOrder?orderId=${orderId}`
    );
  },
  getAllBySite(siteId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}online/searchOrder/${siteId}?orderId=`
    );
  },
  getPaymentIntent(lineItems) {
    return axiosPublic.post(`${REST_ENDPOINT}online/pay`, lineItems);
  },
};

export const orderApi = {
  getAll() {
    return axiosPrivate.get(`${REST_ENDPOINT}store/customerOrder?orderId=`);
  },
  get(orderId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/customerOrder/view/${orderId}`
    );
  },
  createOrder(order) {
    return axiosPublic.post(
      `${REST_ENDPOINT}store/customerOrder/create`,
      order
    );
  },
};

export const posApi = {
  getOrders(siteId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/customerOrder/${siteId}?orderId=`
    );
  },
  addProductToLineItems(rfidsku, lineItems) {
    return axiosPublic.post(
      `${REST_ENDPOINT}store/customerOrder/add/${rfidsku}`,
      lineItems
    );
  },
  removeProductFromLineItems(rfidsku, lineItems) {
    return axiosPublic.post(
      `${REST_ENDPOINT}store/customerOrder/remove/${rfidsku}`,
      lineItems
    );
  },
  calculatePromotions(lineItems) {
    return axiosPublic.post(
      `${REST_ENDPOINT}store/customerOrder/calculate`,
      lineItems
    );
  },
  connectToken() {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/connectionToken`
    )
  }
};
