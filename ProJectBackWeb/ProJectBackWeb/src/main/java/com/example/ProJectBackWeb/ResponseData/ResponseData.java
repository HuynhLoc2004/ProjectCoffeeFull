    package com.example.ProJectBackWeb.ResponseData;

    import com.fasterxml.jackson.annotation.JsonInclude;
    import lombok.Builder;
    import lombok.Data;
    import org.springframework.http.ResponseEntity;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public class ResponseData<T> {
        private int statusCode;
        private String message;
        private T result;

        // Delete , PUT,
        public ResponseData(int statuscode , String message){
            this.statusCode =statuscode;
            this.message = message;
        }

        public ResponseData(int statusCode , String message , T result) {
            this.result = result;
            this.message = message;
            this.statusCode = statusCode;
        }



    }
