/* eslint-disable no-undef */
export const BaseUrl = "https://www.otmsapi.somee.com/" + "api";
// export const BaseAuthUrl = process.env.REACT_APP_AUTH_URL;
// export const BaseAdminAuthUrl = process.env.REACT_APP_ADMIN_AUTH_URL + 'api';
// export const BaseImageUrl = process.env.REACT_APP_IMAGE_URL;
// export const BaseUrlChat = process.env.REACT_APP_API_URL;

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;
export const PHONENO_REGEX =
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
export const API_ENDPOINTS = {
  auth: {
    login: "/Account/LoginVerification",
  },
  order: {
    getAllList: "/Order/GetOrderList",
    getOrderDetails: "/Order/GetOrderDetailsList",
    createOrder: '/Order/OrderCreate'
  },
  shippingMethod: {
    getAll: "/Order/GetShippingModesList",
  },
  user: {
    businessPartnerList: "/BusinessPartner/GetBusinessPartnerList",
  },
  product: {
    getAll: "/Product/GetProductList",
  },
};
