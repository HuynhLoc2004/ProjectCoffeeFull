import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft, FaTrash } from "react-icons/fa"; // Re-added FaTrash
import "./CartPage.css"; // Import the new CSS file
import ProductCart from "./ProductCart"; // Importing ProductCart component
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { unlogout } from "../ManagerLogout/ManagerLogout";
import axiosClient from "../AxiosClient";

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 py-16">
    <FaShoppingCart className="w-24 h-24 mb-6 text-gray-400" />
    <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 mb-4">
      Giỏ hàng của bạn trống
    </h1>
    <p className="text-lg text-gray-500 mb-8">
      Hãyเติม đầy giỏ hàng của bạn với những sản phẩm tuyệt vời.
    </p>
    <Link
      to="/"
      className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full text-lg font-semibold transition-transform transform hover:scale-105"
    >
      <FaArrowLeft />
      Tiếp tục mua sắm
    </Link>
  </div>
);

const Cartpage = () => {
  const [cart, setCart] = useState(null);
  const [checkupdate, setCheckupdate] = useState(0);
  const navigate = useNavigate();
  const [accesstoken, setAccesstoken] = useState(getAccessToken());

  const handleCheckout = () => {
    axiosClient
      .post(
        "/order/create",
        {
          totalPrice: cart.totalPrice,
          createOrder: Date.now(),
          cartProductEntities: cart.cartProductEntities,
          type_order: "ORDER_CART",
        },
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      )
      .then((res) => {
        if (res.data.statusCode == 201) {
          const order_id = res.data.result;

          axiosClient
            .get(`/payos/createQr?order_id=${order_id}`, {
              headers: {
                Authorization: `Bearer ${getAccessToken()}`,
              },
            })
            .then((res) => {
              if (res.data.statusCode == 200) {
                window.location.href = res.data.result.checkoutUrl;
              }
            })
            .catch((err) => {
              console.log(getAccessToken());
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let hasRefreshed = false;

    const fetchCart = () => {
      if (getAccessToken()) {
        axiosClient
          .get("/cart/getCart", {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          })
          .then((res) => {
            if (res.data.statusCode == 204) {
              setCart(res.data.result);
            }
          })
          .catch((err) => {
            if (err.status == 401 && !hasRefreshed) {
              hasRefreshed = true;
              axiosClient
                .get("/auth/refresh_token", {
                  withCredentials: true,
                })
                .then((res) => {
                  if (res.data.statusCode == 200) {
                    setAccessToken(res.data.result.accessToken);
                    unlogout();
                    setAccesstoken(res.data.result.accessToken);
                    // Retry cart request with new token
                    fetchCart();
                  } else if (res.data.statusCode == 401) {
                    localStorage.setItem(
                      "page_before",
                      window.location.pathname + window.location.search,
                    );
                    navigate("/login");
                  }
                })
                .catch((err) => {
                  if (err.status === 401) {
                    localStorage.setItem(
                      "page_before",
                      window.location.pathname + window.location.search,
                    );
                    navigate("/login");
                  }
                });
            } else if (err.status == 401 && hasRefreshed) {
              // Already tried refresh, redirect to login
              localStorage.setItem(
                "page_before",
                window.location.pathname + window.location.search,
              );
              navigate("/login");
            }
          });
      } else {
        // No token, redirect to login
        localStorage.setItem(
          "page_before",
          window.location.pathname + window.location.search,
        );
        navigate("/login");
      }
    };

    fetchCart();
  }, [accesstoken, checkupdate, navigate]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 p-4 sm:p-6 lg:p-8 font-sans cart-slide-down" style={{ paddingTop: "100px" }}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-6 sm:p-10 border border-gray-100">
          {!cart || cart.cartProductEntities.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-gray-100 pb-6 gap-4">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter">
                  Giỏ Hàng <span className="text-[#D4A373] text-lg sm:text-xl ml-2">({cart.cartProductEntities.length} món)</span>
                </h1>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#D4A373] transition-colors uppercase tracking-widest"
                >
                  <FaArrowLeft size={12} /> Tiếp tục mua sắm
                </Link>
              </div>

              <div className="space-y-2 mb-10">
                {cart.cartProductEntities.map((cartProduct) => (
                  <ProductCart
                    key={cartProduct.id}
                    cartProduct={cartProduct}
                    setCheckUpdate={setCheckupdate}
                  />
                ))}
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-6 sm:p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Tổng giá trị:
                  </h2>
                  <p className="text-3xl sm:text-4xl font-black text-[#D4A373] tracking-tighter">
                    {cart.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full sm:w-auto px-12 py-5 bg-[#1a1a1a] text-white rounded-2xl text-lg font-black transition-all hover:bg-[#D4A373] hover:shadow-xl hover:shadow-[#D4A373]/20 uppercase tracking-widest"
                  >
                    Thanh toán ngay
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cartpage;
