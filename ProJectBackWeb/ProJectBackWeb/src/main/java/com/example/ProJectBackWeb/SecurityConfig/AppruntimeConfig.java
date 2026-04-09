package com.example.ProJectBackWeb.SecurityConfig;

import com.example.ProJectBackWeb.EntityModel.*;
import com.example.ProJectBackWeb.Reponsitory.*;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Configuration
public class AppruntimeConfig {
    private final SizeRepository sizeRepository;
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ToppingRepository toppingRepository;
    private final ProductRepository productRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public AppruntimeConfig(SizeRepository sizeRepository, PermissionRepository permissionRepository, RoleRepository roleRepository, UserRepository userRepository, ToppingRepository toppingRepository, ProductRepository productRepository) {
        this.sizeRepository = sizeRepository;
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.toppingRepository = toppingRepository;
        this.productRepository = productRepository;
    }

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            if (!sizeRepository.existsBySize("S")) {
                sizeRepository.save(new SizeEntity("S", 0.0));
            }
            if (!sizeRepository.existsBySize("M")) {
                sizeRepository.save(new SizeEntity("M", 5000.0));
            }
            if (!sizeRepository.existsBySize("L")) {
                sizeRepository.save(new SizeEntity("L", 8000.0));
            }

        };
    }

    @Bean
    ApplicationRunner applicationRunner_Roles() {
        return args -> {
            if (!permissionRepository.existsByPermissionname("FULL")) {
                permissionRepository.save(new Permission("FULL"));
            }
            if (!permissionRepository.existsByPermissionname("READ")) {
                permissionRepository.save(new Permission("READ"));
            }
            if (!permissionRepository.existsByPermissionname("UPDATE")) {
                permissionRepository.save(new Permission("UPDATE"));
            }
            if (!permissionRepository.existsByPermissionname("WRITE")) {
                permissionRepository.save(new Permission("WRITE"));
            }

            // ROLES

            if (!roleRepository.existsByNamerole("ADMIN")) {
                Role role = new Role("ADMIN");
                role.Addpermission(permissionRepository.findBynamePermissionn("FULL"));
                roleRepository.save(role);
            }
            if (!roleRepository.existsByNamerole("USER")) {
                Role role = new Role("USER");
                role.setPermissionSets((new ArrayList<>(permissionRepository.findAllPermissionExcep("ADMIN"))));
                roleRepository.save(role);
            }


        };
    }

    @Bean
    ApplicationRunner applicationRunner_ADMIN() {
        return args -> {
            if (!userRepository.existsByAccount("admin")) {
                UserEntity userEntity = new UserEntity();
                userEntity.setAccount("admin");
                userEntity.setAddress("");
                userEntity.setPassword(passwordEncoder.encode("admin"));
                userEntity.setPhone("0977958350");
                userEntity.setFullname("Huỳnh Tấn Lộc");
                userEntity.setCreateAt(LocalDateTime.now());
                userEntity.setDate(LocalDate.parse("2004-10-27"));
                userEntity.setActive(true);
                userEntity.setEmail("huynhtanlocpp089@gmail.com");
                userEntity.addRole(roleRepository.findRoleByName("ADMIN"));
                userEntity.setProvider("LOCAL");
                userEntity.setProviderId(UUID.randomUUID().toString());
                userRepository.save(userEntity);
            }
        };
    }

    @Bean
    ApplicationRunner applicationRunner_Topping() {
        return args -> {
            if (this.toppingRepository.findToppingByType("A") == null) {
                this.toppingRepository.save(new ToppingEntity("A", "Trân châu đen", 5000.0));
            }
            if (this.toppingRepository.findToppingByType("B") == null) {
                this.toppingRepository.save(new ToppingEntity("B", "Thạch cà phê", 7000.0));
            }
            if (this.toppingRepository.findToppingByType("C") == null) {
                this.toppingRepository.save(new ToppingEntity("C", "Kem cheese", 10000.0));
            }


        };
    }
}

