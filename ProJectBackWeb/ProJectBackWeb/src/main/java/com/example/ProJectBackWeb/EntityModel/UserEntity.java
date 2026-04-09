    package com.example.ProJectBackWeb.EntityModel;
    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonFormat;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.Pattern;
    import lombok.*;
    import org.springframework.core.annotation.Order;
    import org.springframework.format.annotation.DateTimeFormat;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.util.*;


    @AllArgsConstructor
    @NoArgsConstructor
    @Entity
    @Getter
    @Setter
    @Table(name = "user_account")
    public class UserEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_user")
        private Integer id;

        @Column(name = "account_user", unique = true, nullable = true)
        private String account;

        @Column(name = "password_user", nullable = true)
        private String password;

        @Column(name = "email_user", unique = true, nullable = false)
        private String email;

        @Column(name = "phone_user", unique = true, nullable = true)
        private String phone;

        @Column(name = "date_user" , nullable = true)
        private LocalDate date;

        @Column(name = "fullname" , nullable = true  , columnDefinition = "Nvarchar(100)")
        private String fullname;

        @Column(name = "picture" , nullable = true , columnDefinition = "Nvarchar(255)")
        private String picture;

        @Column(name = "user_active" , nullable = false)
        private Boolean active;

        @Column(name = "provider" , nullable = false)
        private String provider;

        @Column(name = "providerId" , nullable = false)
        private String providerId;
        @Column(name = "address" , nullable = false , columnDefinition = "NVARCHAR(255)")
        private String address;
        @Column(name = "create_at" , nullable = false )
        private LocalDateTime createAt;
        @ManyToMany(
                fetch = FetchType.LAZY
        )
        @JoinTable(
                name = "user_role",
                joinColumns =  @JoinColumn(name = "id_user"),
                inverseJoinColumns = @JoinColumn(name = "id_role")
        )
        private Set<Role> roles = new HashSet<>();


        @JsonManagedReference
        @OneToOne(mappedBy = "userEntity" , fetch = FetchType.LAZY , cascade = CascadeType.ALL,
                orphanRemoval = true)
        private CartEntity cartEntity;


        @OneToMany(mappedBy = "userEntity" , fetch = FetchType.LAZY)
        @JsonManagedReference
        @OrderBy("createdAt ASC")
        private Set<OrderEntity> orderEntities = new HashSet<>();

        @OneToMany(fetch = FetchType.LAZY , mappedBy = "userEntity")
        @JsonManagedReference
        private List<OrderSHistoryEntity> orderSHistoryEntities = new ArrayList<>();
        @OneToMany(fetch =  FetchType.LAZY , cascade = CascadeType.ALL , mappedBy = "userEntity")
        private List<EvaluateEntity> evaluateEntity;

        public void addRole(Role role){
            this.roles.add(role);
        }


    }
