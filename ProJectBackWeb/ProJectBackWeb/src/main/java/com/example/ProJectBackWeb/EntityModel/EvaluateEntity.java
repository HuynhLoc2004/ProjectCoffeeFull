package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvaluateEntity {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "evaluate_id" , nullable = false )
    private Integer id;
    @Column(name = "evaluate_text" , nullable = true , columnDefinition = "NVARCHAR(MAX)")
    private String text;
    @Column(name = "created_at" , nullable = true )
    private LocalDateTime created_at;
    @ManyToOne(fetch = FetchType.LAZY , cascade = CascadeType.ALL)
    private UserEntity userEntity;
}
