package com.example.ProJectBackWeb.RequestData;

import com.example.ProJectBackWeb.EntityModel.CartProductEntity;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
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
public class OrdersRequest {
    @NotNull(message = "totalprice orderrequets not null")
    private Double totalPrice;
    @NotNull(message = "type_order not null")
    private String type_order;
    private List<CartProductEntity> cartProductEntities = new ArrayList<>();
}
