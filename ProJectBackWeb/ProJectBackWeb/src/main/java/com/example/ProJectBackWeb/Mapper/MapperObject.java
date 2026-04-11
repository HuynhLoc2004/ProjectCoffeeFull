package com.example.ProJectBackWeb.Mapper;

import com.example.ProJectBackWeb.DTO.*;
import com.example.ProJectBackWeb.EntityModel.*;
import com.example.ProJectBackWeb.RequestData.OrderDetailsRequest;
import com.example.ProJectBackWeb.RequestData.ProductRequest;
import com.example.ProJectBackWeb.RequestData.ProductRquest;
import com.example.ProJectBackWeb.RequestData.UserRequestRegistry;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Component
public class MapperObject {

    public UserEntity toUserEntity(UserRequestRegistry userRequest){
        UserEntity user = new UserEntity();
        user.setAccount(userRequest.getAccount());
        user.setPassword(userRequest.getPassword());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setFullname(userRequest.getFullname());
        user.setDate(LocalDate.parse(userRequest.getDate()));
        user.setAddress(userRequest.getAddress());
        return user;
    }
      public ProductEntity toProductEntity(ProductRquest productRquest){
        ProductEntity productEntity = new ProductEntity();
        productEntity.setCode(productRquest.getCode());
        productEntity.setName(productRquest.getName());
        productEntity.setPrice(productRquest.getPrice());
        productEntity.setImg(productRquest.getImg());
        productEntity.setCategory(productRquest.getCategory());
        productEntity.setSale(productRquest.getSale());
        productEntity.setActive(true);
        return productEntity;
    }
    public ProductEntity toProductEntity(ProductRequest productRequest){
        ProductEntity productEntity = new ProductEntity();
        productEntity.setCode(productRequest.getCode());
        productEntity.setName(productRequest.getName());
        productEntity.setPrice(productRequest.getPrice());
        productEntity.setImg(productRequest.getImgUpload().getOriginalFilename());
        productEntity.setCategory(productRequest.getCategory());
        productEntity.setSale(productRequest.getSale());
        return productEntity;
    }

//    public CartEntity toCartEntity (CartRequest cartRequest){
//        CartEntity cartEntity  = new CartEntity();
//        cartEntity.setCreatAt(cartEntity.getCreatAt());
//        cartEntity.setQuantity(cartEntity.getQuantity());
//        return cartEntity;
//    }

    public OrderDetailsEntity toOrderDetail(OrderDetailsRequest orderDetailsRequest){
         OrderDetailsEntity orderDetailsEntity = new OrderDetailsEntity();
         orderDetailsEntity.setSize(orderDetailsRequest.getSize());
         orderDetailsEntity.setQuantity(orderDetailsRequest.getQuantity());
         orderDetailsEntity.setCreatAt(LocalDateTime.now());
         orderDetailsEntity.setToppingEntityList(orderDetailsRequest.getToppingEntityList());
         orderDetailsEntity.setTotalPrice(orderDetailsEntity.getTotalPrice());
        return orderDetailsEntity;
    }

    public OrderDetailsEntity toOrderDetails(CartProductEntity cartProductEntity){
         OrderDetailsEntity orderDetails = new OrderDetailsEntity();
         orderDetails.setSize(cartProductEntity.getSize());
         orderDetails.setQuantity(cartProductEntity.getQuantity());
         orderDetails.setCreatAt(cartProductEntity.getCreatAt());
         orderDetails.setToppingEntityList(cartProductEntity.getToppingEntityList());
         orderDetails.setTotalPrice(cartProductEntity.getTotalPrice());
         orderDetails.setProductEntity(cartProductEntity.getProductEntity());
         return orderDetails;
    }

    public UserProfileDTO toUserProfileDTO(UserEntity user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(Long.valueOf(user.getId()));
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        if(user.getPicture() == null){
            user.setPicture(null);
        }else{
            dto.setPicture(user.getPicture());
        }


        dto.setOrderEntities(
                user.getOrderEntities().stream()
                        .map(this::toOrderDTO)
                        .toList()
        );

        dto.setOrderSHistoryEntities(
                user.getOrderSHistoryEntities().stream()
                        .map(this::toOrderHistoryDTO)
                        .toList()
        );

        return dto;
    }

    private OrderDTO toOrderDTO(OrderEntity order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    private OrderSHistoryDTO toOrderHistoryDTO(OrderSHistoryEntity history) {
        OrderSHistoryDTO dto = new OrderSHistoryDTO();
        dto.setId(history.getId());
        dto.setOrder_id(history.getOrderEntity().getId());
        dto.setTotalPrice(history.getTotalPrice());
        dto.setTimeOrderHistory(history.getTimeOrderHistory());
        dto.setStatus(history.getStatus());
        dto.setAddress(history.getAddress());
        return dto;
    }
    public OrderDetailsDTO orderDetailsDTO(OrderDetailsEntity orderDetailsEntity){
        OrderDetailsDTO orderDetailsDTO = new OrderDetailsDTO();
        orderDetailsDTO.setId(orderDetailsEntity.getId());
        orderDetailsDTO.setQuantity(orderDetailsEntity.getQuantity());
        orderDetailsDTO.setCreatAt(orderDetailsEntity.getCreatAt());
        orderDetailsDTO.setSize(orderDetailsEntity.getSize());
        orderDetailsDTO.setPictureProduct(orderDetailsEntity.getProductEntity().getImg());
        orderDetailsDTO.setTotalPrice(orderDetailsEntity.getTotalPrice());
        orderDetailsDTO.setNameproduct(orderDetailsEntity.getProductEntity().getName());
        orderDetailsDTO.setToppingDTOs(orderDetailsEntity.getToppingEntityList().stream().map(item->{
              return new ToppingDTO(item.getNameTopping() , item.getPrice_topping());
        }).collect(Collectors.toList()));
        return orderDetailsDTO;
    }



}
