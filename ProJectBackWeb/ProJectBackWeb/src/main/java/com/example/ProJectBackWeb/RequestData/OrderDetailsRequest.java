package com.example.ProJectBackWeb.RequestData;

import com.example.ProJectBackWeb.EntityModel.ProductEntity;
import com.example.ProJectBackWeb.EntityModel.ToppingEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderDetailsRequest {

    @NotNull(message = "productEntity not null")
    private ProductEntity productEntity;

    @NotNull(message = "quantity not null")
    private Integer quantity;

    @NotNull(message = "totalPrice not null ")
    private Double totalPrice;


    private String Size;



    private List<ToppingEntity> toppingEntityList = new ArrayList<>();

}
