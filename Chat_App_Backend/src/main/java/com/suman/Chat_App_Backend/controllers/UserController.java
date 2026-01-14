package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.UserRepository;
import com.suman.Chat_App_Backend.Service.SessionTrackerService;
import com.suman.Chat_App_Backend.Service.UserService;
import com.suman.Chat_App_Backend.entity.UserSignup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173") // adjust port if needed
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository; // ✅ Add this

	@Autowired
	private SessionTrackerService sessionTrackerService;
	// ✅ Fetch user details by username
	@GetMapping("/username/{username}")
	public ResponseEntity<UserSignup> getUserByUsername(@PathVariable String username) {
		UserSignup user = userService.getUserByUsername(username);
		if (user != null) {
			return ResponseEntity.ok(user);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// ✅ Update user details (with optional photo upload)
	@PutMapping("/update") // ✅ fixed mapping (removed duplicate /api/user/)
	public ResponseEntity<?> updateUser(
			@RequestPart("user") UserSignup updatedUser,
			@RequestPart(value = "photo", required = false) MultipartFile photo) {

		Optional<UserSignup> existingUserOpt = userRepository.findById(updatedUser.getId());
		if (existingUserOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		UserSignup existingUser = existingUserOpt.get();

		existingUser.setEmail(updatedUser.getEmail());
		existingUser.setPhone(updatedUser.getPhone());

		if (photo != null && !photo.isEmpty()) {
			try {
				existingUser.setPhoto(photo.getBytes());
			} catch (IOException e) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid photo");
			}
		}

		userRepository.save(existingUser);
		return ResponseEntity.ok(existingUser);
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserSignup> getUserById(@PathVariable String id) {
		return userRepository.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}


	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable String id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("User not found");
		}

		userRepository.deleteById(id);
		return ResponseEntity.ok("User deleted successfully");
	}
@GetMapping("/all")
	public ResponseEntity<?>getAllUser(){
		List<UserSignup>list=userRepository.findAll();
		return ResponseEntity.ok(list);
}
}
