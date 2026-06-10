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
        log.info("Cấu hình JavaMailSender với email hệ thống: [{}]", systemmail);
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(systemmail.trim());
        sender.setPassword(password.trim());

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.from", systemmail.trim());
        props.put("mail.debug", "false");

        return sender;
    }
}
