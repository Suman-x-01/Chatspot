package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.AdminRepository;
import com.suman.Chat_App_Backend.Repository.RoomRepository;
import com.suman.Chat_App_Backend.Repository.UserRepository;
import com.suman.Chat_App_Backend.Service.AdminService;
import com.suman.Chat_App_Backend.entity.Admin;
import com.suman.Chat_App_Backend.entity.Complaint;
import com.suman.Chat_App_Backend.entity.Room;
import com.suman.Chat_App_Backend.entity.UserSignup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
//@RequestMapping("/api/admin/rooms")
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private AdminRepository adminRepository;
	private final AdminService adminService;

	@Autowired
	private RoomRepository roomRepository;
	@Autowired
	private UserRepository userRepository;
	// ✅ Single constructor for dependency injection
	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping
	public ResponseEntity<List<Room>> getAllRooms() {
		return ResponseEntity.ok(adminService.getAllRooms());
	}

	@GetMapping("/{roomId}")
	public ResponseEntity<Room> getRoomInfo(@PathVariable String roomId) {
		return ResponseEntity.ok(adminService.getRoomInfo(roomId));
	}

//	@DeleteMapping("/{roomId}")
//	public ResponseEntity<Void> deleteRoom(@PathVariable String roomId) {
//		adminService.deleteRoom(roomId);
//		return ResponseEntity.noContent().build();
//	}

	@DeleteMapping("/{roomId}")
	public ResponseEntity<Void> deleteRoom(@PathVariable String roomId) {

		// 1️⃣ Delete room normally
		adminService.deleteRoom(roomId);

		// 2️⃣ Notify all users connected in that room
		messagingTemplate.convertAndSend("/topic/room-deleted/" + roomId, "ROOM_DELETED");

		return ResponseEntity.noContent().build();
	}



//	@GetMapping("/{roomId}/active-users")
//	public ResponseEntity<Map<String, Object>> getActiveUsers(@PathVariable String roomId) {
//		int count = adminService.getActiveUserCount(roomId);
//		return ResponseEntity.ok(Map.of("count", count));
//	}

	@GetMapping("/{roomId}/complaints")
	public ResponseEntity<List<Complaint>> getComplaints(@PathVariable String roomId) {
		return ResponseEntity.ok(adminService.getComplaintsForRoom(roomId));
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginAdmin(@RequestBody Admin loginRequest) {
		Admin admin = adminRepository.findByAdminName(loginRequest.getAdminName());

		if (admin != null && admin.getAdminPass().equals(loginRequest.getAdminPass())) {
			return ResponseEntity.ok(Map.of("message", "Login successful"));
		} else {
			return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
		}
	}
	@GetMapping("/stats")
	public ResponseEntity<?> getDashboardStats() {

		List<UserSignup> users = userRepository.findAll();
		List<Room> rooms = roomRepository.findAll();

		// Count users per month
		Map<String, Long> userPerMonth = users.stream()
				.collect(Collectors.groupingBy(
						u -> u.getCreatedAt().substring(0, 7), // yyyy-MM
						Collectors.counting()
				));

		// Count rooms per month
		Map<String, Long> roomPerMonth = rooms.stream()
				.collect(Collectors.groupingBy(
						r -> r.getCreatedAt().substring(0, 7),
						Collectors.counting()
				));

		Map<String, Object> response = new HashMap<>();
		response.put("totalUsers", users.size());
		response.put("totalRooms", rooms.size());
		response.put("userPerMonth", userPerMonth);
		response.put("roomPerMonth", roomPerMonth);

		return ResponseEntity.ok(response);
	}
}
