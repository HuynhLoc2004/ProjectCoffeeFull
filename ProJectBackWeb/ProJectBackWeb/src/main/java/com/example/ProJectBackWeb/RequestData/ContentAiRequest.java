package com.example.ProJectBackWeb.RequestData;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Setter
@Getter
public class ContentAiRequest {
    @NotNull(message = "content not null")
    private String content;
    private LocalDateTime localDateTime;
}
