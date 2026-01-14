package com.suman.Chat_App_Backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "banned_users")
public class BannedUser {

	@Id
	private String id;

	private String roomId;
	private String username;
	private java.time.Instant bannedAt; // timestamp when banned

	public BannedUser() {}

	public BannedUser(String roomId, String username) {
		this.roomId = roomId;
		this.username = username;
		this.bannedAt = java.time.Instant.now();
	}

	// getters / setters

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getRoomId() { return roomId; }
	public void setRoomId(String roomId) { this.roomId = roomId; }

	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }

	public java.time.Instant getBannedAt() { return bannedAt; }
	public void setBannedAt(java.time.Instant bannedAt) { this.bannedAt = bannedAt; }
}
