package com.example.ProJectBackWeb.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Array;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDTO {
    private Long id;
    private Double totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private String fullname;
    private String mail;
    private Long quantity;
    private String address;
    private List<OrderDetailsDTO> orderDetailsDTOS =  new ArrayList<>();
    public OrderDTO(Long id, Double totalPrice, String status, LocalDateTime createdAt, String fullname, String mail, Long quantity ,String address ) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.fullname = fullname;
        this.mail = mail;
        this.quantity = quantity;
        this.address = address;
    }
}
