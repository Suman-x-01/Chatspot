package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.ActiveRoomUsers;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActiveRoomUsersRepository extends MongoRepository<ActiveRoomUsers, String> {
	ActiveRoomUsers findByRoomId(String roomId);
}