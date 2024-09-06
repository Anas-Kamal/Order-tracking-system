import React from "react";
import { useLocation } from "react-router-dom";
import { ProductForm } from "../../components";

export const CreateProductForm = () => {
  const location = useLocation();
  return (
    <React.Fragment>
      <ProductForm editData={location.state} />
    </React.Fragment>
  );
};
