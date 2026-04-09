package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "email not null !!!")
    private String email;
    @NotNull(message = "newPassword not null !!")
    private String newPassword;
}
