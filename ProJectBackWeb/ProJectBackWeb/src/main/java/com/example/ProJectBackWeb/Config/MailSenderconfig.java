package com.example.ProJectBackWeb.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class    MailSenderconfig {
    @Bean
    public JavaMailSender javaMailSender (
            @Value("${mail.host}") String host,
            @Value("${mail.port}") int port,
            @Value("${mail.system}") String systemmail,
            @Value("${mail.password}") String password)
    {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(systemmail);
        sender.setPassword(password);


        sender.getJavaMailProperties().put("mail.smtp.auth", "true");
        sender.getJavaMailProperties().put("mail.smtp.starttls.enable", "true");
        sender.getJavaMailProperties().put("mail.debug", "false");

        return sender;
    }
}
