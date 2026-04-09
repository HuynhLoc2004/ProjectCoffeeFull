package com.example.ProJectBackWeb.ResponseData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@NoArgsConstructor
@Slf4j
public class ResponseAuthentication {
    private Boolean authenticated;
    private String  message;
    private String accessToken;

    public ResponseAuthentication(Boolean authenticated, String message, String accessToken) {
        this.authenticated = authenticated;
        this.message = message;
        this.accessToken = accessToken;
    }

    public ResponseAuthentication(Boolean authenticated, String message) {
        this.authenticated = authenticated;
        this.message = message;
    }
}
