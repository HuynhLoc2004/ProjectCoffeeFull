import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import {
  CiCalendar,
  CiLocationOn,
  CiDeliveryTruck,
  CiReceipt,
} from "react-icons/ci";
import "./OrderDetailModal.css";

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleTransitionEnd = (e) => {
    if (!isOpen && e.propertyName === "opacity") {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "open" : "closing"}`}
      onClick={onClose}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <CiReceipt className="header-icon" />
            <div>
              <h3>Chi tiết đơn hàng</h3>
              <p className="order-id">Mã đơn: #{order?.order_id || "N/A"}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Thông tin chung */}
          <div className="detail-section info-cards">
            <div className="info-card">
              <CiCalendar className="card-icon" />
              <div className="card-text">
                <label>Ngày đặt</label>
                <span>{order?.createdAtOrder || "N/A"}</span>
              </div>
            </div>
            <div className="info-card">
              <CiDeliveryTruck className="card-icon" />
              <div className="card-text">
                <label>Trạng thái</label>
                <span
                  className={`status-pill ${order?.status?.toLowerCase()?.replace(/\s+/g, "-")}`}
                >
                  {order?.statusOrder || "Chưa xác định"}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="section-title">
              <CiLocationOn />
              <h4>Địa chỉ nhận hàng</h4>
            </div>
            <div className="address-box">
              <p className="recipient-name">
                Người nhận: {order?.fullnameUser || "Người dùng"}
              </p>
              <p className="recipient-phone">
                SĐT: {order?.phoneUser || "N/A"}
              </p>
              <p className="recipient-address">
                {order?.adresssUser || "Chưa cập nhật địa chỉ"}
              </p>
            </div>
          </div>

          <div className="detail-section">
            <div className="section-title">
              <h4>Danh sách sản phẩm</h4>
            </div>
            <div className="product-list">
              {/* User will map their API data here */}
              <div className="empty-product-state">
                <p>Dữ liệu sản phẩm sẽ được render ở đây</p>
                <p className="hint">
                  (Bạn hãy map order.products hoặc dữ liệu chi tiết vào đây)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="total-row">
            <span>Tổng cộng:</span>
            <span className="total-amount">
              {order?.totalpriceOrder?.toLocaleString() || 0}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
