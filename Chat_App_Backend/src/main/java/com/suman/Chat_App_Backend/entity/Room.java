//package com.suman.Chat_App_Backend.entity;
//
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
////
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//
//@Document(collection = "rooms")
////@Getter
////@Setter
////@NoArgsConstructor
////@AllArgsConstructor
//public class Room {
//	@Id
//	private String id;//Mongo db : unique identifier
//	private String roomId;
//	private List<Message> messages = new ArrayList<>();
//
//	public Room(String id, String roomId, List<Message> messages) {
//		this.id = id;
//		this.roomId = roomId;
//		this.messages = messages;
//	}
//
//	public Room() {
//	}
//
//	public String getRoomId() {
//		return roomId;
//	}
//
//	public void setRoomId(String roomId) {
//		this.roomId = roomId;
//	}
//
//	public String getId() {
//		return id;
//	}
//
//	public void setId(String id) {
//		this.id = id;
//	}
//
//	public List<Message> getMessages() {
//		return messages;
//	}
//
//	public void setMessages(List<Message> messages) {
//		this.messages = messages;
//	}
//}


package com.suman.Chat_App_Backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
@Document(collection = "rooms")
public class Room {

	@Id
	private String id;

	private String roomId;
	private String roomName;
	private String createdBy;
	private String createdAt = LocalDate.now().toString();

	private List<Message> messages = new ArrayList<>();

	// ✅ No-arg constructor (important for Spring)
	public Room() {}

	// ✅ All-args constructor (optional, useful)
	public Room(String roomId, String roomName, String createdBy) {
		this.roomId = roomId;
		this.roomName = roomName;
		this.createdBy = createdBy;
	}

	// ✅ Getters and Setters
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
}
