package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.EntityModel.OrderEntity;
import com.example.ProJectBackWeb.EntityModel.OrderSHistoryEntity;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.OrderStatus;
import com.example.ProJectBackWeb.EnumStatus.TypeOrderEnum;
import com.example.ProJectBackWeb.Reponsitory.OrderSHistoryRepository;
import com.example.ProJectBackWeb.Reponsitory.OrdersRepository;
import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.exception.APIException;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.webhooks.Webhook;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j

public class CheckOutService {
    @Value("${payos.create-url}")
    private String createUrl;

    @Value("${payos.returnUrl}")
    private String returnUrl;
    @Value("${payos.cancelUrl}")
    private String cancelUrl;
    private final PayOS payOS;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final OrderSHistoryRepository orderSHistoryRepository;
    private final OrdersRepository  ordersRepository;


    public CheckOutService(PayOS payOS, UserRepository userRepository, RedisTemplate redisTemplate, ObjectMapper objectMapper, OrderSHistoryRepository orderSHistoryRepository, OrdersRepository ordersRepository) {
        this.payOS = payOS;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.orderSHistoryRepository = orderSHistoryRepository;
        this.ordersRepository = ordersRepository;
    }


    public CreatePaymentLinkResponse createPaymentLink(
            JwtAuthenticationToken jwtAuthenticationToken,
            long order_id
    ) throws JsonProcessingException {

        Long userId = jwtAuthenticationToken.getToken().getClaim("userId");


        String orderJson = redisTemplate.opsForValue()
                .get("OrderEntity" + userId.intValue() + order_id);

        if (orderJson == null) {
            throw new RuntimeException("Order không tồn tại");
        }

        OrderEntity orderEntity =
                objectMapper.readValue(orderJson, OrderEntity.class);

        CreatePaymentLinkRequest request =
                CreatePaymentLinkRequest.builder()
                        .orderCode(orderEntity.getId())
                        .amount(orderEntity.getTotalPrice().longValue())
                        .description("mã: " + orderEntity.getId())
                        .returnUrl(returnUrl+"/payment-success")
                        .cancelUrl(cancelUrl+"/payment-cancel")
                        .expiredAt(System.currentTimeMillis() / 1000 + 300)
                        .build();

        try {
            return payOS.paymentRequests().create(request);
        } catch (APIException e) {
            log.error("PayOS error: {}", e.getMessage());
            throw new RuntimeException("Không thể tạo QR thanh toán: " + e.getMessage());
        }
    }

    @Transactional
    public Boolean handleWebHook(Webhook
                                 webhook){
         var data  = payOS.webhooks().verify(webhook);

             Long orderCode = data.getOrderCode();
             OrderEntity orderEntity = this.ordersRepository.findById(orderCode).orElse(null);
             if(orderEntity == null) {
                 return true; // xác thực chơ payos gửi webhook
             }

             orderEntity.setStatus(OrderStatus.PAID.toString());
             UserEntity userEntity = orderEntity.getUserEntity();
             OrderSHistoryEntity orderSHistoryEntity = new OrderSHistoryEntity();
             orderSHistoryEntity.setOrderEntity(orderEntity);
             orderSHistoryEntity.setStatus(orderEntity.getStatus());
             orderSHistoryEntity.setTotalPrice(data.getAmount());
             DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
             LocalDateTime time = LocalDateTime.parse(data.getTransactionDateTime(), formatter);
             orderSHistoryEntity.setTimeOrderHistory(time);
             orderSHistoryEntity.setUserEntity(userEntity) ;
             orderSHistoryEntity.setAddress(orderEntity.getAddress());

             this.orderSHistoryRepository.save(orderSHistoryEntity);
             if(orderEntity.getType_Order().equals(TypeOrderEnum.ORDER_CART.toString())){
                 userEntity.setCartEntity(null);
             }
             this.ordersRepository.save(orderEntity);

             this.redisTemplate.delete("cartEntity"+userEntity.getId());


         return true;
    }

}
