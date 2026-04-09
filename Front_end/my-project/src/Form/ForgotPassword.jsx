import React, { useState, useEffect } from "react";
import "./ChangePassWordPage.css";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import { useNavigate } from "react-router-dom";

/* ================= Eye Icon ================= */
const EyeIcon = ({ onClick, isVisible }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="eye-icon"
  >
    {isVisible ? (
      <path
        fillRule="evenodd"
        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.974 0 9.19 3.226 10.678 7.697a.75.75 0 010 .606C21.19 16.774 16.974 20.25 12.001 20.25c-4.973 0-9.189-3.476-10.678-7.947a.75.75 0 010-.606zM12 15a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    ) : (
      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 001.06-1.06l-18-18z" />
    )}
  </svg>
);

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [animationKey, setAnimationKey] = useState(1);
  const [accesstoken, setAccesstoken] = useState(getAccessToken());
  const navigate = useNavigate();
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const changeStep = (s) => {
    setError("");
    setMessage("");
    setAnimationKey(s);
    setStep(s);
  };

  const sendOtp = async () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axiosClient.post("/email/send-OTP-forgotPassword", {
        email: email,
      });

      setMessage("Mã OTP đã được gửi về email");
      setCountdown(60);
      changeStep(2);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otpEmail.length !== 6) {
      setError("OTP phải đủ 6 chữ số");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await axiosClient.post("/email/verify-OTP-forgotPassword", {
        otpEmail: otpEmail,
        email: email,
      });

      if (data.data.statusCode == 400) {
        console.log(data);
        setError(data.data.message);
        return;
      }
      changeStep(3);
    } catch (err) {
      setError("OTP không đúng hoặc đã hết hạn");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axiosClient.post("/user/forgot-password", {
        email: email,
        newPassword: newPassword,
      });

      setMessage("Đổi mật khẩu thành công");
       setTimeout(()=>{
        navigate('/login')
       },1500)
    } catch (err) {
      setError("Đổi mật khẩu thất bại");
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

  const getButtonText = () => {
    if (step === 1) return "Nhận Mã OTP";
    if (step === 2) return "Xác Nhận OTP";
    if (step === 3) return "Đổi Mật Khẩu";
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="card-header">
          <h2 className="form-title">
            {step === 1 && "Quên Mật Khẩu"}
            {step === 2 && "Xác Thực OTP"}
            {step === 3 && "Tạo Mật Khẩu Mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div key={animationKey} className="form-step-container">
            {step === 1 && (
              <div className="input-group">
                <input
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <label>Email</label>
              </div>
            )}

            {step === 2 && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder=" "
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  maxLength="6"
                  disabled={isLoading}
                />
                <label>OTP</label>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="input-group password-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder=" "
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <label>Mật khẩu mới</label>
                  <EyeIcon
                    isVisible={showNewPassword}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>

                <div className="input-group password-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <label>Xác nhận mật khẩu</label>
                  <EyeIcon
                    isVisible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </>
            )}
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-message">{message}</p>}

          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading || (step === 1 && countdown > 0)}
          >
            {isLoading ? <div className="spinner"></div> : getButtonText()}
          </button>

          {step === 2 && (
            <button
              type="button"
              className="btn-resend"
              onClick={sendOtp}
              disabled={countdown > 0 || isLoading}
            >
              {countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi lại OTP"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
