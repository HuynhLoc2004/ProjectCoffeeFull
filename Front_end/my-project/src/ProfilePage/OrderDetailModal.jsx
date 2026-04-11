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
              {order?.orderDetailsDTOS && order.orderDetailsDTOS.length > 0 ? (
                order.orderDetailsDTOS.map((item, idx) => (
                  <div key={idx} className="product-item-detail">
                    <img
                      src={item.pictureProduct}
                      alt={item.nameproduct}
                      className="product-image-detail"
                    />
                    <div className="product-info-detail">
                      <div className="product-name-detail">
                        <span className="quantity-badge">{item.quantity}x</span>
                        {item.nameproduct}
                      </div>
                      <div className="product-meta-detail">
                        <span>Size: {item.size}</span>
                        {item.toppingDTOs && item.toppingDTOs.length > 0 && (
                          <span className="toppings-detail">
                            {" "}
                            - Toppings:{" "}
                            {item.toppingDTOs
                              .map((t) => t.nameTopping)
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="product-price-detail">
                      {item.totalPrice.toLocaleString()}đ
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-product-state">
                  <p>Không có sản phẩm nào trong đơn hàng này.</p>
                </div>
              )}
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
