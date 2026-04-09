package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topping")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ToppingEntity {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "topping_id")
    private Integer id;
    @Column(name = "type_Topping" , nullable = false)
    private String typeTopping;
    @Column(name= "name_topping" , nullable = false , columnDefinition = "Nvarchar(225)")
    private String nameTopping;
    @Column(name = "price_topping" , nullable = false)
    private Double price_topping;

    public ToppingEntity(String typeTopping, String nameTopping, Double price_topping) {
        this.typeTopping = typeTopping;
        this.nameTopping = nameTopping;
        this.price_topping = price_topping;
    }
}
