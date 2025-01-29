package com.suman.Chat_App_Backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class Message {
	private String sender;
	private String content;
	private LocalDateTime timeStamp;

	public Message(String sender, String content) {
		this.sender = sender;
		this.content = content;
		timeStamp=LocalDateTime.now();
	}

	public Message() {
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime time) {
		this.timeStamp = time;
	}
}
