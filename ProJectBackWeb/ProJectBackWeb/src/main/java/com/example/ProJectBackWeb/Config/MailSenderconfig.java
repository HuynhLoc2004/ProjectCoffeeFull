package com.example.ProJectBackWeb.Config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Slf4j
@Configuration
public class MailSenderconfig {
    @Bean
    public JavaMailSender javaMailSender (
            @Value("${mail.host:smtp.gmail.com}") String host,
            @Value("${mail.port:587}") int port,
            @Value("${mail.system:}") String systemmail,
            @Value("${mail.password:}") String password)
    {
        if (systemmail == null || systemmail.trim().isEmpty()) {
            log.error("CẢNH BÁO: Email hệ thống (mail.system) chưa được cấu hình! Vui lòng kiểm tra biến môi trường MAIL_SYSTEM.");
        } else {
            log.info("Khởi tạo Mail Service với Email: [{}]", systemmail);
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(systemmail != null ? systemmail.trim() : "");
        sender.setPassword(password != null ? password.trim() : "");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", host);
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        props.put("mail.debug", "true"); 

        return sender;
    }
}
