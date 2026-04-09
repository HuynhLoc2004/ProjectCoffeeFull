package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class EvaluatedRequest {
    @NotNull(message = "textform not null")
    private String textForm;
    @NotNull(message = "email not null")
    private String email;
    @NotNull(message = "time not null")
    private LocalDateTime localDateTime;
}
