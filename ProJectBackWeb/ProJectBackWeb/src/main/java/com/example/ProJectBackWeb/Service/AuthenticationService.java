package com.example.ProJectBackWeb.Service;

import com.cloudinary.Cloudinary;
import com.example.ProJectBackWeb.EntityModel.InvalidRefreshTokenEntity;
import com.example.ProJectBackWeb.EntityModel.Permission;
import com.example.ProJectBackWeb.EntityModel.Role;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.Exception.Appexception;
import com.example.ProJectBackWeb.Reponsitory.InvalidRefreshTokenRepository;
import com.example.ProJectBackWeb.Reponsitory.PermissionRepository;
import com.example.ProJectBackWeb.Reponsitory.RoleRepository;
import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import com.example.ProJectBackWeb.RequestData.UserRequestLogin;

import com.example.ProJectBackWeb.ResponseData.ResponseAuthentication;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    private final RedisTemplate<String , String> redisTemplate;
    private final Gson gson ;
    private final InvalidRefreshTokenRepository invalidRefreshTokenRepository;
    private final ObjectMapper objectMapper;
    private  final Cloudinary cloudinary;
    @Value("${jwt.secret_key}")
    protected String SECRET_KEY;


    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository, RedisTemplate redisTemplate, Gson gson, InvalidRefreshTokenRepository invalidRefreshTokenRepository, ObjectMapper objectMapper, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;

        this.redisTemplate = redisTemplate;
        this.gson = gson;
        this.invalidRefreshTokenRepository = invalidRefreshTokenRepository;
        this.objectMapper = objectMapper;
        this.cloudinary = cloudinary;
    }

    @Value("${jwt.expirytime}")
    protected int expirytime;
    @Value("${jwt.refresh_time}")
    protected int refresh_time;
    @Value("${google.returnUrl}")
    private String googleReturnUrl;
    public ResponseAuthentication authentication_login(UserRequestLogin userRequestLogin, HttpServletResponse httpServletResponse) throws ParseException {
        if (!userRepository.existsByAccount(userRequestLogin.getAccount_user())) {
            throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "User not found");
        } else {

            UserEntity userEntityQuery = userRepository.findUserByAccount(userRequestLogin.getAccount_user());
            if(userRequestLogin.getAccount_user().equals(userEntityQuery.getAccount()) == true && passwordEncoder.matches(userRequestLogin.getPassword(), userEntityQuery.getPassword()) && userEntityQuery.getActive() == false){
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(),  "account blocked");
            }
            if (userRequestLogin.getAccount_user().equals(userEntityQuery.getAccount()) == true && passwordEncoder.matches(userRequestLogin.getPassword(), userEntityQuery.getPassword()) && userEntityQuery.getActive() == true) {
                List<String> scope = new ArrayList<>();
                for (Role r : userEntityQuery.getRoles()) {
                    scope.add("ROLE_" + r.getNamerole());
                    for (Permission p : r.getPermissionSets()) {
                        scope.add(p.getPermissionname());
                    }
                }

                String jwt_access = Jwts.builder()
                        .setHeaderParam("typ", "JWT")
                        .setSubject(userEntityQuery.getAccount())
                        .setId(UUID.randomUUID().toString())
                        .claim("scope", scope)
                        .claim("provider" , userEntityQuery.getProvider())
                        .claim("userId" ,userEntityQuery.getId())
                        .setIssuedAt(new Date())
                        .setExpiration(Date.from(Instant.now().plus(expirytime, ChronoUnit.MINUTES)))
                        .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                        .compact();


                String refreshTk =  GenRefresh_token(jwt_access, httpServletResponse);
                this.redisTemplate.opsForValue().set("refreshtoken_"+SignedJWT.parse(refreshTk).getJWTClaimsSet().getJWTID() , refreshTk);
                return new ResponseAuthentication(true, "login successfully" , jwt_access);


            }else{
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Password do not matches ");
            }
        }


    }

        @Transactional
        public ResponseAuthentication authentication_google(OAuth2AuthenticationToken oAuth2AuthenticationToken , HttpServletResponse httpServletResponse) throws ParseException, IOException {
                String email = oAuth2AuthenticationToken.getPrincipal().getAttribute("email");
                String fullname = oAuth2AuthenticationToken.getPrincipal().getAttribute("name");
                String picture = oAuth2AuthenticationToken.getPrincipal().getAttribute("picture");
                String subId = oAuth2AuthenticationToken.getPrincipal().getAttribute("sub");


                if(!userRepository.existsByEmail(email)){
                    String filePicture = this.downloadGoogleAvatar(picture);
                    UserEntity userEntity = new UserEntity();
                    userEntity.setEmail(email);
                    userEntity.setFullname(fullname);
                    userEntity.setPicture(filePicture);
                    userEntity.setProvider("GOOGLE");
                    userEntity.setProviderId(subId);
                    userEntity.setActive(true);
                    userEntity.setAddress("");
                    userEntity.setCreateAt(LocalDateTime.now());
                    userEntity.addRole(roleRepository.findRoleByName("USER"));
                    this.redisTemplate.opsForValue().set("userEntity"+userEntity.getId() , objectMapper.writeValueAsString(userEntity)  , 60 , TimeUnit.MINUTES);
                    userRepository.save(userEntity);


                    UserEntity userEntityQuery = userRepository.findUserByEmail(email);
                    List<String> scope = new ArrayList<>();
                    for (Role r : userEntityQuery.getRoles()) {
                        scope.add("ROLE_" + r.getNamerole());
                        for (Permission p : r.getPermissionSets()) {
                            scope.add(p.getPermissionname());
                        }
                    }

                    String jwt_access = Jwts.builder()
                               .setHeaderParam("typ", "JWT")
                            .setSubject(userEntityQuery.getAccount())
                            .setId(UUID.randomUUID().toString())
                            .claim("scope", scope)
                            .claim("userId" ,userEntityQuery.getId())
                            .claim("provider" , userEntityQuery.getProvider())
                            .setIssuedAt(new Date())
                            .setExpiration(Date.from(Instant.now().plus(expirytime, ChronoUnit.MINUTES)))
                            .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                            .compact();

                    GenRefresh_token(jwt_access, httpServletResponse);

                    return new ResponseAuthentication(true, "login successfully" , jwt_access);

                }
            UserEntity userEntityQuery = userRepository.findUserByEmail(email);
                if(userEntityQuery.getActive() == false){
                    httpServletResponse.sendRedirect(googleReturnUrl + "/login/account%20is%20blocked");
                    return null;
                }
            List<String> scope = new ArrayList<>();
            for (Role r : userEntityQuery.getRoles()) {
                scope.add("ROLE_" + r.getNamerole());
                for (Permission p : r.getPermissionSets()) {
                    scope.add(p.getPermissionname());
                }
            }

            String jwt_access = Jwts.builder()
                    .setHeaderParams(Map.of("typ" , "JWT"))
                    .setSubject(userEntityQuery.getAccount())
                    .setId(UUID.randomUUID().toString())
                    .claim("scope", scope)
                    .claim("userId" ,userEntityQuery.getId())
                    .claim("provider" , userEntityQuery.getProvider())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(Instant.now().plus(expirytime, ChronoUnit.MINUTES)))
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                    .compact();

          String refreshTk =  GenRefresh_token(jwt_access, httpServletResponse);
          this.redisTemplate.opsForValue().set("refreshtoken_"+SignedJWT.parse(refreshTk).getJWTClaimsSet().getJWTID() , refreshTk);
          return new ResponseAuthentication(true, "login successfully" , jwt_access);

    }


    private String downloadGoogleAvatar(String imageUrl) throws IOException {

        // 1. Mở luồng đọc từ URL của Google
        URL url = new URL(imageUrl);

        try (InputStream in = url.openStream()) {

            String nameFileRandom = UUID.randomUUID().toString();

            Map<String, Object> params = new HashMap<>();
            params.put("folder", "uploads");
            params.put("use_filename", true);
            params.put("unique_filename", false);
            params.put("public_id", nameFileRandom);

            Map uploadResult = this.cloudinary.uploader().upload(in.readAllBytes(), params);

            return uploadResult.get("secure_url").toString();
        }
    }

    public ResponseAuthentication verifyToken(String token) throws ParseException, JOSEException {
        if(token == null || token.equals("")){
            throw new Appexception(HttpStatusEnum.UNAUTHORIZED.getCode(), "invalid token");
        }
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier jwsVerifier = new MACVerifier(SECRET_KEY.getBytes());

        boolean veritfy =signedJWT.verify(jwsVerifier);
        
        Date expirytime = signedJWT.getJWTClaimsSet().getExpirationTime();

        if(veritfy && expirytime.after(new Date())){
            return new ResponseAuthentication(true , "verify token succussfully");
        }else{
            throw new Appexception(HttpStatusEnum.UNAUTHORIZED.getCode(), "invalid token");
        }

    }


    @Transactional
    public UserEntity getinfoUserId(JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
          String userInfogson = redisTemplate.opsForValue().get("userInfo"+jwtAuthenticationToken.getToken().getClaim("userId") );
          if(userInfogson == null){
              Number idUserNum =  jwtAuthenticationToken.getToken().getClaim("userId");
              Integer iduser = idUserNum.intValue();
              UserEntity userQuery = this.userRepository.findUserFullInfoById(iduser).orElseThrow();
              UserEntity userinfo = new UserEntity();
              userinfo.setFullname(userQuery.getFullname());
              if(userQuery.getPicture() == null){
                  userinfo.setPicture(null);
              }else{
                  userinfo.setPicture(userQuery.getPicture());
              }
              redisTemplate.opsForValue().set("userInfo"+jwtAuthenticationToken.getToken().getClaim("userId") , objectMapper.writeValueAsString(userinfo), 5 , TimeUnit.MINUTES);
              return userinfo;
          }

        return  objectMapper.readValue(userInfogson , UserEntity.class);


    }

    public String GenRefresh_token(String accessToken , @NotNull HttpServletResponse httpServletResponse) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(accessToken);

        String refresh_token = Jwts.builder()
                .setHeaderParams(Map.of("typ" , "JWT"))
                .setSubject(signedJWT.getJWTClaimsSet().getSubject())
                .setId(UUID.randomUUID().toString())
                .claim("scope", signedJWT.getJWTClaimsSet().getClaim("scope"))
                .claim("userId" ,signedJWT.getJWTClaimsSet().getClaim("userId"))
                .claim("provider" , signedJWT.getJWTClaimsSet().getClaim("provider"))
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plus(refresh_time, ChronoUnit.MINUTES)))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();

        Cookie cookie = new Cookie("Refresh_Token", refresh_token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(refresh_time * 60);

        httpServletResponse.addCookie(cookie);
        return refresh_token;
    }

    public ResponseAuthentication refreshToken(JwtAuthenticationToken jwtAuthenticationToken , HttpServletResponse httpServletResponse) throws ParseException {
          String refreshToken = this.redisTemplate.opsForValue().get("refreshtoken_"+jwtAuthenticationToken.getToken().getId());
          if(refreshToken == null ){
             if(this.invalidRefreshTokenRepository.countByJti(jwtAuthenticationToken.getToken().getId()) > 0){
                  throw new Appexception(HttpStatusEnum.UNAUTHORIZED.getCode(),  "Invalid Token");
             }
          }

        String jwt_access = Jwts.builder()
                .setHeaderParams(Map.of("typ" , "JWT"))
                .setSubject(jwtAuthenticationToken.getToken().getSubject())
                .setId(UUID.randomUUID().toString())
                .claim("scope", jwtAuthenticationToken.getToken().getClaim("scope"))
                .claim("userId" ,jwtAuthenticationToken.getToken().getClaim("userId"))
                .claim("provider" , jwtAuthenticationToken.getToken().getClaim("provider"))
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plus(expirytime, ChronoUnit.MINUTES)))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();

      String rfToken = this.GenRefresh_token(jwt_access , httpServletResponse);
      SignedJWT signedJWT = SignedJWT.parse(rfToken);
      this.redisTemplate.opsForValue().set("refreshtoken_" + signedJWT.getJWTClaimsSet().getJWTID() , rfToken , this.refresh_time , TimeUnit.MINUTES);
      InvalidRefreshTokenEntity invalidRefreshTokenEntity  = new InvalidRefreshTokenEntity();
      invalidRefreshTokenEntity.setJti(jwtAuthenticationToken.getToken().getId());
      this.invalidRefreshTokenRepository.save(invalidRefreshTokenEntity);


      return new ResponseAuthentication(true , "RefreshToken successfully" ,  jwt_access);
    }

    public ResponseAuthentication logout(JwtAuthenticationToken jwtAuthenticationToken , HttpServletResponse httpServletResponse){

         String refreshtoken =  this.redisTemplate.opsForValue().get("refreshtoken_"+jwtAuthenticationToken.getToken().getId());
         this.redisTemplate.delete("refreshtoken_"+jwtAuthenticationToken.getToken().getId());
         this.invalidRefreshTokenRepository.save(new InvalidRefreshTokenEntity(jwtAuthenticationToken.getToken().getId()));
        Cookie cookie = new Cookie("Refresh_Token", refreshtoken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(refresh_time * 0);
        httpServletResponse.addCookie(cookie);
        return new ResponseAuthentication(true , "logout successfully " );

    }
}





