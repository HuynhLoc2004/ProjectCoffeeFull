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
    
    // Đọc chính xác từ các biến môi trường của .env, xóa bỏ khoảng trắng thừa
    @Bean
    public JavaMailSender javaMailSender(
            @Value("${MAIL_HOST:smtp.gmail.com}") String host,
            @Value("${MAIL_PORT:587}") int port,
            @Value("${MAIL_SYSTEM:huynhloc27102004@gmail.com}") String systemmail,
            @Value("${MAIL_PASSWORD:gekbwjyizhtldydi}") String password) 
    {

        log.info("SMTP Host: {}, Port: {}", host, port);
        log.info("Email hệ thống gửi: {}", systemmail.trim());

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host.trim());
        sender.setPort(port);
        sender.setUsername(systemmail.trim());
        
        String cleanPassword = password.trim().replaceAll("\\s+", "");
        sender.setPassword(cleanPassword);
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        
        // Đồng bộ chuẩn TLS bắt buộc của Google
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        
        // Khử triệt để lỗi treo kết nối (Timeout)
        props.put("mail.smtp.connectiontimeout", "15000");
        props.put("mail.smtp.timeout", "15000");
        props.put("mail.smtp.writetimeout", "15000");
        props.put("mail.smtp.quitwait", "false");
        
        // Giữ debug để quan sát quá trình bắt tay (handshake) với Google
        props.put("mail.debug", "true"); 

        log.info("--- MAIL SERVICE ĐÃ KHỞI TẠO THÀNH CÔNG ---");
        return sender;
    }
}