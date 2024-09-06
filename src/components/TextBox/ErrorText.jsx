import React from "react";

export const ErrorText = ({ errorMessage }) => {
  if (!errorMessage) return null;
  return <p className="text-xs text-red-500 ">{errorMessage}</p>;
};
