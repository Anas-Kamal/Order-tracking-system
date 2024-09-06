import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
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
import {
  GalaxyTowels,
  DuvetSetImage,
  UploadImage,
} from "../../constant/images";
import ImageUploader from "../ImageUploader";
// import { ErrorText } from "../components";

const tabs = [
  { name: "Fabric Details ", id: 1 },
  // { name: "General Information", id: 2 },
  { name: "Printed/Dyed", id: 3 },
  { name: "Product Accessories (Packaging) ", id: 7 },
  // { name: "Yarn Count", id: 4 },
  // { name: "Product Code ", id: 5 },
  // { name: "Label ", id: 6 },
  // { name: "Poly Status ", id: 8 },
  // { name: "Carton ", id: 9 },
  // { name: "Shipping Mark ", id: 10 },
];

export const ProductForm = ({ editData }) => {
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
  const [currRetailer, setCurrRetailer] = useState();
  const [currInspection, setCurrInspection] = useState();
  const [currShip, setCurrShip] = useState();

  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState("printed");
  const [prodCat, setProdCat] = useState([{ name: "Bedroom", id: "1" }]);
  const [fabricWeaving, setFabricWeaving] = useState([
    { name: "Plain", id: "1" },
    { name: "Twinn", id: "2" },
    { name: "Satin", id: "3" },
    { name: "Honeycomb", id: "4" },
  ]);

  const [fabricComb, setFabricComb] = useState([
    { name: "Cotton", id: "1" },
    { name: "Polyestar", id: "2" },
  ]);

  const [designs, setDesigns] = useState([
    { name: "Design 1", id: "1" },
    { name: "Design 2", id: "2" },
    { name: "Design 3", id: "3" },
    { name: "Design 4", id: "4" },
    { name: "Design 5", id: "5" },
    { name: "Design 6", id: "6" },
    { name: "Design 7", id: "7" },
    { name: "Design 8", id: "8" },
    { name: "Design 9", id: "9" },
    { name: "Design 10", id: "10" },
  ]);
  const [colors, setColors] = useState([
    { name: "Color 1", id: "1" },
    { name: "Color 2", id: "2" },
    { name: "Color 3", id: "3" },
    { name: "Color 4", id: "4" },
    { name: "Color 5", id: "5" },
    { name: "Color 6", id: "6" },
    { name: "Color 7", id: "7" },
    { name: "Color 8", id: "8" },
    { name: "Color 9", id: "9" },
    { name: "Color 10", id: "10" },
  ]);
  const [brandsLabel, setBrandsLabel] = useState([
    { name: "Woven Jacquard", id: "1" },
    { name: "Printed", id: "2" },
  ]);
  const [careLabel, setCareLabel] = useState([
    { name: "Taffita", id: "1" },
    { name: "Sateen", id: "2" },
    { name: "Paper", id: "3" },
  ]);

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

  const onHndlRadio = (e) => {
    const { value } = e.target;
    setSelectedRadio(value);
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
                    Cutomers Info.
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
                      <span className="text-primary-color">Shipped Date: </span>
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
        className=" bg-white p-7 rounded-xl h-[740px] "
        onSubmit={handleSubmit(onHandleSubmit)}
      >
        <div className="space-y-12">
          <div className=" border-gray-900/10 pb-12">
            <div className="flex items-center justify-between gap-x-6">
              <h1 className="text-2xl text-primary-color font-bold leading-3 ">
                Create Product
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

            <div className="mt-10 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-12">
              <div className="sm:col-span-12">
                <div className="mt-1 flex gap-x-8 items-stretch w-full">
                  {/* <img
                    src={DuvetSetImage}
                    width={150}
                    alt=""
                    className="rounded-md" */}
                  <ImageUploader
                    // src={DuvetSetImage}
                    imgWidth={150}
                    onImageUpload={() => {}}
                  />
                  {/* /> */}
                  <div className="flex flex-col justify-center w-full">
                    <div className="sm:col-span-10 flex gap-2 w-full">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400 "
                      >
                        Product Name:
                      </label>
                      <div className="w-auto">
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          type="text"
                          placeholder="Enter Product Name"
                          value={"Duvet set"}
                        />
                        <ErrorText errorMessage={errors?.shipperId?.message} />
                      </div>
                    </div>
                    <div className="sm:col-span-12  flex gap-2 w-full ">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Description:
                      </label>
                      <div className="w-full">
                        <input
                          className={`w-full placeholder:text-xs outline-none focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          type="text"
                          value={
                            // "100% Cotton Reactive Dyed 13s Combed Made on Toyota air Jet JAQ looms"
                            "Recycled Poly Cotton 30x30 / 76x68 144TC"
                          }
                          placeholder="Enter Product Decription"
                        />
                        <ErrorText errorMessage={errors?.shipperId?.message} />
                      </div>
                    </div>
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

              {/* General Information */}
              {selectedTab === 4 && (
                <>
                  <div className="sm:col-span-12">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Category :
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <select
                          // {...register("customerId")}
                          className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                        >
                          {prodCat.map((c) => (
                            <option value={c?.id}>{c?.name}</option>
                          ))}
                        </select>
                        <ErrorText errorMessage={errors?.customerId?.message} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Unit Price :
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        $
                        <input
                          className={`outline-none w-[300px] focus:border-0 focus:border-b-[1px] border-[${COLOR.primary}]`}
                          type="number"
                          value={`${99}`}
                        />
                        <ErrorText errorMessage={errors?.customerId?.message} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Reference Code :
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <input
                          className={`outline-none w-[300px] focus:border-0 focus:border-b-[1px] border-[${COLOR.primary}]`}
                          type="text"
                          value={"DUVET_1111"}
                        />
                        <ErrorText errorMessage={errors?.customerId?.message} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Bar Code :
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <input
                          className={`outline-none w-[300px] focus:border-0 focus:border-b-[1px] border-[${COLOR.primary}]`}
                          type="text"
                          value={""}
                          placeholder="Enter code"
                        />
                        <ErrorText errorMessage={errors?.customerId?.message} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* General Information End    */}

              {/* Printed / Dyed */}

              {/* <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-1 flex gap-2 w-full items-center">
                        <div className="mt-1">
                          <input
                            type="radio"
                            defaultChecked
                            name="type"
                            value={"printed"}
                            onChange={onHndlRadio}
                          />
                        </div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Printed
                        </label>
                      </div>
                      <div className="sm:col-span-1 flex gap-2 w-full items-center">
                        <div className="mt-1">
                          <input
                            type="radio"
                            name="type"
                            value={"dyed"}
                            onChange={onHndlRadio}
                          />
                        </div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Dyed
                        </label>
                      </div>
                    </div> */}
              {selectedTab === 3 && (
                <>
                  <div className="sm:col-span-6">
                    <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div
                        className="sm:col-span-2 flex gap-2 w-full items-center"
                        style={{ flex: "10%" }}
                      >
                         <div className="mt-1">
                          <input
                            type="radio"
                            defaultChecked
                            name="type"
                            value={"printed"}
                            onChange={onHndlRadio}
                          />
                        </div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Printed
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                         <div className="mt-1">
                          <input
                            type="radio"
                            name="type"
                            value={"dyed"}
                            onChange={onHndlRadio}
                          />
                        </div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Dyed
                        </label>
                      </div>
                    </div>
                    {selectedRadio === "dyed" && <Fragment>
                    <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div
                        className="sm:col-span-2 flex gap-2 w-full items-center"
                        style={{ flex: "10%" }}
                      >
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Color 1:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 1"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 2:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 2"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 3:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 3"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 4:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 4"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 5:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 5"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 6:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 6"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 7:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 7"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 8:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 8"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 9:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 9"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Color 10:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="color 10"
                        />
                        <ImageUploader onImageUpload={() => {}} />
                      </div>
                    </div>
                      </Fragment>}
                    {selectedRadio === "printed" && <Fragment>
                    <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div
                        className="sm:col-span-2 flex gap-2 w-full items-center"
                        style={{ flex: "10%" }}
                      >
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Design 1:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 1"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 2:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 2"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 3:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 3"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 4:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 4"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 5:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 5"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 6:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 6"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 7:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 7"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 8:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 8"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 9:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 9"
                        />
                        <ImageUploader onImageUpload={() => {}} />
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
                          Design 10:
                          
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="design 10"
                        />
                        <ImageUploader onImageUpload={() => {}} />
                      </div>
                    </div>
                      </Fragment>}

                  </div>
                  <div className="sm:col-span-6">
                  
                    <div className="flex gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div
                        className="sm:col-span-2 flex gap-2 w-full items-center"
                        style={{ flex: "10%" }}
                      >
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Duvet Size:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={`  w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Duvet Front Des"
                        />
                                                {/* <ImageUploader onImageUpload={() => {}} /> */}

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
                          Duvet Style:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Duvet Back Des"
                        />
                                                {/* <ImageUploader onImageUpload={() => {}} /> */}

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
                          Pillow Size:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={`  w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Duvet Back Des"
                        />
                                                {/* <ImageUploader onImageUpload={() => {}} /> */}

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
                          Pillow Style:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={`  w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Duvet Back Des"
                        />
                                                {/* <ImageUploader onImageUpload={() => {}} /> */}

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
                         Quality:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-70 outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Enter quality"
                        />
                                                <ImageUploader onImageUpload={() => {}} />
 
                      </div>
                    </div>
                   
                  </div>
                </>
              )}

              {/* Printed Dyed End    */}

              {/* Yarn Count */}
              {/* {selectedTab === 4 && (
                <div className="sm:col-span-12">
                
                </div>
              )} */}
              {/* Yarn Count End */}

              {/* Fabric Details */}
              {selectedTab === 1 && (
                <div className="sm:col-span-12">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Fabric Weaving
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      {/* <select
                        // {...register("customerId")}
                        className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                      >
                        
                        {fabricWeaving.map((c) => (
                          <option value={c?.id}>{c?.name}</option>
                        ))}
                      </select> */}
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Fabric Compositon:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>

                    {/* <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <select
                        // {...register("customerId")}
                        className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                      >
                        
                        {fabricComb.map((c) => (
                          <option value={c?.id}>{c?.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        WARP
                      </label>
                    </div> */}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        WARP Yarn:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        WEFT Yarn:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        REED Yarn:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        PICK Yarn:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        GSM :
                      </label>
                    </div>
                    {/* <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <input
                          className={`outline-none w-[300px] focus:border-0 focus:border-b-[1px] border-[${COLOR.primary}]`}
                          type="text"
                          value={``}
                          placeholder=""
                          // placeholder="Enter GSM"
                        />
                        <ErrorText errorMessage={errors?.customerId?.message} />
                      </div> */}
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center" />

                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <select
                        // {...register("customerId")}
                        className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                      >
                        {fabricComb.map((c) => (
                          <option value={c?.id}>{c?.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        WEFT
                      </label>
                    </div>
                  </div> */}
                </div>
              )}
              {/* Fabric Details End */}

              {/* Product Code */}
              {selectedTab === 5 && (
                <div className="sm:col-span-12">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Importer Order No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Retailer Order No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Retailer Batch No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Retailer Suppliers No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Product No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        EAN Code:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Product Code End */}

              {/* Label */}
              {selectedTab === 6 && (
                <>
                  <div className="sm:col-span-12 ">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Brand Label:
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <select
                          // {...register("customerId")}
                          className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                        >
                          {brandsLabel.map((c) => (
                            <option value={c?.id}>{c?.name}</option>
                          ))}
                        </select>
                        <img src={UploadImage} width={30} alt="" srcset="" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Care Label:
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-2 w-full items-center">
                        <select
                          // {...register("customerId")}
                          className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                        >
                          {careLabel.map((c) => (
                            <option value={c?.id}>{c?.name}</option>
                          ))}
                        </select>
                        <img src={UploadImage} width={30} alt="" srcset="" />
                      </div>
                    </div>
                  </div>{" "}
                </>
              )}
              {/* Label End */}

              {/* Packing */}
              {selectedTab === 7 && (
                <>
                  {/* <div className="sm:col-span-12"></div> */}
                  <div className="sm:col-span-6">
                    <div className="w-40 mb-2">
                      <h5 className="text-gray-400 font-bold">Packaging</h5>
                      <hr />
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
                          Brand Label (Quality):
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <select
                          // {...register("customerId")}
                          className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                        >
                          {brandsLabel.map((c) => (
                            <option value={c?.id}>{c?.name}</option>
                          ))}
                        </select>
                        {/* <img src={UploadImage} width={30} alt="" srcset="" /> */}
                        <ImageUploader onImageUpload={() => {}} />
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
                          Care Label (Quality):
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <select
                          // {...register("customerId")}
                          className={`outline-none block w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6  focus:border-0 focus:border-b-[2px] border-[${COLOR.primary}]`}
                        >
                          {careLabel.map((c) => (
                            <option value={c?.id}>{c?.name}</option>
                          ))}
                        </select>
                        {/* <img src={UploadImage} width={30} alt="" srcset="" /> */}
                        <ImageUploader onImageUpload={() => {}} />
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
                          Art Card:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Duvet Front Des"
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
                          Craft Card:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Duvet Back Des"
                        />
                      </div>
                    </div>
                    <div className="gflex gap-x-6 gap-y-2 sm:grid-cols-12">
                      <div
                        className="sm:col-span-2 flex gap-2 w-full items-center"
                        style={{ flex: "10%" }}
                      >
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-6 text-gray-400"
                        >
                          Bleach Card:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Pillow Front Des"
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
                          Stiffner :
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                          <div className="sm:col-span-6 flex gap-2 w-full items-center">
                            <div className="mt-1">
                              <input
                                type="radio"
                                defaultChecked
                                name="type"
                                value={"white"}
                                onChange={onHndlRadio}
                              />
                            </div>
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium leading-6 text-gray-400"
                            >
                              White
                            </label>
                          </div>
                          <div className="sm:col-span-6 flex gap-2 w-full items-center">
                            <div className="mt-1">
                              <input
                                type="radio"
                                name="type"
                                value={"brown"}
                                onChange={onHndlRadio}
                              />
                            </div>
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium leading-6 text-gray-400"
                            >
                              Brown
                            </label>
                          </div>
                        </div>
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
                          FSC No.:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        <input
                          className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                          value={""}
                          placeholder="Pillow Back Des"
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
                          Inlay Pic:
                        </label>
                      </div>
                      <div
                        className="sm:col-span-4 flex gap-2 w-full items-center"
                        style={{ flex: "50%" }}
                      >
                        {/* <img src={UploadImage} width={30} alt="" srcset="" /> */}
                        <ImageUploader onImageUpload={() => {}} />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <div className="w-40 mb-2">
                      <h5 className="text-gray-400 font-bold">Poly Status</h5>
                      <hr />
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
                          Single PC:
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
                          Master:
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
                          Instruction on Poly:
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
                          Quality:
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
                    <div className="w-40 mb-2">
                      <h5 className="text-gray-400 font-bold mt-2">Carton</h5>
                      <hr />
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
                          Size:
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
                          Quality:
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
                  </div>
                </>
              )}
              {/* Packing  END*/}

              {/* Poly Status */}
              {selectedTab === 8 && (
                <div className="sm:col-span-12">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Single PC:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Master:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Instruction on Poly:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Quality:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Poly Status End */}

              {/* Carton Status */}
              {selectedTab === 9 && (
                <div className="sm:col-span-12">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Size:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Quality:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Carton End */}

              {/* Poly Status */}
              {selectedTab === 10 && (
                <div className="sm:col-span-12">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        EAN Code:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Design No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Product Size:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Pcs/Sets/Carton:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Net WT:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Gross WT:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Product Description:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Order No.:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        QR Code:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-400"
                      >
                        Importer:
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-2 w-full items-center">
                      <input
                        className={` w-full outline-none placeholder:text-xs focus:border-0 focus:border-b-[3px] border-[${COLOR.primary}]`}
                        value={""}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
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
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-12">
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
                  </div>
                </div>
              )}
              {/* Poly Status End */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
