import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import "./ChangePassWordPage.css";
import axiosClient from "../AxiosClient";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { logout } from "../ManagerLogout/ManagerLogout";

const ChangePassWordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  // Pre-fill email if logged in
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      axiosClient
        .get("/auth/info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.result?.email) {
            setEmail(res.data.result.email);
          }
        })
        .catch(() => {});
    }
  }, []);

  // OTP Countdown Timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const changeStep = (s) => {
    setError("");
    setMessage("");
    setStep(s);
  };

  const sendOtp = async () => {
    if (!email || !email.trim()) {
      setError("Vui lòng nhập địa chỉ email của bạn");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Địa chỉ email không đúng định dạng");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const trimmedEmail = email.trim();
      const res = await axiosClient.post(
        "/email/send-OTP-ChangePassword",
        { email: trimmedEmail },
        {
          timeout: 60000,
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      if (res.data?.statusCode !== 200 || res.data?.result !== true) {
        throw new Error(res.data?.message || "Không thể gửi OTP");
      }

      setMessage("Mã xác thực OTP đã được gửi đến email của bạn.");
      setCountdown(60);
      changeStep(2);
    } catch (err) {
      console.error("Lỗi gửi OTP:", err);
      if (err.response?.status === 403 && !err.response?.data) {
        setMessage("Mã xác thực OTP đã được gửi đến email của bạn.");
        setCountdown(60);
        changeStep(2);
        return;
      }
      if (err.response?.status === 401) {
        try {
          const refreshRes = await axiosClient.get("/auth/refresh_token", {
            withCredentials: true,
          });
          const newToken = refreshRes.data.result.accessToken;
          setAccessToken(newToken);

          const retryRes = await axiosClient.post(
            "/email/send-OTP-ChangePassword",
            { email: email.trim() },
            {
              timeout: 60000,
              headers: { Authorization: `Bearer ${newToken}` },
            },
          );

          if (retryRes.data?.statusCode !== 200 || retryRes.data?.result !== true) {
            throw new Error(retryRes.data?.message || "Không thể gửi OTP");
          }

          setMessage("Mã xác thực OTP đã được gửi đến email của bạn.");
          setCountdown(60);
          changeStep(2);
          return;
        } catch (refreshErr) {
          localStorage.setItem(
            "page_before",
            window.location.pathname + window.location.search,
          );
          navigate("/login");
          return;
        }
      }
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Không thể gửi mã OTP. Vui lòng thử lại sau.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otpEmail.length !== 6) {
      setError("Mã OTP phải có đầy đủ 6 chữ số");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await axiosClient.post(
        "/email/verify-OTP-ChangePassword",
        { otpEmail },
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      if (data.data?.statusCode !== 200 || !data.data?.result) {
        throw new Error(data.data?.message || "Mã OTP không đúng hoặc đã hết hạn");
      }
      setVerificationToken(data.data.result);
      changeStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axiosClient.post(
        "/user/change-password",
        {
          newPassword,
          verificationToken,
        },
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      if (res.data?.statusCode !== 201 || res.data?.result !== true) {
        throw new Error(res.data?.message || "Đổi mật khẩu thất bại");
      }

      setMessage("Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...");
      clearAccessToken();
      logout();
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) sendOtp();
    if (step === 2) verifyOtp();
    if (step === 3) changePassword();
  };

  return (
    <div className="auth-form-wrapper page-shell">
      <div className="auth-form-card">
        {/* Card Header */}
        <div className="auth-card-header">
          <div className="auth-badge-icon">
            <KeyRound size={28} />
          </div>
          <h1 className="auth-card-title">Đổi Mật Khẩu</h1>
          <p className="auth-card-subtitle">
            {step === 1 && "Nhập email tài khoản để nhận mã xác thực bảo mật"}
            {step === 2 && `Nhập mã OTP 6 số đã gửi đến ${email}`}
            {step === 3 && "Thiết lập mật khẩu mới an toàn cho tài khoản"}
          </p>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="auth-step-wizard">
          <div className={`auth-wizard-item ${step === 1 ? "active" : "completed"}`}>
            <div className="auth-wizard-circle">
              {step > 1 ? <Check size={14} strokeWidth={3} /> : "1"}
            </div>
            <span className="auth-wizard-label">Email</span>
          </div>

          <div className={`auth-wizard-item ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
            <div className="auth-wizard-circle">
              {step > 2 ? <Check size={14} strokeWidth={3} /> : "2"}
            </div>
            <span className="auth-wizard-label">Xác thực</span>
          </div>

          <div className={`auth-wizard-item ${step === 3 ? "active" : ""}`}>
            <div className="auth-wizard-circle">
              {step === 3 ? <ShieldCheck size={14} strokeWidth={2.5} /> : "3"}
            </div>
            <span className="auth-wizard-label">Mật khẩu mới</span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="auth-alert auth-alert-success">
            <Check size={18} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="auth-field-group">
              <label className="auth-label">Địa chỉ Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="auth-field-group">
              <label className="auth-label">Mã xác thực OTP (6 chữ số)</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-input otp-input-large"
                  placeholder="••••••"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength="6"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="auth-field-group">
                <label className="auth-label">Mật khẩu mới (Tối thiểu 8 ký tự)</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="auth-eye-btn"
                    tabIndex="-1"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Xác nhận mật khẩu mới</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-eye-btn"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-auth-primary"
            disabled={isLoading || (step === 2 && otpEmail.length !== 6)}
          >
            {isLoading ? (
              <RotateCcw size={18} className="animate-spin" />
            ) : step === 1 ? (
              "Nhận mã OTP qua Email"
            ) : step === 2 ? (
              "Xác nhận mã OTP"
            ) : (
              "Lưu mật khẩu mới"
            )}
          </button>

          {/* Resend OTP in Step 2 */}
          {step === 2 && (
            <button
              type="button"
              className="btn-auth-resend"
              onClick={sendOtp}
              disabled={countdown > 0 || isLoading}
            >
              {countdown > 0 ? `Gửi lại mã OTP sau (${countdown}s)` : "Chưa nhận được? Gửi lại mã OTP"}
            </button>
          )}

          {/* Footer Navigation */}
          <div className="auth-footer-links">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => changeStep(step - 1)}
                className="auth-back-step-btn"
              >
                <ArrowLeft size={14} />
                <span>Quay lại bước trước</span>
              </button>
            ) : (
              <Link to="/" className="auth-back-step-btn">
                <ArrowLeft size={14} />
                <span>Trang chủ</span>
              </Link>
            )}

            <Link to="/login" className="auth-link">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassWordPage;
