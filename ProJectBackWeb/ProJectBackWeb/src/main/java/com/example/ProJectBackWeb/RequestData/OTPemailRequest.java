package com.example.ProJectBackWeb.RequestData;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OTPemailRequest {
    @NotNull(message = "otp email not null")
    private String otpEmail;
}
