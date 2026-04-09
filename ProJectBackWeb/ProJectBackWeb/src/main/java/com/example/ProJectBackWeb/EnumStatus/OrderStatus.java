package com.example.ProJectBackWeb.EnumStatus;

public enum OrderStatus {
    PENDING,   // mới tạo
    PAID,      // webhook xác nhận
    CANCELLED, // payos báo huỷ
    EXPIRED ,  // backend tự kết luận
    PROCESSING
    }