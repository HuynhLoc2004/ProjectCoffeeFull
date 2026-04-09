package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.EntityModel.CartEntity;
import com.example.ProJectBackWeb.EntityModel.CartProductEntity;
import com.example.ProJectBackWeb.EntityModel.ToppingEntity;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.Reponsitory.CartProductRepository;
import com.example.ProJectBackWeb.Reponsitory.CartRepository;
import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import com.example.ProJectBackWeb.RequestData.CartProductUpdateRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class CartproductService {
    private final RedisTemplate<String , String> redisTemplate;
    private final Gson gson;
    private final UserRepository userRepository;
    private final CartProductRepository cartProductRepository;
    private final ObjectMapper objectMapper;
    private final CartService cartService;
    private final CartRepository cartRepository;
    public CartproductService(RedisTemplate<String, String> redisTemplate, Gson gson, UserRepository userRepository, CartProductRepository cartProductRepository, ObjectMapper objectMapper, CartService cartService, CartRepository cartRepository) {
        this.redisTemplate = redisTemplate;
        this.gson = gson;
        this.userRepository = userRepository;
        this.cartProductRepository = cartProductRepository;
        this.objectMapper = objectMapper;
        this.cartService = cartService;
        this.cartRepository = cartRepository;
    }

    public boolean UpdateIncrQuantityProductCart(
            JwtAuthenticationToken jwtAuthenticationToken,
            CartProductUpdateRequest req,
            int cartProductId) throws JsonProcessingException {

        Long userId = jwtAuthenticationToken.getToken().getClaim("userId");

        UserEntity user = userRepository
                .findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        CartEntity cart = user.getCartEntity();

        CartProductEntity entity = cart.getCartProductEntities()
                .stream()
                .filter(cp -> cp.getId() == cartProductId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CartProduct không thuộc user"));

        double unitPrice = entity.getTotalPrice() / entity.getQuantity();

        entity.setQuantity(entity.getQuantity() + req.getQuantityUpdate());
        entity.setTotalPrice(entity.getQuantity() * unitPrice);

        cart.sumTotalpriceCart();
        cartProductRepository.save(entity);

        redisTemplate.opsForValue().set(
                "cartEntity" + userId,
                objectMapper.writeValueAsString(cart) , 5 , TimeUnit.MINUTES
        );

        return true;
    }

    public boolean UpdateDescQuantityProductCart(
            JwtAuthenticationToken jwtAuthenticationToken,
            CartProductUpdateRequest req,
            int cartProductId) throws JsonProcessingException {

        Long userId = jwtAuthenticationToken.getToken().getClaim("userId");

        UserEntity user = userRepository
                .findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        CartEntity cart = user.getCartEntity();

        CartProductEntity entity = cart.getCartProductEntities()
                .stream()
                .filter(cp -> cp.getId() == cartProductId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CartProduct không thuộc user"));

        double unitPrice = entity.getTotalPrice() / entity.getQuantity();

        if(entity.getQuantity() - req.getQuantityUpdate() == 0){
             cart.getCartProductEntities().remove(entity);
             cart.sumTotalpriceCart();
             this.cartProductRepository.deleteById(entity.getId());
             this.redisTemplate.delete("cartEntity"+userId);
             this.redisTemplate.opsForValue().set("cartEntity"+userId , objectMapper.writeValueAsString(cart) , 5 , TimeUnit.MINUTES);
             return true;
        }

        entity.setQuantity(entity.getQuantity() - req.getQuantityUpdate());
        entity.setTotalPrice(entity.getQuantity() * unitPrice);
        cart.sumTotalpriceCart();
        cartProductRepository.save(entity);
        redisTemplate.opsForValue().set(
                "cartEntity" + userId,
                objectMapper.writeValueAsString(cart) , 5 , TimeUnit.MINUTES
        );

        return true;
    }

    @Transactional
    public boolean DeleteProductCartByid(JwtAuthenticationToken jwtAuthenticationToken , int productCartId) throws JsonProcessingException {
        Long userId = jwtAuthenticationToken.getToken().getClaim("userId");

        UserEntity user = userRepository
                .findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        CartEntity cart = user.getCartEntity();

        CartProductEntity entity = cart.getCartProductEntities()
                .stream()
                .filter(cp -> cp.getId() == productCartId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CartProduct không thuộc user"));
        cart.getCartProductEntities().remove(entity);
        cart.sumTotalpriceCart();
        this.cartProductRepository.deleteById(entity.getId());
        this.redisTemplate.delete("cartEntity"+userId);
        this.redisTemplate.opsForValue().set("cartEntity"+userId , objectMapper.writeValueAsString(cart) , 5 , TimeUnit.MINUTES);
        return true;

    }
//    public CartProductEntity getCartProduct(JwtAuthenticationToken jwtAuthenticationToken , int productCartId ) throws JsonProcessingException {
//        Long  userId  =  jwtAuthenticationToken.getToken().getClaim("userId");
//         String cartEntityJSon = this.redisTemplate.opsForValue().get("cartEntity"+userId.intValue());
//         if(cartEntityJSon == null){
//             CartEntity cartEntity = this.userRepository.findById(userId.intValue()).orElseThrow().getCartEntity();
//             for (CartProductEntity cartProductEntity : cartEntity.getCartProductEntities()){
//                 if(cartProductEntity.getId() == productCartId){
//                     this.redisTemplate.opsForValue().set("cartEntity"+userId.intValue(), objectMapper.writeValueAsString(cartEntity) , 5 , TimeUnit.MINUTES);
//                     return cartProductEntity;
//                 }
//             }
//         }
//        CartEntity cartEntity = objectMapper.readValue(cartEntityJSon, CartEntity.class);
//         for(CartProductEntity cartProductEntity : cartEntity.getCartProductEntities())
//         {
//             if(cartProductEntity.getId() == productCartId){
//                 return cartProductEntity;
//             }
//         }
//            return null;
//    }

}
