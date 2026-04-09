package com.example.ProJectBackWeb.Exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Appexception extends RuntimeException{
    private int statusCode;
    private String message;
    private Object object;

    public Appexception(int statusCode , String message){
        this.statusCode =  statusCode;
        this.message = message;
    }
}
