package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.CheckOutService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.payos.model.webhooks.Webhook;

@RestController
@RequestMapping("/payos")
public class    CheckOutController {
    private final CheckOutService checkOutService;

    public CheckOutController(CheckOutService checkOutService) {
        this.checkOutService = checkOutService;
    }

    @GetMapping("/createQr")
    public ResponseData<?> createQr(JwtAuthenticationToken jwtAuthenticationToken ,@RequestParam("order_id") long order_id ) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "create Qr check out" , this.checkOutService.createPaymentLink(jwtAuthenticationToken , order_id));
   }
   @PostMapping("/webhook")
    public ResponseData<Boolean> handleWebhook(@RequestBody Webhook webhook){
        return new ResponseData<>(200 , "complete payment"  , this.checkOutService.handleWebHook(webhook));
   }





}
