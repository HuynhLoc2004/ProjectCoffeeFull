package com.example.ProJectBackWeb.Service;

import com.cloudinary.Cloudinary;
import com.example.ProJectBackWeb.DTO.UserDTO;
import com.example.ProJectBackWeb.DTO.UserProfileDTO;
import com.example.ProJectBackWeb.DTO.YEARPRODUCTDTO;
import com.example.ProJectBackWeb.EntityModel.OrderSHistoryEntity;
import com.example.ProJectBackWeb.EntityModel.Role;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.EnumStatus.OrderStatus;
import com.example.ProJectBackWeb.EnumStatus.TypeOrderEnum;
import com.example.ProJectBackWeb.Mapper.MapperObject;
import com.example.ProJectBackWeb.Reponsitory.RoleRepository;
import com.example.ProJectBackWeb.Reponsitory.UserRepository;
import com.example.ProJectBackWeb.RequestData.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import com.example.ProJectBackWeb.Exception.Appexception;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class UserService {
    private final UserRepository userRepository;
    private final MapperObject mapperObject;
    private final RoleRepository roleRepository;
    private final ObjectMapper objectMapper;
    private final RedisTemplate<String , String> redisTemplate;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    private final Cloudinary cloudinary;
    public UserService(UserRepository userRepository, MapperObject mapperObject, RoleRepository roleRepository, ObjectMapper objectMapper, RedisTemplate<String, String> redisTemplate, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.mapperObject = mapperObject;
        this.roleRepository = roleRepository;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
        this.cloudinary = cloudinary;
    }

    public UserEntity createUser(UserRequestRegistry userRequest) throws JsonProcessingException {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        Role roleQuery = roleRepository.findRoleByName("USER");
        if(userRepository.existsByAccount(userRequest.getAccount())){
            throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode() , "User existed" , userRequest);
        }
        if(userRepository.existsByEmail(userRequest.getEmail())){
            throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode() , "Email user existed" , userRequest);
        }

        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        UserEntity userEntity = mapperObject.toUserEntity(userRequest);
        userEntity.addRole(roleQuery);
        userEntity.setActive(true);
        userEntity.setProviderId(UUID.randomUUID().toString());
        userEntity.setProvider("LOCAL");
        userEntity.setCreateAt(LocalDateTime.now());
        this.redisTemplate.opsForValue().set("userEntity"+userEntity.getId() , objectMapper.writeValueAsString(userEntity) , 60 , TimeUnit.MINUTES);
        return userRepository.save(userEntity);
    }

    @Transactional
    public Boolean changePasswordUSer(ChangePasswordRequest changePasswordRequest , JwtAuthenticationToken jwtAuthenticationToken){
         Long userId =   jwtAuthenticationToken.getToken().getClaim("userId");
         String newPassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());
         this.userRepository.updatePasswordUser(newPassword , userId.intValue());
         return true;
    }
    @Transactional
    public Boolean ForgotPasswordUSer(ForGotPassWordRequest forGotPassWordRequest ){
        UserEntity userEntity = this.userRepository.findUserByEmail(forGotPassWordRequest.getEmail());
        String newPassword = passwordEncoder.encode(forGotPassWordRequest.getNewPassword());
        userEntity.setPassword(newPassword);
        return true;
    }

        @Transactional
        public UserProfileDTO getprofileUSer(JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
            Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
             UserEntity userentity  = this.userRepository.findUserWithOrders(userId.intValue()).orElseThrow();
             userentity.setOrderSHistoryEntities(this.userRepository.findHistoryByUser(userId.intValue()));
             return mapperObject.toUserProfileDTO(userentity);
        }

    @PreAuthorize("hasAuthority('UPDATE') or  hasAuthority('FULL')")
    @Transactional
    public Integer UpdateInfoUser(JwtAuthenticationToken jwtAuthenticationToken, UserUpdateReqquest userUpdateReqquest) {
        Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
        UserEntity user = this.userRepository.findById(userId.intValue()).orElseThrow(
                () -> new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "not found user")
        );

        if (!user.getEmail().equals(userUpdateReqquest.getEmail())) {
            if (userRepository.existsByEmail(userUpdateReqquest.getEmail())) {
                throw new Appexception(HttpStatusEnum.BAD_REQUEST.getCode(), "Email này đã được người khác sử dụng");
            }
            user.setEmail(userUpdateReqquest.getEmail());
        }

        if (userUpdateReqquest.getFullname() != null && !userUpdateReqquest.getFullname().isEmpty()) {
            user.setFullname(userUpdateReqquest.getFullname());
        }
        if (userUpdateReqquest.getAddress() != null && !userUpdateReqquest.getAddress().isEmpty()) {
            user.setAddress(userUpdateReqquest.getAddress());
        }

        this.userRepository.save(user);

        this.redisTemplate.delete("userEntity" + userId);

        this.redisTemplate.delete("userProfile" + userId);

        return 1;
    }

     @Transactional
     public Integer updateImginfoUser(JwtAuthenticationToken jwtAuthenticationToken , MultipartFile multipartFile) throws IOException {
         Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
         String originName = multipartFile.getOriginalFilename();

         String nameRandomFile = UUID.randomUUID().toString() ; //ranđomname

         Map<String , Object>   params = new HashMap<>();
         params.put("folder" , "uploads");
         params.put("use_filename" , true);
         params.put("unique_filename" , false);
         params.put("public_id" , nameRandomFile);

         Map uploadresult = this.cloudinary.uploader().upload(multipartFile.getBytes() ,params);

        UserEntity userEntity = this.userRepository.findInfoUserTOUpdateById(jwtAuthenticationToken.getToken().getClaim("userId")).orElseThrow(() -> {
            throw new Appexception(
                    HttpStatusEnum.NOT_FOUND.getCode(), "not found user"
            );
        });
         userEntity.setPicture(uploadresult.get("secure_url").toString());
         this.redisTemplate.delete("userInfo"+userId);
         this.redisTemplate.delete("userEntity" + userId);;
         return 1;
     }

     public List<UserDTO> get_userS(){
       List<UserEntity> userEntities =  this.userRepository.findAllUsers();

       if(userEntities == null){
           return null;
       }

       List<UserDTO> userDTOS = new ArrayList<>();
       for (UserEntity user : userEntities){
           UserDTO userDTO = new UserDTO();
           userDTO.setFullname(user.getFullname());
           if(user.getPicture() == null){
               userDTO.setAvatar(null);
           }else{
               userDTO.setAvatar(user.getPicture());
           }
           long totalPriceOrder = 0;
           if(user.getOrderSHistoryEntities() != null){
               for(OrderSHistoryEntity orderSHistoryEntity : user.getOrderSHistoryEntities()){
                   if(orderSHistoryEntity.getStatus().equals(OrderStatus.PAID.toString())){
                       totalPriceOrder+=orderSHistoryEntity.getTotalPrice();
                   }
               }
           }
           userDTO.setTotalPriceOrder(totalPriceOrder);
           userDTOS.add(userDTO);
       }
        userDTOS.sort((o1, o2) -> {
            return Math.toIntExact(o2.getTotalPriceOrder() - o1.getTotalPriceOrder());
        });

        return userDTOS;
     }

        @PreAuthorize("hasRole('ADMIN')")
        public Long getCounntUserByYear(JwtAuthenticationToken jwtAuthenticationToken , Integer year){
                    Long userId = jwtAuthenticationToken.getToken().getClaim("userId");
                    Long count = this.userRepository.getCountNewAccountByYear(year , userId.intValue());
                    return count;
        }


        @PreAuthorize("hasRole('ADMIN')")
        public Long getCountUser(){
         return this.userRepository.getCountuser(1);
        }

        @PreAuthorize("hasRole('ADMIN')")
        public List<UserDTO> getinfoAllUser(JwtAuthenticationToken jwtAuthenticationToken){
            long userId = jwtAuthenticationToken.getToken().getClaim("userId");
            return this.userRepository.getinfoAllUser(userId , OrderStatus.PAID.toString());
        }


        @PreAuthorize("hasRole('ADMIN')")
        @Transactional
        public Boolean changeActiveUse(long userid , ActiveRequest acRequest){
            UserEntity userEntity = this.userRepository.findById((int) userid).orElseThrow(()->{
                throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(),  "not found user by id");
            });

            userEntity.setActive(acRequest.getActiveupdate());
            return true;
        }
}

