import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(3),
});

export const orderCreateSchema = yup.object().shape({
    customerId: yup.string().required("Cutomer is required!"),
    supplierId: yup.string().required("Supplier is required!"),
    shipperId: yup.string().required("Shipper is required!"),
    shippingModeId: yup.string().required("Shipping mode is required!"),
    requiredDate: yup.date().required('Required date is required!'),
    shippedDate: yup.date().required("Shipped Date is required!"),
  });