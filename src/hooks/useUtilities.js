import { StorageService } from "../config/storage";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import * as Http from "../https/fetchWrapper";
import { getHeaders } from "../utils/helperFunctions";

export const useUtilities = () => {
  const getCountryList = async () => {
    const response = await Http.get(
      API_ENDPOINTS.utilities.countryList,
      getHeaders(StorageService.getItem("accessToken"))
    );
    return response;
  };

  const getCountyList = async (countryId) => {
    const response = await Http.get(
      API_ENDPOINTS.utilities.countyList(countryId),
      getHeaders(StorageService.getItem("accessToken"))
    );
    return response;
  };

  const getStatesList = async (stateId) => {
    const response = await Http.get(
      API_ENDPOINTS.utilities.getStates(stateId),
      getHeaders(StorageService.getItem("accessToken"))
    );
    return response;
  };

  const getCitiesThruStateId = async (stateId) => {
    const response = await Http.get(
      API_ENDPOINTS.utilities.getCitiesByStateId(stateId),
      getHeaders(StorageService.getItem("accessToken"))
    );
    return response;
  };

  const getCityList = async (payload) => {
    const response = await Http.get(
      `${API_ENDPOINTS.utilities.cityList}?CountyId=${payload?.CountyId}&search=${payload?.search}&Page=${payload?.page}&PageSize=${payload?.pageSize}`,
      getHeaders(StorageService.getItem("accessToken"))

    );
    return response;
  };

  return { getCountryList, getCountyList, getCityList, getStatesList, getCitiesThruStateId };
};
