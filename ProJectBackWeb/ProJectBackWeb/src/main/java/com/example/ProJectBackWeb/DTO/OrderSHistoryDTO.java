package com.example.ProJectBackWeb.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderSHistoryDTO {
    private Long id;
    private Long order_id;
    private Long totalPrice;
    private LocalDateTime timeOrderHistory;
    private String status;
    private String address;
}