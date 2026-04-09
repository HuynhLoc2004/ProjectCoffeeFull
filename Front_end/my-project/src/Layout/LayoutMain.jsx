import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footter from "../Components/Footter";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken as saveAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout } from "../ManagerLogout/ManagerLogout";
const LayoutMain = () => {
  useEffect(() => {
    const refreshToken = () => {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            const newAccessToken = res.data.result.accessToken;
            saveAccessToken(newAccessToken);
            unlogout();
          }
        })
        .catch((err) => {
          console.error("Auto-refresh token failed:", err.message);
        });
    };

    const intervalId = setInterval(refreshToken, 4 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Outlet />
      <Footter />
    </div>
  );
};

export default LayoutMain;
