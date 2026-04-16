package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.UserRepository;
import com.suman.Chat_App_Backend.entity.UserSignup;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/session")
@CrossOrigin("http://localhost:5173")
public class SessionController {

	private final UserRepository userRepository;

	public SessionController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/validate/{username}/{token}")
	public ResponseEntity<?> validateSession(
			@PathVariable String username,
			@PathVariable String token) {

		UserSignup user = userRepository.findByUsername(username);

		if (user == null) {
			return ResponseEntity.status(401).body(Map.of("valid", false));
		}

		boolean valid = token.equals(user.getSessionToken());
		return ResponseEntity.ok(Map.of("valid", valid));
	}
}