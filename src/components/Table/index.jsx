import React from "react";
import { useNavigate } from "react-router-dom";

export const CustomTable = ({ data }) => {
  const router = useNavigate();

  const onHandleClick = (orderDetials) => {
    router("CreateOrder", { state: { orderDetials } });
  };
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order Id
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="text-right px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Required Date
                </th>
                <th className="text-right px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shipped Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Supplier Info
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shipped Info
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shipping Mode
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th> */}
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody>
              {data?.map((order, index) => (
                <tr className="hover:bg-slate-400 cursor-pointer" key={index} onClick={() => onHandleClick(order)}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap text-xs">
                          {order?.orderId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs">
                      {order?.orderDate === "string" ? "---" : order?.orderDate}
                    </p>
                    {/* <p className="text-gray-600 whitespace-no-wrap">
                      {invoice.currency}
                    </p> */}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs">
                      {order?.requiredDate === "string"
                        ? "---"
                        : order?.requiredDate}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs">
                      {order?.shippedDate === "string"
                        ? "---"
                        : order?.shippedDate}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs">
                      {order?.customer?.name}
                    </p>
                    {order?.customer?.addresses.length ? (
                      <p className="text-gray-600 whitespace-no-wrap text-xs">
                        <span className="text-xs text-gray-400">Address. </span>
                        {`${order?.customer?.addresses[0]?.postalCode}, ${order?.customer?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs">
                      {order?.supplier?.name}
                    </p>
                    {order?.supplier?.addresses.length ? (
                      <p className="text-gray-600 whitespace-no-wrap text-xs">
                        <span className="text-xs text-gray-400">Address. </span>
                        {`${order?.supplier?.addresses[0]?.postalCode}, ${order?.supplier?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs">
                      {order?.shipper?.name}
                    </p>
                    {order?.shipper?.addresses.length ? (
                      <p className="text-gray-600 whitespace-no-wrap text-xs">
                        <span className="text-xs text-gray-400">Address. </span>
                        {`${order?.shipper?.addresses[0]?.postalCode}, ${order?.shipper?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-xs text-center">
                      {order?.shippingMode?.mode}
                    </p>
                  </td>
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    <button
                      type="button"
                      className="inline-block text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="inline-block h-6 w-6 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" />
                      </svg>
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
