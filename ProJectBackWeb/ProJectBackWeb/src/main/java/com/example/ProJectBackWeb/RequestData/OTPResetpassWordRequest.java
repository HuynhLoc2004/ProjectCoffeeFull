package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OTPResetpassWordRequest {
    @NotBlank(message = "OTP không được để trống")
    @Pattern(regexp = "\\d{6}", message = "OTP phải gồm đúng 6 chữ số")
    private String otpEmail;
    @Email(message = "email invalid !!!")
    @NotBlank(message = "email not null !!!")
    private String email;
}
