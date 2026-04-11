package com.example.ProJectBackWeb.SecurityConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Value("${redis.port}")
    private Integer port;
    @Value("${redis.host}")
    private String host;
    @Bean
   public LettuceConnectionFactory lettuceConnectionFactory(){
            LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory();
            lettuceConnectionFactory.setPort(port);
            lettuceConnectionFactory.setHostName(host);
            return  lettuceConnectionFactory;
    }

    @Bean
    public RedisTemplate<String , String> redisTemplate (LettuceConnectionFactory lettuceConnectionFactory){
        RedisTemplate<String , String> redisTemplate  = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(lettuceConnectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        return redisTemplate;
    }
}
