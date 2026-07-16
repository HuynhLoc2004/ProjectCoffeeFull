package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.DTO.OrderDetailsDTO;
import com.example.ProJectBackWeb.EntityModel.OrderDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.data.domain.Pageable;

public interface OrderDetailsRepository extends JpaRepository<OrderDetailsEntity  , Integer> {

    @Query("""
        SELECT p.name, SUM(od.quantity)
        FROM OrderDetailsEntity od
        JOIN od.productEntity p
        JOIN od.orderEntity o
        JOIN OrderSHistoryEntity h ON h.orderEntity = o
        WHERE h.status = :status
        GROUP BY p.id, p.name
        ORDER BY SUM(od.quantity) DESC
    """)
    List<Object[]> findBestSellingProducts(@Param("status") String status, Pageable pageable);

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
