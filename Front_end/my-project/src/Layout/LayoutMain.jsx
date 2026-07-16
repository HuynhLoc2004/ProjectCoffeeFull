import React from "react";
import { Outlet } from "react-router-dom";
import Footter from "../Components/Footter";
const LayoutMain = () => {
  return (
    <div className="coffee-app-shell">
      <div className="coffee-ambient" aria-hidden="true"><span /><span /><span /></div>
      <Outlet />
      <Footter />
    </div>
  );
};

export default LayoutMain;
