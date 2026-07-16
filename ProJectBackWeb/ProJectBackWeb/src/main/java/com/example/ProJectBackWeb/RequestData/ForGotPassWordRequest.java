package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ForGotPassWordRequest {
    @Email(message ="invalid email")
    @NotBlank(message = "email not null !!!")
    private String email;
    @NotBlank(message = "newPassword not null !!")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String newPassword;
    @NotBlank(message = "Reset token không được để trống")
    private String resetToken;
}
