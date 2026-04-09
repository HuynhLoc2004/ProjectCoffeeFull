package com.example.ProJectBackWeb.GlobalHandleException;

import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.Exception.Appexception;
import com.example.ProJectBackWeb.ResponseErrorData.ResponseError;
import com.microsoft.sqlserver.jdbc.SQLServerException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.NoSuchElementException;

@RestControllerAdvice

public class HandleException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseError handleValidException(MethodArgumentNotValidException e){
        String message =  e.getMessage();

        int indexStart = message.lastIndexOf("[");
        int indexend = message.lastIndexOf("]");
        message = message.substring(indexStart+1 , indexend-1);
        ResponseError responseError = new ResponseError();
        responseError.setError(HttpStatusEnum.BAD_REQUEST.getMessage());
        responseError.setStatusCode(HttpStatusEnum.BAD_REQUEST.getCode());
        responseError.setTimestamp(new Date());
        responseError.setMessage(message);
        return responseError;

    }

    @ExceptionHandler(Appexception.class)
    public ResponseError handleValidAxception(Appexception e){
        ResponseError responseError = new ResponseError();
        responseError.setError(e.getMessage());
        responseError.setTimestamp(new Date());
        responseError.setMessage(e.getMessage());
        responseError.setStatusCode(e.getStatusCode());
        return responseError;
    }
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseError handleNosuch(NoSuchElementException e){
        ResponseError responseError =  new ResponseError();
        responseError.setError(e.getMessage());
        responseError.setTimestamp(new Date());
        responseError.setMessage(e.getMessage());
        responseError.setStatusCode(HttpStatusEnum.NOT_FOUND.getCode());
        return responseError;
    }
//    @ExceptionHandler(SQLServerException.class)
//    public ResponseError handleSqlException(SQLServerException sqlex){
//        ResponseError responseError = new ResponseError();
//        String message = sqlex.getMessage().substring(sqlex.getMessage().lastIndexOf("The"));
//        responseError.setMessage(message);
//        responseError.setError(HttpStatusEnum.BAD_REQUEST.getMessage());
//        responseError.setStatusCode(HttpStatusEnum.BAD_REQUEST.getCode());
//        responseError.setTimestamp(new Date());
//        return responseError;
//    }


}
