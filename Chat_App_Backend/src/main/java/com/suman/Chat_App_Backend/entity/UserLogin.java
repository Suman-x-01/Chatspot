package com.suman.Chat_App_Backend.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "UserDetails")
public class UserLogin {
	@Id
	private String id;
	private String username;
	private String password;
	private String email;
	private String phone;
	private byte[] photo; // stored as bytes
}

