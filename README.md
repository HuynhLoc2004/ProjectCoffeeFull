# Project Coffee ☕

Một hệ thống quản lý và kinh doanh cà phê hiện đại, tích hợp trí tuệ nhân tạo (AI) và hệ thống thanh toán trực tuyến chuyên nghiệp. Dự án được xây dựng với kiến trúc Client-Server mạnh mẽ, mang lại trải nghiệm người dùng mượt mà và khả năng quản trị tối ưu.

## 🚀 Tính năng nổi bật

### 🛒 Trải nghiệm khách hàng
- **Hệ thống cửa hàng (Shop):** Duyệt danh sách sản phẩm cà phê, bánh ngọt với giao diện hiện đại, hiệu ứng mượt mà.
- **Giỏ hàng & Đặt hàng:** Quản lý giỏ hàng thông minh, hỗ trợ tùy chọn kích cỡ, toppings và quy trình đặt hàng tối ưu.
- **Thanh toán trực tuyến:** Tích hợp cổng thanh toán **PayOS** (hỗ trợ QR Code) giúp giao dịch nhanh chóng và an toàn.
- **Hệ thống VIP & Ranking:** Phân hạng thành viên (Vip Page) với các ưu đãi đặc quyền dựa trên mức độ tương tác.
- **AI Chatbot Assistant:** Tích hợp trợ lý ảo thông minh (sử dụng **Google Gemini AI**) hỗ trợ tư vấn sản phẩm và giải đáp thắc mắc khách hàng.

### 🛡️ Bảo mật & Tài khoản
- **Xác thực đa phương thức:** Đăng nhập, đăng ký, quên mật khẩu và đổi mật khẩu.
- **Quản lý Token:** Cơ chế tự động làm mới Access Token (Refresh Token) giúp duy trì phiên đăng nhập bảo mật.
- **Phân quyền:** Hệ thống phân quyền chặt chẽ giữa khách hàng (User) và quản trị viên (Admin).

### 📊 Quản trị viên (Admin Dashboard)
- **Tổng quan (Dashboard):** Thống kê doanh thu, đơn hàng và lượng khách hàng qua biểu đồ trực quan (**Recharts**).
- **Quản lý đơn hàng:** Theo dõi trạng thái đơn hàng từ lúc đặt đến khi hoàn tất.
- **Quản lý sản phẩm:** Thêm, sửa, xóa và cập nhật kho hàng.
- **Quản lý khách hàng:** Xem thông tin và lịch sử mua hàng của người dùng.

---

## 🛠️ Công nghệ sử dụng

### Front-end
- **Core:** React 19, Vite, React Router Dom v7.
- **Styling & UI:** Tailwind CSS, Framer Motion, GSAP, AOS (Animate On Scroll).
- **Icons & Visuals:** Lucide React, React Icons, Swiper, Three.js, Canvas Confetti.
- **State & Data:** Axios, React Toastify, Recharts.

### Back-end
- **Core:** Java 21, Spring Boot 3.2.2.
- **Security:** Spring Security, OAuth2, JWT (JSON Web Token).
- **Database:** SQL Server (MSSQL), Redis (Caching).
- **AI Integration:** Spring AI (Google GenAI/Gemini).
- **Payment Gateway:** PayOS.
- **Cloud Storage:** Cloudinary (Quản lý hình ảnh).
- **Utilities:** MapStruct, Lombok, Spring Mail.
- **Documentation:** Swagger/OpenAPI.

---

## 📂 Cấu trúc dự án

```text
ProjectCoffe/
├── Front_end/            # Mã nguồn Front-end (React)
│   └── my-project/
│       ├── src/
│       │   ├── Components/ # Các component dùng chung & Page Admin
│       │   ├── PAGEADMIN/  # Giao diện dành cho quản trị
│       │   ├── CartPage/   # Quản lý giỏ hàng
│       │   └── ...         # Các trang chức năng khác
├── ProJectBackWeb/       # Mã nguồn Back-end (Spring Boot)
│   └── src/main/java/com/example/ProJectBackWeb/
│       ├── Controller/     # Xử lý API Endpoints
│       ├── EntityModel/    # Định nghĩa cấu trúc dữ liệu (ORM)
│       ├── Reponsitory/    # Tương tác cơ sở dữ liệu
│       └── Config/         # Cấu hình Security, AI, Payment...
└── init.sql              # File khởi tạo cơ sở dữ liệu
```

---

## ⚙️ Cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- **Java:** JDK 21 hoặc cao hơn.
- **Node.js:** v18.x trở lên.
- **Cơ sở dữ liệu:** SQL Server & Redis Server.
- **Công cụ:** Maven (cho Java), npm/yarn (cho React).

### 2. Cấu hình Back-end
1. Mở thư mục `ProJectBackWeb`.
2. Cấu hình cơ sở dữ liệu trong `src/main/resources/application.properties`:
   - DB URL, Username, Password.
   - Redis Host/Port.
   - Cloudinary Keys.
   - PayOS Keys.
   - Google Gemini API Key.
3. Chạy lệnh:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### 3. Cấu hình Front-end
1. Mở thư mục `Front_end/my-project`.
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ mặc định: `http://localhost:5173`.

---

## 📝 Ghi chú
- Đảm bảo SQL Server đã được chạy và database đã được khởi tạo bằng file `init.sql`.
- Cần cấu hình đúng `CORS` trong Spring Boot để Front-end có thể gọi API thành công.

---
*Chúc bạn có trải nghiệm tuyệt vời với Project Coffee!* ☕✨
