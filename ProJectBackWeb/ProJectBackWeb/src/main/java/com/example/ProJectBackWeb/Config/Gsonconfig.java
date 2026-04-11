package com.example.ProJectBackWeb.Config;

import com.example.ProJectBackWeb.Custom.LocalDateAdapterCustom;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class Gsonconfig {

    @Bean
    public Gson gson() {
        return new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapterCustom())
                .create();
    }
}

