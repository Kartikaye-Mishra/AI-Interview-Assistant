import type { NavItem } from "../lib/types";
import { IoMdHome } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";

export const navItems: NavItem[] = [
  {
    icon: IoMdHome,
    label: "home",
    path:"/",
  },
  {
    icon: FaAddressCard,
    label: "About",
    path:"/about",
  },
  {
    icon: FaPhone,
    label: "Contact Us",
    path:"/contact",
  },
];
