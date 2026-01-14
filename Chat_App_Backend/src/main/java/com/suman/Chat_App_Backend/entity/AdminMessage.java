package com.suman.Chat_App_Backend.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "AdminMessages")
public class AdminMessage {

	@Id
	private String id;

	private String username;    // message belongs to which user
	private String message;     // text
	private boolean read;       // unread or read
	private String type;        // info, warning, system
	private Instant timestamp;  // createdAt

	public AdminMessage() {}

	public AdminMessage(String username, String message, String type) {
		this.id = UUID.randomUUID().toString();
		this.username = username;
		this.message = message;
		this.read = false;
		this.type = type;
		this.timestamp = Instant.now();
	}

	// Getters & Setters
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }

	public String getMessage() { return message; }
	public void setMessage(String message) { this.message = message; }

	public boolean isRead() { return read; }
	public void setRead(boolean read) { this.read = read; }

	public String getType() { return type; }
	public void setType(String type) { this.type = type; }

	public Instant getTimestamp() { return timestamp; }
	public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

