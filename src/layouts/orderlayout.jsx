import React from "react";
import { Outlet } from "react-router-dom";
import { Breadcrumb, OrderHeader } from "../components";

export const Orderlayout = () => {
  return (
    <div className="bg-secondary2-color h-screen">
      <OrderHeader />
      <Breadcrumb />
      <div className="bg-secondary2-color">
        <Outlet />
      </div>
    </div>
  );
};
