import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentCancelPage.css';

/**
 * PaymentCancelPage Component - v4 (Fast, Clean & Direct)
 *
 * This version prioritizes speed, clarity, and direct user feedback.
 * - Renders with a single, fast fade-in animation.
 * - Features a clean, professional design with a subtle shadow on the main card.
 * - The call-to-action is a single button with a clear "return" arrow icon.
 * - The color palette is simple and universally understood (blue for action, red for cancel).
 */
const PaymentCancelPage = () => {
  return (
    <div className="payment-cancel-wrapper">
      <div className="cancel-card">
        
        {/* Simple, universally understood cancel icon */}
        <div className="icon-wrapper">
          <svg 
            className="cancel-svg-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </div>

        <h1>Thanh toán bị hủy</h1>
        <p>
          Giao dịch của bạn đã không được hoàn tất. Vui lòng quay lại trang chủ để tiếp tục.
        </p>

        {/* A single, clear call-to-action button with an arrow icon */}
        <Link to="/" className="btn-home">
          <svg 
            className="btn-arrow-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          <span>Quay về trang chủ</span>
        </Link>
        
      </div>
    </div>
  );
};

export default PaymentCancelPage;