import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./index.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormRegister from "./Form/FormRegister";
import LayoutMain from "./Layout/LayoutMain";
import HeaderPage from "./Header/Headerpage";
import ProductPage from "./Product/ProductPage";
import OrderPage from "./OrderPage/OrderPage";
import ContactPage from "./ContactPage/ContactPage";
import CheckoutPage from "./QRthanhtoan/CheckoutPage";
import PaymentSuccessPage from "../src/Components/Payment/PaymentSuccessPage";
import ScrollToTop from "./Scolltoppage";
import BackToTop from "./component/BackToTop";
import ChatAI from "./Components/ChatAI/ChatAI";
import MouseCursor from "./Components/MouseCursor";
import Authentication from "./assets/Authentication/Authentication";
import FormLogin from "./Form/FormLogin";
import LoadingPage from "./LoadingPage/LoadingPage";
import Cartpage from "./CartPage/Cartpage";
import PaymentCancelPage from "./Components/Payment/PaymentCancelPage";
import ChangePassWordPage from "./Form/ChangePassWordPage";
import ForgotPassword from "./Form/ForgotPassword";
import Shop from "./Shop/Shop";
import Vippage from "./VipPage/Vippage";
import Profile from "./ProfilePage/Profile";
import AdminPage from "./PAGEADMIN/adminPage";
import LoginAdmin from "./PAGEADMIN/LoginAdmin/LoginAdmin";
import axiosClient from "./AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "./ManagerAccessToken/ManagerAccessToken";
import { unlogout, logout } from "./ManagerLogout/ManagerLogout";

function App() {
  const sv = {
    id: String,
    age: Number,
  };
  // Check authentication on app load
  useEffect(() => {
    if (getAccessToken()) {
      // Verify if refresh token is still valid
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 200) {
            setAccessToken(res.data.result.accessToken);
            unlogout();
            console.log("Token verified on app load");
          } else {
            // Refresh token invalid, redirect to login
            setAccessToken("");
            logout();
            window.location.href = "/login";
          }
        })
        .catch((err) => {
          // Refresh token invalid, redirect to login
          setAccessToken("");
          logout();
          window.location.href = "/login";
        });
    }
  }, []);

  // Auto refresh token every 5 minutes
  useEffect(() => {
    const refreshTokenInterval = setInterval(
      () => {
        if (getAccessToken()) {
          axiosClient
            .get("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.statusCode == 200) {
                setAccessToken(res.data.result.accessToken);
                unlogout();
                console.log("Token refreshed automatically");
              } else if (res.data.statusCode == 401) {
                // Refresh token expired, clear tokens and redirect to login
                setAccessToken("");
                logout();
                console.log("Refresh token expired, redirecting to login");
                window.location.href = "/login";
              }
            })
            .catch((err) => {
              if (err.response?.status === 401) {
                // Refresh token expired, clear tokens and redirect to login
                setAccessToken("");
                logout();
                console.log("Refresh token expired, redirecting to login");
                window.location.href = "/login";
              } else {
                console.log("Failed to refresh token:", err);
              }
            });
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(refreshTokenInterval);
  }, []);

  return (
    <div>
      <MouseCursor />
      <ScrollToTop />
      <BackToTop />
      <ChatAI />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route element={<LayoutMain />}>
          <Route path="/" element={<HeaderPage />}></Route>
          <Route path="/product" element={<ProductPage />}></Route>
          <Route path="/order" element={<OrderPage />}></Route>
          <Route path="/Cartpage" element={<Cartpage />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/rank-page" element={<Vippage />}></Route>
          <Route path="/contact" element={<ContactPage />}></Route>
        </Route>
        <Route path="/authentication" element={<Authentication />}></Route>
        <Route path="registry" element={<FormRegister />}></Route>
        <Route path="/login/:message" element={<FormLogin />}></Route>
        <Route path="/login" element={<FormLogin />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/loadingpage" element={<LoadingPage />}></Route>
        <Route path="/payment-cancel" element={<PaymentCancelPage />}></Route>
        <Route path="/change-password" element={<ChangePassWordPage />}></Route>
        <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/admin" element={<AdminPage></AdminPage>}></Route>
        <Route path="/admin/login" element={<LoginAdmin />}></Route>
        <Route path="/admin-login" element={<LoginAdmin></LoginAdmin>}></Route>
      </Routes>
    </div>
  );
}
export default App;
