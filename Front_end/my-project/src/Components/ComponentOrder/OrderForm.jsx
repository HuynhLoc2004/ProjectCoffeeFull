import React from "react";
import axiosClient from "../../AxiosClient";

const OrderForm = ({ product, size, toppings, quantity }) => {
  const handleOrder = async () => {
    const payload = {
      productId: product.id,
      size,
      toppings: toppings.map((t) => t.name),
      quantity,
    };

    // CALL API BACKEND
    await axiosClient.post("/order/create", payload);
    alert("Đặt hàng thành công ☕🧋");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
      <h3 className="text-xl font-bold mb-4">Xác nhận đơn</h3>

      <ul className="text-gray-700 space-y-2">
        <li>
          Sản phẩm: <b>{product.name}</b>
        </li>
        <li>
          Size: <b>{size}</b>
        </li>
        <li>
          Số lượng: <b>{quantity}</b>
        </li>
        <li>
          Topping:
          <b>
            {" "}
            {toppings.length ? toppings.map((t) => t.name).join(", ") : "Không"}
          </b>
        </li>
      </ul>

      <button
        onClick={handleOrder}
        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold hover:scale-105 transition"
      >
        Đặt hàng ngay
      </button>
    </div>
  );
};

export default OrderForm;
