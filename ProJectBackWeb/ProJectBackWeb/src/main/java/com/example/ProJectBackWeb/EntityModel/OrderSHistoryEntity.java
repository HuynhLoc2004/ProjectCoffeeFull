package com.example.ProJectBackWeb.EntityModel;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "OrdersHistory", indexes = {
        @Index(name = "idx_order_history_user_time", columnList = "user_id,time_order_history"),
        @Index(name = "idx_order_history_status_time", columnList = "status,time_order_history")
})
@Setter
@Getter
@NoArgsConstructor
public class OrderSHistoryEntity {
    @Id
    @Column(name = "orderHistory_id")
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;
    @Column(name = "totalPrice"  , nullable = true)
    private Long totalPrice;
    @Column(name = "address_order" , columnDefinition = "TEXT")
    private String address;
    @Column(name = "time_order_history" , nullable = false)
    private LocalDateTime timeOrderHistory;
    @OneToOne(fetch = FetchType.LAZY)
    private OrderEntity orderEntity;
    @Column(name = "status" , nullable = false )
    private String status;
    @ManyToOne(fetch = FetchType.LAZY)

    @JoinColumn(
            name = "user_id"
    )
    @JsonBackReference
    private UserEntity userEntity;


}
