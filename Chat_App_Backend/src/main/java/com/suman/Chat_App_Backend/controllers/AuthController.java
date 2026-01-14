package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.UserRepository;
import com.suman.Chat_App_Backend.entity.UserSignup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // React port
public class AuthController {

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/signup")
	public ResponseEntity<String> signup(
			@RequestParam("username") String username,
			@RequestParam("password") String password,
			@RequestParam("email") String email,
			@RequestParam("phone") String phone,
			@RequestParam(value = "photo", required = false) MultipartFile photo
	) {
		try {
			if (userRepository.findByUsername(username) != null) {
				return ResponseEntity.badRequest().body("Username already exists!");
			}

			UserSignup user = new UserSignup();
			user.setUsername(username);
			user.setPassword(password);
			user.setEmail(email);
			user.setPhone(phone);

			if (photo != null && !photo.isEmpty()) {
				user.setPhoto(photo.getBytes());
			}
//			System.out.println("=========="+username);
			userRepository.save(user);
			return ResponseEntity.ok("User registered successfully!");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}

	// Optional: Fetch user photo later
//	@GetMapping("/photo/{username}")
//	public ResponseEntity<byte[]> getPhoto(@PathVariable String username) {
//		UserSignup user = userRepository.findByUsername(username);
//		if (user == null || user.getPhoto() == null) {
//			return ResponseEntity.notFound().build();
//		}
//		return ResponseEntity.ok().body(user.getPhoto());
//	}


	// ---------- LOGIN ----------
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
		try {
			String username = credentials.get("username");
			String password = credentials.get("password");

			UserSignup user = userRepository.findByUsername(username);
			if (user == null) {
				return ResponseEntity.status(401).body("User not found!");
			}

			if (!user.getPassword().equals(password)) {
				return ResponseEntity.status(401).body("Invalid password!");
			}
			System.out.println("============================="+username);
			// create response map
			Map<String, Object> response = new HashMap<>();
			response.put("username", user.getUsername());
			response.put("email", user.getEmail());
			response.put("phone", user.getPhone());

			// send photo as base64 string (React can display it)
			if (user.getPhoto() != null) {
				String base64Photo = java.util.Base64.getEncoder().encodeToString(user.getPhoto());
				response.put("photo", base64Photo);
			}

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}

	// ---------- FETCH PHOTO ----------
//	@GetMapping("/photo/{username}")
//	public ResponseEntity<byte[]> getPhoto2(@PathVariable String username) {
//		UserSignup user = userRepository.findByUsername(username);
//		if (user == null || user.getPhoto() == null) {
//			return ResponseEntity.notFound().build();
//		}
//		return ResponseEntity.ok().body(user.getPhoto());
//	}
	@GetMapping("/photo/{username}")
	public ResponseEntity<byte[]> getUserPhoto(@PathVariable String username) {
		UserSignup user = userRepository.findByUsername(username);
		if (user == null || user.getPhoto() == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		return ResponseEntity.ok()
				.contentType(MediaType.IMAGE_JPEG)
				.body(user.getPhoto());
	}

}
