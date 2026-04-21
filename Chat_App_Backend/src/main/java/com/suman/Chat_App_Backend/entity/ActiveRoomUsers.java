package com.suman.Chat_App_Backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "active_room_users")
public class ActiveRoomUsers {

	@Id
	private String roomId;

	private List<ActiveUserInfo> activeUsers = new ArrayList<>();
	// In your existing ActiveRoomUsers.java, add:
	private LocalDateTime lastSeen;

	public LocalDateTime getLastSeen() { return lastSeen; }
	public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
	public ActiveRoomUsers() {}

	public ActiveRoomUsers(String roomId) {
		this.roomId = roomId;
	}

	// ✅ Add a new user (with current date/time)
	public void addUser(String username) {
		boolean exists = activeUsers.stream()
				.anyMatch(u -> u.getUsername().equals(username));
		if (!exists) {
			activeUsers.add(new ActiveUserInfo(username));
		}
	}

	// ✅ Remove a user
	public void removeUser(String username) {
		activeUsers.removeIf(u -> u.getUsername().equals(username));
	}

	// Getters & Setters
	public String getRoomId() { return roomId; }
	public void setRoomId(String roomId) { this.roomId = roomId; }

	public List<ActiveUserInfo> getActiveUsers() { return activeUsers; }
	public void setActiveUsers(List<ActiveUserInfo> activeUsers) { this.activeUsers = activeUsers; }
}
