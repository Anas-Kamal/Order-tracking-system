import { createContext, useMemo, useReducer } from "react";
import { commonReducer } from "./reducer";
import { initialCommonState } from "./types";
import { useAuthHttp } from "../../hooks/useAuth";
import { useOrder } from "../../hooks/useOrder";
import { useUser } from "../../hooks/useUser";
import { useProduct } from "../../hooks/useProduct";
import { useShipping } from "../../hooks/useShipping";
// import { StorageService } from "../../config/storage";
// import { CustomToast } from "../../components/Toastr/Toastr";

const CommonContext = createContext();

// eslint-disable-next-line react/prop-types
function CommonContextProvider({ children }) {
  const [state] = useReducer(commonReducer, initialCommonState);
  const { orderList, orderCreate } = useOrder();
  const { getBusinessPartners } = useUser();
  const { productList } = useProduct();
  const { shippedMode } = useShipping();

  const AuthValue = useMemo(() => {
    const getAllOrder = async () => {
      const res = await orderList();
      return res;
    };

    const postOrderCreate = async (payload) => {
      const res = await orderCreate(payload);
      return res;
    };

    const businessPartnersList = async () => {
      const res = await getBusinessPartners();
      return res;
    };

    const getProductList = async () => {
      const res = await productList();
      return res;
    };

    const getShippedModeList = async () => {
      const res = await shippedMode();
      return res;
    };

    return {
      commonState: state,
      getAllOrder,
      businessPartnersList,
      getProductList,
      getShippedModeList,
      postOrderCreate
    };
  }, [state, orderList, getBusinessPartners, productList, shippedMode, orderCreate]);
  return (
    <CommonContext.Provider value={AuthValue}>
      {children}
    </CommonContext.Provider>
  );
}

export { CommonContext, CommonContextProvider };
