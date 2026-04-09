package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.SizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<SizeEntity , Integer> {
    @Query(value = "select * from Sizes s where s.size_type in (:sizes) " , nativeQuery = true)
  public List<SizeEntity> FindBysize(@Param(value = "sizes") List<String> sizes);


    boolean existsBySize(String s);


}
