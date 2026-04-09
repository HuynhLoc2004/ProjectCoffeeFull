package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.UserRequestLogin;
import com.example.ProJectBackWeb.ResponseData.ResponseAuthentication;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.AuthenticationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.oauth2.sdk.auth.JWTAuthentication;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;


    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseData<ResponseAuthentication> login_local(@RequestBody  UserRequestLogin userRequestLogin , HttpServletResponse httpServletResponse) throws ParseException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode() , HttpStatusEnum.OK.getMessage() , this.authenticationService.authentication_login(userRequestLogin , httpServletResponse));

    }

//    @GetMapping("/google")
//    public ResponseData<ResponseAuthentication> login_google(OAuth2AuthenticationToken oAuth2AuthenticationToken , HttpServletResponse httpServletResponse) throws ParseException {
//        return new ResponseData<>(HttpStatusEnum.OK.getCode() , HttpStatusEnum.OK.getMessage()+oAuth2AuthenticationToken.getPrincipal().getAttribute("email") , this.authenticationService.authentication_google(oAuth2AuthenticationToken , httpServletResponse));
//    }


    @GetMapping("/info")
    public ResponseData<UserEntity> getInfoUser(JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "get info user" ,this.authenticationService.getinfoUserId(jwtAuthenticationToken));
    }

    @GetMapping("/refresh_token")
    public ResponseData<ResponseAuthentication> refreshToken(JwtAuthenticationToken jwtAuthenticationToken ,  HttpServletResponse httpServletResponse) throws ParseException {
       return new ResponseData(HttpStatusEnum.OK.getCode() , "refresh successfully" , this.authenticationService.refreshToken(jwtAuthenticationToken , httpServletResponse));

    }

    @GetMapping("/logout")
    public ResponseData<ResponseAuthentication> logoutUser(JwtAuthenticationToken jwtAuthenticationToke , HttpServletResponse httpServletResponse){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), HttpStatusEnum.OK.getMessage() , this.authenticationService.logout(jwtAuthenticationToke , httpServletResponse));
    }





}
