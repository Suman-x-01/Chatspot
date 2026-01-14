package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Service.AdminMessageService;
import com.suman.Chat_App_Backend.dto.AdminMessageRequest;
import com.suman.Chat_App_Backend.entity.AdminMessage;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin-messages")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminMessageController {

	private final AdminMessageService service;

	public AdminMessageController(AdminMessageService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody AdminMessageRequest req) {
		if (req.getUsername() == null || req.getMessage() == null)
			return ResponseEntity.badRequest().body("Username or message missing");

		AdminMessage msg = service.create(req.getUsername(), req.getMessage(), req.getType());
		return ResponseEntity.status(HttpStatus.CREATED).body(msg);
	}

	@GetMapping("/user/{username}")
	public ResponseEntity<List<AdminMessage>> getMessages(@PathVariable String username) {
		return ResponseEntity.ok(service.getMessages(username));
	}

	@GetMapping("/{username}/unread-count")
	public ResponseEntity<Long> unread(@PathVariable String username) {
		return ResponseEntity.ok(service.getUnread(username));
	}

//	@PutMapping("/read/{id}")
//	public ResponseEntity<?> markRead(@PathVariable String id) {
//		return service.markRead(id)
//				.map(msg -> ResponseEntity.ok(msg))
//				.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
//						.body("Message not found"));
//	}

	@PutMapping("/read/{id}")
	public ResponseEntity<?> markRead(@PathVariable String id) {

		Optional<AdminMessage> opt = service.markRead(id);

		if (opt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("Message not found");
		}

		return ResponseEntity.ok(opt.get());
	}



	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable String id) {
		boolean ok = service.delete(id);
		if (!ok) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");

		return ResponseEntity.ok("Deleted");
	}
}
