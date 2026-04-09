package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.EmailRequest;
import com.example.ProJectBackWeb.RequestData.EvaluatedRequest;
import com.example.ProJectBackWeb.RequestData.OTPResetpassWordRequest;
import com.example.ProJectBackWeb.RequestData.OTPemailRequest;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.SenderMailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.jsonwebtoken.Jwt;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@Slf4j
public class SenderMailController {
    private final SenderMailService senderMailService;

    public SenderMailController(SenderMailService senderMailService) {
        this.senderMailService = senderMailService;
    }

    @PostMapping("/send-OTP-ChangePassword")
     public ResponseData<Boolean> sendOtpChangePassword( @RequestBody EmailRequest emailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
         return new ResponseData<Boolean>(HttpStatusEnum.OK.getCode(), "send otp successfully" ,this.senderMailService.SenderOtpEmail_ChangePassword(emailRequest , jwtAuthenticationToken));
    }
    @PostMapping("/verify-OTP-ChangePassword")
    public ResponseData<Boolean> verifyOtpChangePassword(@RequestBody @Valid OTPemailRequest otPemailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode() , "verify otp email successfully" , this.senderMailService.Verify_OTP_CHANGE_PASSWORD(otPemailRequest , jwtAuthenticationToken));
    }
    @PostMapping("/send-OTP-forgotPassword")
    public ResponseData<Boolean> sendOtpForgotPassword( @RequestBody EmailRequest emailRequest ) throws JsonProcessingException {
        return new ResponseData<Boolean>(HttpStatusEnum.OK.getCode(), "send otp successfully" ,this.senderMailService.SenderOtpEmail_Forgotpassword(emailRequest ));
    }
    @PostMapping("/verify-OTP-forgotPassword")
    public ResponseData<Boolean> verifyOtp_fotgotPassword(@RequestBody @Valid OTPResetpassWordRequest otpResetpassWordRequest ) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode() , "verify otp email successfully" , this.senderMailService.Verify_OTP_Forgot_PASSWORD(otpResetpassWordRequest ));
    }
    @PostMapping("/sendEvaluate")
    public ResponseData<Boolean> sendEvaluate( JwtAuthenticationToken
              jwtAuthenticationToken ,@RequestBody EvaluatedRequest evaluatedRequest ){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "send evaluate successfully" , this.senderMailService
                .sendEmailEvaluate(jwtAuthenticationToken , evaluatedRequest));
    }
}
