package com.example.ProJectBackWeb.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order_Ordetails_DTO {
    private Long order_id;
    private String address;
    private String fullnameUser;
    private String phoneUser;
    private String statusOrder;
    private LocalDateTime createdAtOrder ;
    private Double totalpriceOrder;
    private List<OrderDetailsDTO> orderDetailsDTOList = new ArrayList<>();
}
