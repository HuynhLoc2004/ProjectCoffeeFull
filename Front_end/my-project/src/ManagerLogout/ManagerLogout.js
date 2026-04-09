import React from "react";

const LOGOUT_KEY = "is_logged_out";

export const unlogout = () => {
  localStorage.setItem(LOGOUT_KEY, "0");
};

export const logout = () => {
  localStorage.setItem(LOGOUT_KEY, "1");
};

export const getLogout = () => {
  return parseInt(localStorage.getItem(LOGOUT_KEY) || "1");
};
