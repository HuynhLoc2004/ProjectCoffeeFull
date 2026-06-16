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
    import org.springframework.mail.SimpleMailMessage;
    import org.springframework.mail.javamail.JavaMailSender;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
    import org.springframework.stereotype.Service;

    import jakarta.mail.internet.MimeMessage;
    import org.springframework.mail.javamail.MimeMessageHelper;
    import java.time.LocalDateTime;
    import java.util.concurrent.TimeUnit;

    @Slf4j
    @Service
    public class  SenderMailService {
        private final RedisTemplate<String  , String> redisTemplate;
        private final ObjectMapper objectMapper;
        private final OtpEmailRepository otpEmailRepository;
        private final JavaMailSender javaMailSender ;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        private final EvaluateRepository evaluateRepository;
        
        @Value("${mail.mailadmin}")
        private String adminMail;

        @Value("${mail.system:huynhtanlocpp09@gmail.com}")
        private String systemMail;

        @jakarta.annotation.PostConstruct
        public void init() {
            log.info("--- KIỂM TRA CẤU HÌNH MAIL KHI KHỞI CHẠY ---");
            log.info("System Mail: {}", systemMail);
            log.info("Admin Mail: {}", adminMail);
            log.info("------------------------------------------");
        }

        public SenderMailService(RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper, OtpEmailRepository otpEmailRepository, JavaMailSender javaMailSender, UserRepository userRepository, EvaluateRepository evaluateRepository) {
            this.redisTemplate = redisTemplate;
            this.objectMapper = objectMapper;
            this.otpEmailRepository = otpEmailRepository;
            this.javaMailSender = javaMailSender;
            this.userRepository = userRepository;
            this.evaluateRepository = evaluateRepository;
        }

        private String CreateOtp(){
            return String.valueOf((long)((Math.random() * 900000) + 100000));
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

        private void sendMailHelper(String to, String subject, String htmlContent, String type) {
            try {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                
                helper.setFrom(systemMail);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true); // Set to true for HTML
                
                log.info("--- BẮT ĐẦU TIẾN TRÌNH GỬI MAIL (HTML) ---");
                log.info("Type: {}, To: {}, Subject: {}", type, to, subject);
                
                this.javaMailSender.send(mimeMessage);
                
                log.info("--- GỬI MAIL THÀNH CÔNG ---");
            } catch (Exception e) {
                log.error("!!! LỖI GỬI MAIL NGHIÊM TRỌNG !!!");
                log.error("Type: {}, To: {}", type, to);
                log.error("Lỗi: {}", e.getMessage());
                throw new Appexception(HttpStatusEnum.INTERNAL_SERVER_ERROR.getCode(), "Hệ thống gặp sự cố khi gửi mail đến " + to + ". Vui lòng thử lại sau.");
            }
        }

        @Transactional
        public Boolean SenderOtpEmail_ChangePassword(EmailRequest emailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            Number userIdNum = (Number) jwtAuthenticationToken.getToken().getClaim("userId");
            Long userId = userIdNum.longValue();
            
            UserEntity userEntity;
            String userEntityJson = this.redisTemplate.opsForValue().get("userEntity"+userId);
            if(userEntityJson == null){
                userEntity = this.userRepository.findUserFullInfoById(userId.intValue()).orElseThrow();
            } else {
                userEntity = objectMapper.readValue(userEntityJson , UserEntity.class);
            }

            String requestEmail = emailRequest.getEmail().trim().toLowerCase();
            if(userEntity.getEmail().equalsIgnoreCase(requestEmail)){
                String otp = this.CreateOtp();
                String body = "<p>Chào bạn, chúng tôi nhận được yêu cầu <strong>thay đổi mật khẩu</strong> cho tài khoản của bạn.</p>" +
                             "<div class='otp-box'><p style='margin-bottom: 10px; color: #888;'>Mã xác thực của bạn là:</p><p class='otp-code'>" + otp + "</p></div>" +
                             "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với bộ phận hỗ trợ.</p>";
                
                String htmlContent = generateHtmlTemplate("Xác Thực Thay Đổi Mật Khẩu", body, null, null);
                this.sendMailHelper(requestEmail, "Mã OTP xác thực thay đổi mật khẩu", htmlContent, "Change Password");

                OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
                otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
                otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
                otpEmailEntity.setEmail(requestEmail);
                otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.CHANGE_PASSWORD.toString());
                this.otpEmailRepository.save(otpEmailEntity);
                
                this.redisTemplate.opsForValue().set("OTP_CHANGE_PASSWORD"+requestEmail , objectMapper.writeValueAsString(otpEmailEntity) , 5 , TimeUnit.MINUTES);
                return true;
            } else {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "email không khớp");
            }
        }

        @Transactional
        public Boolean SenderOtpEmail_Forgotpassword(EmailRequest emailRequest) throws JsonProcessingException {
            if (emailRequest.getEmail() == null || emailRequest.getEmail().trim().isEmpty()) {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Email không được để trống");
            }
            
            String requestEmail = emailRequest.getEmail().trim().toLowerCase();
            
            if (!userRepository.existsByEmail(requestEmail)) {
                throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "Email không tồn tại trong hệ thống");
            }

            String otp = this.CreateOtp();
            String body = "<p>Chào bạn, chúng tôi nhận được yêu cầu <strong>khôi phục mật khẩu</strong> cho tài khoản của bạn.</p>" +
                         "<div class='otp-box'><p style='margin-bottom: 10px; color: #888;'>Mã xác thực của bạn là:</p><p class='otp-code'>" + otp + "</p></div>" +
                         "<p>Vui lòng nhập mã này vào trang khôi phục để tiếp tục.</p>";
            
            String htmlContent = generateHtmlTemplate("Khôi Phục Mật Khẩu", body, null, null);
            this.sendMailHelper(requestEmail, "Mã OTP khôi phục mật khẩu", htmlContent, "Forgot Password");

            OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
            otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
            otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
            otpEmailEntity.setEmail(requestEmail);
            otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.RESET_PASSWORD.toString());
            this.otpEmailRepository.save(otpEmailEntity);
            
            this.redisTemplate.opsForValue().set("OTP_RESET_PASSWORD"+requestEmail , objectMapper.writeValueAsString(otpEmailEntity) , 5 , TimeUnit.MINUTES);
            return true;
        }

        @Transactional
        public Boolean Verify_OTP_CHANGE_PASSWORD(OTPemailRequest otPemailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            log.info("đã chạy vào verify changePassword");
            Number userIdNum = (Number) jwtAuthenticationToken.getToken().getClaim("userId");
            Long userId = userIdNum.longValue();
            
            UserEntity userEntity;
            String userEntityJson  = this.redisTemplate.opsForValue().get("userEntity"+userId);
            if(userEntityJson == null){
                userEntity = this.userRepository.findUserFullInfoById(userId.intValue()).orElseThrow();
            } else {
                userEntity = objectMapper.readValue(userEntityJson , UserEntity.class);
            }

            String email = userEntity.getEmail().trim().toLowerCase();
            String OTPEntityJson = this.redisTemplate.opsForValue().get("OTP_CHANGE_PASSWORD"+email);
            if(OTPEntityJson == null){
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
            }
            
            OTPEmailEntity otpEmailEntity  = objectMapper.readValue(OTPEntityJson ,  OTPEmailEntity.class);
            if(passwordEncoder.matches(otPemailRequest.getOtpEmail().trim() , otpEmailEntity.getOtpEmail())){
                this.redisTemplate.delete("OTP_CHANGE_PASSWORD"+email);
                log.info("otp hợp lệ");
                return true;
            } else {
                log.info("otp không hợp lệ");
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP không hợp lệ" , false);
            }
        }

        @Transactional
        public Boolean Verify_OTP_Forgot_PASSWORD(OTPResetpassWordRequest  otpResetpassWordRequest) throws JsonProcessingException {
             String email = otpResetpassWordRequest.getEmail().trim().toLowerCase();
             String OTPEntityJson = this.redisTemplate.opsForValue().get("OTP_RESET_PASSWORD"+email);
                if(OTPEntityJson == null){
                    throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
                }
                OTPEmailEntity otpEmailEntity  = objectMapper.readValue(OTPEntityJson ,  OTPEmailEntity.class);
                if(passwordEncoder.matches( otpResetpassWordRequest.getOtpEmail().trim() , otpEmailEntity.getOtpEmail())){
                    this.redisTemplate.delete("OTP_RESET_PASSWORD"+email);
                    return true; 
                }else{
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

                String subject = "Đánh giá mới từ khách hàng: " + userEntity.getFullname();
                String body = "<p>Bạn có một đánh giá mới từ khách hàng <strong>" + userEntity.getFullname() + "</strong>.</p>" +
                             "<div class='otp-box' style='text-align: left;'>" +
                             "<p><strong>Nội dung:</strong></p>" +
                             "<p><i>\"" + evaluatedRequest.getTextForm() + "\"</i></p>" +
                             "<p style='margin-top: 15px; font-size: 13px; color: #888;'>Thời gian: " + evaluatedRequest.getLocalDateTime() + "</p>" +
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
