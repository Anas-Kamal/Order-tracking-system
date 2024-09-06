import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  CustomTable,
  OrderHeader,
  Product,
} from "../../components";
import { CommonContext } from "../../context/common";
import { useNavigate } from "react-router-dom";

export const ProductScreen = () => {
  const { getAllOrder } = useContext(CommonContext);
  const [ordersList, setOrdersList] = useState();
  const router = useNavigate();

  const fetchAll = useCallback(async () => {
    const allOrderRes = await getAllOrder();
    if (allOrderRes.ok) {
      setOrdersList(allOrderRes?.body?.orders);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);
  return (
    <React.Fragment>
      <div className="fixed bottom-6 right-6 z-50 ">
        <button
          onClick={() => router("createProduct")}
          className="text-white px-4 w-auto h-12 bg-primary-color rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
        >
          <svg
            viewBox="0 0 20 20"
            enable-background="new 0 0 20 20"
            class="w-6 h-6 inline-block"
          >
            <path
              fill="#FFFFFF"
              d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z"
            />
          </svg>
          <span>Create New Product</span>
        </button>
      </div>
      <div className="flex  flex-wrap flex-1 gap-6 justify-center items-center py-10">
        {["", "", "", "", "", "", "", "", "", "", "", ""].map(() => (
          <Product />
        ))}
      </div>
      {/* <CustomTable data={ordersList} /> */}
    </React.Fragment>
  );
};
