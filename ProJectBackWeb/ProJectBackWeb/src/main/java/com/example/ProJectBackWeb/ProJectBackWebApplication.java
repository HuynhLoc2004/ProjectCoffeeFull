package com.example.ProJectBackWeb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ProJectBackWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProJectBackWebApplication.class, args);
	}

}
