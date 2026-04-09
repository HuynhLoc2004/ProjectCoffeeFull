package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.DTO.OrderDTO;
import com.example.ProJectBackWeb.DTO.Order_Ordetails_DTO;
import com.example.ProJectBackWeb.DTO.ProductBestSelDTO;
import com.example.ProJectBackWeb.DTO.ProfitByMonthDTO;
import com.example.ProJectBackWeb.EntityModel.OrderEntity;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdersRepository extends JpaRepository<OrderEntity , Long> {

    @Query(
            value = "select o from OrderEntity o where o.status = :status and o.expiredAt < :now"
    )
    public List<OrderEntity> findAllOrderEntityByStatusAndExpiryTimeBeFore(@Param(value = "status") String status , @Param(value = "now")LocalDateTime now);

    @Query(value = "Select o From OrderEntity o " +
            "JOIN FETCH o.userEntity  " +
            "Where o.id = :order_id and o.userEntity.id = :user_id")
    public Optional<OrderEntity> findOrderByIdOfUser(@Param(value = "user_id") Long user_id , @Param(value = "order_id") Long order_id);

    @Query(value =
            "SELECT new com.example.ProJectBackWeb.DTO.ProfitByMonthDTO(" +
                    "MONTH(od.expiredAt), " +
                    "SUM(od.totalPrice)) " +
                    "FROM OrderEntity od " +
                    "WHERE od.status = :statusOd and YEAR(od.expiredAt) = :year " +
                    "GROUP BY YEAR(od.expiredAt), MONTH(od.expiredAt) " +
                    "ORDER BY YEAR(od.expiredAt), MONTH(od.expiredAt)"
    )
    List<ProfitByMonthDTO> getProfitBymonth(@Param("statusOd") String statusOd , @Param("year") Integer year);


    @Query(value = "SELECT DISTINCT YEAR(od.expiredAt) as year " +
            "FROM OrderEntity od " +
            "Order by YEAR(od.expiredAt) DESC")
    List<Integer> getfullYearOrder();


    @Query(value = "SELECT Count(*) FROM OrderEntity od where od.status = :status and YEAR(od.expiredAt) = :year")
    Long getCountOrderBy_year(@Param("status") String status , @Param("year") Integer year);

    @Query(
            "SELECT new com.example.ProJectBackWeb.DTO.ProductBestSelDTO(" +
                    "p.name, COUNT(p.id)) " +
                    "FROM OrderEntity od " +
                    "JOIN od.orderDetailEntities odt " +
                    "JOIN odt.productEntity p " +
                    "WHERE od.status = :status and YEAR(od.expiredAt) = :year " +
                    "GROUP BY p.name " +
                    "ORDER BY COUNT(p.id) DESC"
    )
    List<ProductBestSelDTO> getTopProductBest(@Param("status") String status , Pageable pageable ,@Param("year") Integer year);

    @Query(value = "SELECT new com.example.ProJectBackWeb.DTO.OrderDTO(" +
            "od.id, od.totalPrice  , od.status, od.createdAt, u.fullname , u.email, count(odt.id) , u.picture ) " +
            "FROM OrderEntity od JOIN od.orderDetailEntities odt JOIN od.userEntity u " +
            "WHERE u.id != :Idadmin " +
            "GROUP BY od.id , od.status, od.createdAt, u.fullname, u.email , od.totalPrice , u.picture")
    public List<OrderDTO> getOrders(
                                    @Param("Idadmin") Long idAdmin);


    @Query(value = "SELECT od FROM OrderEntity od " +
            "where od.id =:orderId")
    Optional<OrderEntity> getOrder(@Param("orderId") Long orderId);


}

