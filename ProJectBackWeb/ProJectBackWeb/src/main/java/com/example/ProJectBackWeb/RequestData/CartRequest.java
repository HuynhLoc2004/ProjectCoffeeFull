package com.example.ProJectBackWeb.RequestData;

import com.example.ProJectBackWeb.EntityModel.ToppingEntity;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class CartRequest {


    @NotNull(message = "Size product not null")
    private String size;

    private List<Integer> toppingIds = new ArrayList<>();

    @NotNull(message = "quantity not null")
    private Integer quantity;
    @NotNull(message = "product_id not null")
    private Integer productId;


    @NotNull(message = "totalPrice not null")
    private Double totalPrice;

}
