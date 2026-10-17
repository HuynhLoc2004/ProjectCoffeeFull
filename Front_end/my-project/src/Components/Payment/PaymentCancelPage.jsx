import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { X, ArrowLeft, ShoppingBag, RotateCcw } from "lucide-react";
import "./PaymentCancelPage.css";

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const [countdown, setCountdown] = useState(5);

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
        {/* Cancel Icon */}
        <div className="payment-icon-circle cancel">
          <X size={38} strokeWidth={2.8} />
        </div>

        {/* Title & Description */}
        <h1 className="payment-status-title">Thanh toán bị hủy</h1>
        <p className="payment-status-desc">
          Giao dịch của bạn đã không được hoàn tất. Đừng lo lắng, các món đã chọn vẫn được lưu trong giỏ hàng của bạn.
        </p>

        {/* Order Code Pill if present */}
        {orderCode && (
          <div className="payment-info-box">
            <span className="payment-info-label">Mã giao dịch:</span>
            <span className="payment-info-value">#{orderCode}</span>
          </div>
        )}

        {/* Live Countdown Badge */}
        <div className="payment-countdown-badge">
          <RotateCcw size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
          <span>
            Tự động về trang chủ sau <b className="countdown-number">{countdown}s</b>
          </span>
        </div>

        {/* Actions */}
        <div className="payment-actions-col">
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="btn-payment-primary"
          >
            <ArrowLeft size={18} />
            <span>Quay về trang chủ ngay ({countdown}s)</span>
          </button>

          <Link to="/cart" className="btn-payment-secondary">
            <ShoppingBag size={17} />
            <span>Xem lại giỏ hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;