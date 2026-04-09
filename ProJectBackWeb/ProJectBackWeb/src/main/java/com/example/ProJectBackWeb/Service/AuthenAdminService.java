package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import com.example.ProJectBackWeb.RequestData.AdminLoginRequest;
import com.example.ProJectBackWeb.RequestData.UserRequestLogin;
import com.example.ProJectBackWeb.ResponseData.ResponseAuthentication;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public class AuthenAdminService {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    public AuthenAdminService(UserRepository userRepository, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
    }
    public ResponseAuthentication AuthenAdminLogin(UserRequestLogin adminLoginRequest , HttpServletResponse httpServletResponse) throws ParseException {
        return this.authenticationService.authentication_login(adminLoginRequest , httpServletResponse);
    }

    public ResponseAuthentication authenLogout(JwtAuthenticationToken jwtAuthenticationToken , HttpServletResponse httpServletResponse){
        return this.authenticationService.logout(jwtAuthenticationToken , httpServletResponse);
    }
}
