
package com.example.ProJectBackWeb.EntityModel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Sizes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SizeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "size_id")
    private int id;
    @Column(name = "size_type" , unique = true)
    private String size;
    @Column(name = "price_size")
    private Double price_size;
    public SizeEntity(String size, Double price_size) {
        this.size = size;
        this.price_size = price_size;
    }

}
