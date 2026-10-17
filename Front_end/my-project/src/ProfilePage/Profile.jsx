import React, { useState, useRef, useEffect } from "react";
import {
  CiUser,
  CiCalendar,
  CiShoppingTag,
  CiWallet,
  CiClock2,
} from "react-icons/ci";
import { HiOutlineReceiptTax } from "react-icons/hi";
import "./ProfilePage.css";
import axiosClient from "../AxiosClient";
import {
  getAccessToken,
  setAccessToken,
} from "../ManagerAccessToken/ManagerAccessToken";
import Navbar from "../Components/Navbar";
import { getLogout, unlogout } from "../ManagerLogout/ManagerLogout";
import { data, useNavigate } from "react-router-dom";
import OrderDetailModal from "./OrderDetailModal";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef(null);
  const [infoUser, setInfoUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [accesstoken, setAccesstoken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [userEntity, setUserEntity] = useState({
    picture: null,
    fullname: "",
    email: "",
    phone: "",
    address: "",
    orderEntities: [],
    orderSHistoryEntities: [],
  });
  useEffect(() => {
    if (getAccessToken() != "") return;
    axiosClient
      .get("/auth/refresh_token", {
        withCredentials: true,
      })
      .then((res) => {
        setAccessToken(res.data.result.accessToken);
        setAccesstoken(res.data.result.accessToken);
      })
      .catch((err) => {
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    if (getLogout() == 0 && getAccessToken() != "") {
      axiosClient
        .get("/auth/info", {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            withCredentials: getLogout() == 1 ? true : false,
          },
        })
        .then((res) => {
          setInfoUser({
            fullname: res.data.result.fullname,
            picture: res.data.result.picture,
          });
        })
        .catch((err) => {
          if (err.status == 401) {
            axiosClient
              .get("/auth/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                if (res.data.statusCode == 401) {
                  return;
                }
                unlogout();
                setAccessToken(res.data.result.accessToken);
                setAccesstoken(res.data.result.accessToken);
              })
              .catch((err) => {
                if (err.status == 401) {
                  return;
                }
              });
          }
        });
    } else {
      axiosClient
        .get("/auth/refresh_token", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.statusCode == 401) {
            return;
          }
          unlogout();
          setAccessToken(res.data.result.accessToken);
          setAccesstoken(res.data.result.accessToken);
        })
        .catch((err) => {
          if (err.status == 401) {
            return;
          }
        });
    }
  }, [getAccessToken()]);

  useEffect(() => {
    setTimeout(() => {
      axiosClient
        .get("/user/profile", {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
        .then((res) => {
          if (res.data.statusCode == 200) {
            setUserEntity(res.data.result);
          }
          if (res.data.statusCode == 401) {
            axiosClient
              .get("/auth/refresh_token", {
                withCredentials: true,
              })
              .then((res) => {
                setAccessToken(res.data.result.accessToken);
                setAccesstoken(res.data.result.accessToken);
              })
              .catch((err) => {
                navigate("/login");
              });
          }
        })
        .catch((err) => {
          navigate("/login");
        });
    }, 100);
  }, [isEditing]);

  const handleChange = (e) => {
    const { fullname, value } = e.target;
    setUserEntity((prev) => ({ ...prev, [fullname]: value }));
  };

  const handleSave = () => {
    console.log("Saving:", userEntity);
    setIsEditing(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgError(false);
    const formData = new FormData();
    formData.append("file", file);

    axiosClient
      .put("/user/update-imgInfo", formData, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        localStorage.setItem(
          "page_before",
          window.location.pathname + window.location.search,
        );
        navigate("/loadingpage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewOrderDetails = (orderDetailsDTO) => {
    setSelectedOrder(orderDetailsDTO);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileInfo
            user={userEntity}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            fullname={fullname}
            setFullname={setFullname}
            setAddress={setAddress}
            address={address}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
          />
        );
      case "history":
        return (
          <OrderHistory
            orders={userEntity.orderSHistoryEntities}
            onViewDetails={handleViewOrderDetails}
          />
        );
      case "status":
        return (
          <OrderStatus
            orders={userEntity.orderEntities}
            onViewDetails={handleViewOrderDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userInfo={infoUser}></Navbar>
      <div className="profile-page-container">
        <div className="profile-sidebar">
          <div className="profile-user-info">
            <div className="avatar-container" onClick={handleUploadClick} title="Bấm để đổi ảnh đại diện">
              {userEntity?.picture && !imgError ? (
                <img
                  src={userEntity.picture}
                  alt="Avatar"
                  className="profile-main-avatar"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="profile-default-avatar">
                  <CiUser className="default-user-icon" />
                </div>
              )}

              <div className="avatar-overlay">
                <div className="overlay-text-content">
                  <span className="camera-icon">📷</span>
                  <span>Đổi ảnh</span>
                </div>
              </div>
            </div>
            <h2 className="profile-main-name">{userEntity.fullname || "Khách Hàng"}</h2>
            <p className="profile-main-email">{userEntity.email}</p>
            <div className="profile-badge-pill">☕ Thành viên Thân Thiết</div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>
          <nav className="profile-nav">
            <button
              className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <CiUser className="nav-button-icon" />
              <span>Thông Tin Cá Nhân</span>
            </button>
            <button
              className={`nav-button ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <HiOutlineReceiptTax className="nav-button-icon" />
              <span>Lịch Sử Mua Hàng</span>
            </button>
            <button
              className={`nav-button ${activeTab === "status" ? "active" : ""}`}
              onClick={() => setActiveTab("status")}
            >
              <CiClock2 className="nav-button-icon" />
              <span>Trạng Thái Đơn Hàng</span>
            </button>
          </nav>
        </div>
        <div className="profile-content">{renderContent()}</div>
      </div>
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

const ProfileInfo = ({
  user,
  isEditing,
  setIsEditing,
  setFullname,
  fullname,
  email,
  setEmail,
  address,
  setAddress,
  phone,
  setPhone,
}) => {
  const navigate = useNavigate();
  return (
    <div className="content-section">
      <div className="section-header">
        <div className="section-header-left">
          <h2>Hồ Sơ Của Tôi</h2>
          <p className="section-subtitle">Quản lý thông tin hồ sơ và địa chỉ giao hàng</p>
        </div>
        <div className="action-buttons-group">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  axiosClient
                    .put(
                      `/user/update-info`,
                      {
                        email: email,
                        phone: phone,
                        fullname: fullname,
                        address: address,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${getAccessToken()}`,
                        },
                      },
                    )
                    .then((res) => {
                      if (res.data.statusCode == 204 || res.data.statusCode == 200) {
                        setIsEditing(false);
                        localStorage.setItem(
                          "page_before",
                          window.location.pathname + window.location.search,
                        );
                        navigate("/loadingpage");
                      }
                      if (res.data.statusCode == 400) {
                        alert(res.data.message);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
                className="action-button save-btn"
              >
                Lưu Thay Đổi
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="action-button cancel-btn"
              >
                Huỷ
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setFullname(user.fullname || "");
                setEmail(user.email || "");
                setPhone(user.phone || "");
                setAddress(user.address || "");
                setIsEditing(true);
              }}
              className="action-button edit-btn"
            >
              Chỉnh Sửa
            </button>
          )}
        </div>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <label>Họ và Tên</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              placeholder="Nhập họ và tên..."
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          ) : (
            <p className={!user.fullname ? "empty-val" : ""}>{user.fullname || "Chưa cập nhật"}</p>
          )}
        </div>
        <div className="info-item">
          <label>Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className={!user.email ? "empty-val" : ""}>{user.email || "Chưa cập nhật"}</p>
          )}
        </div>
        <div className="info-item">
          <label>Số điện thoại</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              placeholder="Nhập số điện thoại..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <p className={!user.phone ? "empty-val" : ""}>{user.phone || "Chưa cập nhật"}</p>
          )}
        </div>
        <div className="info-item">
          <label>Địa chỉ nhận hàng</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              placeholder="Nhập địa chỉ nhận hàng..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <p className={!user.address ? "empty-val" : ""}>{user.address || "Chưa cập nhật"}</p>
          )}
        </div>
        <div className="info-item full-width">
          <label>Hạng Thành Viên</label>
          <p>Khách hàng VIP • Coffee Chill Diamond Club</p>
        </div>
      </div>
    </div>
  );
};

const OrderHistory = ({ orders, onViewDetails }) => {
  const getStatusClass = (status) => {
    if (!status) return "unknown";
    return status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="content-section">
      <div className="compact-header">
        <div className="title-wrapper">
          <HiOutlineReceiptTax className="section-icon-small" />
          <h2>Lịch Sử Đơn Hàng</h2>
        </div>
        <div className="order-count-pill">{orders?.length || 0} Đơn Hàng</div>
      </div>
      {!orders || orders.length === 0 ? (
        <div className="profile-empty-orders">
          <HiOutlineReceiptTax />
          <p>Bạn chưa có lịch sử mua hàng nào</p>
        </div>
      ) : (
        <div className="order-grid-compact">
          {orders.map((order) => (
            <div key={order.id} className="compact-card history">
              <div className="compact-card-top">
                <span className="compact-id">#{order.id}</span>
                <div
                  className={`compact-status status-${getStatusClass(order.status)}`}
                >
                  {order.status}
                </div>
              </div>
              <div className="compact-card-mid">
                <div className="compact-info">
                  <CiCalendar />
                  <span>{order.timeOrderHistory}</span>
                </div>
                <div className="compact-price">
                  {order.totalPrice?.toLocaleString()}đ
                </div>
              </div>
              <button
                className="compact-btn"
                onClick={() =>
                  axiosClient
                    .get(`/order/get-ordt/${order.order_id}`, {
                      headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                      },
                    })
                    .then((res) => {
                      if (res.data.statusCode == 200) {
                        onViewDetails(res.data.result);
                      }
                    })
                    .catch((err) => {
                      console.log("không call được api");
                    })
                }
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderStatus = ({ orders, onViewDetails }) => {
  const getStatusClass = (status) => {
    if (!status) return "unknown";
    return status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-");
  };

  const getStatusIcon = (status) => {
    const s = getStatusClass(status);
    if (s.includes("dang-giao")) return "🚚";
    if (s.includes("dang-xu-ly")) return "⚙️";
    if (s.includes("da-giao")) return "✅";
    return "📦";
  };

  return (
    <div className="content-section">
      <div className="compact-header">
        <div className="title-wrapper">
          <CiClock2 className="section-icon-small" />
          <h2>Theo Dõi Tiến Trình</h2>
        </div>
        <div className="order-count-pill">{orders?.length || 0} Đang Giao</div>
      </div>
      {!orders || orders.length === 0 ? (
        <div className="profile-empty-orders">
          <CiClock2 />
          <p>Hiện không có đơn hàng nào đang trong tiến trình xử lý</p>
        </div>
      ) : (
        <div className="order-grid-compact">
          {orders.map((order) => (
            <div
              key={order.id}
              className="compact-card tracking"
              style={{ cursor: "pointer" }}
            >
              <div className="compact-card-top">
                <span className="compact-id">#{order.id}</span>
                <span className="compact-icon-mini">
                  {getStatusIcon(order.status)}
                </span>
              </div>
              <div className="compact-status-row">
                <span
                  className={`status-text-tiny color-${getStatusClass(order.status)}`}
                >
                  {order.status}
                </span>
                <span className="percentage-tiny">{order.progress || 25}%</span>
              </div>
              <div className="compact-progress-track">
                <div
                  className={`compact-progress-fill fill-${getStatusClass(order.status)}`}
                  style={{ width: `${order.progress || 25}%` }}
                ></div>
              </div>
              <div className="compact-card-bot">
                <span className="time-tiny">{order.createdAt}</span>
                <span className="price-tiny">
                  {order.totalPrice?.toLocaleString()}đ
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
