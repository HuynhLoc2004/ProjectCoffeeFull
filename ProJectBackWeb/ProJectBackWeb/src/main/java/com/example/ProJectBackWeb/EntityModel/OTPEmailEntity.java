package com.example.ProJectBackWeb.EntityModel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_Email")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OTPEmailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OtpEmail_id")
    private Long id;
    @Column(name = "otpEmail" , nullable = false)
    private String otpEmail;
    @Column(name = "email" , nullable = false)
    private String email;
    @Column(name = "expirytime" , nullable = false)
    private LocalDateTime expiryTime;
    @Column(name = "TypeOtp", nullable = false)
    private String typeOtp;
}
