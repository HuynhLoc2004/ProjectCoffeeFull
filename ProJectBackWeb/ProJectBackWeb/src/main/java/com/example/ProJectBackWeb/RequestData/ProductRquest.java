package com.example.ProJectBackWeb.RequestData;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRquest {
    @NotBlank(message = "product_code must be not null and not one whitespace character")
    private String code;
    @NotBlank(message = "product_name must be not null and not one whitespace character")
    private String name;
    @Min(0)
    private Double price;
    @NotBlank(message = "product_img must be not null and not one whitespace character")
    private String img;
    @Min(0)
    @Null
    private Integer sale;
    @NotBlank(message = "product_category must be not null and not one whitespace character")
    private String category;
}
