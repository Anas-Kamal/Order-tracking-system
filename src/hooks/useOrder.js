import { API_ENDPOINTS } from "../constant/apiEndpoints";
import * as Http from "../https/fetchWrapper";
import { getHeaders } from "../utils/helperFunctions";
export const useOrder = () => {
  const orderList = async () => {
    const response = await Http.get(
      `${API_ENDPOINTS.order.getAllList}`,
      getHeaders(),
    );
    return response;
  };

  const orderCreate = async (payload) => {
    const response = await Http.post(
      `${API_ENDPOINTS.order.createOrder}`,
      payload,
      getHeaders(),
    );
    return response;
  };
  

  return { orderList, orderCreate };
};
