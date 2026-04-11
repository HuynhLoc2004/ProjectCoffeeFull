import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import {
  CiCalendar,
  CiLocationOn,
  CiDeliveryTruck,
  CiReceipt,
  CiPhone,
  CiUser
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

  const formatPrice = (price) => {
    return (price || 0).toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                <span>{formatDate(order?.createdAtOrder)}</span>
              </div>
            </div>
            <div className="info-card">
              <CiDeliveryTruck className="card-icon" />
              <div className="card-text">
                <label>Trạng thái</label>
                <span
                  className={`status-pill ${order?.statusOrder?.toLowerCase()?.replace(/\s+/g, "-")}`}
                >
                  {order?.statusOrder || "Đang xử lý"}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin khách hàng & Địa chỉ */}
          <div className="detail-section">
            <div className="section-title">
              <CiLocationOn />
              <h4>Thông tin nhận hàng</h4>
            </div>
            <div className="address-box">
              <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CiUser size={20} />
                <p className="recipient-name">
                  <strong>Người nhận:</strong> {order?.fullnameUser || "Người dùng"}
                </p>
              </div>
              <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CiPhone size={20} />
                <p className="recipient-phone">
                  <strong>SĐT:</strong> {order?.phoneUser || "Chưa cập nhật"}
                </p>
              </div>
              <div className="info-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CiLocationOn size={20} style={{ marginTop: '2px' }} />
                <p className="recipient-address">
                  <strong>Địa chỉ:</strong> {order?.address || "Chưa cập nhật địa chỉ"}
                </p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="section-title">
              <h4>Danh sách sản phẩm</h4>
            </div>
            <div className="product-list">
              {order?.orderDetailsDTOList && order.orderDetailsDTOList.length > 0 ? (
                order.orderDetailsDTOList.map((item, idx) => (
                  <div key={idx} className="product-item-detail">
                    <img
                      src={item.pictureProduct || "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=200&auto=format&fit=crop"}
                      alt={item.nameproduct}
                      className="product-image-detail"
                    />
                    <div className="product-info-detail">
                      <div className="product-name-detail">
                        <span className="quantity-badge">{item.quantity}x</span>
                        {item.nameproduct}
                      </div>
                      <div className="product-meta-detail">
                        <div className="item-size">Size: {item.size}</div>
                        {item.toppingDTOs && item.toppingDTOs.length > 0 && (
                          <div className="item-toppings">
                            <span className="topping-label">Toppings: </span>
                            {item.toppingDTOs.map((t, tIdx) => (
                              <span key={tIdx} className="topping-tag">
                                {t.nameTopping} (+{formatPrice(t.price_topping)})
                                {tIdx < item.toppingDTOs.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="item-date" style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '4px' }}>
                          Ngày tạo: {formatDate(item.creatAt)}
                        </div>
                      </div>
                    </div>
                    <div className="product-price-detail">
                      {formatPrice(item.totalPrice)}
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
            <span>Tổng cộng hóa đơn:</span>
            <span className="total-amount">
              {formatPrice(order?.totalpriceOrder)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
