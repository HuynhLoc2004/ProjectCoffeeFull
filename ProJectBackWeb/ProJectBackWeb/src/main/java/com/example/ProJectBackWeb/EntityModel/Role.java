package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "Roles")
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Column(name = "id_role")
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Id
    private Integer id;
    @Column(name = "name_role" , unique = true , nullable = false)
    private String namerole;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "roles_permission",
            joinColumns = @JoinColumn(name = "id_role"),
            inverseJoinColumns = @JoinColumn(name = "id_permission")
    )
    private List<Permission> permissionSets = new ArrayList<>();

    public Role(String name_role) {
        this.namerole = name_role;
    }
    public void Addpermission(Permission permission){
        this.permissionSets.add(permission);
    }
}
