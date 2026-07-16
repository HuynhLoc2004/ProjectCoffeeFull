package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.ProductEntity;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity , Integer> {
    public boolean existsByCode(String code);
    List<ProductEntity> findByCategoryAndActiveTrueOrderByIdDesc(String category);

    List<ProductEntity> findByActiveTrueOrderByIdDesc();

    List<ProductEntity> findByCategoryAndActiveTrue(String category, Pageable pageable);

    @Query("""
    SELECT DISTINCT p
    FROM ProductEntity p
    LEFT JOIN FETCH p.sizeEntitySet s
    WHERE  p.id = :id
 
""")
    ProductEntity FindProductByid(@Param("id") int id);

    List<ProductEntity> findByNameContainingIgnoreCaseAndActiveTrueOrderByIdDesc(String searchName, Pageable pageable);

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
