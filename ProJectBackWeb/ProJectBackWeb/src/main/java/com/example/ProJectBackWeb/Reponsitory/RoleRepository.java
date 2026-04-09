package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoleRepository extends JpaRepository<Role , Integer> {
    public boolean existsByNamerole(String name);
    @Query(
            value = "Select * from roles r where r.name_role = :nameRole" ,nativeQuery = true
    )
    public Role findRoleByName(@Param("nameRole") String nameRole);
}
