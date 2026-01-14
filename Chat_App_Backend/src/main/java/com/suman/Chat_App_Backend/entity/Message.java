package com.suman.Chat_App_Backend.entity;

//
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.time.LocalDateTime;
//
//@Document(collection = "room")
//public class Message {
//	@Id
//	private String id;
//	private String sender;
//	private String roomId;
//	private String content;
//	private LocalDateTime timestamp; // ✅ change here
//
//	private boolean edited = false;
//	private boolean deleted = false;
//	// Getters & Setters
//	public String getId() { return id; }
//	public void setId(String id) { this.id = id; }
//
//	public String getSender() { return sender; }
//	public void setSender(String sender) { this.sender = sender; }
//
//	public String getRoomId() { return roomId; }
//	public void setRoomId(String roomId) { this.roomId = roomId; }
//
//	public String getContent() { return content; }
//	public void setContent(String content) { this.content = content; }
//
//	public LocalDateTime getTimestamp() { return timestamp; }
//	public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
//
//
//	public boolean isEdited() { return edited; }
//	public void setEdited(boolean edited) { this.edited = edited; }
//
//	public boolean isDeleted() { return deleted; }
//	public void setDeleted(boolean deleted) { this.deleted = deleted; }
//}
//



import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.*;

public class Message {

	@Field("_id") // 👈 maps MongoDB "_id" to this field in nested list
	private String id = UUID.randomUUID().toString(); // unique message id
	private String sender;
	private String roomId;
	private String content;
	private LocalDateTime timestamp = LocalDateTime.now();
	private boolean edited = false;
	private boolean deleted = false;
//	private Map<String, Integer> reactions = new HashMap<>();
private Map<String, List<String>> reactions = new HashMap<>();

	// Getters & Setters
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getSender() { return sender; }
	public void setSender(String sender) { this.sender = sender; }

	public String getRoomId() { return roomId; }
	public void setRoomId(String roomId) { this.roomId = roomId; }

	public String getContent() { return content; }
	public void setContent(String content) { this.content = content; }

	public LocalDateTime getTimestamp() { return timestamp; }
	public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

	public boolean isEdited() { return edited; }
	public void setEdited(boolean edited) { this.edited = edited; }

	public boolean isDeleted() { return deleted; }
	public void setDeleted(boolean deleted) { this.deleted = deleted; }

//	public String getReaction() { return reaction; }
//	public void setReaction(String reaction) { this.reaction = reaction; }
//	public Map<String, Integer> getReactions() { return reactions; }
//	public void setReactions(Map<String, Integer> reactions) { this.reactions = reactions; }
	public Map<String, List<String>> getReactions() { return reactions; }
	public void setReactions(Map<String, List<String>> reactions) { this.reactions = reactions; }

	// 🟦 Reply-To (stores id, sender, content of replied message)
//	private Map<String, Object> replyTo = null;
	private Map<String, Object> replyTo;
	public Map<String, Object> getReplyTo() {
		return replyTo;
	}

	public void setReplyTo(Map<String, Object> replyTo) {
		this.replyTo = replyTo;
	}

//for pool nd voice feature
	private boolean isPoll = false;
	private String pollQuestion;
	private List<String> pollOptions = new ArrayList<>();
	private Map<String, Integer> pollVotes = new HashMap<>();  // option -> count
	private Map<String, String> votedUsers = new HashMap<>(); // username -> option

	public boolean isPoll() {
		return isPoll;
	}

	public void setPoll(boolean poll) {
		isPoll = poll;
	}

	public String getPollQuestion() {
		return pollQuestion;
	}

	public void setPollQuestion(String pollQuestion) {
		this.pollQuestion = pollQuestion;
	}

	public List<String> getPollOptions() {
		return pollOptions;
	}

	public void setPollOptions(List<String> pollOptions) {
		this.pollOptions = pollOptions;
	}

	public Map<String, Integer> getPollVotes() {
		return pollVotes;
	}

	public void setPollVotes(Map<String, Integer> pollVotes) {
		this.pollVotes = pollVotes;
	}

	public Map<String, String> getVotedUsers() {
		return votedUsers;
	}

	public void setVotedUsers(Map<String, String> votedUsers) {
		this.votedUsers = votedUsers;
	}
}
