    package com.example.ProJectBackWeb.Service;

    import com.example.ProJectBackWeb.EntityModel.EvaluateEntity;
    import com.example.ProJectBackWeb.EntityModel.OTPEmailEntity;
    import com.example.ProJectBackWeb.EntityModel.UserEntity;
    import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
    import com.example.ProJectBackWeb.EnumStatus.TypeOTpEmailEnums;
    import com.example.ProJectBackWeb.Exception.Appexception;
    import com.example.ProJectBackWeb.Reponsitory.EvaluateRepository;
    import com.example.ProJectBackWeb.Reponsitory.OtpEmailRepository;
    import com.example.ProJectBackWeb.Reponsitory.UserRepository;
    import com.example.ProJectBackWeb.RequestData.EmailRequest;
    import com.example.ProJectBackWeb.RequestData.EvaluatedRequest;
    import com.example.ProJectBackWeb.RequestData.OTPResetpassWordRequest;
    import com.example.ProJectBackWeb.RequestData.OTPemailRequest;
    import com.fasterxml.jackson.core.JsonProcessingException;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import jakarta.transaction.Transactional;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.data.redis.core.RedisTemplate;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
    import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

    @Slf4j
    @Service
    public class  SenderMailService {
        private final RedisTemplate<String  , String> redisTemplate;
        private final ObjectMapper objectMapper;
        private final OtpEmailRepository otpEmailRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        private final SecureRandom secureRandom = new SecureRandom();
        private final EvaluateRepository evaluateRepository;
        
        @Value("${mail.mailadmin}")
        private String adminMail;

        @Value("${resend.api-key:}")
        private String resendApiKey;

        @Value("${resend.from:onboarding@resend.dev}")
        private String resendFrom;

        @Value("${resend.api-url:https://api.resend.com/emails}")
        private String resendApiUrl;

        @jakarta.annotation.PostConstruct
        public void init() {
            log.info("--- KIỂM TRA CẤU HÌNH MAIL KHI KHỞI CHẠY ---");
            log.info("Resend sender: {}", resendFrom);
            log.info("Admin Mail: {}", adminMail);
            log.info("------------------------------------------");
        }

        public SenderMailService(RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper, OtpEmailRepository otpEmailRepository, UserRepository userRepository, EvaluateRepository evaluateRepository) {
            this.redisTemplate = redisTemplate;
            this.objectMapper = objectMapper;
            this.otpEmailRepository = otpEmailRepository;
            this.userRepository = userRepository;
            this.evaluateRepository = evaluateRepository;
        }

        private String CreateOtp(){
            return String.valueOf(100000 + secureRandom.nextInt(900000));
        }

        private void registerFailedOtpAttempt(String attemptKey, String otpKey) {
            Long attempts = this.redisTemplate.opsForValue().increment(attemptKey);
            if (attempts != null && attempts == 1) {
                this.redisTemplate.expire(attemptKey, 5, TimeUnit.MINUTES);
            }
            if (attempts != null && attempts >= 5) {
                this.redisTemplate.delete(otpKey);
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu mã mới");
            }
        }

        private void acquireOtpCooldown(String cooldownKey) {
            Boolean acquired = this.redisTemplate.opsForValue()
                    .setIfAbsent(cooldownKey, "1", 60, TimeUnit.SECONDS);
            if (!Boolean.TRUE.equals(acquired)) {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Vui lòng chờ 60 giây trước khi gửi lại OTP");
            }
        }

        private String generateHtmlTemplate(String title, String content, String buttonLabel, String buttonUrl) {
            return "<!DOCTYPE html>" +
                   "<html>" +
                   "<head>" +
                   "<meta charset='UTF-8'>" +
                   "<style>" +
                   "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }" +
                   "  .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }" +
                   "  .header { background: linear-gradient(135deg, #6f4e37, #3c2a21); color: white; padding: 30px; text-align: center; }" +
                   "  .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }" +
                   "  .content { padding: 40px; background-color: #ffffff; }" +
                   "  .otp-box { background-color: #f8f1eb; border: 2px dashed #6f4e37; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; }" +
                   "  .otp-code { font-size: 32px; font-weight: bold; color: #6f4e37; letter-spacing: 5px; margin: 0; }" +
                   "  .footer { background-color: #f9f9f9; color: #888; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #eee; }" +
                   "  .btn { display: inline-block; padding: 12px 25px; background-color: #6f4e37; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }" +
                   "  .warning { color: #e74c3c; font-size: 13px; margin-top: 20px; font-style: italic; }" +
                   "</style>" +
                   "</head>" +
                   "<body>" +
                   "  <div class='container'>" +
                   "    <div class='header'><h1>COFFEE HOUSE</h1></div>" +
                   "    <div class='content'>" +
                   "      <h2 style='color: #6f4e37; margin-top: 0;'>" + title + "</h2>" +
                          content +
                   "      <p class='warning'>* Lưu ý: Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai để bảo mật tài khoản.</p>" +
                   "    </div>" +
                   "    <div class='footer'>" +
                   "      <p>&copy; 2026 Coffee House. All rights reserved.</p>" +
                   "      <p>Địa chỉ: 123 Đường Cà Phê, TP. Hồ Chí Minh</p>" +
                   "    </div>" +
                   "  </div>" +
                   "</body>" +
                   "</html>";
        }

        private String escapeHtml(String value) {
            if (value == null) return "";
            return value.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#39;");
        }

        private void sendMailHelper(String to, String subject, String htmlContent, String type) {
            try {
                if (resendApiKey == null || resendApiKey.isBlank()) {
                    throw new IllegalStateException("RESEND_API_KEY chưa được cấu hình");
                }

                log.info("Type: {}, To: {}, Subject: {}", type, to, subject);
                sendMailWithResend(to, subject, htmlContent);
                log.info("--- GỬI MAIL THÀNH CÔNG QUA RESEND API ---");
            } catch (Exception e) {
                log.error("!!! LỖI GỬI MAIL NGHIÊM TRỌNG !!!");
                log.error("Type: {}, To: {}", type, to);
                log.error("Lỗi: {}", e.getMessage());
                throw new Appexception(
                        HttpStatusEnum.INTERNAL_SERVER_ERROR.getCode(),
                        getPublicMailError(e)
                );
            }
        }

        private String getPublicMailError(Exception exception) {
            String detail = exception.getMessage() == null ? "" : exception.getMessage();

            if (detail.contains("RESEND_API_KEY chưa được cấu hình")) {
                return "Backend chưa được cấu hình RESEND_API_KEY.";
            }
            if (detail.contains("HTTP 401")) {
                return "RESEND_API_KEY không hợp lệ hoặc đã bị thu hồi.";
            }
            if (detail.contains("HTTP 403") || detail.contains("HTTP 422")) {
                return "Resend từ chối sender. Hãy xác minh domain và đặt RESEND_FROM bằng email thuộc domain đó.";
            }
            if (detail.contains("HTTP 429")) {
                return "Resend đã giới hạn số lần gửi. Vui lòng thử lại sau.";
            }

            return "Không thể kết nối Resend. Vui lòng thử lại sau.";
        }

        private void sendMailWithResend(String to, String subject, String htmlContent) throws Exception {
            Map<String, Object> payload = Map.of(
                    "from", "Coffee House <" + resendFrom + ">",
                    "to", List.of(to),
                    "subject", subject,
                    "html", htmlContent
            );
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(resendApiUrl))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload), StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build()
                    .send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("Resend API trả về HTTP " + response.statusCode() + ": " + response.body());
            }
        }

        @Transactional
        public Boolean SenderOtpEmail_ChangePassword(EmailRequest emailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            Number userIdNum = (Number) jwtAuthenticationToken.getToken().getClaim("userId");
            Long userId = userIdNum.longValue();

            String requestEmail = emailRequest.getEmail().trim().toLowerCase();
            UserEntity userEntity = this.userRepository.findById(userId.intValue())
                    .orElseThrow(() -> new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "Không tìm thấy tài khoản"));

            if(userEntity.getEmail() != null && userEntity.getEmail().equalsIgnoreCase(requestEmail)){
                String verifiedEmail = userEntity.getEmail().trim().toLowerCase();
                String cooldownKey = "OTP_SEND_COOLDOWN:CHANGE:" + userId;
                acquireOtpCooldown(cooldownKey);
                String otp = this.CreateOtp();
                String body = "<p>Chào bạn, chúng tôi nhận được yêu cầu <strong>thay đổi mật khẩu</strong> cho tài khoản của bạn.</p>" +
                             "<div class='otp-box'><p style='margin-bottom: 10px; color: #888;'>Mã xác thực của bạn là:</p><p class='otp-code'>" + otp + "</p></div>" +
                             "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với bộ phận hỗ trợ.</p>";
                
                String htmlContent = generateHtmlTemplate("Xác Thực Thay Đổi Mật Khẩu", body, null, null);
                OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
                otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
                otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
                otpEmailEntity.setEmail(verifiedEmail);
                otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.CHANGE_PASSWORD.toString());
                this.otpEmailRepository.save(otpEmailEntity);
                this.redisTemplate.opsForValue().set("OTP_CHANGE_PASSWORD" + verifiedEmail,
                        objectMapper.writeValueAsString(otpEmailEntity), 5, TimeUnit.MINUTES);
                try {
                    this.sendMailHelper(verifiedEmail, "Mã OTP xác thực thay đổi mật khẩu", htmlContent, "Change Password");
                } catch (RuntimeException exception) {
                    this.redisTemplate.delete(cooldownKey);
                    throw exception;
                }
                this.redisTemplate.delete("OTP_ATTEMPTS:CHANGE:" + verifiedEmail);
                return true;
            } else {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Email không khớp với tài khoản đang đăng nhập");
            }
        }

        @Transactional
        public Boolean SenderOtpEmail_Forgotpassword(EmailRequest emailRequest) throws JsonProcessingException {
            if (emailRequest.getEmail() == null || emailRequest.getEmail().trim().isEmpty()) {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Email không được để trống");
            }
            
            String requestEmail = emailRequest.getEmail().trim().toLowerCase();
            
            UserEntity userEntity = userRepository.findFirstByEmailIgnoreCase(requestEmail)
                    .orElseThrow(() -> new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "Email không tồn tại trong hệ thống"));
            String verifiedEmail = userEntity.getEmail().trim().toLowerCase();
            String cooldownKey = "OTP_SEND_COOLDOWN:RESET:" + verifiedEmail;
            acquireOtpCooldown(cooldownKey);

            String otp = this.CreateOtp();
            String body = "<p>Chào bạn, chúng tôi nhận được yêu cầu <strong>khôi phục mật khẩu</strong> cho tài khoản của bạn.</p>" +
                         "<div class='otp-box'><p style='margin-bottom: 10px; color: #888;'>Mã xác thực của bạn là:</p><p class='otp-code'>" + otp + "</p></div>" +
                         "<p>Vui lòng nhập mã này vào trang khôi phục để tiếp tục.</p>";
            
            String htmlContent = generateHtmlTemplate("Khôi Phục Mật Khẩu", body, null, null);
            OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
            otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
            otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
            otpEmailEntity.setEmail(verifiedEmail);
            otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.RESET_PASSWORD.toString());
            this.otpEmailRepository.save(otpEmailEntity);
            this.redisTemplate.opsForValue().set("OTP_RESET_PASSWORD" + verifiedEmail,
                    objectMapper.writeValueAsString(otpEmailEntity), 5, TimeUnit.MINUTES);
            try {
                this.sendMailHelper(verifiedEmail, "Mã OTP khôi phục mật khẩu", htmlContent, "Forgot Password");
            } catch (RuntimeException exception) {
                this.redisTemplate.delete(cooldownKey);
                throw exception;
            }
            this.redisTemplate.delete("OTP_ATTEMPTS:RESET:" + verifiedEmail);
            return true;
        }

        @Transactional
        public String Verify_OTP_CHANGE_PASSWORD(OTPemailRequest otPemailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            log.info("đã chạy vào verify changePassword");
            Number userIdNum = (Number) jwtAuthenticationToken.getToken().getClaim("userId");
            Long userId = userIdNum.longValue();
            
            UserEntity userEntity = this.userRepository.findById(userId.intValue())
                    .orElseThrow(() -> new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "Không tìm thấy tài khoản"));

            String email = userEntity.getEmail().trim().toLowerCase();
            String otpKey = "OTP_CHANGE_PASSWORD" + email;
            String attemptKey = "OTP_ATTEMPTS:CHANGE:" + email;
            String OTPEntityJson = this.redisTemplate.opsForValue().get(otpKey);
            if(OTPEntityJson == null){
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
            }
            
            OTPEmailEntity otpEmailEntity  = objectMapper.readValue(OTPEntityJson ,  OTPEmailEntity.class);
            if(passwordEncoder.matches(otPemailRequest.getOtpEmail().trim() , otpEmailEntity.getOtpEmail())){
                this.redisTemplate.delete(otpKey);
                this.redisTemplate.delete(attemptKey);
                String verificationToken = UUID.randomUUID().toString();
                this.redisTemplate.opsForValue().set(
                        "PASSWORD_CHANGE_TOKEN:" + verificationToken,
                        String.valueOf(userId),
                        5,
                        TimeUnit.MINUTES
                );
                log.info("otp hợp lệ");
                return verificationToken;
            } else {
                log.info("otp không hợp lệ");
                registerFailedOtpAttempt(attemptKey, otpKey);
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP không hợp lệ" , false);
            }
        }

        @Transactional
        public String Verify_OTP_Forgot_PASSWORD(OTPResetpassWordRequest  otpResetpassWordRequest) throws JsonProcessingException {
             String email = otpResetpassWordRequest.getEmail().trim().toLowerCase();
             String otpKey = "OTP_RESET_PASSWORD" + email;
             String attemptKey = "OTP_ATTEMPTS:RESET:" + email;
             String OTPEntityJson = this.redisTemplate.opsForValue().get(otpKey);
                if(OTPEntityJson == null){
                    throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
                }
                OTPEmailEntity otpEmailEntity  = objectMapper.readValue(OTPEntityJson ,  OTPEmailEntity.class);
                if(passwordEncoder.matches( otpResetpassWordRequest.getOtpEmail().trim() , otpEmailEntity.getOtpEmail())){
                    this.redisTemplate.delete(otpKey);
                    this.redisTemplate.delete(attemptKey);
                    String resetToken = UUID.randomUUID().toString();
                    this.redisTemplate.opsForValue().set(
                            "PASSWORD_RESET_TOKEN:" + resetToken,
                            email,
                            5,
                            TimeUnit.MINUTES
                    );
                    return resetToken;
                }else{
                    registerFailedOtpAttempt(attemptKey, otpKey);
                    throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP không hợp lệ" , false);
                }
        }

        @Transactional
        public Boolean sendEmailEvaluate(JwtAuthenticationToken jwtAuthenticationToken , EvaluatedRequest evaluatedRequest){
            Number iduserNum = jwtAuthenticationToken.getToken().getClaim("userId");
            Long iduser = iduserNum.longValue();
            UserEntity userEntity = this.userRepository.findById(iduser.intValue()).orElseThrow(()->{
                throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "không tìm được user cần tìm ");
            });
            
            if(userEntity.getEmail().equals(evaluatedRequest.getEmail())){
                EvaluateEntity evaluateEntity = new EvaluateEntity();
                evaluateEntity.setText(evaluatedRequest.getTextForm());
                evaluateEntity.setCreated_at(evaluatedRequest.getLocalDateTime());
                evaluateEntity.setUserEntity(userEntity);
                this.evaluateRepository.save(evaluateEntity);

                String safeFullname = escapeHtml(userEntity.getFullname());
                String safeReview = escapeHtml(evaluatedRequest.getTextForm());
                String safeTime = escapeHtml(String.valueOf(evaluatedRequest.getLocalDateTime()));
                String subject = "Đánh giá mới từ khách hàng: " + String.valueOf(userEntity.getFullname()).replaceAll("[\\r\\n]", " ");
                String body = "<p>Bạn có một đánh giá mới từ khách hàng <strong>" + safeFullname + "</strong>.</p>" +
                             "<div class='otp-box' style='text-align: left;'>" +
                             "<p><strong>Nội dung:</strong></p>" +
                             "<p><i>\"" + safeReview + "\"</i></p>" +
                             "<p style='margin-top: 15px; font-size: 13px; color: #888;'>Thời gian: " + safeTime + "</p>" +
                             "</div>";
                
                String htmlContent = generateHtmlTemplate("Đánh Giá Khách Hàng", body, null, null);
                this.sendMailHelper(this.adminMail, subject, htmlContent, "Evaluate");

                this.redisTemplate.delete("userInfo"+iduser);
                this.redisTemplate.delete("userEntity" + iduser);
                return true;
            } else {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "email không hợp lệ");
            }
        }
    }
