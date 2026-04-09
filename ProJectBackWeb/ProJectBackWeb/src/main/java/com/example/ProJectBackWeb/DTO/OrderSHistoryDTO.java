package com.example.ProJectBackWeb.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class OrderSHistoryDTO {
    private Long id;
    private Long order_id;
    private Long totalPrice;
    private LocalDateTime timeOrderHistory;
    private String status;


}