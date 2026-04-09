package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.ToppingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ToppingRepository extends JpaRepository<ToppingEntity , Integer> {
    @Query(
            "select t from ToppingEntity t where t.typeTopping = :type"
    )
    public ToppingEntity findToppingByType(@Param("type") String type);
}
