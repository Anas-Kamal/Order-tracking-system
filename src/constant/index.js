import {
  CustomerIcon,
  InventoryIcon,
  KanbanIcon,
  OrderIcon,
  SettingIcon,
  SupplierIcon,
} from "./images";

export const tilesData = [
  {
    id: 1,
    name: "Order Management",
    url: OrderIcon,
    link: "/orders",
  },
  {
    id: 2,
    name: "Product Management",
    url: InventoryIcon,
    link: "/products",
  },

  {
    id: 4,
    name: "Customer",
    url: CustomerIcon,
  },
  {
    id: 5,
    name: "Supplier",
    url: SupplierIcon,
  },
  {
    id: 6,
    name: "Order Status",
    url: KanbanIcon,
  },
  {
    id: 3,
    name: "Configuration",
    url: SettingIcon,
  },
  // {
  //     id:7,
  //     name:'Partner 4',
  //     url:PartnerIcon
  // }
];

export const Statuses = [
  {
    name: "Booked",
    id: 1,
    bg: "bg-green-400",
    fg: " text-white",
  },
  {
    name: "Confirmed",
    id: 2,
    bg: "bg-green-500",
    fg: " text-white",
  },
  {
    name: "Shipped",
    id: 3,
    bg: "bg-green-600",
    fg: " text-white",
  },
  {
    name: "Dly. In Process",
    id: 4,
    bg: "bg-green-700",
    fg: " text-white",
  },
  {
    name: "Delivered",
    id: 5,
    bg: "bg-green-800",
    fg: " text-white",
  },
  {
    name: "Cancelled",
    id: 6,
    bg: "bg-gray-100 ",
    fg: " text-white",
  },
];
