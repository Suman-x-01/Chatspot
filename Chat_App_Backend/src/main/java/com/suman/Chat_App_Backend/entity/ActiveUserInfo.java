package com.suman.Chat_App_Backend.entity;

import java.time.LocalDate;
import java.time.LocalTime;

public class ActiveUserInfo {

	private String username;
	private LocalDate date;
	private LocalTime time;

	public ActiveUserInfo() {}

	public ActiveUserInfo(String username) {
		this.username = username;
		this.date = LocalDate.now();
		this.time = LocalTime.now();
	}

	// Getters and Setters
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }

	public LocalDate getDate() { return date; }
	public void setDate(LocalDate date) { this.date = date; }

	public LocalTime getTime() { return time; }
	public void setTime(LocalTime time) { this.time = time; }
}

