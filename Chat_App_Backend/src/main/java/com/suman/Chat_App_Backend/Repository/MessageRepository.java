package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
	List<Message> findByRoomId(String roomId);
}

