package com.example.ProJectBackWeb.SecurityConfig;

import com.example.ProJectBackWeb.Custom.JwtDecodeCustom;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.Exception.Appexception;
import com.example.ProJectBackWeb.ResponseData.ResponseAuthentication;
import com.example.ProJectBackWeb.Service.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.text.ParseException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {
    private final String[] ENDPOINT = {"/product/**" , "/image/**" };
    private final JwtDecodeCustom jwtDecodeCustom;
    private final AuthenticationService authenticationService;
    private final RedisTemplate<String , String> redisTemplate;
    public SecurityConfig(JwtDecodeCustom jwtDecodeCustom, AuthenticationService authenticationService, RedisTemplate<String, String> redisTemplate) {
        this.jwtDecodeCustom = jwtDecodeCustom;
        this.authenticationService = authenticationService;
        this.redisTemplate = redisTemplate;
    }
    @Value("${google.returnUrl}")
    private String googleReturnUrl;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http , JwtAuthenticationConverter authenticationConverter  , BearerTokenResolver bearerTokenResolver) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.authorizeHttpRequests(
                authorizationManagerRequestMatcherRegistry -> authorizationManagerRequestMatcherRegistry.requestMatchers(HttpMethod.POST , ENDPOINT).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()//
                        .requestMatchers(HttpMethod.GET , ENDPOINT).permitAll()
                        .requestMatchers(HttpMethod.POST , "/auth/login").permitAll()
//                        .requestMatchers(HttpMethod.GET , "/auth/google").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user/registry").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user/change-password").authenticated()
                        .requestMatchers(HttpMethod.GET , "/user/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT , "/user/update-imgInfo").authenticated()
                        .requestMatchers(HttpMethod.PUT , "/user/update-info").authenticated()
                        .requestMatchers(HttpMethod.GET , "/user/get-countUser").authenticated()
                        .requestMatchers(HttpMethod.POST , "/user/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.GET , "/user/get-CountAllUser").authenticated()
                        .requestMatchers(HttpMethod.PUT , "/user/change-userActive").authenticated()
                        .requestMatchers(HttpMethod.GET  , "/user/get-infoAllUser").authenticated()
                        .requestMatchers(HttpMethod.GET , "/auth/info").authenticated()
                        .requestMatchers(HttpMethod.GET , "/auth/refresh_token").authenticated()
                        .requestMatchers(HttpMethod.GET , "/auth/logout").authenticated()
                        .requestMatchers(HttpMethod.POST , "/cart/createCart").authenticated()
                        .requestMatchers(HttpMethod.GET , "/cart/getCart").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/cartproduct/**").authenticated()
                        .requestMatchers(HttpMethod.GET , "/cartproduct/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE , "/cartproduct/**").authenticated()
                        .requestMatchers(HttpMethod.POST , "/order/create").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/get-ordt/**").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/getFullyearOrder").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/getCountOrderByYear").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/get-profit/by-month").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/getTopBestSel").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/get-orders").authenticated()
                        .requestMatchers(HttpMethod.GET , "/order/get-order").authenticated()
                        .requestMatchers(HttpMethod.GET , "/payos/createQr").authenticated()
                        .requestMatchers(HttpMethod.POST , "/payos/webhook").permitAll()
                        .requestMatchers(HttpMethod.POST , "/email/send-OTP-forgotPassword").permitAll()
                        .requestMatchers(HttpMethod.POST , "/email/verify-OTP-forgotPassword").permitAll()
                        .requestMatchers(HttpMethod.POST , "/email/**").authenticated()
                        .requestMatchers(HttpMethod.GET , "/user/get-users").permitAll()
                        .requestMatchers(HttpMethod.POST , "/product/CreateProducts").authenticated()
                        .requestMatchers(HttpMethod.GET , "/product/get-products").authenticated()
                        .requestMatchers(HttpMethod.PUT , "/product/update-product").authenticated()
                        .requestMatchers(HttpMethod.DELETE , "/product/delete-product").authenticated()
                        .requestMatchers(HttpMethod.POST , "/admin/login").permitAll()
                        .requestMatchers(HttpMethod.GET , "/admin/authenAdmin").authenticated()
                        .requestMatchers(HttpMethod.GET , "/admin/AdminLogOut").authenticated()
                        .requestMatchers(HttpMethod.POST , "/ai/chat").permitAll()
                );
        http.oauth2ResourceServer(httpSecurityOAuth2ResourceServerConfigurer ->
                httpSecurityOAuth2ResourceServerConfigurer.bearerTokenResolver(bearerTokenResolver)
                        .jwt(jwtConfigurer ->
                                jwtConfigurer.decoder(jwtDecodeCustom)
                                        .jwtAuthenticationConverter(authenticationConverter)
                        )

                );

        http.exceptionHandling(e -> e
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
        );

        http.sessionManagement(httpSecuritySessionManagementConfigurer ->
                httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        http.oauth2Login(
                httpSecurityOAuth2LoginConfigurer -> {
                    httpSecurityOAuth2LoginConfigurer.successHandler((req , res , authentication)->{
                        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
                        ResponseAuthentication responseAuthentication = new ResponseAuthentication();
                        try {
                            responseAuthentication = this.authenticationService.authentication_google(oAuth2AuthenticationToken , res);
                        } catch (ParseException e) {
                            throw new RuntimeException(e);
                        }
                        if(responseAuthentication != null){
                            res.sendRedirect(
                                    this.googleReturnUrl+"/authentication?info="+responseAuthentication.getAccessToken());
                        }
                    });

            }
        );
        http.cors(Customizer.withDefaults());
        return http.build();
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
         registry.addMapping("/**")
                 .allowedMethods("GET" , "POST" , "DELETE" , "PUT")
                 .allowedOrigins("http://localhost:5173" ,
                         "http://localhost:3000",
                         "http://localhost",
                         "http://localhost:80" , 
                         "http://103.28.32.228")
                 .allowedHeaders("*")
                 .allowCredentials(true);
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",  // ← thêm vào
                "http://localhost",       // ← thêm vào
                "http://localhost:80",
                "http://103.28.32.228"     // ← thêm vào
        ));
        config.setAllowCredentials(true);
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT", "OPTIONS", "PATCH"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    @Bean
    public BearerTokenResolver bearerTokenResolver(){
        return request -> {
            String authHeader = request.getHeader("Authorization"); // Bearer <token> cắt khoản trắng c
            if (authHeader != null) {
                String token = authHeader.split(" ").length == 2 ? authHeader.split(" ")[1] : null;
                return token;
            }

            if(request.getCookies() == null) return null;

            for (Cookie cookie : request.getCookies()){
                if(cookie.getName().equals("Refresh_Token")){
                    return cookie.getValue();
                }
            }
            return null;
        }; 
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
         jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("scope");
         jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

         JwtAuthenticationConverter jwtauthenticationConverter  = new JwtAuthenticationConverter();
         jwtauthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

         return jwtauthenticationConverter;

    }

}
