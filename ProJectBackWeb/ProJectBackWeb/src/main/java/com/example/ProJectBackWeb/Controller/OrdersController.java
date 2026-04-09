package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.DTO.*;
import com.example.ProJectBackWeb.EntityModel.OrderEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.OrdersRequest;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpMethod;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/order")
public class OrdersController {
    private final OrderService orderService;

    public OrdersController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseData<Long> createOrders(JwtAuthenticationToken jwtAuthenticationToken , @RequestBody OrdersRequest ordersRequest) throws JsonProcessingException {
        long orderId = this.orderService.CreateOrders(jwtAuthenticationToken  , ordersRequest);

        return new ResponseData<>(HttpStatusEnum.CREATED.getCode(), "create order successfully" , orderId );
    }
    @GetMapping("/get-ordt/{order_id}")
    public ResponseData<Order_Ordetails_DTO> getOrderDetailsByid(JwtAuthenticationToken jwtAuthenticationToken, @PathVariable Long order_id){
            return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get successFully " ,  this.orderService.getOrder(jwtAuthenticationToken , order_id));
    }
    @GetMapping("/get-profit/by-month")
    public ResponseData<List<ProfitByMonthDTO>>  get_profit_by_Month(@RequestParam("year") Integer year){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get profit by month successfully" , this.orderService.getProfitBymonth(year));
        }
    @GetMapping("/getFullyearOrder")
    public ResponseData<List<Integer>> getfullyearOrder(){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get full year successfully" , this.orderService.getFullyear());
    }

    @GetMapping("/getCountOrderByYear")
    public ResponseData<Long> getCountOrderByYear(@RequestParam("year") Integer year){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get count order by year successfully " , this.orderService.getCountOrderByYear(year));
    }
    @GetMapping("/getTopBestSel")
    public ResponseData<List<ProductBestSelDTO>> getTop4BestProduct(@RequestParam("top") Integer top , @RequestParam("year") Integer year){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get top product best succesfully" ,  this.orderService.getTopProductBest(top , year));
    }
    @GetMapping("/get-orders")
    public ResponseData<List<OrderDTO>> getOrders(JwtAuthenticationToken
                                                    jwtAuthenticationToken

    ){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get products succesully " , this.orderService.getOrders(jwtAuthenticationToken));
    }

    @GetMapping("/get-order")
    public ResponseData<OrderDTO> getOrderByid(JwtAuthenticationToken jwtAuthenticationToken, @RequestParam("orderId") Long orderId){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "get order successfully" , this.orderService.getOrderByid(orderId));

    }
}
