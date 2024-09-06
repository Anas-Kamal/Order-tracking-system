import { API_ENDPOINTS } from "../constant/apiEndpoints";
import * as Http from "../https/fetchWrapper";
import { getHeaders } from "../utils/helperFunctions";
export const useShipping = () => {
  const shippedMode = async () => {
    const response = await Http.get(
      `${API_ENDPOINTS.shippingMethod.getAll}`,
      getHeaders(),
    );
    return response;
  };
  

  return { shippedMode };
};
