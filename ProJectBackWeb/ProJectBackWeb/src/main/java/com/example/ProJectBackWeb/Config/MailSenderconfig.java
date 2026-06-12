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
            @Value("${mail.system:huynhloc27102004@gmail.com}") String systemmail,
            @Value("${mail.password:gekbwjyizhtldydi}") String password)
    {
        log.info("--- ĐANG KHỞI TẠO MAIL SERVICE ---");
        log.info("Host: {}, Port: {}", host, port);
        log.info("Email gửi: {}", systemmail);

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(systemmail.trim());
        sender.setPassword(password.trim());
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        
        // Cấu hình bổ sung để tránh bị chặn hoặc timeout
        props.put("mail.smtp.connectiontimeout", "15000");
        props.put("mail.smtp.timeout", "15000");
        props.put("mail.smtp.writetimeout", "15000");
        props.put("mail.smtp.quitwait", "false");
        
        props.put("mail.debug", "true"); 

        log.info("--- MAIL SERVICE ĐÃ SẴN SÀNG ---");
        return sender;
    }
}
