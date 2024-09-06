import { API_ENDPOINTS } from "../constant/apiEndpoints";
import * as Http from "../https/fetchWrapper";
import { getHeaders } from "../utils/helperFunctions";
export const useProduct = () => {
  const productList = async () => {
    const response = await Http.get(
      `${API_ENDPOINTS.product.getAll}`,
      getHeaders(),
    );
    return response;
  };
  

  return { productList };
};
