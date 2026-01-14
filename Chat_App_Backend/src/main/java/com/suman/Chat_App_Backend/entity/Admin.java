package com.suman.Chat_App_Backend.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
//@NoArgsConstructor
@Document(collection = "AdminDetails")
public class Admin {

	@Id
	private String id;
	private String adminName;
	private String adminPass;

	public Admin() {
	}

	public Admin(String adminName, String adminPass) {
		this.adminName = adminName;
		this.adminPass = adminPass;
	}

	// ✅ Add these getters and setters
	public String getAdminName() {
		return adminName;
	}

	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}

	public String getAdminPass() {
		return adminPass;
	}

	public void setAdminPass(String adminPass) {
		this.adminPass = adminPass;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Document(collection = "Complaints")
	public static class Complaint {
		@Id
		private String id;
		private String roomId;
		private String reportedBy;
		private String againstUser;
		private String reason;
		private String createdAt;
	}
}
