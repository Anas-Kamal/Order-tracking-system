import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, orderCreateSchema } from "../../constant/schema";
import { CommonContext } from "../../context/common";
import { CustomTable } from "../Table";
import { OrderLinesTable } from "../Table/orderLines";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ErrorText } from "../TextBox";
import { Statuses } from "../../constant";
import { COLOR } from "../../constant/Color";

// import { ErrorText } from "../components";

export const OrderForm = ({ editData }) => {
  const [orderEditInfo] = useState(editData?.orderDetials ?? false);
  const [cus, setCus] = useState([]);
  const [sup, setSup] = useState([]);
  const [ship, setShip] = useState([]);
  const [insp, setInsp] = useState([]);
  const [logis, setLogis] = useState([]);
  const [prod, setProd] = useState([]);
  const [shipModes, setShipMode] = useState([]);
  const [orderLines, setOrderLines] = useState([]);
  const [newProduct, setNewProduct] = useState(false);
  const [currCust, setCurrCust] = useState();
  const [currSup, setCurrSup] = useState();
  const [currentImporter, setCurrentImporter] = useState();
  const [currRetailer, setCurrRetailer] = useState();
  const [currInspection, setCurrInspection] = useState();
  const [currShip, setCurrShip] = useState();
  const [selectedTab, setSelectedTab] = useState(1);

  const [importerId, setImporterId] = useState(null);

  const tabs = [
    { name: "Order Line", id: 1 },
    { name: "Shipping Mark ", id: 2 },
  ];
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderCreateSchema),
  });
  const customerID = watch("customerId");
  const supplierID = watch("supplierId");
  const shipperID = watch("shipperId");
  // const importerID = watch("shipperId");
  const router = useNavigate();
  const {
    businessPartnersList,
    getProductList,
    getShippedModeList,
    postOrderCreate,
  } = useContext(CommonContext);
  const onHandleSubmit = async (data) => {
    const shAdd = cus.find((a) => a.businessPartnerId == data?.customerId);
    const obj = {
      customerId: +data.customerId,
      supplierId: +data.supplierId,
      shipperId: +data.shipperId,
      orderDate: dayjs().format("YYYY-MM-DD").toString(),
      requiredDate: dayjs(data.requiredDate).format("YYYY-MM-DD").toString(),
      shippedDate: dayjs(data.shippedDate).format("YYYY-MM-DD").toString(),
      shippingModeId: +data.shippingModeId,
      freight: 0,
      shpdAddrId: shAdd?.addresses.length ? shAdd?.addresses[0]?.addressId : 0,
      //   salesRepId: 0,
      createdOn: dayjs().format("YYYY-MM-DD").toString(),
      //   createdBy: 0,
      modifiedOn: dayjs().format("YYYY-MM-DD").toString(),
      //   modifiedBy: 0,
      isActive: true,
      orderDetails: orderLines.map((v, i) => {
        const itemNo = i < 10 ? "0" + (i + 1) : i + 1;
        return {
          itemNo: +itemNo,
          productId: +v.productId,
          unitPrice: +v.unitPrice,
          uomId: +v.uomId,
          orderQty: +v.orderQty,
          divQty: 0,
          discount: 0,
          totalBfrDisc: 0,
          netTotal: +(v.unitPrice * v.orderQty),
        };
      }),
    };
    const res = await postOrderCreate(obj);
    if (res?.body?.status === "201") {
      alert("Order Created Successfully!");
      router("/orders");
    } else {
      alert(res?.body?.message);
    }
  };

  const fetchAll = useCallback(async () => {
    const bpListRes = await businessPartnersList();
    const prodListRes = await getProductList();
    const shipModeListRes = await getShippedModeList();
    if (bpListRes.ok) {
      const bpList = bpListRes?.body?.businessPartners;
      setCus(bpList.filter((b) => b.bpTypeId === 1));
      setSup(bpList.filter((b) => b.bpTypeId === 2));
      setShip(bpList.filter((b) => b.bpTypeId === 3));
    }
    if (prodListRes.ok) {
      const prodList = prodListRes?.body?.products;
      setProd(prodList);
    }
    if (shipModeListRes.ok) {
      const shipModeList = shipModeListRes?.body?.shippingModes;
      setShipMode(shipModeList);
    }
  }, []);

  const onHandleChange = (e, lable, ind) => {
    const { name, value, type } = e.target;
    console.log({ name, value, type });
    switch (lable) {
      case "product":
        setNewProduct(false);
        orderLines.push(prod.find((p) => p?.productId == value));
        break;
      case "orderlines":
        const temp = [...orderLines];
        if (type === "number") {
          temp[ind][name] = value < 0 ? 0 : value;
        } else {
          temp[ind][name] = value;
        }
        setOrderLines(temp);
        break;
    }
  };

  const onHandleDelete = (ind) => {
    const temp = [...orderLines];
    temp.splice(ind, 1);
    setOrderLines(temp);
  };

  useEffect(() => {
    if (customerID) {
      setCurrCust(cus.find((c) => c.businessPartnerId == customerID));
    }
  }, [customerID]);
  useEffect(() => {
    if (importerId) {
      setCurrentImporter(cus.find((c) => c.businessPartnerId == importerId));
    }
  }, [importerId]);
  useEffect(() => {
    if (supplierID) {
      setCurrSup(sup.find((c) => c.businessPartnerId == supplierID));
    }
  }, [supplierID]);
  useEffect(() => {
    if (shipperID) {
      setCurrShip(ship.find((c) => c.businessPartnerId == shipperID));
    }
  }, [shipperID]);

  useEffect(() => {
    fetchAll();
  }, []);

  if (orderEditInfo) {
    return (
      <div className="bg-secondary2-color p-7">
        <form className=" bg-white p-7 rounded-xl ">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex items-center justify-between gap-x-6">
                <h1 className="text-2xl text-primary-color font-bold leading-3 ">
                  Order Details
                </h1>
                <div className="flex gap-4">
                  <h1>Status: </h1>
                  <div className="flex  justify-between items-start ">
                    {Statuses.map((s, i) => (
                      <p
                        key={s.id}
                        className="flex flex-col items-center relative"
                      >
                        {i === orderEditInfo?.orderStatuses.length - 1 && (
                          <div className="absolute bottom-0  w-20 border-2 border-red-400" />
                        )}
                        <span
                          className={`${s.bg} ${s.fg} text-xs font-medium  px-2.5 py-0.5`}
                        >
                          {s.name}
                        </span>
                        <span className=" bg-white text-black text-xs1 font-extralight mr-  px-2.5 py-0.5">
                          {orderEditInfo?.orderStatuses.find(
                            (v) => v.statusId === s.id
                          )?.orderStatusDate || null}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Customers Info.
                  </label>
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color">Name: </span>
                      {orderEditInfo.customer?.name}
                    </p>
                    {orderEditInfo?.customer?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color">Address: </span>
                        {`${orderEditInfo?.customer?.addresses[0]?.postalCode}, ${orderEditInfo?.customer?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Suppliers Info.
                  </label>
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color">Name: </span>
                      {orderEditInfo.supplier?.name}
                    </p>
                    {orderEditInfo?.supplier?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color">Address: </span>
                        {`${orderEditInfo?.supplier?.addresses[0]?.postalCode}, ${orderEditInfo?.supplier?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Shipper Info.
                  </label>
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color">Name: </span>
                      {orderEditInfo.shipper?.name}
                    </p>
                    {orderEditInfo?.shipper?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color">Address: </span>
                        {`${orderEditInfo?.shipper?.addresses[0]?.postalCode}, ${orderEditInfo?.shipper?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                    <p className="text-xs">
                      <span className="text-primary-color">
                        Shipping mode:{" "}
                      </span>
                      {orderEditInfo.shippingMode?.mode}
                    </p>
                    <p className="text-xs">
                      <span className="text-primary-color">
                        Shipping Date:{" "}
                      </span>
                      {orderEditInfo.shippedDate}
                    </p>
                  </div>
                </div>
                {orderEditInfo?.salesRep && (
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Agent Info.
                    </label>
                    <div className="mt-2">
                      <p className="text-xs">
                        <span className="text-primary-color">Name: </span>
                        {orderEditInfo.salesRep?.firstName}{" "}
                        {orderEditInfo.salesRep?.lastName}
                      </p>
                      <p className="text-xs">
                        <span className="text-primary-color">DOB: </span>
                        {orderEditInfo.salesRep?.birthDate}
                      </p>
                      <p className="text-xs">
                        <span className="text-primary-color">Title: </span>
                        {orderEditInfo.salesRep?.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Order Lines
              </h2>
              <div className="mt-1 ">
                <OrderLinesTable data={orderEditInfo?.orderDetails} />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-secondary2-color p-7">
      <form
        className=" bg-white p-7 rounded-xl "
        onSubmit={handleSubmit(onHandleSubmit)}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex items-center justify-between gap-x-6">
              <h1 className="text-2xl text-primary-color font-bold leading-3 ">
                Create Order
              </h1>
              <div className="flex items-center justify-between gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={() => -1}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Customers
                </label>
                <div className="mt-2">
                  <select
                    {...register("customerId")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {cus.map((c) => (
                      <option value={c?.businessPartnerId}>{c?.name}</option>
                    ))}
                  </select>
                  <ErrorText errorMessage={errors?.customerId?.message} />
                </div>
                {currCust ? (
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color font-bold">
                        Name:{" "}
                      </span>
                      {currCust?.name}
                    </p>
                    {currCust?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Address:{" "}
                        </span>
                        {`${currCust?.addresses[0]?.postalCode}, ${currCust?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                    {currCust?.contact ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Contact Info:{" "}
                        </span>
                        <ul className="max-w-md space-y-1 list-disc list-inside">
                          <li>
                            <span className="font-medium">Email:</span>{" "}
                            {currCust?.contact.emailAddress}
                          </li>
                          <li>
                            <span className="font-medium">Fax no:</span>{" "}
                            {currCust?.contact.faxNumber}
                          </li>
                          <li>
                            <span className="font-medium">Mobile no:</span>{" "}
                            {currCust?.contact.mobileNumber}
                          </li>
                          <li>
                            <span className="font-medium">Phone no:</span>{" "}
                            {currCust?.contact.phoneNumber}
                          </li>
                        </ul>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Retailer
                </label>
                <div className="mt-2">
                  <select
                    {...register("retailerId")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {cus.map((c) => (
                      <option value={c?.businessPartnerId}>{c?.name}</option>
                    ))}
                  </select>
                  <ErrorText errorMessage={errors?.customerId?.message} />
                </div>
                {currCust ? (
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color font-bold">
                        Name:{" "}
                      </span>
                      {currCust?.name}
                    </p>
                    {currCust?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Address:{" "}
                        </span>
                        {`${currCust?.addresses[0]?.postalCode}, ${currCust?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                    {currCust?.contact ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Contact Info:{" "}
                        </span>
                        <ul className="max-w-md space-y-1 list-disc list-inside">
                          <li>
                            <span className="font-medium">Email:</span>{" "}
                            {currCust?.contact.emailAddress}
                          </li>
                          <li>
                            <span className="font-medium">Fax no:</span>{" "}
                            {currCust?.contact.faxNumber}
                          </li>
                          <li>
                            <span className="font-medium">Mobile no:</span>{" "}
                            {currCust?.contact.mobileNumber}
                          </li>
                          <li>
                            <span className="font-medium">Phone no:</span>{" "}
                            {currCust?.contact.phoneNumber}
                          </li>
                        </ul>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Suppliers
                </label>
                <div className="mt-2">
                  <select
                    {...register("supplierId")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {sup.map((s) => (
                      <option value={s?.businessPartnerId}>{s?.name}</option>
                    ))}
                  </select>
                  <ErrorText errorMessage={errors?.supplierId?.message} />
                </div>
                {currSup ? (
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color font-bold">
                        Name:{" "}
                      </span>
                      {currSup?.name}
                    </p>
                    {currSup?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Address:{" "}
                        </span>
                        {`${currSup?.addresses[0]?.postalCode}, ${currSup?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                    {currSup?.contact ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Contact Info:{" "}
                        </span>
                        <ul className="max-w-md space-y-1 list-disc list-inside ">
                          <li>
                            <span className="font-medium">Email:</span>{" "}
                            {currSup?.contact.emailAddress}
                          </li>
                          <li>
                            <span className="font-medium">Fax no:</span>{" "}
                            {currSup?.contact.faxNumber}
                          </li>
                          <li>
                            <span className="font-medium">Mobile no:</span>{" "}
                            {currSup?.contact.mobileNumber}
                          </li>
                          <li>
                            <span className="font-medium">Phone no:</span>{" "}
                            {currSup?.contact.phoneNumber}
                          </li>
                        </ul>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Inspection Company
                </label>
                <div className="mt-2">
                  <select
                    {...register("inspectionId")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {sup.map((s) => (
                      <option value={s?.businessPartnerId}>{s?.name}</option>
                    ))}
                  </select>
                  <ErrorText errorMessage={errors?.inspectionId?.message} />
                </div>
                {currSup ? (
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color font-bold">
                        Name:{" "}
                      </span>
                      {currSup?.name}
                    </p>
                    {currSup?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Address:{" "}
                        </span>
                        {`${currSup?.addresses[0]?.postalCode}, ${currSup?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                    {currSup?.contact ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Contact Info:{" "}
                        </span>
                        <ul className="max-w-md space-y-1 list-disc list-inside ">
                          <li>
                            <span className="font-medium">Email:</span>{" "}
                            {currSup?.contact.emailAddress}
                          </li>
                          <li>
                            <span className="font-medium">Fax no:</span>{" "}
                            {currSup?.contact.faxNumber}
                          </li>
                          <li>
                            <span className="font-medium">Mobile no:</span>{" "}
                            {currSup?.contact.mobileNumber}
                          </li>
                          <li>
                            <span className="font-medium">Phone no:</span>{" "}
                            {currSup?.contact.phoneNumber}
                          </li>
                        </ul>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Logistic Company
                </label>
                <div className="mt-2">
                  <select
                    {...register("shipperId")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {ship.map((sh) => (
                      <option value={sh?.businessPartnerId}>{sh?.name}</option>
                    ))}
                  </select>
                  <ErrorText errorMessage={errors?.shipperId?.message} />
                </div>
                {currShip ? (
                  <div className="mt-2">
                    <p className="text-xs">
                      <span className="text-primary-color font-bold">
                        Name:{" "}
                      </span>
                      {currShip?.name}
                    </p>
                    {currShip?.addresses.length ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Address:{" "}
                        </span>
                        {`${currShip?.addresses[0]?.postalCode}, ${currShip?.addresses[0]?.street1}`}
                      </p>
                    ) : null}
                    {currShip?.contact ? (
                      <p className="text-xs">
                        <span className="text-primary-color font-bold">
                          Contact Info:{" "}
                        </span>
                        <ul className="max-w-md space-y-1 list-disc list-inside">
                          <li>
                            <span className="font-medium">Email:</span>{" "}
                            {currShip?.contact.emailAddress}
                          </li>
                          <li>
                            <span className="font-medium">Fax no:</span>{" "}
                            {currShip?.contact.faxNumber}
                          </li>
                          <li>
                            <span className="font-medium">Mobile no:</span>{" "}
                            {currShip?.contact.mobileNumber}
                          </li>
                          <li>
                            <span className="font-medium">Phone no:</span>{" "}
                            {currShip?.contact.phoneNumber}
                          </li>
                        </ul>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Order Date
                </label>
                <div className="mt-2">
                  <div class="relative max-w-sm">
                    <input
                      type="date"
                      {...register("requiredDate")}
                      className="block w-full rounded-md border-0 py-1 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      placeholder="Select date"
                    />
                  </div>
                  <ErrorText errorMessage={errors?.requiredDate?.message} />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Shipping Date
                </label>
                <div className="mt-2">
                  <div class="relative max-w-sm">
                    <input
                      type="date"
                      {...register("shippedDate")}
                      className="block w-full rounded-md border-0 py-1 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      placeholder="Select date"
                    />
                  </div>
                  <ErrorText errorMessage={errors?.shippedDate?.message} />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Shipping Mode
                </label>
                <div className="mt-2">
                  <select
                    {...register("shippingModeId")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {shipModes.map((sh) => (
                      <option value={sh?.shippingModeId}>{sh?.mode}</option>
                    ))}
                  </select>
                  <ErrorText errorMessage={errors?.shippingModeId?.message} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-12">
            <div className="sm:col-span-12">
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-[#d9b99b] border-b-[2px] ">
                {tabs.map((det, ind) => (
                  <li
                    key={ind}
                    className="mr-2"
                    onClick={() => setSelectedTab(det.id)}
                  >
                    <div
                      aria-current="page"
                      className={`cursor-pointer text-[12px] opacity-80 hover:opacity-100 inline-block p-2 text-[${COLOR.primary}] bg-gray-100 rounded-t-lg active `}
                    >
                      {det.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {selectedTab === 1 && (
              <div className="sm:col-span-12">
                {/* <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12"> */}
                {/* Order line */}
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Order Lines
                  </h2>
                  <div className="mt-1 ">
                    <OrderLinesTable
                      data={orderLines}
                      onHandleChange={(e, ind) =>
                        onHandleChange(e, "orderlines", ind)
                      }
                      onHandleDelete={onHandleDelete}
                    />
                  </div>
                  <div className="flex px-8 bg-secondary2-color h-10">
                    <div className="flex items-center gap-2">
                      {newProduct ? (
                        <select
                          onChange={(e) => onHandleChange(e, "product")}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          {prod.map((p) => (
                            <option value={p?.productId}>
                              {p?.productName}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <p
                        className=" hover:underline cursor-pointer text-xs"
                        onClick={() => setNewProduct(true)}
                      >
                        + Add New Product
                      </p>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            )}
            {selectedTab === 2 && (
              <Fragment>
                <div className="sm:col-span-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    {/* SHIPPING MARK */}
                    <div className="sm:col-span-12">
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div
                          className="sm:col-span-2 flex gap-2 w-full items-center"
                          style={{ flex: "10%" }}
                        >
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Importer:
                          </label>
                        </div>
                        <div
                          className="sm:col-span-4 flex gap-2 w-full items-center"
                          style={{ flex: "50%" }}
                        >
                          {/* <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      /> */}
                          <div className="mt-2 w-80">
                            <select
                              // {...register("customerId")}
                              onChange={(e) => {
                                setImporterId(e.target.value);
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              {cus.map((c) => (
                                <option value={c?.businessPartnerId}>
                                  {c?.name}
                                </option>
                              ))}
                            </select>
                            <ErrorText
                              errorMessage={errors?.customerId?.message}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div
                          className="sm:col-span-2 flex gap-2 w-full items-center"
                          style={{ flex: "10%" }}
                        >
                          {/* <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Design No.:
                        </label> */}
                        </div>
                        <div
                          className="sm:col-span-4 flex gap-2 w-full items-center"
                          style={{ flex: "50%" }}
                        >
                          {/* <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Enter value"
                        /> */}
                          {currentImporter ? (
                            <div className="mt-2">
                              <p className="text-xs">
                                <span className="text-primary-color font-bold">
                                  Name:{" "}
                                </span>
                                {currentImporter?.name}
                              </p>
                              {currentImporter?.addresses.length ? (
                                <p className="text-xs">
                                  <span className="text-primary-color font-bold">
                                    Address:{" "}
                                  </span>
                                  {`${currentImporter?.addresses[0]?.postalCode}, ${currentImporter?.addresses[0]?.street1}`}
                                </p>
                              ) : null}
                              {currentImporter?.contact ? (
                                <p className="text-xs">
                                  <span className="text-primary-color font-bold">
                                    Contact Info:{" "}
                                  </span>
                                  <ul className="max-w-md space-y-1 list-disc list-inside ">
                                    <li>
                                      <span className="font-medium">
                                        Email:
                                      </span>{" "}
                                      {currentImporter?.contact.emailAddress}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Fax no:
                                      </span>{" "}
                                      {currentImporter?.contact.faxNumber}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Mobile no:
                                      </span>{" "}
                                      {currentImporter?.contact.mobileNumber}
                                    </li>
                                    <li>
                                      <span className="font-medium">
                                        Phone no:
                                      </span>{" "}
                                      {currentImporter?.contact.phoneNumber}
                                    </li>
                                  </ul>
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div
                          className="sm:col-span-2 flex gap-2 w-full items-center"
                          style={{ flex: "10%" }}
                        >
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Customer Order No.:
                          </label>
                        </div>
                        <div
                          className="sm:col-span-4 flex gap-2 w-full items-center"
                          style={{ flex: "50%" }}
                        >
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div
                          className="sm:col-span-2 flex gap-2 w-full items-center"
                          style={{ flex: "10%" }}
                        >
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Product Details:
                          </label>
                        </div>
                        <div
                          className="sm:col-span-4 flex gap-2 w-full items-center"
                          style={{ flex: "50%" }}
                        >
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div
                          className="sm:col-span-2 flex gap-2 w-full items-center"
                          style={{ flex: "10%" }}
                        >
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Design No.:
                          </label>
                        </div>
                        <div
                          className="sm:col-span-4 flex gap-2 w-full items-center"
                          style={{ flex: "50%" }}
                        >
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>

                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div
                          className="sm:col-span-2 flex gap-2 w-full items-center"
                          style={{ flex: "10%" }}
                        >
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Product Size:
                          </label>
                        </div>
                        <div
                          className="sm:col-span-4 flex gap-2 w-full items-center"
                          style={{ flex: "50%" }}
                        >
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>

                      {/* <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Others:
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Enter value"
                        />
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    {/* SHIPPING MARK */}
                    <div className="sm:col-span-12">
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div className="sm:col-span-2 flex gap-2 w-full items-center" style={{flex:"10%"}}>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Carton Size:
                          </label>
                        </div>
                        <div className="sm:col-span-4 flex gap-2 w-full items-center"style={{flex:"50%"}}>
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div className="sm:col-span-2 flex gap-2 w-full items-center" style={{flex:"10%"}}>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            PCS/Sets/Carton:
                          </label>
                        </div>
                        <div className="sm:col-span-4 flex gap-2 w-full items-center"style={{flex:"50%"}}>
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div className="sm:col-span-2 flex gap-2 w-full items-center" style={{flex:"10%"}}>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Net Weight:
                          </label>
                        </div>
                        <div className="sm:col-span-4 flex gap-2 w-full items-center"style={{flex:"50%"}}>
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div className="sm:col-span-2 flex gap-2 w-full items-center" style={{flex:"10%"}}>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            Gross Weight:
                          </label>
                        </div>
                        <div className="sm:col-span-4 flex gap-2 w-full items-center"style={{flex:"50%"}}>
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div className="sm:col-span-2 flex gap-2 w-full items-center" style={{flex:"10%"}}>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            EAM Code:
                          </label>
                        </div>
                        <div className="sm:col-span-4 flex gap-2 w-full items-center"style={{flex:"50%"}}>
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                        <div className="sm:col-span-2 flex gap-2 w-full items-center" style={{flex:"10%"}}>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-400"
                          >
                            QR Code:
                          </label>
                        </div>
                        <div className="sm:col-span-4 flex gap-2 w-full items-center"style={{flex:"50%"}}>
                          <input
                            className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                            value={""}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>

                      {/* <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Others:
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Enter value"
                        />
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
