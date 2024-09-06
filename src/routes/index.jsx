import { Route, Routes } from "react-router-dom";
import {
  Login,
  Orders,
  ProductScreen,
  Tiles,
  CreateProductForm,
} from "../pages";
import { OrderKanban } from "../pages/Order/OrderKanban";
import { Orderlayout } from "../layouts/orderlayout";
import { CreateForm } from "../pages/Order/CreateForm";
import { UnderDevelopment } from "../pages/underDevelopment";

export const Router = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="/dashboard" element={<Tiles />}></Route>
        <Route path="/orders" element={<Orderlayout />}>
          <Route index element={<Orders />} />
          <Route path="ordersKanban" element={<OrderKanban />} />
          <Route path="createOrder" element={<CreateForm />} />
          <Route path="*" element={<UnderDevelopment />} />
        </Route>
        <Route path="/products" element={<Orderlayout />}>
          <Route index element={<ProductScreen />} />
          <Route path="createProduct" element={<CreateProductForm />} />
          <Route path="*" element={<UnderDevelopment />} />
        </Route>
        <Route path="*" element={<UnderDevelopment />} />
      </Route>
      {/* <Route index element={<Register />} /> */}
      {/* <Route path="teams" element={<DashboardLayout />}>
          <Route path=":teamId" element={<Order />}>
            
          </Route>
          <Route path=":teamId/edit" element={<EditTeam />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route> */}
    </Routes>
  );
};
