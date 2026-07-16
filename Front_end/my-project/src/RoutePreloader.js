const routeLoaders = {
  "/": () => import("./Header/Headerpage"),
  "/product": () => import("./Product/ProductPage"),
  "/shop": () => import("./Shop/Shop"),
  "/rank-page": () => import("./VipPage/Vippage"),
  "/contact": () => import("./ContactPage/ContactPage"),
  "/Cartpage": () => import("./CartPage/Cartpage"),
  "/profile": () => import("./ProfilePage/Profile"),
  "/change-password": () => import("./Form/ChangePassWordPage"),
  "/login": () => import("./Form/FormLogin"),
};

export const preloadRoute = (path) => routeLoaders[path]?.();

export const preloadCommonRoutes = () =>
  Promise.allSettled([preloadRoute("/product"), preloadRoute("/shop")]);
