package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.ComplaintRepository;
import com.suman.Chat_App_Backend.Repository.MessageRepository;
import com.suman.Chat_App_Backend.entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping(
		value = "/api/messages",
		produces = "application/json; charset=UTF-8"
)
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

	@Autowired
	private MessageRepository messageRepository;

	@Autowired
	private ComplaintRepository complaintRepository;

//	@GetMapping("/{roomId}")
//	public ResponseEntity<List<Message>> getMessagesByRoom(@PathVariable String roomId) {
//		List<Message> messages = messageRepository.findByRoomId(roomId);
////		for (Message m:messages){
////			System.out.println(m);
////		}
//		return ResponseEntity.ok(messages);
//	}



	// ✏️ Update a message (only within 24 hours)
	@PutMapping("/{id}")
	public ResponseEntity<?> updateMessage(@PathVariable String id, @RequestBody Map<String, String> body) {
		String newText = body.get("content");

		Optional<Message> optionalMsg = messageRepository.findById(id);
		if (optionalMsg.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
		}

		Message msg = optionalMsg.get();

		// 🕒 Check 24-hour edit limit
		if (Duration.between(msg.getTimestamp(), LocalDateTime.now()).toHours() > 24) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Edit window expired");
		}

		msg.setContent(newText);
		msg.setEdited(true);
		messageRepository.save(msg);

		return ResponseEntity.ok("Message updated successfully");
	}

	// 🗑 Delete a message
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteMessage(@PathVariable String id) {
		Optional<Message> optionalMsg = messageRepository.findById(id);
		if (optionalMsg.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
		}

		Message msg = optionalMsg.get();
		msg.setContent(" a");
		msg.setDeleted(true);
		messageRepository.save(msg);

		return ResponseEntity.ok("Message deleted successfully");
	}


}
