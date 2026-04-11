package com.example.ProJectBackWeb.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order_Ordetails_DTO {
    private Long order_id;
    private String address;
    private String fullnameUser;
    private String phoneUser;
    private String statusOrder;
    private LocalDateTime createdAtOrder ;
    private Double totalpriceOrder;
    private List<OrderDetailsDTO> orderDetailsDTOList = new ArrayList<>();
}
//ở trang profile chỗ lịch sử đơn hàng /order/get-ordt khi call api nó sẽ trả về result là 1 object bao gồm order_id cho biết chi tiết hoá đơn này thuộc đơn hàng nào nó sẽ thuộc đơnn hàng nào  , address là địa chỉ của user đã đặt ở đơn hàng đó //fullnameUser là tên của họ , statusOrder là trạng thái dơn hàng , phoneUser là số điện thoại của họ nếu có , createdAtOrder ngày tạo hoá đơn , totalpriceOrder tổng của hoá đơn đó , là 1 list orderDetailsDTOList trong đó các phần tử là orderDetailsDto có các giá trị như private  Integer id; private Integer quantity số lượng các sản phẩm đó ; private Double totalPrice; private String size; private LocalDateTime creatAt;private String pictureProduct;private String nameproduct; private List<ToppingDTO> toppingDTOs = new ArrayList<>(); list topping này nó có    private String nameTopping;  private Double price_topping; đặt kèm trong các chi tiết đơn hàng đó tức là chi đơn hannfg này sẽ có các chi tiết dơn hàng cuẩ nó có những thứ đó bạn cập nhật modal cho tui đi ,
