package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.EntityModel.*;
import com.example.ProJectBackWeb.Mapper.MapperObject;
import com.example.ProJectBackWeb.Reponsitory.*;
import com.example.ProJectBackWeb.RequestData.CartRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CartService {
    private final CartRepository cartRepository;
    private final MapperObject mapperObject;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartProductRepository cartProductRepository;
    private final ToppingRepository toppingRepository;
    private final RedisTemplate<String , String> redisTemplate;
    private final Gson gson;
    private final ObjectMapper objectMapper;

    public CartService(CartRepository cartRepository, MapperObject mapperObject, UserRepository userRepository, ProductRepository productRepository, CartProductRepository cartProductRepository, ToppingRepository toppingRepository, RedisTemplate<String, String> redisTemplate, Gson gson, ObjectMapper objectMapper) {
        this.cartRepository = cartRepository;
        this.mapperObject = mapperObject;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartProductRepository = cartProductRepository;
        this.toppingRepository = toppingRepository;
        this.redisTemplate = redisTemplate;
        this.gson = gson;
        this.objectMapper = objectMapper;
    }

    public boolean checkTopping(CartProductEntity cartProductEntity, List<ToppingEntity> toppingEntities) {
        if (cartProductEntity.getToppingEntityList().size() == toppingEntities.size()) {
            if (cartProductEntity.getToppingEntityList().containsAll(toppingEntities)) {
                return true;
            }
        }
        return false;

    }
    @Transactional
    public boolean createCart(CartRequest cartRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
        Long userIdL = jwtAuthenticationToken.getToken().getClaim("userId");
        Integer userId = userIdL.intValue();
        int check = -1;
        ProductEntity productEntity = this.productRepository.findById(cartRequest.getProductId()).orElseThrow();
        UserEntity userEntity = this.userRepository.findById(userId).orElseThrow();
            List<ToppingEntity> toppingEntities = new ArrayList<>(this.toppingRepository.findAllById(cartRequest.getToppingIds()));
            CartEntity cart = userEntity.getCartEntity();
            if (cart == null) {
                cart = new CartEntity();
                CartProductEntity cartProductEntity = new CartProductEntity();
                cartProductEntity.setTotalPrice(cartRequest.getTotalPrice());
                cartProductEntity.setQuantity(cartRequest.getQuantity());
                cartProductEntity.setSize(cartRequest.getSize());
                cartProductEntity.setProductEntity(productEntity);
                cartProductEntity.setCreatAt(LocalDateTime.now());
                cartProductEntity.setToppingEntityList(toppingEntities);
                cart.getCartProductEntities().add(cartProductEntity);
                cart.setUserEntity(userEntity);
                cartProductEntity.setCartEntity(cart);
                userEntity.setCartEntity(cart);
                cart.sumTotalpriceCart();
                this.cartRepository.save(cart);
                this.userRepository.save(userEntity);
                this.cartProductRepository.save(cartProductEntity);
                this.redisTemplate.delete("cartEntity" + userId);
            } else if (cart != null) {
                List<CartProductEntity> cartProductEntities = cart.getCartProductEntities();
                for (CartProductEntity cartProductEntity : cartProductEntities) {
                    if (cartProductEntity.getProductEntity().getId() == cartRequest.getProductId()
                            && cartProductEntity.getSize().equals(cartRequest.getSize())) {
                        if (this.checkTopping(cartProductEntity, toppingEntities)) {
                            cartProductEntity.incrQuantity(cartRequest.getQuantity());
                            cartProductEntity.increTotalPrice(cartRequest.getTotalPrice());
                            cart.sumTotalpriceCart();
                            this.cartProductRepository.save(cartProductEntity); check = 1;
                            this.redisTemplate.delete("cartEntity" + userId);
                        }
                    }}
                if(check != 1){
                    CartProductEntity cartProduct = new CartProductEntity();
                    cartProduct.setTotalPrice(cartRequest.getTotalPrice());
                    cartProduct.setQuantity(cartRequest.getQuantity());
                    cartProduct.setSize(cartRequest.getSize());
                    cartProduct.setProductEntity(productEntity);
                    cartProduct.setCreatAt(LocalDateTime.now());
                    cartProduct.setToppingEntityList(toppingEntities);
                    cart.getCartProductEntities().add(cartProduct);
                    cart.setUserEntity(userEntity);
                    cartProduct.setCartEntity(cart);
                    userEntity.setCartEntity(cart);
                    cart.sumTotalpriceCart();
                    this.cartRepository.save(cart);
                    this.userRepository.save(userEntity);
                    this.cartProductRepository.save(cartProduct);
                    this.redisTemplate.delete("cartEntity" + userId);
                }
            }
            return true;
    }




    public CartEntity Getcart(JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
        Long  userId  =  jwtAuthenticationToken.getToken().getClaim("userId");
        String cartEntityJson = this.redisTemplate.opsForValue().get("cartEntity"+userId.intValue());
        if(cartEntityJson == null){
            UserEntity userEntity = this.userRepository.findById(userId.intValue()).orElseThrow();
            this.redisTemplate.opsForValue().set("cartEntity"+userId.intValue() , objectMapper.writeValueAsString(userEntity.getCartEntity()) , 5 , TimeUnit.MINUTES);
            if(userEntity.getCartEntity() ==  null){
                return null;
            }else{
                 return userEntity.getCartEntity();
            }
        }

        CartEntity cartEntity = this.objectMapper.readValue(cartEntityJson,   CartEntity.class);
        if(cartEntity != null){
                cartEntity.getCartProductEntities().sort((o1, o2) ->
                        Integer.compare(o2.getQuantity() ,  o1.getQuantity())
                );
                return cartEntity;
        }
        return null;
    }

}
