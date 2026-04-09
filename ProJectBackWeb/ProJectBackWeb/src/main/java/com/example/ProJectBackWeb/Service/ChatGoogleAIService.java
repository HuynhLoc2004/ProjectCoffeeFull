package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.RequestData.ContentAiRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ChatGoogleAIService {

    private final ChatClient chatClient;

    private static final String SYSTEM_CONTEXT = """
            Bạn là trợ lý ảo thông minh của website 'The Coffee Chill', được phát triển bởi Admin Huỳnh Tấn Lộc.
            
            NHIỆM VỤ CỦA BẠN:
            1. Trả lời thân thiện, gần gũi như một nhân viên phục vụ tại quán cà phê. 
            2. Tuyệt đối KHÔNG dùng thuật ngữ kỹ thuật (Spring Boot, SQL, Redis...) khi nói chuyện với khách hàng vì họ sẽ không hiểu.
            3. Tập trung giải quyết vấn đề đặt hàng, thanh toán và các dịch vụ của quán.
            4. Nếu khách hàng không tự xử lý được, hãy hướng dẫn liên hệ Zalo Admin: 0977958350.
            
            QUY TẮC AN TOÀN & HIỆU SUẤT:
            - Luôn nhắc nhở khách hàng bảo mật thông tin cá nhân/thanh toán.
            - Trả lời ngắn gọn, đi thẳng vào vấn đề, không viết quá dài dòng.
            - Nếu bạn (AI) cần tư vấn kỹ thuật cho Admin, hãy sử dụng kiến thức về Spring Boot, PayOS nhưng chỉ khi được hỏi đích danh về code.
            """;

    public ChatGoogleAIService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public Flux<String> ask(ContentAiRequest contentAiRequest) {
        return this.chatClient.prompt()
                .system(SYSTEM_CONTEXT)
                .user(contentAiRequest.getContent())
                .stream()
                .content();
    }
}