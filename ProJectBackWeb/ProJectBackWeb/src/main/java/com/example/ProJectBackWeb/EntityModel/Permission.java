package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Permissions")
@Getter
@Setter
public class Permission {
    @Column(name = "id_permission")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    @Column(name = "name_permission" , nullable = false)
    private String permissionname;

    public Permission(String permission_name) {
        this.permissionname = permission_name;
    }
}
