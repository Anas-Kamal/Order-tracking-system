import { API_ENDPOINTS } from "../constant/apiEndpoints";
import * as Http from "../https/fetchWrapper";
import { getHeaders } from "../utils/helperFunctions";
export const useAuthHttp = () => {
  const loginUser = async (name, password) => {
    const response = await Http.get(
      `${API_ENDPOINTS.auth.login}?Username=${name}&Password=${password}`,
      getHeaders(),
    );
    return response;
  };
  

  return { loginUser };
};
