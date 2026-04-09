package com.example.ProJectBackWeb.DTO;

import com.example.ProJectBackWeb.EntityModel.ToppingEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDetailsDTO {
    private  Integer id;
    private Integer quantity;
    private Double totalPrice;
    private String size;
    private LocalDateTime creatAt;
    private String nameproduct;
    private List<ToppingDTO> toppingDTOs = new ArrayList<>();
}
