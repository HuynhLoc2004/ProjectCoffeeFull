package com.example.ProJectBackWeb.RequestData;

import lombok.*;
import org.springframework.web.bind.annotation.RequestBody;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class ActiveRequest {
    private Boolean activeupdate;
}
