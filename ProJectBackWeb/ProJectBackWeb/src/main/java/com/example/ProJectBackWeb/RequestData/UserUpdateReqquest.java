package com.example.ProJectBackWeb.RequestData;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserUpdateReqquest {
    private String fullname;
    private String phone;
    private String address;
    private String email;
}
