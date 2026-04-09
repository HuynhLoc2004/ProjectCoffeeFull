package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "invalid_refresh_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvalidRefreshTokenEntity {
    @Column(name = "id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "jti")
    private String jti;

    public InvalidRefreshTokenEntity(String jti) {
        this.jti = jti;
    }
}
