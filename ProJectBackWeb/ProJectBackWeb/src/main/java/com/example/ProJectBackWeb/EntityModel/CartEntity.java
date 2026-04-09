package com.example.ProJectBackWeb.EntityModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@Builder
@Getter
@Setter
@Table(name = "cart")
public class CartEntity {
    @Column(name = "cart_id" , nullable = false)
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "totalprice")
    private Double totalPrice;
    @OneToOne(fetch =  FetchType.LAZY)
    @JoinColumn(
            name = "user_id" , nullable = false)
    @JsonBackReference
    private UserEntity userEntity;
    @JsonManagedReference
    @OneToMany(mappedBy = "cartEntity"  ,   cascade = CascadeType.ALL,
            orphanRemoval = true)
    @OrderBy(value = "quantity desc")
    private List<CartProductEntity> cartProductEntities = new ArrayList<>();

    public void sumTotalpriceCart(){
         this.totalPrice = 0.0;
         for (CartProductEntity cartProductEntity : this.getCartProductEntities()){
             this.totalPrice += cartProductEntity.getTotalPrice();
         }
    }

}
