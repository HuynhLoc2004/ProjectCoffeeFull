package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "Products")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private int id;
    @Column(name = "product_code" , nullable = false , unique = true)
    private String code;
    @Column(name = "product_active" , nullable = false)
    private boolean active;
    @Column(name = "product_name" , nullable = false , columnDefinition = "Nvarchar(250)")
    private String name;
    @Column(name = "product_price" , nullable = false)
    private Double price;
    @Column(name = "product_img" , nullable = false)
    private String img;
    @Column(name = "product_sale" , nullable = true)
    private Integer sale;
    @Column(name = "product_category" , nullable = false , columnDefinition = "Nvarchar(100)")
    private String category;

    @ManyToMany(fetch = FetchType.LAZY , cascade = CascadeType.ALL)
    @JoinTable(
         name = "product_size",
         joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "size_id")
    )


    @OrderBy("id ASC")
    private List<SizeEntity> sizeEntitySet = new ArrayList<>();
    @ManyToMany(fetch = FetchType.LAZY , cascade = CascadeType.ALL)
    @JoinTable(
            name = "product_topping",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    @OrderBy("id ASC")
    private List<ToppingEntity> toppingEntities = new ArrayList<>();



    public void setActive(boolean active) {
        this.active = active;
    }
}
