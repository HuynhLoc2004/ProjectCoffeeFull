import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

const NAV_HEIGHT = 72;

// ===== VIETQR CONFIG (MB BANK) =====
const BANK_ID = "970422"; // MB Bank
const ACCOUNT_NO = "0977958350"; // STK (có thể là SĐT)
const ACCOUNT_NAME = "HUYNH TAN LOC";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Không có thông tin đơn hàng 😢
      </div>
    );
  }

  const { product, _size, toppings, quantity, totalPrice, orderCode } = state;

  // ===== TẠO LINK VIETQR =====
  const vietQRUrl = `
https://api.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}
?amount=${totalPrice}
&addInfo=${encodeURIComponent("Thanh toan " + orderCode)}
&accountName=${encodeURIComponent(ACCOUNT_NAME)}
`;

  // ===== XỬ LÝ SAU KHI THANH TOÁN =====
  const handlePaid = () => {
    // giả lập lưu đơn đã thanh toán
    localStorage.setItem(
      "lastOrder",
      JSON.stringify({
        orderCode,
        totalPrice,
        status: "PAID",
        time: new Date().toISOString(),
      })
    );

    navigate("/payment-success", {
      state: { orderCode, totalPrice },
      replace: true,
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#f7ede2] to-[#f1e3d3]"
      style={{ paddingTop: NAV_HEIGHT }}
    >
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-[#fffaf3] rounded-[28px] shadow-2xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-8 py-6 border-b text-center">
            <h1 className="text-3xl font-serif text-[#3b2a20]">
              Thanh toán đơn hàng
            </h1>
            <p className="text-sm text-[#7a5c48] mt-1">
              Quét QR bằng app ngân hàng
            </p>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-8">
            <div className="space-y-4">
              <InfoRow label="Sản phẩm" value={product.name} />
              {product.category != "cake" && (
                <>
                  <InfoRow label="Size" value={_size} />
                  <InfoRow
                    label="Topping"
                    value={
                      toppings.length
                        ? toppings
                            .map((item) => {
                              return item.name;
                            })
                            .join(", ")
                        : "Không"
                    }
                  />
                </>
              )}
              <InfoRow label="Số lượng" value={quantity} />
              <InfoRow label="Mã đơn" value={orderCode} />

              <div className="mt-6 p-4 rounded-xl bg-[#f3e6d6]">
                <p className="text-sm text-[#7a5c48]">Tổng thanh toán</p>
                <p className="text-3xl font-bold text-[#3b2a20]">
                  {totalPrice.toLocaleString()} đ
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <QRCode value={vietQRUrl} size={220} />
              </div>

              <p className="mt-4 text-sm text-center text-gray-600">
                Kiểm tra đúng <b>số tiền</b> và <b>nội dung</b> trước khi chuyển
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-5 bg-[#f3e6d6] flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border font-semibold"
            >
              Quay lại
            </button>

            <button
              onClick={handlePaid}
              className="flex-1 py-3 rounded-xl bg-[#3b2a20] text-white font-semibold hover:bg-[#c89b6d]"
            >
              Tôi đã thanh toán
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
