package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission , Integer> {
    public boolean existsByPermissionname(String name);
    @Query(
            value = "select * from Permissions pe where pe.name_permission = :name" , nativeQuery = true
    )
    public Permission findBynamePermissionn(@Param(value = "name") String name);
    @Query(
            value = "select * from Permissions pe where pe.name_permission != :nameException" , nativeQuery = true
    )
    public List<Permission> findAllPermissionExcep(@Param(value = "nameException" ) String nameException);
}
