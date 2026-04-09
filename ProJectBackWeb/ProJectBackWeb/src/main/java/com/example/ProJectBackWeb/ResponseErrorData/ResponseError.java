package com.example.ProJectBackWeb.ResponseErrorData;

import lombok.*;

import java.util.Date;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseError {
    private int statusCode;
    private String message;
    private Date timestamp;
    private String error;

}
