import { StorageService } from "../config/storage";
import { API_ENDPOINTS } from "../constant/apiEndpoints";
import * as Http from "../https/fetchWrapper";
import { getHeaders } from "../utils/helperFunctions";

export const useUser = () => {

  const getBusinessPartners = async (token) => {
    try {
      const response = await Http.get(
        API_ENDPOINTS.user.businessPartnerList,
        getHeaders()
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return { getBusinessPartners };
}

