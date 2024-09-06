import React from "react";
import { useLocation } from "react-router-dom";
import { OrderForm } from "../../components";

export const CreateForm = () => {
  const location = useLocation();
  return (
    <React.Fragment>
      <OrderForm editData={location.state} />
    </React.Fragment>
  );
};
