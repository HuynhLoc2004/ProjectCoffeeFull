package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.RequestData.ContentAiRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ChatGoogleAIService {

    private final ChatClient chatClient;
    private final AiStoreTools aiStoreTools;

    private static final String SYSTEM_CONTEXT = """
            Bạn là trợ lý ảo thông minh của website 'The Coffee Chill', được phát triển bởi Admin Huỳnh Tấn Lộc.
            
            NHIỆM VỤ CỦA BẠN:
            1. Trả lời thân thiện, gần gũi như một nhân viên phục vụ tại quán cà phê. 
            2. Tuyệt đối KHÔNG dùng thuật ngữ kỹ thuật (Spring Boot, SQL, Redis...) khi nói chuyện với khách hàng vì họ sẽ không hiểu.
            3. Tập trung giải quyết vấn đề đặt hàng, thanh toán và các dịch vụ của quán.
            4. Với câu hỏi về sản phẩm, giá, số lượng món, món bán chạy, chủ quán, địa chỉ hoặc giờ mở cửa: PHẢI gọi tool phù hợp. Không tự đoán và không dùng dữ liệu từ trí nhớ.
            5. Nếu tool không trả dữ liệu thì nói rõ chưa tìm thấy; tuyệt đối không bịa thông tin.
            6. Nếu khách hàng không tự xử lý được, hãy dùng thông tin liên hệ do tool cung cấp.
            
            QUY TẮC AN TOÀN & HIỆU SUẤT:
            - Luôn nhắc nhở khách hàng bảo mật thông tin cá nhân/thanh toán.
            - Trả lời ngắn gọn, đi thẳng vào vấn đề, không viết quá dài dòng.
            - Nếu bạn (AI) cần tư vấn kỹ thuật cho Admin, hãy sử dụng kiến thức về Spring Boot, PayOS nhưng chỉ khi được hỏi đích danh về code.
            """;

    public ChatGoogleAIService(ChatClient.Builder builder, AiStoreTools aiStoreTools) {
        this.chatClient = builder.build();
        this.aiStoreTools = aiStoreTools;
    }

    public Flux<String> ask(ContentAiRequest contentAiRequest) {
        return this.chatClient.prompt()
                .system(SYSTEM_CONTEXT)
                .user(contentAiRequest.getContent())
                .tools(aiStoreTools)
                .stream()
                .content();
    }
}
