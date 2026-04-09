import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoReloadSharp } from "react-icons/io5";
const LoadingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(localStorage.getItem("page_before"));
    }, 150);
  }, []);
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <p className="text-sm ">Đang xử lí..</p>
      <IoReloadSharp className="text-3xl animate-spin" />
    </div>
  );
};

export default LoadingPage;
