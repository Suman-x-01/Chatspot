package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.ActiveRoomUsersRepository;
import com.suman.Chat_App_Backend.entity.ActiveRoomUsers;
import com.suman.Chat_App_Backend.entity.ActiveUserInfo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/heartbeat")
@CrossOrigin("http://localhost:5173")
public class HeartbeatController {

	private final ActiveRoomUsersRepository activeRoomUsersRepository;

	public HeartbeatController(ActiveRoomUsersRepository activeRoomUsersRepository) {
		this.activeRoomUsersRepository = activeRoomUsersRepository;
	}

	// ✅ Frontend calls this every 15 seconds
	@PostMapping("/{roomId}/{username}")
	public ResponseEntity<?> heartbeat(
			@PathVariable String roomId,
			@PathVariable String username) {

		Optional<ActiveRoomUsers> opt = activeRoomUsersRepository.findById(roomId);

		if (opt.isPresent()) {
			ActiveRoomUsers room = opt.get();

			// Find the user inside the activeUsers list and update their lastSeen
			room.getActiveUsers().forEach(u -> {
				if (u.getUsername().equals(username)) {
					u.setLastSeen(LocalDateTime.now()); // ✅ update lastSeen on the user
				}
			});

			activeRoomUsersRepository.save(room);
		}

		return ResponseEntity.ok(Map.of("status", "ok"));
	}

	// ✅ Runs every 30 seconds — removes users with no heartbeat
	@Scheduled(fixedDelay = 30000)
	public void removeInactiveUsers() {
		LocalDateTime cutoff = LocalDateTime.now().minusSeconds(30);

		activeRoomUsersRepository.findAll().forEach(room -> {
			boolean anyRemoved = room.getActiveUsers()
					.removeIf(u ->
							u.getLastSeen() != null &&
									u.getLastSeen().isBefore(cutoff)
					);

			if (anyRemoved) {
				activeRoomUsersRepository.save(room);
				System.out.println("🧹 Removed inactive users from room: " + room.getRoomId());
			}
		});
	}
}