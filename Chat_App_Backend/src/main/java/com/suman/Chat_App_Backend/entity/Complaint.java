package com.suman.Chat_App_Backend.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Complaints")
public class Complaint {
	@Id
	private String id;
	private String roomName;



	private String senderName;

	private String roomId;
	private String complaintAgainst;
	private String reason;
	private String message;

	// Getters & Setters
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getRoomName() { return roomName; }
	public void setRoomName(String roomName) { this.roomName = roomName; }
	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	public String getRoomId() { return roomId; }
	public void setRoomId(String roomId) { this.roomId = roomId; }

	public String getComplaintAgainst() { return complaintAgainst; }
	public void setComplaintAgainst(String complaintAgainst) { this.complaintAgainst = complaintAgainst; }

	public String getReason() { return reason; }
	public void setReason(String reason) { this.reason = reason; }

	public String getMessage() { return message; }
	public void setMessage(String message) { this.message = message; }
}
