//package com.suman.Chat_App_Backend.payload;
//
//public class MessageRequest {
//
//	private String content;
//	private String sender;
//	private String roomId;
//
//	public MessageRequest(String content, String sender, String roomId) {
//		this.content = content;
//		this.sender = sender;
//		this.roomId = roomId;
//	}
//
//	public String getContent() {
//		return content;
//	}
//
//	public void setContent(String content) {
//		this.content = content;
//	}
//
//	public String getSender() {
//		return sender;
//	}
//
//	public void setSender(String sender) {
//		this.sender = sender;
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
//	public MessageRequest() {
//	}
//}


package com.suman.Chat_App_Backend.payload;

import java.util.List;
import java.util.Map;

public class MessageRequest {

	private String content;
	private String sender;
	private String roomId;

	// 🟦 Reply-To
	private Map<String, Object> replyTo;

	// 🟧 Poll fields
	private boolean isPoll;
	private String pollQuestion;
	private List<String> pollOptions;

	public MessageRequest() {}

	// GETTERS & SETTERS
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public Map<String, Object> getReplyTo() {
		return replyTo;
	}

	public void setReplyTo(Map<String, Object> replyTo) {
		this.replyTo = replyTo;
	}

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
}
