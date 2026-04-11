package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.DTO.*;
import com.example.ProJectBackWeb.EntityModel.CartProductEntity;
import com.example.ProJectBackWeb.EntityModel.OrderDetailsEntity;
import com.example.ProJectBackWeb.EntityModel.OrderEntity;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.OrderStatus;
import com.example.ProJectBackWeb.EnumStatus.TypeOrderEnum;
import com.example.ProJectBackWeb.Mapper.MapperObject;
import com.example.ProJectBackWeb.Reponsitory.OrderDetailsRepository;
import com.example.ProJectBackWeb.Reponsitory.OrdersRepository;
import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import com.example.ProJectBackWeb.RequestData.OrdersRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.oauth2.sdk.auth.JWTAuthentication;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.jaxb.SpringDataJaxb;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderService {
    private final OrderDetailsRepository orderDetailsRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final MapperObject mapperObject;
    private final OrdersRepository ordersRepository;

    public OrderService(OrderDetailsRepository orderDetailsRepository, UserRepository userRepository, RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper, MapperObject mapperObject, OrdersRepository ordersRepository) {
        this.orderDetailsRepository = orderDetailsRepository;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.mapperObject = mapperObject;
        this.ordersRepository = ordersRepository;
    }

    private long generate() {
        String timePart = new java.text.SimpleDateFormat("yyMMddHHmmss")
                .format(new java.util.Date());

        int randomPart = java.util.concurrent.ThreadLocalRandom
                .current().nextInt(100, 999); // 3 số

        return Long.parseLong(timePart + randomPart);
    }

    @Transactional
    public Long CreateOrders(JwtAuthenticationToken jwtAuthenticationToken, OrdersRequest ordersRequest) throws JsonProcessingException {

        Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
        UserEntity userEntity = userRepository.findById(userId.intValue()).orElseThrow();
        List<OrderDetailsEntity> orderDetailsEntities = new ArrayList<>();


        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setCreatedAt(LocalDateTime.now());
        orderEntity.setAddress(ordersRequest.getAddress());
        orderEntity.setExpiredAt(LocalDateTime.now().plusMinutes(6));
        orderEntity.setStatus(OrderStatus.PENDING.toString());
        orderEntity.setTotalPrice(ordersRequest.getTotalPrice());
        if (ordersRequest.getType_order().equals(TypeOrderEnum.ORDER_CART.toString())) {
            orderEntity.setType_Order(TypeOrderEnum.ORDER_CART.toString());
        } else if (ordersRequest.getType_order().equals(TypeOrderEnum.ORDER_NOW.toString())) {
            orderEntity.setType_Order(TypeOrderEnum.ORDER_NOW.toString());
        }
        orderEntity.setId(this.generate());
        List<CartProductEntity> cartProductEntities = ordersRequest.getCartProductEntities();
        for (CartProductEntity cartProductEntity : cartProductEntities) {
            OrderDetailsEntity orderDetails = this.mapperObject.toOrderDetails(cartProductEntity);
            orderDetails.setOrderEntity(orderEntity);
            orderDetailsEntities.add(orderDetails);
        }

        orderEntity.setOrderDetailEntities(orderDetailsEntities);
        orderEntity.setUserEntity(userEntity);
        this.ordersRepository.save(orderEntity);
        this.redisTemplate.opsForValue().set("OrderEntity" + userId.intValue() + orderEntity.getId()
                , objectMapper.writeValueAsString(orderEntity), 5, TimeUnit.MINUTES
        );

        return orderEntity.getId();
    }

    public Order_Ordetails_DTO getOrder(JwtAuthenticationToken jwtAuthenticationToken, Long orderId) {
        Long user_id = jwtAuthenticationToken.getToken().getClaim("userId");
        OrderEntity order = this.ordersRepository.findOrderByIdOfUser(user_id, orderId).orElseThrow();
        List<OrderDetailsDTO> orderDetailsDTOS = new ArrayList<>();
        for (OrderDetailsEntity orderDetails : order.getOrderDetailEntities()) {
            orderDetailsDTOS.add(this.mapperObject.orderDetailsDTO(orderDetails));
        }
        Order_Ordetails_DTO orderOrdetailsDto = new Order_Ordetails_DTO();
        orderOrdetailsDto.setOrderDetailsDTOList(orderDetailsDTOS);
        orderOrdetailsDto.setPhoneUser(order.getUserEntity().getPhone());
        orderOrdetailsDto.setAdresssUser(order.getUserEntity().getAddress());
        orderOrdetailsDto.setCreatedAtOrder(order.getCreatedAt());
        orderOrdetailsDto.setStatusOrder(order.getStatus());
        orderOrdetailsDto.setFullnameUser(order.getUserEntity().getFullname());
        orderOrdetailsDto.setOrder_id(order.getId());
        orderOrdetailsDto.setTotalpriceOrder(order.getTotalPrice());
        return orderOrdetailsDto;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<ProfitByMonthDTO> getProfitBymonth(Integer
                                                           year) {
        return this.ordersRepository.getProfitBymonth(OrderStatus.PAID.toString(), year);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<Integer> getFullyear() {
        return this.ordersRepository.getfullYearOrder();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public Long getCountOrderByYear(Integer year) {
        return this.ordersRepository.getCountOrderBy_year(OrderStatus.PAID.toString(), year);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<ProductBestSelDTO> getTopProductBest(Integer top, Integer year) {
        Pageable pageable = PageRequest.of(0, top);
        return this.ordersRepository.getTopProductBest(OrderStatus.PAID.toString(), pageable, year);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDTO> getOrders(JwtAuthenticationToken
                                     jwtAuthenticationToken) {

        Long idAdmin = jwtAuthenticationToken.getToken().getClaim("userId");
        return this.ordersRepository.getOrders(idAdmin) == null ? null : this.ordersRepository.getOrders(idAdmin);
    }



    @Transactional
    public OrderDTO getOrderByid(Long orderId){
        List<OrderDetailsEntity> orderDetailsEntities = this.orderDetailsRepository.getOrderDetailsOfOrder(orderId);

        List<OrderDetailsDTO> orderDetailsDTOS = orderDetailsEntities.stream().map(item -> {
            OrderDetailsDTO orderDetailsDTO = new OrderDetailsDTO();
            orderDetailsDTO.setNameproduct(item.getProductEntity().getName());
            orderDetailsDTO.setSize(item.getSize());
            orderDetailsDTO.setCreatAt(item.getCreatAt());
            orderDetailsDTO.setQuantity(item.getQuantity());
            orderDetailsDTO.setTotalPrice(item.getTotalPrice());
            orderDetailsDTO.setToppingDTOs(item.getToppingEntityList().stream().map(t -> {
                ToppingDTO toppingDTO = new ToppingDTO();
                toppingDTO.setNameTopping(t.getNameTopping());
                toppingDTO.setPrice_topping(t.getPrice_topping());
                return toppingDTO;
            }).collect(Collectors.toList()));
            return orderDetailsDTO;
        }).collect(Collectors.toList());
        OrderEntity
                orderEntity = this.ordersRepository.getOrder(orderId).orElseThrow();
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(orderId);
        orderDTO.setOrderDetailsDTOS(orderDetailsDTOS);
        orderDTO.setStatus(orderEntity.getStatus());
        orderDTO.setTotalPrice(orderEntity.getTotalPrice());
        orderDTO.setQuantity((long) orderDTO.getOrderDetailsDTOS().size());
        return orderDTO;
    }
}