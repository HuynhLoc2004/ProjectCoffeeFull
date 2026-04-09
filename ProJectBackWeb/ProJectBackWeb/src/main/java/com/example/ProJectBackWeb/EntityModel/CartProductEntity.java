package com.example.ProJectBackWeb.EntityModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Setter
@Getter
@Table(name = "cart_Product")
@AllArgsConstructor
@NoArgsConstructor
public class CartProductEntity {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "cart_product_id")
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    private CartEntity cartEntity;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;

    @Column(name = "quantity" , nullable = false)
    private Integer quantity;

    @Column(name = "totalPrice")
    private Double totalPrice;

    @Column(name = "cartproduct_size")
    private String size;

    @Column(name = "create_At", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime creatAt;
    @ManyToMany(fetch =  FetchType.LAZY)
    @JoinTable(
            name = "cart_product_topping",
            joinColumns = @JoinColumn(name = "cart_product_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    @OrderBy("id ASC")
        private List<ToppingEntity> toppingEntityList = new ArrayList<>();
    public void incrQuantity(int quantity){
        this.quantity+=quantity;
    }
    public void decrQuantity(){
        this.quantity--;
    }
    public void increTotalPrice(Double totalPrice){
        this.totalPrice += totalPrice;
    }
}
