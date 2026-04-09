package com.example.ProJectBackWeb.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private Integer userId;
    private String fullname;
    private Long totalPriceOrder;
    private String avatar;
    private String email;
    private Long countOrder;
    private LocalDate date;
    private Boolean active;


    public UserDTO(Integer userid ,String fullname, Long totalPriceOrder, String avatar, String email, Long countOrder, LocalDate date , Boolean active) {
        this.userId = userid;
        this.fullname = fullname;
        this.totalPriceOrder = totalPriceOrder;
        this.avatar = avatar;
        this.email = email;
        this.countOrder = countOrder;
        this.date = date;
        this.active = active;
    }
}
