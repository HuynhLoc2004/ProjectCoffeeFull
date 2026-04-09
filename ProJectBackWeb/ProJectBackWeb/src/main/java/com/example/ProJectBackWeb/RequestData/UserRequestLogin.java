package com.example.ProJectBackWeb.RequestData;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserRequestLogin {
    @NotBlank(message = "the account_user not null")
    @Pattern(
            regexp = "^[a-zA-Z0-9]+$",
            message = "Tài khoản chỉ gồm chữ không dấu và số, không có khoảng trắng"
    )
        private String account_user;
    @NotBlank(message = "the password not null")
    private String password;
}
