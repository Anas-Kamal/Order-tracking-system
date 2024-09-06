import React from "react";
import TrashIcon from "../../assets/icons/TrashIcon";

export const OrderLinesTable = ({ data, onHandleChange, onHandleDelete }) => {
  return (
    <div className="container mx-auto  ">
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-1 overflow-x-auto">
        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  S.No.
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-right px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unit Price
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Discount
                </th> */}
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Net Price
                </th>
                {onHandleDelete ? (
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {data?.map((order, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {index < 10 ? "0" + (index + 1) : index + 1}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order?.productName || order?.product?.productName}
                    </p>
                    {/* <p className="text-gray-600 whitespace-no-wrap">
                      {invoice.currency}
                    </p> */}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order?.productCategory?.name || order?.product?.productCategory?.name}
                    </p>
                  </td>
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order?.product?.productCategory?.description}
                    </p>
                  </td> */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-right">
                      {onHandleChange ? (
                        <input
                          type="number"
                          className="w-10 text-black border outline-none p-1 text-xs"
                          name="orderQty"
                          value={order?.orderQty ?? 1}
                          onChange={(e) => onHandleChange(e, index)}
                        />
                      ) : (
                        order?.orderQty ?? 1
                      )}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-right">
                      ${order?.unitPrice?.toFixed(2)}
                    </p>
                  </td>
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-right">
                      0.00
                    </p>
                  </td> */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap text-right">
                      $
                      {(
                        (order?.unitPrice?.toFixed(2)) *
                        (order?.orderQty ?? 1)
                      ).toFixed(2)}
                    </p>
                  </td>
                  {onHandleDelete ? (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span onClick={() => onHandleDelete(index)}>
                        <svg
                          className="w-4 h-4 cursor-pointer text-primary-color"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 20"
                        >
                          <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                        </svg>
                      </span>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
