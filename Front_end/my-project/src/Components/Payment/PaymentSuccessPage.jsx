import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axiosClient from "../../AxiosClient";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [orderInfo, setOrderInfo] = useState({
    orderCode: state?.orderCode || searchParams.get("orderCode"),
    totalPrice: state?.totalPrice || 0,
  });

  useEffect(() => {
    // Nếu có mã đơn hàng từ URL nhưng chưa có số tiền (trường hợp redirect từ PayOS)
    const urlOrderCode = searchParams.get("orderCode");
    if (!state?.totalPrice && urlOrderCode) {
      axiosClient
        .get(`/order/get-order?orderId=${urlOrderCode}`)
        .then((res) => {
          if (res.data.statusCode === 200) {
            setOrderInfo({
              orderCode: urlOrderCode,
              totalPrice: res.data.result.totalPrice,
            });
          }
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin đơn hàng:", err);
        });
    }
  }, [searchParams, state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7ede2]">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center border border-[#e3d5c8] max-w-md w-full mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-500 mb-8 text-center">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.</p>
        
        <div className="w-full space-y-4 bg-[#fffaf5] p-6 rounded-xl border border-[#f3e9df] mb-8">
          <div className="flex justify-between items-center pb-3 border-b border-[#f3e9df]">
            <span className="text-gray-500 font-medium">Mã đơn hàng:</span>
            <b className="text-gray-800">{orderInfo.orderCode || "---"}</b>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-gray-500 font-medium">Số tiền thanh toán:</span>
            <span className="text-2xl font-bold text-[#c89b6d]">
              {orderInfo.totalPrice?.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6 italic">
          Hệ thống sẽ tự động quay về trang chủ sau 5 giây...
        </p>
        
        <button 
          onClick={() => navigate("/", { replace: true })}
          className="w-full py-4 bg-[#3b2a20] text-white rounded-xl font-bold hover:bg-[#523c2e] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#3b2a20]/20"
        >
          Quay lại Trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
