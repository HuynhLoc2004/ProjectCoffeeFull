package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.RequestData.ContentAiRequest;
import com.example.ProJectBackWeb.Service.ChatGoogleAIService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/ai")
public class ChatGoogleAIController {
    private final ChatGoogleAIService chatClaudeAIService;

    public ChatGoogleAIController(ChatGoogleAIService chatClaudeAIService) {
        this.chatClaudeAIService = chatClaudeAIService;
    }

    @PostMapping(value = "/chat")
    public Flux<String> handle(@RequestBody ContentAiRequest contentAiRequest){
       return this.chatClaudeAIService.ask(contentAiRequest);
    }

}
