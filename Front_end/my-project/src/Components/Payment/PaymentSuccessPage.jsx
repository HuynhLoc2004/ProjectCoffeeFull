import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Check, ArrowLeft, RotateCcw } from "lucide-react";
import axiosClient from "../../AxiosClient";
import "./PaymentCancelPage.css";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [orderInfo, setOrderInfo] = useState({
    orderCode: state?.orderCode || searchParams.get("orderCode"),
    totalPrice: state?.totalPrice || 0,
  });

  useEffect(() => {
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
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="payment-status-wrapper page-shell">
      <div className="payment-status-card">
        {/* Success Icon */}
        <div className="payment-icon-circle success">
          <Check size={42} strokeWidth={3} />
        </div>

        <h1 className="payment-status-title">Thanh toán thành công!</h1>
        <p className="payment-status-desc">
          Cảm ơn bạn đã đặt món tại The Coffee Chill. Quán đang chuẩn bị pha chế và sẽ giao đến bạn trong thời gian sớm nhất!
        </p>

        <div className="payment-info-box">
          <span className="payment-info-label">Mã đơn hàng:</span>
          <span className="payment-info-value">#{orderInfo.orderCode || "---"}</span>
        </div>

        {orderInfo.totalPrice > 0 && (
          <div className="payment-info-box" style={{ marginTop: "-12px" }}>
            <span className="payment-info-label">Tổng thanh toán:</span>
            <span className="payment-info-value" style={{ color: "#d4a373", fontSize: "1.1rem" }}>
              {orderInfo.totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>
        )}

        <div className="payment-countdown-badge">
          <RotateCcw size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
          <span>
            Tự động về trang chủ sau <b className="countdown-number">{countdown}s</b>
          </span>
        </div>

        <button 
          onClick={() => navigate("/", { replace: true })}
          className="btn-payment-primary"
        >
          <ArrowLeft size={18} />
          <span>Quay lại Trang chủ ngay ({countdown}s)</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
