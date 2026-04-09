package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.DTO.UserDTO;
import com.example.ProJectBackWeb.EntityModel.OrderSHistoryEntity;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity , Integer> {
    public boolean existsByAccount(String account);
    public boolean existsByEmail(String email);
    @Query(
            value = "select u.* , r.name_role , p.name_permission\n" +
                    "from user_account u join user_role ur on u.id_user = ur.id_user \n" +
                    "join roles_permission rp on ur.id_role  = rp.id_role\n" +
                    "join permissions p on rp.id_permission = p.id_permission\n" +
                    "join roles r on r.id_role = ur.id_role\n" +
                    "where u.account_user = :account" ,nativeQuery = true
    )
    public UserEntity findUserByAccount(@Param("account") String account);

    @Query("""
select distinct u
from UserEntity u
left join fetch u.roles r
left join fetch r.permissionSets
where u.email = :email
""")
    public UserEntity findUserByEmail(@Param("email")  String email);


    @Query("""
        SELECT DISTINCT u
        FROM UserEntity u
        LEFT JOIN FETCH u.roles r
        LEFT JOIN FETCH u.orderEntities o
        LEFT JOIN FETCH u.orderSHistoryEntities h
            WHERE u.id = :id Order By h.timeOrderHistory DESC
    """)
    Optional<UserEntity> findUserFullInfoById(@Param("id") Integer id);

    @Query("""
    SELECT DISTINCT u
    FROM UserEntity u
    LEFT JOIN FETCH u.orderEntities
    WHERE u.id = :id
""")
    Optional<UserEntity> findUserWithOrders(Integer id);

    @Query("""
    SELECT h
    FROM OrderSHistoryEntity h
    WHERE h.userEntity.id = :id
    ORDER BY h.timeOrderHistory DESC
""")
    List<OrderSHistoryEntity> findHistoryByUser(Integer id);
    @Modifying
    @Query(
            value = "UPDATE UserEntity u " +
                    "SET u.password = :changePassword " +
                    "WHERE u.id = :id_user "
    )
    public Integer updatePasswordUser(@Param("changePassword") String changePassord , @Param("id_user") Integer iduser);

    @Query(
            value = "SELECT u FROM UserEntity u " +
                    "WHERE u.id = :userId"
    )
    public Optional<UserEntity> findInfoUserTOUpdateById(@Param("userId") Long userId);

    @Query(
            value = "SELECT u " +
                    "FROM UserEntity u JOIN u.orderSHistoryEntities odht "
    )
    public  List<UserEntity> findAllUsers();

    @Query(
            value = "SELECT COUNT(*)" +
                    "FROM UserEntity u " +
                    "Where YEAR(u.createAt) = :year and u.id != :idAdmin "
    )
    Long getCountNewAccountByYear(@Param("year") Integer year  ,@Param("idAdmin") Integer idAdmin);

    @Query(
            value = "SELECT COUNT(u) " +
                    "FROM UserEntity u " +
                    "WHERE u.id != :idAdmin"
    )
    public Long getCountuser(@Param("idAdmin") long idAdmin);

    @Query("""
            SELECT new com.example.ProJectBackWeb.DTO.UserDTO( u.id, u.fullname, COALESCE(SUM(odh.totalPrice),0), u.picture, u.email, COUNT(odh.id), u.date, u.active ) 
            FROM UserEntity u LEFT JOIN u.orderSHistoryEntities odh ON odh.status = :status  
            WHERE u.id != :idAdmin  
            GROUP BY u.id, u.fullname, u.picture, u.email, u.date, u.active """)
    public List<UserDTO> getinfoAllUser(@Param("idAdmin") long idAdmin , @Param("status") String status);
}
