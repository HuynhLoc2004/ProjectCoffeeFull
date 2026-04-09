package com.example.ProJectBackWeb.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private long id;
    private boolean active;
    private String code;
    private String category;
    private Long price;
    private Long priceSale;
    private String picture;
    private String name;

}
