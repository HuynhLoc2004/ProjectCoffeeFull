package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.AdminLoginRequest;
import com.example.ProJectBackWeb.RequestData.UserRequestLogin;
import com.example.ProJectBackWeb.ResponseData.ResponseAuthentication;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.AuthenAdminService;
import com.example.ProJectBackWeb.Service.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AuthenAdminController {
    private final AuthenAdminService authenAdminService;
    public AuthenAdminController(AuthenAdminService authenAdminService) {
        this.authenAdminService = authenAdminService;
    }
    @PostMapping("/login")
    public ResponseData<ResponseAuthentication> loginAdmin(@RequestBody UserRequestLogin userRequestLogin , HttpServletResponse httpServletResponse) throws ParseException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode() , "admin login successfully" , this.authenAdminService.AuthenAdminLogin(userRequestLogin , httpServletResponse));
    }

        @GetMapping("/authenAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<Boolean> checkAuthenAdmin(JwtAuthenticationToken jwtAuthenticationToken){
        return new ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(),  "ok" , true);
    }
    @GetMapping("/AdminLogOut")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseData<ResponseAuthentication> adminLogOut(JwtAuthenticationToken jwtAuthenticationToken , HttpServletResponse httpServletResponse){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "Logout successfully" , this.authenAdminService.authenLogout(jwtAuthenticationToken ,httpServletResponse ));
    }
}
