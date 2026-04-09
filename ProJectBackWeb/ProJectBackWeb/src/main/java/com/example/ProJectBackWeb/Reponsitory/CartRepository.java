package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity , Integer> {

}
