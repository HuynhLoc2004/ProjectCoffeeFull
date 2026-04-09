package com.example.ProJectBackWeb.Custom;

import com.example.ProJectBackWeb.Exception.Appexception;
import com.example.ProJectBackWeb.Service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;

@Slf4j
@Component
public class JwtDecodeCustom implements JwtDecoder {
    private final AuthenticationService authenticationService;
    private JwtDecoder jwtDecoder;

    public JwtDecodeCustom(AuthenticationService authenticationService ,@Value("${jwt.secret_key}") String SECRET_KEY) {
        this.authenticationService = authenticationService;
        SecretKeySpec secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");
        this.jwtDecoder = NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            this.authenticationService.verifyToken(token).getAuthenticated();
            return this.jwtDecoder.decode(token);
        } catch (Appexception e) {
            throw new Appexception(e.getStatusCode() , e.getMessage());
        } catch (JOSEException | ParseException e) {
            throw new JwtException("JWT decode error", e);
        }

    }


}
