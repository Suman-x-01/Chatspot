

//
//import com.suman.Chat_App_Backend.entity.Message;
//import com.suman.Chat_App_Backend.entity.Room;
//import com.suman.Chat_App_Backend.entity.UserSignup;
//import org.springframework.dao.DuplicateKeyException;
//
//import java.time.LocalDateTime;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/v1/rooms")
//@CrossOrigin("http://localhost:5173")
//public class RoomController {
//
//	@Autowired
//	private RoomRepository roomRepository;
//
//	@Autowired
//	private UserRepository userRepository;
//
//	@Autowired
//	private SessionTrackerService sessionTrackerService;
//	@Autowired
//	private TotalRoomUsersRepository totalRoomUsersRepository;
//	@Autowired
//	private ActiveRoomUsersRepository activeRoomUsersRepository;
//
//
//	// ✅ Create Room
//	@PostMapping("/create")
//	public ResponseEntity<?> createRoom(@RequestBody Room newRoom) {
//		try {
//			if (newRoom.getRoomId() == null || newRoom.getRoomName() == null || newRoom.getCreatedBy() == null) {
//				return ResponseEntity.badRequest().body("roomId, roomName, and createdBy are required!");
//			}
//
//			if (roomRepository.findByRoomId(newRoom.getRoomId()) != null) {
//				return ResponseEntity.badRequest().body("Room ID already exists!");
//			}
//			if (roomRepository.findByRoomName(newRoom.getRoomName()) != null) {
//				return ResponseEntity.badRequest().body("Room Name already exists!");
//			}
//
//			Room savedRoom = roomRepository.save(newRoom);
//			return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
//
//		} catch (DuplicateKeyException e) {
//			return ResponseEntity.badRequest().body("Room ID or Room Name already exists!");
//		} catch (Exception e) {
//			return ResponseEntity.internalServerError().body("Error creating room: " + e.getMessage());
//		}
//	}
//
//	// ✅ Join Room
////	@GetMapping("/{roomId}/join/{username}")
////	public ResponseEntity<?> joinRoom(@PathVariable String roomId, @PathVariable String username) {
////		Room room = roomRepository.findByRoomId(roomId);
////		if (room == null) {
////			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
////		}
////
////		UserSignup user = userRepository.findByUsername(username);
////		if (user == null) {
////			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
////		}
////
////		if (!user.getJoinedRooms().contains(roomId)) {
////			user.getJoinedRooms().add(roomId);
////			userRepository.save(user);
////			System.out.println("✅ " + username + " joined room " + roomId);
////		}
////
////		sessionTrackerService.userJoined(roomId, username);
////		return ResponseEntity.ok("User joined room successfully!");
////	}
//
//
//	// ✅ Get all rooms
//	@GetMapping("/all")
//	public ResponseEntity<List<Room>> getAllRooms() {
//		List<Room> rooms = roomRepository.findAll();
//		return ResponseEntity.ok(rooms);
//	}
//
//	// ✅ Get all messages from a specific room (no pagination)
//	@GetMapping("/{roomId}/messages")
//	public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId) {
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//		}
//		return ResponseEntity.ok(room.getMessages());
//	}
//
//	// ✅ Verify room by ID
//	@GetMapping("/verify/{roomId}")
//	public ResponseEntity<?> verifyRoom(@PathVariable String roomId) {
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
//		}
//		return ResponseEntity.ok(room);
//	}
//
//	// ✅ Get all users who joined the room
//	@GetMapping("/{roomId}/users")
//	public ResponseEntity<List<UserSignup>> getUsersByRoom(@PathVariable String roomId) {
//		System.out.println("✅ /api/v1/rooms/" + roomId + "/users hit!");
//		List<UserSignup> users = userRepository.findByJoinedRoomsContaining(roomId);
//
//		return users.isEmpty()
//				? ResponseEntity.notFound().build()
//				: ResponseEntity.ok(users);
//	}
//
//	// ✅ DELETE a message by ID
//	@DeleteMapping("/{roomId}/message/{messageId}")
//	public ResponseEntity<?> deleteMessage(@PathVariable String roomId, @PathVariable String messageId) {
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
//		}
//
//		for (Message msg : room.getMessages()) {
//			if (msg.getId().equals(messageId)) {
//				msg.setDeleted(true);
//				msg.setContent("");
//				roomRepository.save(room);
//				return ResponseEntity.ok("Message deleted successfully");
//			}
//		}
//
//		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
//	}
//
//	// ✅ EDIT a message by ID
//	@PutMapping("/{roomId}/message/{messageId}")
//	public ResponseEntity<?> editMessage(
//			@PathVariable String roomId,
//			@PathVariable String messageId,
//			@RequestBody Map<String, String> body
//	) {
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
//		}
//
//		String newContent = body.get("content");
//		if (newContent == null || newContent.trim().isEmpty()) {
//			return ResponseEntity.badRequest().body("Content cannot be empty");
//		}
//
//		for (Message msg : room.getMessages()) {
//			if (msg.getId().equals(messageId)) {
//
//				// Allow edit only within 24 hours
//				if (msg.getTimestamp() != null &&
//						java.time.Duration.between(msg.getTimestamp(), LocalDateTime.now()).toHours() > 24) {
//					return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Edit window expired");
//				}
//
//				// Edit only text messages
//				msg.setContent(newContent);
//				msg.setEdited(true);
//				roomRepository.save(room);
//				return ResponseEntity.ok("Message edited successfully");
//			}
//		}
//
//		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
//	}
//
//
//	// ✅ Active users in this room
//	@GetMapping("/{roomId}/active-users")
//	public ResponseEntity<List<String>> getActiveUsers(@PathVariable String roomId) {
//		List<String> activeUsers = sessionTrackerService.getActiveUsernames(roomId);
//		return ResponseEntity.ok(activeUsers);
//	}
//}


package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.*;
import com.suman.Chat_App_Backend.Service.SessionTrackerService;
import com.suman.Chat_App_Backend.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SessionTrackerService sessionTrackerService;

	@Autowired
	private TotalRoomUsersRepository totalRoomUsersRepository;

	@Autowired
	private ActiveRoomUsersRepository activeRoomUsersRepository;

	@Autowired
	private SimpMessagingTemplate messagingTemplate; // ✅ For WebSocket notifications


	// ✅ Create Room
	@PostMapping("/create")
	public ResponseEntity<?> createRoom(@RequestBody Room newRoom) {
		try {
			if (newRoom.getRoomId() == null || newRoom.getRoomName() == null || newRoom.getCreatedBy() == null) {
				return ResponseEntity.badRequest().body("roomId, roomName, and createdBy are required!");
			}

			if (roomRepository.findByRoomId(newRoom.getRoomId()) != null) {
				return ResponseEntity.badRequest().body("Room ID already exists!");
			}
			if (roomRepository.findByRoomName(newRoom.getRoomName()) != null) {
				return ResponseEntity.badRequest().body("Room Name already exists!");
			}

			Room savedRoom = roomRepository.save(newRoom);

			// ✅ Initialize both collections when room is created
			if (totalRoomUsersRepository.findByRoomId(newRoom.getRoomId()) == null) {
				totalRoomUsersRepository.save(new TotalRoomUsers(newRoom.getRoomId()));
			}
			if (activeRoomUsersRepository.findByRoomId(newRoom.getRoomId()) == null) {
				activeRoomUsersRepository.save(new ActiveRoomUsers(newRoom.getRoomId()));
			}

			return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);

		} catch (DuplicateKeyException e) {
			return ResponseEntity.badRequest().body("Room ID or Room Name already exists!");
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error creating room: " + e.getMessage());
		}
	}

	// ✅ Join Room
//	@GetMapping("/{roomId}/join/{username}")
//	public ResponseEntity<?> joinRoom(@PathVariable String roomId, @PathVariable String username) {
//
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
//		}
//
//		UserSignup user = userRepository.findByUsername(username);
//		if (user == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
//		}
//
//		if (!user.getJoinedRooms().contains(roomId)) {
//			user.getJoinedRooms().add(roomId);
//			userRepository.save(user);
//		}
//
//		// ✅ Save to ActiveRoomUsers and TotalRoomUsers
//		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);
//		if (activeRoom == null) activeRoom = new ActiveRoomUsers(roomId);
////		activeRoom.getActiveUsers().add(username);
////		activeRoomUsersRepository.save(activeRoom);
//		activeRoom.addUser(username);
//		activeRoomUsersRepository.save(activeRoom);
//
//
//
//		TotalRoomUsers totalRoom = totalRoomUsersRepository.findByRoomId(roomId);
//		if (totalRoom == null) totalRoom = new TotalRoomUsers(roomId);
//		totalRoom.getUsers().add(username);
//		totalRoomUsersRepository.save(totalRoom);
//
//		sessionTrackerService.userJoined(roomId, username);
//
//		// ✅ Notify other users in the room via WebSocket
//		messagingTemplate.convertAndSend(
//				"/topic/room/" + roomId,
//				Map.of("type", "system", "content", username + " joined the room")
//		);
//
//		return ResponseEntity.ok("User joined room successfully!");
//	}


//	// ✅ Leave Room
//	@GetMapping("/{roomId}/leave/{username}")
//	public ResponseEntity<?> leaveRoom(@PathVariable String roomId, @PathVariable String username) {
//		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);
//		if (activeRoom != null && activeRoom.getActiveUsers().contains(username)) {
//			activeRoom.getActiveUsers().remove(username);
//			activeRoomUsersRepository.save(activeRoom);
//			System.out.println("❌ " + username + " left room " + roomId);
//
//			// ✅ Notify other users in the room via WebSocket
//			messagingTemplate.convertAndSend(
//					"/topic/room/" + roomId,
//					Map.of("type", "system", "content", username + " left the room")
//			);
//		}
//
//
//		return ResponseEntity.ok("User left room successfully!");
//	}
@GetMapping("/{roomId}/join/{username}")
public ResponseEntity<?> joinRoom(@PathVariable String roomId, @PathVariable String username) {

	// ❌ Ban check
	if (bannedUserRepository.existsByRoomIdAndUsername(roomId, username)) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body("You are banned from this room!");
	}

	Room room = roomRepository.findByRoomId(roomId);
	if (room == null) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
	}

	UserSignup user = userRepository.findByUsername(username);
	if (user == null) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
	}

	if (!user.getJoinedRooms().contains(roomId)) {
		user.getJoinedRooms().add(roomId);
		userRepository.save(user);
	}

	// Add to Active + Total Users
	ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);
	if (activeRoom == null) activeRoom = new ActiveRoomUsers(roomId);
	activeRoom.addUser(username);
	activeRoomUsersRepository.save(activeRoom);

	TotalRoomUsers totalRoom = totalRoomUsersRepository.findByRoomId(roomId);
	if (totalRoom == null) totalRoom = new TotalRoomUsers(roomId);
	totalRoom.getUsers().add(username);
	totalRoomUsersRepository.save(totalRoom);

	sessionTrackerService.userJoined(roomId, username);

	messagingTemplate.convertAndSend(
			"/topic/room/" + roomId,
			Map.of("type", "system", "content", username + " joined the room")
	);

	return ResponseEntity.ok("User joined room successfully!");
}


	// ✅ Leave Room
	@GetMapping("/{roomId}/leave/{username}")
	public ResponseEntity<?> leaveRoom(@PathVariable String roomId, @PathVariable String username) {
		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);

		if (activeRoom != null) {
			// ✅ Remove the user object that matches this username
			boolean removed = activeRoom.getActiveUsers().removeIf(
					user -> user.getUsername().equals(username)
			);

			if (removed) {
				activeRoomUsersRepository.save(activeRoom);
				System.out.println("❌ " + username + " left room " + roomId);

				// ✅ Notify others via WebSocket
				messagingTemplate.convertAndSend(
						"/topic/room/" + roomId,
						Map.of("type", "system", "content", username + " left the room")
				);
			} else {
				System.out.println("⚠️ " + username + " was not found in active users for room " + roomId);
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found in active users!");
		}

		return ResponseEntity.ok("User left room successfully!");
	}


	// ✅ Get all rooms
	@GetMapping("/all")
	public ResponseEntity<List<Room>> getAllRooms() {
		List<Room> rooms = roomRepository.findAll();
		return ResponseEntity.ok(rooms);
	}

	// ✅ Get all messages from a specific room
	@GetMapping("/{roomId}/messages")
	public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId) {
		Room room = roomRepository.findByRoomId(roomId);
		if (room == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok(room.getMessages());
	}

	// ✅ Verify room by ID
	@GetMapping("/verify/{roomId}")
	public ResponseEntity<?> verifyRoom(@PathVariable String roomId) {
		Room room = roomRepository.findByRoomId(roomId);
		if (room == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
		}
		return ResponseEntity.ok(room);
	}

	// ✅ Get all users who joined the room
	@GetMapping("/{roomId}/users")
	public ResponseEntity<List<UserSignup>> getUsersByRoom(@PathVariable String roomId) {
		System.out.println("✅ /api/v1/rooms/" + roomId + "/users hit!");
		List<UserSignup> users = userRepository.findByJoinedRoomsContaining(roomId);

		return users.isEmpty()
				? ResponseEntity.notFound().build()
				: ResponseEntity.ok(users);
	}

	// ✅ DELETE a message by ID
	@DeleteMapping("/{roomId}/message/{messageId}")
	public ResponseEntity<?> deleteMessage(@PathVariable String roomId, @PathVariable String messageId) {
		Room room = roomRepository.findByRoomId(roomId);
		if (room == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
		}

		for (Message msg : room.getMessages()) {
			if (msg.getId().equals(messageId)) {
				msg.setDeleted(true);
				msg.setContent("");
				roomRepository.save(room);
				return ResponseEntity.ok("Message deleted successfully");
			}
		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
	}

	// ✅ EDIT a message by ID
	@PutMapping("/{roomId}/message/{messageId}")
	public ResponseEntity<?> editMessage(
			@PathVariable String roomId,
			@PathVariable String messageId,
			@RequestBody Map<String, String> body
	) {
		Room room = roomRepository.findByRoomId(roomId);
		if (room == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
		}

		String newContent = body.get("content");
		if (newContent == null || newContent.trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Content cannot be empty");
		}

		for (Message msg : room.getMessages()) {
			if (msg.getId().equals(messageId)) {

				// Allow edit only within 24 hours
				if (msg.getTimestamp() != null &&
						java.time.Duration.between(msg.getTimestamp(), LocalDateTime.now()).toHours() > 24) {
					return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Edit window expired");
				}

				msg.setContent(newContent);
				msg.setEdited(true);
				roomRepository.save(room);
				return ResponseEntity.ok("Message edited successfully");
			}
		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
	}

	// ✅ Active users in this room
//	@GetMapping("/{roomId}/active-users")
//	public ResponseEntity<List<String>> getActiveUsers(@PathVariable String roomId) {
//		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);
//		if (activeRoom == null) return ResponseEntity.ok(List.of());
//		return ResponseEntity.ok(activeRoom.getActiveUsers());
//	}

	// ✅ Active users in this room
//	@GetMapping("/{roomId}/active-users")
//	public ResponseEntity<List<String>> getActiveUsers(@PathVariable String roomId) {
//		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);
//
//		if (activeRoom == null) {
//			System.out.println("⚠️ No active users found for room: " + roomId);
//			return ResponseEntity.ok(List.of()); // return empty list
//		}
//
//		// ✅ Convert Set → List before returning
//		return ResponseEntity.ok(new ArrayList<>(activeRoom.getActiveUsers()));
//	}


	// ✅ Active users in this room (with username, date, time)
	@GetMapping("/{roomId}/active-users")
	public ResponseEntity<List<ActiveUserInfo>> getActiveUsers(@PathVariable String roomId) {
		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);

		if (activeRoom == null) {
			System.out.println("⚠️ No active users found for room: " + roomId);
			return ResponseEntity.ok(List.of()); // return empty list if room not found
		}

		// ✅ Return the list of ActiveUserInfo directly
		return ResponseEntity.ok(activeRoom.getActiveUsers());
	}
	// ADMIN: Remove user from active list
	@DeleteMapping("/{roomId}/active-users/{username}")
	public ResponseEntity<?> adminRemoveActiveUser(@PathVariable String roomId, @PathVariable String username) {

		ActiveRoomUsers activeRoom = activeRoomUsersRepository.findByRoomId(roomId);

		if (activeRoom != null) {
			activeRoom.getActiveUsers().removeIf(u -> u.getUsername().equals(username));
			activeRoomUsersRepository.save(activeRoom);
		}

		return ResponseEntity.ok("User removed from active users!");
	}
//	Banned User
	@Autowired
	private BannedUserRepository bannedUserRepository;

	@PostMapping("/{roomId}/ban/{username}")
	public ResponseEntity<?> banUser(@PathVariable String roomId, @PathVariable String username) {

		if (!bannedUserRepository.existsByRoomIdAndUsername(roomId, username)) {
			bannedUserRepository.save(new BannedUser(roomId, username));
		}

		return ResponseEntity.ok("User banned successfully!");
	}
//	unban user
//	@DeleteMapping("/{roomId}/ban/{username}")
//	public ResponseEntity<?> unbanUser(@PathVariable String roomId, @PathVariable String username) {
//
//		if (bannedUserRepository.existsByRoomIdAndUsername(roomId, username)) {
//			bannedUserRepository.deleteByRoomIdAndUsername(roomId, username);
//			return ResponseEntity.ok("User unbanned successfully!");
//		}
//
//		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User was not banned.");
//	}

//	@DeleteMapping("/{roomId}/ban/{username}")
//	public ResponseEntity<?> unbanUser(@PathVariable String roomId, @PathVariable String username) {
//
//		if (!bannedUserRepository.existsByRoomIdAndUsername(roomId, username)) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User is not banned");
//		}
//
//		bannedUserRepository.deleteByRoomIdAndUsername(roomId, username);
//		return ResponseEntity.ok("User unbanned successfully!");
//	}
	// ✅ Get banned users for a room
	@GetMapping("/{roomId}/banned")
	public ResponseEntity<List<BannedUser>> getBannedUsers(@PathVariable String roomId) {
		List<BannedUser> banned = bannedUserRepository.findByRoomId(roomId);
		if (banned == null || banned.isEmpty()) {
			return ResponseEntity.ok(List.of());
		}
		return ResponseEntity.ok(banned);
	}

	// ✅ Unban (delete) a banned user
	@DeleteMapping("/{roomId}/ban/{username}")
	public ResponseEntity<?> unbanUser(@PathVariable String roomId, @PathVariable String username) {
		if (!bannedUserRepository.existsByRoomIdAndUsername(roomId, username)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User is not banned");
		}

		try {
			bannedUserRepository.deleteByRoomIdAndUsername(roomId, username);
			return ResponseEntity.ok("User unbanned successfully!");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to unban user: " + e.getMessage());
		}
	}
	// ✅ UPDATE Room (only creator allowed) for roomId change
	@PutMapping("/{roomId}/update")
	public ResponseEntity<?> updateRoom(
			@PathVariable String roomId,
			@RequestBody Map<String, String> body
	) {
		String newRoomId = body.get("roomId");
		String newRoomName = body.get("roomName");
		String username = body.get("username"); // the one trying to update

		Room room = roomRepository.findByRoomId(roomId);
		if (room == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
		}

		// ❌ only creator can update
		if (!room.getCreatedBy().equals(username)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Only the creator can update this room!");
		}

		// check duplicates for new ID
		if (newRoomId != null && !newRoomId.equals(roomId)) {
			if (roomRepository.findByRoomId(newRoomId) != null) {
				return ResponseEntity.badRequest().body("New Room ID already exists!");
			}
			room.setRoomId(newRoomId);
		}

		// check duplicates for new Name
		if (newRoomName != null && !newRoomName.equals(room.getRoomName())) {
			if (roomRepository.findByRoomName(newRoomName) != null) {
				return ResponseEntity.badRequest().body("New Room Name already exists!");
			}
			room.setRoomName(newRoomName);
		}

		roomRepository.save(room);
		return ResponseEntity.ok(room);
	}


}
