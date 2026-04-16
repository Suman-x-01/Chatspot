package com.suman.Chat_App_Backend.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "UserDetails")
public class UserSignup {

	@Id
	private String id;
	private String username;
	private String password;
	private String email;
	private String phone;
	private String createdAt = LocalDate.now().toString();
	private byte[] photo; // store photo as binary data
//	private String roomId; // ✅ Add this

	// ✅ Add this field for tracking rooms the user joined
	private List<String> joinedRooms = new ArrayList<>();

	public List<String> getJoinedRooms() {
		return joinedRooms;
	}

	public void setJoinedRooms(List<String> joinedRooms) {
		this.joinedRooms = joinedRooms;
	}


	// Add these two fields alongside your existing ones:
	private String sessionToken;
	private String lastLogin;


	// Getters & Setters
	// Add getters & setters:
	public String getSessionToken() { return sessionToken; }
	public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

	public String getLastLogin() { return lastLogin; }
	public void setLastLogin(String lastLogin) { this.lastLogin = lastLogin; }
//	public String getRoomId() { return roomId; }
//	public void setRoomId(String roomId) { this.roomId = roomId; }
	// Getters & Setters
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }

	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public String getPhone() { return phone; }
	public void setPhone(String phone) { this.phone = phone; }

	public byte[] getPhoto() { return photo; }
	public void setPhoto(byte[] photo) { this.photo = photo; }

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	public String getCreatedAt() {
		return createdAt;
	}
}

