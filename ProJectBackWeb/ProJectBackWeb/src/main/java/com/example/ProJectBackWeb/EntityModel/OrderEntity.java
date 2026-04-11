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
import java.util.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Slf4j
@Table(name = "Orders")
public class OrderEntity {
    @Column(name = "order_id")
    @Id
    private Long id;
    @Column(name = "status" , nullable = false)
    private String status;
    @Column(name = "created_at",nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiredAt;
    @Column(name = "totalPrice" , nullable = false)
    private Double totalPrice;

    @Column(name = "type_order" , nullable = false , columnDefinition = "varchar(255)")
    private String Type_Order;
    @OneToMany(fetch = FetchType.LAZY,  mappedBy = "orderEntity" , cascade = CascadeType.ALL)
    @OrderBy(value = "totalPrice desc")
    private List<OrderDetailsEntity> orderDetailEntities = new ArrayList<>();

    @Column(name = "address_order" , nullable = false , columnDefinition = "NVARCHAR(MAX)")
    private String address;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

}
