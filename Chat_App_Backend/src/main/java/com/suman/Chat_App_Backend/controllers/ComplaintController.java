package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.entity.Admin;
import com.suman.Chat_App_Backend.entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import com.suman.Chat_App_Backend.entity.Complaint;
import com.suman.Chat_App_Backend.Repository.ComplaintRepository;

import java.util.List;

@RestController
@RequestMapping(
		value="/api",
		produces = "application/json; charset=UTF-8")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

	@Autowired
	private ComplaintRepository complaintRepository;

	@PostMapping("/complaints")
	public ResponseEntity<?> saveComplaint(@RequestBody Complaint complaint) {
		complaintRepository.save(complaint);
		return ResponseEntity.ok("Complaint saved successfully");
	}
	@GetMapping("/messages/{roomId}")
	public ResponseEntity<List<Complaint>> getMessagesByRoom(@PathVariable String roomId) {
		List<Complaint> complaints = complaintRepository.findByRoomId(roomId);
		return ResponseEntity.ok(complaints);
	}

	@DeleteMapping("/complaints/{id}")
	public ResponseEntity<?> deleteComplaint(@PathVariable String id) {
		if (!complaintRepository.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("Complaint not found");
		}

		complaintRepository.deleteById(id);
		return ResponseEntity.ok("Complaint deleted successfully");
	}

}
