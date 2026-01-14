package com.suman.Chat_App_Backend.controllers;

import com.suman.Chat_App_Backend.Repository.RoomRepository;
import com.suman.Chat_App_Backend.dto.TypingDTO;
import com.suman.Chat_App_Backend.entity.Message;
import com.suman.Chat_App_Backend.entity.Room;
import com.suman.Chat_App_Backend.payload.MessageRequest;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {


	private RoomRepository roomRepository;

	public ChatController(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}


	//for sending and receiving messages
//	@MessageMapping("/sendMessage/{roomId}")// /app/sendMessage/roomId
//	@SendTo("/topic/room/{roomId}")//subscribe
//	public Message sendMessage(
//			@DestinationVariable String roomId,
//			@RequestBody MessageRequest request
//	) {
//
//		Room room = roomRepository.findByRoomId(request.getRoomId());
//		Message message = new Message();
//		message.setContent(request.getContent());
//		message.setSender(request.getSender());
//		message.setTimestamp(LocalDateTime.now());
//		if (room != null) {
//			room.getMessages().add(message);
//			roomRepository.save(room);
//		} else {
//			throw new RuntimeException("room not found !!");
//		}
//
//		return message;
//
//
//	}

//	@MessageMapping("/sendMessage/{roomId}")
//	@SendTo("/topic/room/{roomId}")
//	public Message sendMessage(
//			@DestinationVariable String roomId,
//			@RequestBody MessageRequest request
//	) {
//
//		Room room = roomRepository.findByRoomId(request.getRoomId());
//		if (room == null) throw new RuntimeException("room not found !!");
//
//		Message message = new Message();
//		message.setContent(request.getContent());
//		message.setSender(request.getSender());
//		message.setTimestamp(LocalDateTime.now());
//
//		// 🟦 SAVE REPLY TO MESSAGE
//		if (request.getReplyTo() != null) {
//			message.setReplyTo(request.getReplyTo());
//		}
//
//		room.getMessages().add(message);
//		roomRepository.save(room);
//
//		return message;
//	}





@MessageMapping("/sendMessage/{roomId}")
@SendTo("/topic/room/{roomId}")
public Message sendMessage(
		@DestinationVariable String roomId,
		@RequestBody MessageRequest request
) {

	Room room = roomRepository.findByRoomId(request.getRoomId());
	if (room == null) throw new RuntimeException("room not found !!");

	Message message = new Message();
	message.setContent(request.getContent());
	message.setSender(request.getSender());
	message.setTimestamp(LocalDateTime.now());

	// 🟦 SAVE REPLY TO MESSAGE
	if (request.getReplyTo() != null) {
		message.setReplyTo(request.getReplyTo());
	}

	// 🟧 SAVE POLL MESSAGE
	if (request.isPoll()) {
		message.setPoll(true);
		message.setPollQuestion(request.getPollQuestion());
		message.setPollOptions(request.getPollOptions());

		Map<String, Integer> votesMap = new HashMap<>();
		for (String opt : request.getPollOptions()) votesMap.put(opt, 0);

		message.setPollVotes(votesMap);
		message.setVotedUsers(new HashMap<>());
	}

	room.getMessages().add(message);
	roomRepository.save(room);

	return message;
}




	//	for emoji
//	@MessageMapping("/react/{roomId}")
//	@SendTo("/topic/reactions/{roomId}")
//	public Map<String, Object> handleReaction(
//			@DestinationVariable String roomId,
//			@RequestBody Map<String, String> body
//	) {
//		String messageId = body.get("messageId");
//		String emoji = body.get("emoji");
//
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) {
//			throw new RuntimeException("Room not found");
//		}
//
//		room.getMessages().forEach(msg -> {
//			if (msg.getId().equals(messageId)) {
//				msg.setReaction(emoji);
//			}
//		});
//
//		roomRepository.save(room);
//
//		return Map.of(
//				"messageId", messageId,
//				"emoji", emoji
//		);
//	}


//	for emoji
//	@MessageMapping("/react/{roomId}")
//	@SendTo("/topic/reactions/{roomId}")
//	public Map<String, Object> handleReaction(
//			@DestinationVariable String roomId,
//			@RequestBody Map<String, String> body
//	) {
//		String messageId = body.get("messageId");
//		String emoji = body.get("emoji");
//
//		Room room = roomRepository.findByRoomId(roomId);
//		if (room == null) throw new RuntimeException("Room not found");
//
//		room.getMessages().forEach(msg -> {
//			if (msg.getId().equals(messageId)) {

//				// initialize reactions map if null
//				if (msg.getReactions() == null)
//					msg.setReactions(new HashMap<>());
//
//				int count = msg.getReactions().getOrDefault(emoji, 0);
//				msg.getReactions().put(emoji, count + 1);
//			}
//		});
//
//		roomRepository.save(room);
//
//		return Map.of(
//				"messageId", messageId,
//				"emoji", emoji
//		);
//	}

//	for emoji
@MessageMapping("/react/{roomId}")
@SendTo("/topic/reactions/{roomId}")
public Map<String, Object> handleReaction(
		@DestinationVariable String roomId,
		@RequestBody Map<String, String> body
) {
	String messageId = body.get("messageId");
	String emoji = body.get("emoji");
	String username = body.get("username"); // 👈 user who reacted

	Room room = roomRepository.findByRoomId(roomId);
	if (room == null) throw new RuntimeException("Room not found");

	room.getMessages().forEach(msg -> {
		if (msg.getId().equals(messageId)) {

			msg.getReactions().putIfAbsent(emoji, new ArrayList<>());

			List<String> users = msg.getReactions().get(emoji);

			// ✔ Toggle (add/remove)
			if (users.contains(username)) {
				users.remove(username);
				if (users.isEmpty()) msg.getReactions().remove(emoji);
			} else {
				users.add(username);
			}
		}
	});

	roomRepository.save(room);

	return Map.of(
			"messageId", messageId,
			"emoji", emoji,
			"username", username
	);
}


//for voice and poll
@MessageMapping("/vote/{roomId}")
@SendTo("/topic/votes/{roomId}")
public Map<String, Object> votePoll(
		@DestinationVariable String roomId,
		@RequestBody Map<String, String> body
) {
	String messageId = body.get("messageId");
	String username = body.get("username");
	String option = body.get("option");

	Room room = roomRepository.findByRoomId(roomId);
	if (room == null) throw new RuntimeException("Room not found");

	Message targetMessage = null;

	// Find the poll message
	for (Message msg : room.getMessages()) {
		if (msg.getId().equals(messageId) && msg.isPoll()) {
			targetMessage = msg;

			String previous = msg.getVotedUsers().get(username);

			// ✔ CASE 1: User clicked SAME option → remove vote
			if (previous != null && previous.equals(option)) {
				msg.getVotedUsers().remove(username);
				msg.getPollVotes().put(option, msg.getPollVotes().get(option) - 1);
			}

			// ✔ CASE 2: User switched vote
			else {
				// remove previous vote if exists
				if (previous != null) {
					msg.getPollVotes().put(previous, msg.getPollVotes().get(previous) - 1);
				}

				// add new vote
				msg.getVotedUsers().put(username, option);
				msg.getPollVotes().put(option, msg.getPollVotes().get(option) + 1);
			}

			break;
		}
	}

	roomRepository.save(room);

	if (targetMessage == null)
		throw new RuntimeException("Poll message not found");

	return Map.of(
			"messageId", messageId,
			"pollVotes", targetMessage.getPollVotes(),
			"votedUsers", targetMessage.getVotedUsers()
	);
}



	@MessageMapping("/typing/{roomId}")
	@SendTo("/topic/typing/{roomId}")
	public TypingDTO typing(
			@DestinationVariable String roomId,
			@RequestBody TypingDTO typing
	) {
		return typing; // simply broadcast to all users
	}

}

