import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { useNavigate } from "react-router-dom";
import { unlogout, getLogout } from "../ManagerLogout/ManagerLogout";

const ProductCart = ({ cartProduct, setCheckUpdate }) => {
  const navigate = useNavigate();

  const handleIncrequantity = () => {
    if (cartProduct != null && getAccessToken() != "") {
      axiosClient
        .put(
          `/cartproduct/incrCartproduct/${cartProduct.id}`,
          {
            quantityUpdate: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          },
        )
        .then((res) => {
          if (res.data.result == true) {
            setCheckUpdate((prev) => prev + 1);
          } else if (res.data.statusCode == 401) {
            axiosClient
              .get("/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                setAccessToken(res.data.result.accessToken);
                unlogout();
              })
              .catch((err) => {
                if (err.status == 401) {
                  navigate("/");
                }
              });
          }
        })
        .catch((err) => {
          axiosClient
            .get("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode == 401) {
                navigate("/");
              }
              unlogout();
              setAccessToken(res.data.result.accessToken);
            })
            .catch((err) => {
              if (err.status == 401) {
                navigate("/");
              }
            });
        });
    } else {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 401) {
            navigate("/");
          }
          unlogout();
          setAccessToken(res.data.result.accessToken);
        })
        .catch((err) => {
          if (err.status == 401) {
            navigate("/");
          }
        });
    }
  };

  const handledescQuantity = () => {
    if (cartProduct != null && getAccessToken() != "") {
      axiosClient
        .put(
          `/cartproduct/descCartproduct/${cartProduct.id}`,
          {
            quantityUpdate: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          },
        )
        .then((res) => {
          if (res.data.result == true) {
            setCheckUpdate((prev) => prev + 1);
          } else if (res.data.statusCode == 401) {
            axiosClient
              .get("/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                setAccessToken(res.data.result.accessToken);
                unlogout();
              })
              .catch((err) => {
                if (err.status == 401) {
                  navigate("/");
                }
              });
          }
        })
        .catch((err) => {
          axiosClient
            .get("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode == 401) {
                navigate("/");
              }
              unlogout();
              setAccessToken(res.data.result.accessToken);
            })
            .catch((err) => {
              if (err.status == 401) {
                navigate("/");
              }
            });
        });
    } else {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 401) {
            navigate("/");
          }
          unlogout();
          setAccessToken(res.data.result.accessToken);
        })
        .catch((err) => {
          if (err.status == 401) {
            navigate("/");
          }
        });
    }
  };

  const handleClearCartProduct = () => {
    if (cartProduct != null && getAccessToken() != "") {
      axiosClient
        .delete(`/cartproduct/deleteCartproduct/${cartProduct.id}`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
        .then((res) => {
          if (res.data.result == true) {
            setCheckUpdate((prev) => prev + 1);
          } else if (res.data.statusCode == 401) {
            axiosClient
              .get("/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                setAccessToken(res.data.result.accessToken);
                unlogout();
              })
              .catch((err) => {
                if (err.status == 401) {
                  navigate("/");
                }
              });
          }
        })
        .catch((err) => {
          axiosClient
            .get("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode == 401) {
                navigate("/");
              }
              unlogout();
              setAccessToken(res.data.result.accessToken);
            })
            .catch((err) => {
              if (err.status == 401) {
                navigate("/");
              }
            });
        });
    } else {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 401) {
            navigate("/");
          }
          unlogout();
          setAccessToken(res.data.result.accessToken);
        })
        .catch((err) => {
          if (err.status == 401) {
            navigate("/");
          }
        });
    }
  };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 group">
      {/* Product Info Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <img
          src={cartProduct.productEntity.img}
          alt={cartProduct.productEntity.name}
          className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
        />
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {cartProduct.productEntity.name}
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Size: {cartProduct.size}
            </span>
            {cartProduct.toppingEntityList.length > 0 && (
              <p className="text-xs text-gray-500 font-medium italic">
                Toppings:{" "}
                {cartProduct.toppingEntityList
                  .map((topping) => topping.nameTopping)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Price Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-4 sm:mt-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
        {/* Quantity Selector */}
        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
          <button
            className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-[#D4A373] transition-colors font-bold disabled:opacity-50"
            onClick={handledescQuantity}
            disabled={cartProduct.quantity <= 1}
          >
            -
          </button>
          <span className="w-10 text-center font-mono font-bold text-gray-800">
            {cartProduct.quantity}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-[#D4A373] transition-colors font-bold"
            onClick={handleIncrequantity}
          >
            +
          </button>
        </div>

        {/* Price & Delete */}
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
          <p className="text-xl sm:text-lg font-black text-[#D4A373] sm:w-32 sm:text-right tracking-tighter">
            {cartProduct.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>

          <button
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
            onClick={handleClearCartProduct}
            title="Xóa sản phẩm"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
