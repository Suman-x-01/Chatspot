package com.suman.Chat_App_Backend.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "total_room_users")
public class TotalRoomUsers {

	@Id
	private String roomId;
	private Set<String> users = new HashSet<>();

	public TotalRoomUsers() {}

	public TotalRoomUsers(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomId() { return roomId; }
	public void setRoomId(String roomId) { this.roomId = roomId; }

	public Set<String> getUsers() { return users; }
	public void setUsers(Set<String> users) { this.users = users; }
}
