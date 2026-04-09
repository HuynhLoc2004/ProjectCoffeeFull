import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../AxiosClient";
import { IoReloadSharp } from "react-icons/io5";
import {
  getAccessToken,
  setAccessToken,
} from "../../ManagerAccessToken/ManagerAccessToken";
import { logout, unlogout, getLogout } from "../../ManagerLogout/ManagerLogout";
import { useSearchParams } from "react-router-dom";
const Authentication = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accesstk = searchParams.get("info");
  useEffect(() => {
    setTimeout(() => {
      setAccessToken(accesstk);
      unlogout();
      navigate(localStorage.getItem("page_before"));
    }, 100);
  }, []);
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <p className="text-sm ">Đang xử lí..</p>
      <IoReloadSharp className="text-3xl animate-spin" />
    </div>
  );
};

export default Authentication;
