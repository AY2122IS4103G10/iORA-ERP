import axios from "axios";
import { REST_ENDPOINT } from "../constants/restEndpoint.js";

let axiosPrivate = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosPrivate.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

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

export const authApi = {
  login(email, password) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/loginOld?email=${email}&password=${password}`
    );
  },
  loginJwt(credentials) {
    return axiosPublic.post(`${REST_ENDPOINT}online/login`, credentials);
  },
  postLoginJwt(accessToken) {
    return axiosPublic.get(`${REST_ENDPOINT}online/postLogin`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },
  refreshTokenJwt(refreshToken) {
    return axiosPublic.get(`${REST_ENDPOINT}online/refreshToken`, {
      headers: {
        Authorization: "Bearer " + refreshToken,
      },
    });
  },
  register(user) {
    return axiosPublic.post(`${REST_ENDPOINT}online/register`, user);
  },
};

export const listingApi = {
  getListingByLineAndTag(line, tag) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/model/tag/${line}/${tag}`
    );
  },
  getListingByLine(line) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/model/tag/${line}`
    );
  },

  getListingByCategory(cat) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/model/category/${cat}`
    );
  },

  getModel(modelCode) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/model/${modelCode}`
    );
  },
  getProductStock(sku) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/viewStock/product/${sku}`
    );
  },

  getModelsBySKUList(skuList) {
    return axiosPublic.post(
      `${REST_ENDPOINT}online/public/model/skulist`,
      skuList
    );
  }
}

export const checkoutApi = {
  calculatePromotions(lineItems) {
    return axiosPublic.post(
      `${REST_ENDPOINT}online/public/customerOrder/calculate`,
      lineItems
    );
  },
  applyVoucher(code) {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/voucher/apply?code=${code}`,
    )
  },
  getStores() {
    return axiosPublic.get(
      `${REST_ENDPOINT}online/public/stores/singapore`,
    )
  }, 
  createPaymentIntent(totalAmount, isDelivery) {
    return axiosPublic.post(
      `${REST_ENDPOINT}online/public/pay/${totalAmount}/${isDelivery}`,
      totalAmount
    )
  },
  createOnlineOrder(onlineOrder, paymentIntentId) {
    return axiosPublic.post(
      `${REST_ENDPOINT}online/public/create?paymentIntentId=${paymentIntentId}`,
      onlineOrder
    )
  }
}

export const purchasesApi = {
  getOrder(id) {
    return axiosPrivate.get(
      `${REST_ENDPOINT}online/order/${id}`,
    )
  }
}

export const ticketApi = {
  resolveTicket(ticketId) {
    return axiosPrivate.put(`${REST_ENDPOINT}online/ticket/resolve/${ticketId}`);
  }
}

export const productApi = {
  getModelBySku(sku) {
    return axiosPrivate.get(`${REST_ENDPOINT}sam/model/name/${sku}`);
  },
};

export const onlineOrderApi = {
  cancelOrder(orderId, customerId) {
    return axiosPrivate.put(`${REST_ENDPOINT}online/customer/cancel/${orderId}/${customerId}`)
  },
  completeOrder(orderId) {
    return axiosPrivate.put(`${REST_ENDPOINT}online/deliver/simulateDelivered/${orderId}`)
  }
}