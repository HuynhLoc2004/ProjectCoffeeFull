package com.example.ProJectBackWeb.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserProfileDTO {

    private Long id;
    private String fullname;
    private String email;
    private String phone;
    private String address;
    private String picture;


    private List<OrderDTO> orderEntities = new ArrayList<>();
    private List<OrderSHistoryDTO> orderSHistoryEntities = new ArrayList<>();
}