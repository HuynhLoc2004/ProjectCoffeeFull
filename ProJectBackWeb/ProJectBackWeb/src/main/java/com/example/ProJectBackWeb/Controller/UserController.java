package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.DTO.UserDTO;
import com.example.ProJectBackWeb.DTO.UserProfileDTO;
import com.example.ProJectBackWeb.DTO.YEARPRODUCTDTO;
import com.example.ProJectBackWeb.EntityModel.UserEntity;
import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.RequestData.*;
import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Data
@Builder
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/registry")
    ResponseData<Integer> saveAccountUser(@RequestBody @Valid UserRequestRegistry userRequest) throws JsonProcessingException {
        log.info(userRequest.getFullname());
        this.userService.createUser(userRequest);
        return new ResponseData<Integer>(HttpStatusEnum.CREATED.getCode(), "create user successfully" , 1 );
    }

    @PostMapping("/change-password")
    public ResponseData<Boolean> changePassword(@RequestBody @Valid ChangePasswordRequest  changePasswordRequest , JwtAuthenticationToken  jwtAuthenticationToken){
       return new ResponseData<>(HttpStatusEnum.CREATED.getCode() , "change password successfully" ,  this.userService.changePasswordUSer(changePasswordRequest , jwtAuthenticationToken));
    }

    @PostMapping("/forgot-password")
    public ResponseData<Boolean> forGotPassWord(@RequestBody @Valid ForGotPassWordRequest forGotPassWordRequest){
        return new ResponseData<>(HttpStatusEnum.CREATED.getCode(), "reset password successfully" , this.userService.ForgotPasswordUSer(forGotPassWordRequest));
    }

    @GetMapping("/profile")
    public ResponseData<UserProfileDTO> getProfileUser(JwtAuthenticationToken jwtAuthenticationToken) throws JsonProcessingException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode(), "get profile user successfully" , this.userService.getprofileUSer(jwtAuthenticationToken));
    }

    @PutMapping("/update-info")
    public ResponseData<Integer> updateinfoUser(JwtAuthenticationToken jwtAuthenticationToken ,@RequestBody UserUpdateReqquest userUpdateReqquest){
        return new ResponseData<>(HttpStatusEnum.NO_CONTENT.getCode(), "update info user succesully" , this.userService.UpdateInfoUser(jwtAuthenticationToken, userUpdateReqquest));
    }

    @PutMapping("/update-imgInfo")
    public ResponseData<Integer> updateImgInfoUser(JwtAuthenticationToken jwtAuthenticationToken , @RequestParam("file")MultipartFile multipartFile) throws IOException {
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "update img successfully "  , this.userService.updateImginfoUser(jwtAuthenticationToken , multipartFile));
    }

    @GetMapping("/get-users")
    public ResponseData<List<UserDTO>> get_userS(){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get users successfully" , this.getUserService().get_userS());
    }

    @GetMapping("/get-countUser")
    public ResponseData<Long> getNewAccountByYear(@RequestParam("year") Integer year , JwtAuthenticationToken jwtAuthenticationToken){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get count user by year successfully" , this.userService.getCounntUserByYear(jwtAuthenticationToken , year));
    }

    @GetMapping("/get-CountAllUser")
    public ResponseData<Long> getCountAlluser(){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get count all user successfully" , this.userService.getCountUser());
    }

    @GetMapping("/get-infoAllUser")
    public ResponseData<List<UserDTO>> getinfoAlluser(JwtAuthenticationToken jwtAuthenticationToken){
        return new ResponseData<>(HttpStatusEnum.OK.getCode(),  "get all info user" , this.userService.getinfoAllUser(jwtAuthenticationToken));
    }


    @PutMapping("/change-userActive")
    public ResponseData<Boolean> changuserActive(@RequestParam("userId") long userId , @RequestBody ActiveRequest acRequest ){
        return new ResponseData<>(HttpStatusEnum.OK.getCode() ,"change userAactive successfully" , this.userService.changeActiveUse(userId , acRequest));
    }


}
