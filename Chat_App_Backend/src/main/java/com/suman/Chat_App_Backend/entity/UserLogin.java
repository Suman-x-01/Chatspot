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
	// ✅ Add these two fields
	private String sessionToken;
	private String lastLogin;

//	// ✅ Add getters & setters
//	public String getId() { return id; }
//	public void setId(String id) { this.id = id; }

//	public String getSessionToken() { return sessionToken; }
//	public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
//
//	public String getLastLogin() { return lastLogin; }
//	public void setLastLogin(String lastLogin) { this.lastLogin = lastLogin; }
}

