package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.DTO.OrderDetailsDTO;
import com.example.ProJectBackWeb.EntityModel.OrderDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderDetailsRepository extends JpaRepository<OrderDetailsEntity  , Integer> {

    @Query("""
        select DISTINCT odt
        From OrderDetailsEntity odt
        left join fetch odt.toppingEntityList t
        join fetch odt.productEntity p
        join odt.orderEntity od
        WHERE od.id = :orderid
""")
    public List<OrderDetailsEntity> getOrderDetailsOfOrder(@Param("orderid") Long orderid);
}
