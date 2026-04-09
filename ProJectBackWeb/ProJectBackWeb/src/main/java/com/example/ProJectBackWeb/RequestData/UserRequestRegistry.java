package com.example.ProJectBackWeb.RequestData;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;


import java.io.Serializable;
import java.time.LocalDate;

@Data
@Builder
public class UserRequestRegistry implements Serializable {
    @NotNull(message = "The account cannot be null")
    @Pattern(
            regexp = "^[a-zA-Z0-9]+$",
            message = "Tài khoản chỉ gồm chữ không dấu và số, không có khoảng trắng"
    )
    private String account;
    @NotNull(message = "The password cannot be null")
    private String password;
    @Email(message ="invalid email")
    @NotNull
    private String email;
    @Pattern(regexp = "^0[35789]\\d{8}$", message = "Số điện thoại phải theo chuẩn ")
    @NotNull(message = "Phone not null")
    private String phone;
    @NotNull(message = "name not null")
    private String fullname;
    @NotNull(message = "address not null")
    private String address;
    @NotNull(message = "date not null")
    private String date;

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }


}
