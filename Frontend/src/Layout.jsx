import React from "react";
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router";
import Footer from "./Components/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar className="min-h-0 " />
      <main className=" min-h-0 flex-1 flex justify-center items-center ">
        <Outlet />
      </main>
      <Footer className="min-h-0" />
    </div>
  );
};

export default Layout;
