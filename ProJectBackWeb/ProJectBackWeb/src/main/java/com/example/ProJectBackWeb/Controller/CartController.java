package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.EntityModel.CartEntity;
import com.example.ProJectBackWeb.EntityModel.CartProductEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.CartRequest;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.CartService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/createCart")
    public ResponseData<?> createCart(@RequestBody CartRequest cartRequest,
                                               JwtAuthenticationToken jwtAuthenticationToken
    ) throws JsonProcessingException {
        boolean cartEntity = this.cartService.createCart(cartRequest, jwtAuthenticationToken);
        return new ResponseData<>(HttpStatusEnum.CREATED.getCode(), "Create cart successfully");
    }

    @GetMapping("/getCart")
    public ResponseData<CartEntity> GetCart(JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
       return new  ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(), "get cart successfully" , this.cartService.Getcart(jwtAuthenticationToken)) ;
    }


}
