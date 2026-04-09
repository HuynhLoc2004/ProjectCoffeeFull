package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.EntityModel.CartProductEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.CartProductUpdateRequest;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.CartproductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequestMapping("/cartproduct")
public class CartProductController {
    private final CartproductService cartproductService;

    public CartProductController(CartproductService cartproductService) {
        this.cartproductService = cartproductService;
    }

//    @GetMapping("/get/{productCartId}")
//    public ResponseData<CartProductEntity> getCartProductByid(JwtAuthenticationToken jwtAuthenticationToken , @PathVariable int productCartId) throws JsonProcessingException {
//           return this.cartproductService.getCartProduct(jwtAuthenticationToken , productCartId) != null
//                   ? new ResponseData<>(HttpStatusEnum.OK.getCode(), "get productCart successfully" , this.cartproductService.getCartProduct(jwtAuthenticationToken , productCartId))
//                   : null;
//
//    }
    @PutMapping("/incrCartproduct/{productCartId}")
    public ResponseData<Boolean>  incProductCartByid(JwtAuthenticationToken jwtAuthenticationToken , @RequestBody CartProductUpdateRequest cartProductUpdateRequest, @PathVariable int productCartId) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(), "update cartproduct successfully" , this.cartproductService.UpdateIncrQuantityProductCart(jwtAuthenticationToken , cartProductUpdateRequest , productCartId));
    }
    @PutMapping("/descCartproduct/{productCartId}")
    public ResponseData<Boolean>  descProductCartByid(JwtAuthenticationToken jwtAuthenticationToken , @RequestBody CartProductUpdateRequest cartProductUpdateRequest, @PathVariable int productCartId) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(), "update cartproduct successfully" , this.cartproductService.UpdateDescQuantityProductCart(jwtAuthenticationToken , cartProductUpdateRequest , productCartId));
    }

    @DeleteMapping("/deleteCartproduct/{productCartId}")
    public ResponseData<Boolean>  deleteProductCartByid(JwtAuthenticationToken jwtAuthenticationToken , @PathVariable int productCartId) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(), "update cartproduct successfully" , this.cartproductService.DeleteProductCartByid(jwtAuthenticationToken  , productCartId));
    }
}
