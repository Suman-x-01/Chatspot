package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.TotalRoomUsers;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TotalRoomUsersRepository extends MongoRepository<TotalRoomUsers, String> {
	TotalRoomUsers findByRoomId(String roomId);
}

