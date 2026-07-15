package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.ProductEntity;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity , Integer> {
    public boolean existsByCode(String code);
    @Query(
            value = "SELECT * FROM Products p WHERE p.product_category = :category",
            nativeQuery = true
    )
    public List<ProductEntity> findProductByCategory(@Param("category") String category);

    @Query(
            value = "SELECT * FROM products p WHERE p.product_category = :category ORDER BY p.product_id DESC LIMIT :size" , nativeQuery = true
    )
    public  List<ProductEntity> findTopProductbyCategory(@Param("size") int size,@Param("category") String category);

    @Query("""
    SELECT DISTINCT p
    FROM ProductEntity p
    LEFT JOIN FETCH p.sizeEntitySet s
    WHERE  p.id = :id
 
""")
    ProductEntity FindProductByid(@Param("id") int id);

    @Query(
            value ="SELECT DISTINCT * FROM products p WHERE LOWER(p.product_name) LIKE LOWER(CONCAT('%', TRIM(:searchname), '%')) " +
                    "AND p.product_active = :active ORDER BY p.product_id DESC LIMIT :size"
            , nativeQuery = true
    )
    public List<ProductEntity>  findTopProductBySearchName(@Param("size") int size  , @Param("searchname") String searchname , @Param("active") boolean active);

    @Query(value = "SELECT p FROM ProductEntity p")
    public List<ProductEntity> get_products();

    @Query(value = "SELECT p FROM ProductEntity p WHERE p.code = :code")
     public Optional<ProductEntity> findProductByCode(@Param("code") String code);

    @Modifying
    @Query(
            value = "DELETE FROM ProductEntity p WHERE p.id = :productId "
    )
    public int deleteProductById(@Param("productId") Integer productid);

}
