/**
 * Chuyển đổi các thông báo lỗi (đặc biệt từ backend Java Spring Boot trả về tiếng Anh)
 * sang tiếng Việt chuẩn, rõ ràng, thân thiện với người dùng The Coffee Chill.
 */
export const localizeMessage = (msg, fallback = "Đã xảy ra lỗi, vui lòng thử lại!") => {
  if (!msg || typeof msg !== "string") return fallback;
  const lower = msg.trim().toLowerCase();

  // 1. Lỗi Tài khoản & Xác thực
  if (
    lower.includes("user not found") ||
    lower.includes("not found user") ||
    lower.includes("user_not_found")
  ) {
    return "Tài khoản không tồn tại trong hệ thống!";
  }

  if (
    lower.includes("password do not matches") ||
    lower.includes("password do not match") ||
    lower.includes("password not match") ||
    lower.includes("wrong password") ||
    lower.includes("bad credentials")
  ) {
    return "Mật khẩu không chính xác. Vui lòng kiểm tra lại!";
  }

  if (
    lower.includes("account blocked") ||
    lower.includes("user is blocked") ||
    lower.includes("account is blocked")
  ) {
    return "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!";
  }

  if (lower.includes("user existed") || lower.includes("username existed")) {
    return "Tên tài khoản này đã được sử dụng. Vui lòng chọn tên khác!";
  }

  if (
    lower.includes("email user existed") ||
    lower.includes("email này đã được người khác sử dụng") ||
    (lower.includes("email") && lower.includes("existed"))
  ) {
    return "Địa chỉ email này đã được sử dụng cho tài khoản khác!";
  }

  if (
    lower.includes("invalid token") ||
    lower.includes("token revoked") ||
    lower.includes("token expired") ||
    lower.includes("jwt expired")
  ) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
  }

  // 2. Lỗi Mạng & Hệ thống
  if (
    lower.includes("network error") ||
    lower.includes("failed to fetch") ||
    lower.includes("econnrefused") ||
    lower.includes("timeout")
  ) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!";
  }

  if (
    lower.includes("internal server error") ||
    lower.includes("unexpected error") ||
    lower.includes("nullpointerexception")
  ) {
    return "Hệ thống đang bận. Vui lòng thử lại sau ít phút!";
  }

  // 3. Lỗi Sản phẩm & Giỏ hàng
  if (lower.includes("product existed")) {
    return "Sản phẩm này đã tồn tại trong hệ thống!";
  }

  if (
    lower.includes("not found product") ||
    lower.includes("product not found") ||
    lower.includes("not found product by code")
  ) {
    return "Không tìm thấy sản phẩm yêu cầu!";
  }

  if (lower.includes("not found image")) {
    return "Không tìm thấy hình ảnh tương ứng!";
  }

  if (lower.includes("unauthorized") || lower.includes("access is denied")) {
    return "Bạn không có quyền thực hiện thao tác này!";
  }

  // 4. Nếu câu thông báo đã chứa ký tự tiếng Việt có dấu, chuẩn hóa và hiển thị trực tiếp
  const hasVietnameseChars =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
      msg
    );
  if (hasVietnameseChars) {
    return msg;
  }

  // Nếu là câu tiếng Anh chưa rõ nghĩa, trả về thông báo tiếng Việt mặc định phù hợp
  return fallback;
};

export default localizeMessage;
