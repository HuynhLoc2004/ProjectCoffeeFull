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
    import org.springframework.mail.MailSender;
    import org.springframework.mail.SimpleMailMessage;
    import org.springframework.mail.javamail.JavaMailSender;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
    import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.Random;
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
;        public SenderMailService(RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper, OtpEmailRepository otpEmailRepository, MailSender mailSender, JavaMailSender javaMailSender, UserRepository userRepository, EvaluateRepository evaluateRepository) {
            this.redisTemplate = redisTemplate;
            this.objectMapper = objectMapper;
            this.otpEmailRepository = otpEmailRepository;
            this.javaMailSender = javaMailSender;
            this.userRepository = userRepository;
            this.evaluateRepository = evaluateRepository;
        }

        private String CreateOtp(){
            String otp = String.valueOf((long)((Math.random() * 900000) + 100000));
            return otp;
        }


        @PreAuthorize("hasAuthority('UPDATE') or hasAuthority('FULL')")
        @Transactional
        public Boolean SenderOtpEmail_ChangePassword(EmailRequest emailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
            String userEntityJson = this.redisTemplate.opsForValue().get("userEntity"+userId);
            if(userEntityJson == null){
               UserEntity userEntity = this.userRepository.findUserFullInfoById(userId.intValue()).orElseThrow();
                if(userEntity.getEmail().equals(emailRequest.getEmail())){
                    OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
                    String otp = this.CreateOtp();
                    SimpleMailMessage simpleMailMessage =  new SimpleMailMessage();
                    simpleMailMessage.setTo(emailRequest.getEmail());
                    simpleMailMessage.setSubject("Mã OTP xác thực");
                    simpleMailMessage.setText("""
                    Mã OTP của bạn là: %s
                    Có hiệu lực trong 5 phút.
                    Không chia sẻ mã này cho bất kỳ ai.
                    """.formatted(otp));
                    otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
                    otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
                    otpEmailEntity.setEmail(emailRequest.getEmail());
                    otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.CHANGE_PASSWORD.toString());
                    this.otpEmailRepository.save(otpEmailEntity);
                    this.javaMailSender.send(simpleMailMessage);
                    this.redisTemplate.opsForValue().set("OTP_CHANGE_PASSWORD"+emailRequest.getEmail() , objectMapper.writeValueAsString(otpEmailEntity) , 5 , TimeUnit.MINUTES);
                    return true;
                }else{
                    throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "email không khớp");
                }
            }
            UserEntity userEntity = objectMapper.readValue(userEntityJson , UserEntity.class);
            if(userEntity.getEmail().equals(emailRequest.getEmail())){
                OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
                String otp = this.CreateOtp();
                SimpleMailMessage simpleMailMessage =  new SimpleMailMessage();
                simpleMailMessage.setTo(emailRequest.getEmail());
                simpleMailMessage.setSubject("Mã OTP xác thực");
                simpleMailMessage.setText("""
                    Mã OTP của bạn là: %s
                    Có hiệu lực trong 5 phút.
                    Không chia sẻ mã này cho bất kỳ ai.
                    """.formatted(otp));
                otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
                otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
                otpEmailEntity.setEmail(emailRequest.getEmail());
                otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.CHANGE_PASSWORD.toString());
                this.otpEmailRepository.save(otpEmailEntity);
                this.javaMailSender.send(simpleMailMessage);
                this.redisTemplate.opsForValue().set("OTP_CHANGE_PASSWORD"+emailRequest.getEmail() , objectMapper.writeValueAsString(otpEmailEntity) , 5 , TimeUnit.MINUTES);
                return true;
            }else{
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "email không khớp");
            }
        }

        @Transactional
        public Boolean SenderOtpEmail_Forgotpassword(EmailRequest emailRequest) throws JsonProcessingException {
                OTPEmailEntity otpEmailEntity = new OTPEmailEntity();
                String otp = this.CreateOtp();
                SimpleMailMessage simpleMailMessage =  new SimpleMailMessage();
                simpleMailMessage.setTo(emailRequest.getEmail());
                simpleMailMessage.setSubject("Mã OTP xác thực");
                simpleMailMessage.setText("""
                    Mã OTP của bạn là: %s
                    Có hiệu lực trong 5 phút.
                    Không chia sẻ mã này cho bất kỳ ai.
                    """.formatted(otp));


                otpEmailEntity.setOtpEmail(passwordEncoder.encode(otp));
                otpEmailEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
                otpEmailEntity.setEmail(emailRequest.getEmail());
                otpEmailEntity.setTypeOtp(TypeOTpEmailEnums.RESET_PASSWORD.toString());
                this.otpEmailRepository.save(otpEmailEntity);
                this.javaMailSender.send(simpleMailMessage);
                this.redisTemplate.opsForValue().set("OTP_RESET_PASSWORD"+emailRequest.getEmail() , objectMapper.writeValueAsString(otpEmailEntity) , 5 , TimeUnit.MINUTES);
                return true;
            }


        @Transactional
        public Boolean Verify_OTP_CHANGE_PASSWORD(OTPemailRequest otPemailRequest , JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            log.info("đã chạy vào verify changePassword");
            Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
            String userEntityJson  = this.redisTemplate.opsForValue().get("userEntity"+userId);
            if(userEntityJson == null){
                UserEntity userEntity = this.userRepository.findUserFullInfoById(userId.intValue()).orElseThrow();
                String OTPEntityJson = this.redisTemplate.opsForValue().get("OTP_CHANGE_PASSWORD"+userEntity.getEmail());
                    if(OTPEntityJson == null){
                        throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
                    }
                 OTPEmailEntity otpEmailEntity  = objectMapper.readValue(OTPEntityJson ,  OTPEmailEntity.class);
                  if(passwordEncoder.matches(otPemailRequest.getOtpEmail() , otpEmailEntity.getOtpEmail())){
                        this.redisTemplate.delete("OTP_CHANGE_PASSWORD"+otpEmailEntity.getEmail());
                        log.info("otp hợp lệ");
                        return true;
                  }else{
                      log.info("otp không hợp lệ");
                      throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP không hợp lệ" , false);
                  }
            }
            UserEntity userEntity = objectMapper.readValue(userEntityJson , UserEntity.class);
            String OTPEntityJson = this.redisTemplate.opsForValue().get("OTP_CHANGE_PASSWORD"+userEntity.getEmail());
            if(OTPEntityJson == null){
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
            }
            OTPEmailEntity otpEmailEntity = objectMapper.readValue(OTPEntityJson , OTPEmailEntity.class);
            if(passwordEncoder.matches(otPemailRequest.getOtpEmail(),  otpEmailEntity.getOtpEmail() )){
                this.redisTemplate.delete("OTP_CHANGE_PASSWORD"+otpEmailEntity.getEmail());
                log.info("otp hợp lệ");
                return true;
            }else{
                log.info("otp không hợp lệ");
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(),  "OTP không hợp lệ" , false);
            }

        }

        @Transactional
        public Boolean Verify_OTP_Forgot_PASSWORD(OTPResetpassWordRequest  otpResetpassWordRequest) throws JsonProcessingException {
             String OTPEntityJson = this.redisTemplate.opsForValue().get("OTP_RESET_PASSWORD"+otpResetpassWordRequest.getEmail());
                if(OTPEntityJson == null){
                    throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP hết hạn hoặc chưa tồn tại" , false);
                }
                OTPEmailEntity otpEmailEntity  = objectMapper.readValue(OTPEntityJson ,  OTPEmailEntity.class);
                if(passwordEncoder.matches( otpResetpassWordRequest.getOtpEmail() , otpEmailEntity.getOtpEmail())){
                    this.redisTemplate.delete("OTP_RESET_PASSWORD"+otpResetpassWordRequest.getEmail());
                    return true; 
                }else{
                    throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "OTP không hợp lệ" , false);
                }

        }

    @Transactional
        public Boolean sendEmailEvaluate(JwtAuthenticationToken jwtAuthenticationToken , EvaluatedRequest
                                          evaluatedRequest){
            Long iduser = jwtAuthenticationToken.getToken().getClaim("userId");
            UserEntity userEntity = this.userRepository.findById(iduser.intValue()).orElseThrow(()->{
                throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "không tìm được user cần tìm "
                        );
            });
            if(userEntity.getEmail().equals(evaluatedRequest.getEmail())){
                EvaluateEntity evaluateEntity = new EvaluateEntity();
                evaluateEntity.setText(evaluatedRequest.getTextForm());
                evaluateEntity.setCreated_at(evaluatedRequest.getLocalDateTime());
                evaluateEntity.setUserEntity(userEntity);
                this.evaluateRepository.save(evaluateEntity);

                SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                simpleMailMessage.setSubject("đánh giá của:" + userEntity.getFullname());
                simpleMailMessage.setText("Nội dung:\n" + evaluatedRequest.getTextForm() +"\n" +
                        "Thời gian:\n" + evaluatedRequest.getLocalDateTime());
                simpleMailMessage.setTo(this.adminMail);
                this.javaMailSender.send(simpleMailMessage);
                this.redisTemplate.delete("userInfo"+iduser);
                this.redisTemplate.delete("userEntity" + iduser);;
                return true;
            }else{
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "email không hợp lệ");
            }

    }

    }
