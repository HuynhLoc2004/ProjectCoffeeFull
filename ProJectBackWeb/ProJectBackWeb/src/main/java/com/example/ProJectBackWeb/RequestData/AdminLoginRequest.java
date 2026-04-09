package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class AdminLoginRequest {
    @NotNull(message = "account not null !!")
    private String account;
    @NotNull(message = "password not null !!")
    private String password;
}
