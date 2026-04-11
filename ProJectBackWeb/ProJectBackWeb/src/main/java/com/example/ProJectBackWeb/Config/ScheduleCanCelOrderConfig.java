package com.example.ProJectBackWeb.Config;

import com.example.ProJectBackWeb.EntityModel.OrderEntity;
import com.example.ProJectBackWeb.EntityModel.OrderSHistoryEntity;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.OrderStatus;
import com.example.ProJectBackWeb.Reponsitory.CartRepository;
import com.example.ProJectBackWeb.Reponsitory.OrderSHistoryRepository;
import com.example.ProJectBackWeb.Reponsitory.OrdersRepository;
import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@EnableScheduling
public class ScheduleCanCelOrderConfig {
    private final OrdersRepository ordersRepository;
    private final RedisTemplate<String  , String> redisTemplate;
    private final OrderSHistoryRepository orderSHistoryRepository;
    private final UserRepository userRepository;
    private final CartRepository  cartRepository;

    public ScheduleCanCelOrderConfig(OrdersRepository ordersRepository, RedisTemplate<String, String> redisTemplate, OrderSHistoryRepository orderSHistoryRepository, UserRepository userRepository, CartRepository cartRepository) {
        this.ordersRepository = ordersRepository;
        this.redisTemplate = redisTemplate;
        this.orderSHistoryRepository = orderSHistoryRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional//
    public void ScheDulesCanCelOrder() {
        LocalDateTime now = LocalDateTime.now();
        List<OrderEntity> orderEntities = ordersRepository.findAllOrderEntityByStatusAndExpiryTimeBeFore(OrderStatus.PENDING.toString(), now);
        for (OrderEntity orderEntity : orderEntities) {
            UserEntity userEntity = orderEntity.getUserEntity();
            orderEntity.setStatus(OrderStatus.CANCELLED.toString());
            //
            OrderSHistoryEntity orderSHistoryEntity = new OrderSHistoryEntity();
            orderSHistoryEntity.setUserEntity(orderEntity.getUserEntity());
            orderSHistoryEntity.setOrderEntity(orderEntity);
            orderSHistoryEntity.setStatus(orderEntity.getStatus());
            Long totalPriceHistory = (long) orderEntity.getTotalPrice().intValue();
            orderSHistoryEntity.setTotalPrice(totalPriceHistory);
            orderSHistoryEntity.setTimeOrderHistory(now);

            this.orderSHistoryRepository.save(orderSHistoryEntity);

            this.redisTemplate.delete("OrderEntity" + orderEntity.getUserEntity().getId() + orderEntity.getId());

        }

    }
}
