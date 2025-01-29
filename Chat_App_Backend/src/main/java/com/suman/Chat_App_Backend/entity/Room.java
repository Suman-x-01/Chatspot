package com.suman.Chat_App_Backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "rooms")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
public class Room {
	@Id
	private String id;//Mongo db : unique identifier
	private String roomId;
	private List<Message> messages = new ArrayList<>();

	public Room(String id, String roomId, List<Message> messages) {
		this.id = id;
		this.roomId = roomId;
		this.messages = messages;
	}

	public Room() {
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
}
