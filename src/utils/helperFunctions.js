// import { BaseImageUrl } from "../constant/apiEndpoints";
// const base64 = require("base-64");

export const getHeaders = (token, fileHeader) => {
  let headers = {
    Accept: "application/json",
    "Content-Type": fileHeader ? "multipart/form-data" : "application/json",
    Origin: "",
  };
  if (token) {
    headers = { ...headers, authorization: `Bearer ${token}` };
  }

  return { headers };
};

export const getBPType = {
  Cutomer: 1,
  Supplier: 2,
  Shipper: 3,
};

// export const getImageUrl = (url) => {
//   if (url) {
//     return `${BaseImageUrl}${url}`;
//   }
// };

// export const getBasicAuthHeader = () => {
//   let headers = {
//     "Content-Type": "application/x-www-form-urlencoded",
//     Authorization: `Basic ${base64.encode(
//       // eslint-disable-next-line no-undef
//       process.env.REACT_APP_CLIENT_ID + ":" + process.env.REACT_APP_SECRET
//     )}`,
//   };

//   return { headers };
// };

export const formatString = (data) => {
  let string = "";

  data
    ?.split(" ")
    .forEach(
      (val) =>
        (string =
          string +
          `${string.length === 0 ? "" : " "}` +
          val.charAt(0).toUpperCase() +
          val.substring(1))
    );

  return string;
};

export const uploadFile = (formdata) => {
  const requestOptions = {
    method: "POST",
    body: formdata,
    // redirect: "follow",
  };

  return fetch(
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_API_URL + "uploadfile",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};

export const capitalizeText = (text) => {
  let value = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  return value;
};

export const sortListByAlphabet = (data, field) => {
  data.sort((a, b) => {
    let fa = a[field].toLowerCase(),
      fb = b[field].toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  return data;
};

export const getFirstLetterOfName = (name) => {
  let firstLetters = "";
  if (name) {
    let nameArr = name.split(" ");
    if (nameArr?.length > 1) {
      firstLetters = nameArr[0].charAt(0) + nameArr[1].charAt(0);
    } else {
      firstLetters = nameArr[0].charAt(0);
    }
  }
  return firstLetters.toUpperCase();
};

export const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

export const BillingTextColour = (orderStatus) => {
  let obj = {
    "Open Order": "#a3a3a2",
    "Payment Failed": "#e64c3d",
    "Order Received": "#8bc927",
    "Order Processed": "#f99227",
    "Order Installation": "#8238ed",
    "Order Complete": "#8bc927",
    "Order Canceled": "#e64c3d",
    Complete: "#8bc927",
    paid: "#8bc927",
    Approved: "#8bc927",
    Declined: "#e64c3d",
    Unpaid: "#e64c3d",
    Upcoming: "#8238ed",
    Remaining: "#a3a3a2",
    canceled: "#e64c3d",
    Yes: "#8bc927",
    No: "#e64c3d",
    Active: "#8bc927",
    Inactive: "#a3a3a2",
    Expired: "#e64c3d",
    Scheduled: "#8238ed",
  };
  return obj[orderStatus];
};

export const getAccessForNotification = async () => {
  return await Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // return getFirebaseToken().then((token) => token)
      return true;
    } else {
      console.log("Notification permission denied.");
    }
  });
};

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
