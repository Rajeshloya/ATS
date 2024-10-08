import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { CssBaseline } from "@mui/material";

const Layout = () => {
  return <>
   <CssBaseline />
    <Navbar />
    <Outlet />
  </>;
};

export default Layout