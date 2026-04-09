package com.example.ProJectBackWeb.EntityModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Slf4j
@Table(name = "OrderDetails")
public class OrderDetailsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderdetails_id")
    private  Integer id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;

    @Column(name = "quantity" , nullable = false)
    private Integer quantity;

    @Column(name = "totalPrice")
    private Double totalPrice;

    @Column(name = "cartproduct_size")
    private String Size;

    @Column(name = "create_At", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime creatAt;
    @ManyToMany(fetch =  FetchType.LAZY)
    @JoinTable(
            name = "order_details_topping",
            joinColumns = @JoinColumn(name = "orderdetails_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    @OrderBy("id ASC")
    private List<ToppingEntity> toppingEntityList = new ArrayList<>();

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity orderEntity;

}
