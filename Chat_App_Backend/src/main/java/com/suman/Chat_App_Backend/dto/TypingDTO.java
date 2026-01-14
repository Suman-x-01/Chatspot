package com.suman.Chat_App_Backend.dto;

public class TypingDTO {
	private String username;
	private boolean typing;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isTyping() {
		return typing;
	}

	public void setTyping(boolean typing) {
		this.typing = typing;
	}
}
