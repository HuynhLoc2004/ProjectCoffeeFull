import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoReloadSharp } from "react-icons/io5";
import { setAccessToken } from "../../ManagerAccessToken/ManagerAccessToken";
import { unlogout } from "../../ManagerLogout/ManagerLogout";

const Authentication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("info");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login?error=google_login_failed", { replace: true });
      return;
    }

    setAccessToken(accessToken);
    unlogout();

    const previousPage = localStorage.getItem("page_before");
    const invalidPreviousPage =
      !previousPage ||
      previousPage.startsWith("/login") ||
      previousPage.startsWith("/authentication");

    localStorage.removeItem("page_before");
    navigate(invalidPreviousPage ? "/" : previousPage, { replace: true });
  }, [accessToken, navigate]);

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <p className="text-sm ">Đang xử lí..</p>
      <IoReloadSharp className="text-3xl animate-spin" />
    </div>
  );
};

export default Authentication;
