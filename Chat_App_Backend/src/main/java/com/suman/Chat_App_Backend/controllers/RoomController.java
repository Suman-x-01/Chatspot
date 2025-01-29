package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.RoomRepository;
import com.suman.Chat_App_Backend.entity.Message;
import com.suman.Chat_App_Backend.entity.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {
	@Autowired
	private RoomRepository roomRepository;

	@PostMapping()
	public ResponseEntity<?> createRoom(@RequestBody String roomId){
		if(roomRepository.findByRoomId(roomId)!= null){
//			room already created
			return ResponseEntity.badRequest().body("Room Already Exist");
		}

//		create new room
		Room room=new Room();
		room.setRoomId(roomId);
		Room saveRoom = roomRepository.save(room);
		return ResponseEntity.status(HttpStatus.CREATED).body(room);

	}


	//		join room
	@GetMapping("/{roomId}")
	public ResponseEntity<?>joinRoom(@PathVariable String roomId){
		Room room=roomRepository.findByRoomId(roomId);
		if (room ==null){
			return ResponseEntity.badRequest().body("Room not found!!");
		}
		else{
			return ResponseEntity.ok(room);
		}
	}


//	get message from room
	@GetMapping("/{roomId}/messages")
	public ResponseEntity<List<Message>> getMessage(
			@PathVariable String roomId,
			@RequestParam(value = "page", defaultValue = "0", required = false) int page,
			@RequestParam(value = "size", defaultValue = "20", required = false) int size
	){
		Room room=roomRepository.findByRoomId(roomId);
		if (room ==null){
			return ResponseEntity.badRequest().build();
		}
//	pagination
		List<Message>messages=room.getMessages();
		int start = Math.max(0, messages.size() - (page + 1) * size);
		int end = Math.min(messages.size(), start + size);

		List<Message> paginatedMessages = messages.subList(start, end);
		return ResponseEntity.ok(paginatedMessages);
	}

}
