package com.example.ProJectBackWeb.Reponsitory;

import com.example.ProJectBackWeb.EntityModel.InvalidRefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidRefreshTokenRepository extends JpaRepository<InvalidRefreshTokenEntity, Integer> {
    @Query(
            value = "select count(1) from invalid_refresh_tokens where jti = :jti",
            nativeQuery = true
    )
    Integer countByJti(@Param("jti") String jti);

}
