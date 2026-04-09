import React, { useState } from "react";
import Banner from "../Components/Components_Header/Banner";
import Content from "../Components/Components_Header/Content";
import Marquee from "../Components/Components_Header/Marquee";
import HeaderHero from "../Components/Components_Header/HeaderHero";
import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout, logout, getLogout } from "../ManagerLogout/ManagerLogout";
const HeaderPage = () => {
  localStorage.setItem(
    "page_before",
    window.location.pathname + window.location.search,
  );
  const [infoUser, setInfoUser] = useState(null);
  const location = useLocation();
  const [accessToken, setAccesstoken] = useState(getAccessToken());

  useEffect(() => {
    if (getLogout() == 0 && getAccessToken() != "") {
      axiosClient
        .get("/auth/info", {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            withCredentials: getLogout() == 1 ? true : false,
          },
        })
        .then((res) => {
          setInfoUser({
            fullname: res.data.result.fullname,
            picture: res.data.result.picture,
          });
        })
        .catch((err) => {
          if (err.status == 401) {
            axiosClient
              .get("/auth/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                if (res.data.statusCode == 401) {
                  return;
                }
                unlogout();
                setAccessToken(res.data.result.accessToken);
                setAccesstoken(res.data.result.accessToken);
              })
              .catch((err) => {
                if (err.status == 401) {
                  return;
                }
              });
          }
        });
    } else {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 401) {
            return;
          }
          unlogout();
          setAccessToken(res.data.result.accessToken);
          setAccesstoken(res.data.result.accessToken);
        })
        .catch((err) => {
          if (err.status == 401) {
            return;
          }
        });
    }
  }, [getAccessToken()]);

  return (
    <div className="text-[#3B2F2F]">
      <Navbar userInfo={infoUser} />
      <HeaderHero />
      <Marquee />
      <Content />
    </div>
  );
};

export default HeaderPage;
