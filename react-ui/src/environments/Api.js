/**
 * REST API connections
 */
import axios from "axios";
import { IMGBB_SECRET } from "../config";
import { REST_ENDPOINT } from "../constants/restEndpoint";

let axiosPrivate = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosPrivate.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

export const updateAccessToken = (accessToken) => {
  axiosPrivate.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
};

let axiosPublic = axios.create();

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
  pickPackAtFactory(orderId, sku, qty) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}manufacturing/procurementOrder/${orderId}/${sku}/${qty}`
    );
  },
  adjustAtWarehouse(orderId, sku, qty) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}warehouse/procurementOrder/${orderId}/${sku}/${qty}`
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
  scanReceive(orderId, barcode) {
    return axiosPrivate.patch(
      `${REST_ENDPOINT}store/stockTransfer/scanTo/${orderId}?barcode=${barcode}`
    );
  },
  readyOrder(order, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/ready/${siteId}`,
      order
    );
  },
  deliverOrder(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/deliver/${orderId}`
    );
  },
  deliverMultiple(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/deliverMultiple/${orderId}`
    );
  },
  completeOrder(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/complete/${orderId}`
    );
  },
  adjustAtFrom(orderId, sku, qty) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/from/${orderId}/${sku}/${qty}`
    );
  },
  adjustAtTo(orderId, sku, qty) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}store/stockTransfer/to/${orderId}/${sku}/${qty}`
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
  isUsernameAvailable(username) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}auth/usernameAvailable/${username}`
    );
  },
  updateProfile(details) {
    return axiosPrivate.put(`${REST_ENDPOINT}auth/editProfile`, details);
  },
  changePassword(details) {
    return axiosPrivate.put(`${REST_ENDPOINT}auth/changePassword`, details);
  },
  resetPassword(details) {
    return axiosPublic.post(`${REST_ENDPOINT}auth/resetPassword`, details);
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
  resetOwnPassword(email) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}admin/resetPassword?email=${email}`
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

export const ticketApi = {
  resolveTicket(ticketId) {
    return axiosPrivate.put(`${REST_ENDPOINT}sam/ticket/resolve/${ticketId}`);
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
  getProductBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/product/${sku}`);
  },
  searchProductBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/product?sku=${sku}`);
  },
  searchProductsBySku(skus) {
    return axiosPrivate.post(`${REST_ENDPOINT}sam/products`, skus);
  },
  getModelBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/model/name/${sku}`);
  },
  getModelByModelCode(modelCode) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/model/${modelCode}`);
  },
  generateRFIDs(map) {
    return axiosPrivate.post(`${REST_ENDPOINT}warehouse/generateRFID`, map);
  },
};

export const onlineOrderApi = {
  getAll() {
    return axiosPrivate.get(`${REST_ENDPOINT}store/onlineOrder?orderId=`);
  },
  getAllPickupOfSite(siteId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/onlineOrder/pickup/${siteId}`
    );
  },
  get(orderId) {
    return axiosPrivate.get(`${REST_ENDPOINT}online/order/${orderId}`);
  },
  getAllBySite(siteId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}online/searchOrder/${siteId}?orderId=`
    );
  },
  getPaymentIntent(lineItems, voucherAmt) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}online/pay?amt=${voucherAmt}`,
      lineItems
    );
  },
  pickPack(orderId, siteId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}online/pickpack/${orderId}/${siteId}`
    );
  },
  scanItem(orderId, barcode) {
    return axiosPrivate.patch(
      `${REST_ENDPOINT}online/scan/${orderId}?barcode=${barcode}`
    );
  },
  deliverOrder(orderId) {
    return axiosPrivate.put(`${REST_ENDPOINT}online/deliver/${orderId}`);
  },
  deliverMultiple(orderId) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}online/deliverMultiple/${orderId}`
    );
  },
  receive(orderId, siteId) {
    return axiosPrivate.put(`${REST_ENDPOINT}online/deliver/${orderId}/${siteId}`);
  },
  collect(orderId) {
    return axiosPrivate.put(`${REST_ENDPOINT}online/collect/${orderId}`);
  },
  adjustProduct(orderId, sku, qty) {
    return axiosPrivate.put(
      `${REST_ENDPOINT}online/order/${orderId}/${sku}/${qty}`
    );
  },
};

export const orderApi = {
  getAll() {
    return axiosPrivate.get(`${REST_ENDPOINT}store/customerOrder?orderId=`);
  },
  getAllOnline() {
    return axiosPrivate.get(`${REST_ENDPOINT}store/onlineOrder?orderId=`);
  },
  getAllStore() {
    return axiosPrivate.get(`${REST_ENDPOINT}store/storeOrder?orderId=`);
  },
  get(orderId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/customerOrder/view/${orderId}`
    );
  },
  createOrder(order, paymentIntentId) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/create?clientSecret=${paymentIntentId}`,
      order
    );
  },
};

export const posApi = {
  getOrder(orderId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/customerOrder/view/${orderId}`
    );
  },
  getOrders(siteId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/customerOrder/${siteId}?orderId=`
    );
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
  connectToken() {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/connectionToken`
    );
  },
  getPaymentIntent(lineItems, voucherAmt) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/pay?amt=${voucherAmt}`,
      lineItems
    );
  },
  getVoucherByCode(voucher) {
    return axiosPrivate.get(`${REST_ENDPOINT}store/voucher/${voucher}`);
  },
  addRefundLineItem(orderId, refundLI, refundAmount) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/refund/${orderId}${
        `?refundAmount=${refundAmount}` || ""
      }`,
      refundLI
    );
  },
  addExchangeLineItem(orderId, exchangeLI) {
    return axiosPrivate.post(
      `${REST_ENDPOINT}store/customerOrder/exchange/${orderId}`,
      exchangeLI
    );
  },
  searchSku(sku) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/customerOrder/product?sku=${sku}`
    );
  },
  getVoucherCodes(customerId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/member/vouchers/${customerId}`
    );
  },
  getCurrentSpending(customerId) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}store/member/spending/${customerId}`
    );
  },
};

export const logisticsApi = {
  getSTOBySiteStatus(siteId, status) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}logistics/stockTransfer/${siteId}/${status}`
    );
  },
  getPOBySiteStatus(siteId, status) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}logistics/procurementOrder/${siteId}/${status}`
    );
  },
};

export const utilApi = {
  uploadImage(image) {
    return axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_SECRET}`,
      image
    );
  },
};
export const dashboardApi = {
  getStockLevelSites() {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/viewSites/all`);
  },
  getCustomerOrders({ startDate, endDate }) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/dashboard/customerOrders?start=${startDate}&end=${endDate}`
    );
  },
  getStoreOrders({ startDate, endDate }) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/dashboard/storeOrders?start=${startDate}&end=${endDate}`
    );
  },
  getOnlineOrders({ startDate, endDate }) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/dashboard/onlineOrders?start=${startDate}&end=${endDate}`
    );
  },
  getCustomerOrdersOfSite(siteId, date = "") {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/dashboard/customerOrders/${siteId}?date=${date}`
    );
  },
  getProcurementOrdersOfSite(siteId, date = "") {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/dashboard/procurementOrders/${siteId}?date=${date}`
    );
  },
  getStockTransferOrdersOfSite(siteId, date = "") {
    return axiosPrivate.get(
      `${REST_ENDPOINT}sam/dashboard/stockTransferOrders/${siteId}?date=${date}`
    );
  },
};
