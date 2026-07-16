import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import "./index.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./Scolltoppage";
import BackToTop from "./component/BackToTop";
import MouseCursor from "./Components/MouseCursor";
import axiosClient from "./AxiosClient";
import {
  getAccessToken,
  isAccessTokenExpired,
  setAccessToken,
} from "./ManagerAccessToken/ManagerAccessToken";
import { unlogout, logout } from "./ManagerLogout/ManagerLogout";
import { preloadCommonRoutes } from "./RoutePreloader";
import { useTheme } from "./Theme/ThemeProvider";

const LayoutMain = lazy(() => import("./Layout/LayoutMain"));
const HeaderPage = lazy(() => import("./Header/Headerpage"));
const ProductPage = lazy(() => import("./Product/ProductPage"));
const OrderPage = lazy(() => import("./OrderPage/OrderPage"));
const ContactPage = lazy(() => import("./ContactPage/ContactPage"));
const CheckoutPage = lazy(() => import("./QRthanhtoan/CheckoutPage"));
const PaymentSuccessPage = lazy(() =>
  import("./Components/Payment/PaymentSuccessPage"),
);
const Authentication = lazy(() =>
  import("./assets/Authentication/Authentication"),
);
const FormRegister = lazy(() => import("./Form/FormRegister"));
const FormLogin = lazy(() => import("./Form/FormLogin"));
const LoadingPage = lazy(() => import("./LoadingPage/LoadingPage"));
const Cartpage = lazy(() => import("./CartPage/Cartpage"));
const PaymentCancelPage = lazy(() =>
  import("./Components/Payment/PaymentCancelPage"),
);
const ChangePassWordPage = lazy(() => import("./Form/ChangePassWordPage"));
const ForgotPassword = lazy(() => import("./Form/ForgotPassword"));
const Shop = lazy(() => import("./Shop/Shop"));
const Vippage = lazy(() => import("./VipPage/Vippage"));
const Profile = lazy(() => import("./ProfilePage/Profile"));
const AdminPage = lazy(() => import("./PAGEADMIN/adminPage"));
const LoginAdmin = lazy(() => import("./PAGEADMIN/LoginAdmin/LoginAdmin"));
const ChatAI = lazy(() => import("./Components/ChatAI/ChatAI"));

function App() {
  const { theme } = useTheme();
  useEffect(() => {
    const preload = () => preloadCommonRoutes();
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preload, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(preload, 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    // PayOS performs a full-page redirect back to the application. Keep the
    // current session when its access token is still valid instead of forcing
    // an unnecessary refresh request that can redirect the user to /login.
    if (!isAccessTokenExpired(accessToken, 60)) {
      unlogout();
      return;
    }

    if (accessToken) {
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
            setAccessToken("");
            logout();
            window.location.href = "/login";
          }
        })
        .catch(() => {
          setAccessToken("");
          logout();
          window.location.href = "/login";
        });
    }
  }, []);

  useEffect(() => {
    const refreshTokenInterval = setInterval(
      () => {
        const accessToken = getAccessToken();
        if (accessToken && isAccessTokenExpired(accessToken, 60)) {
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
                setAccessToken("");
                logout();
                console.log("Refresh token expired, redirecting to login");
                window.location.href = "/login";
              }
            })
            .catch((err) => {
              if (err.response?.status === 401) {
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
    );

    return () => clearInterval(refreshTokenInterval);
  }, []);

  return (
    <div>
      <MouseCursor />
      <ScrollToTop />
      <BackToTop />
      <Suspense fallback={null}>
        <ChatAI />
      </Suspense>
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
        theme={theme}
      />
      <Suspense
        fallback={
          <div className="min-h-screen grid place-items-center bg-[#140a05] text-[#D4A373]">
            Đang tải...
          </div>
        }
      >
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
      </Suspense>
    </div>
  );
}
export default App;
