package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface RoomRepository extends MongoRepository<Room, String> {
	Room findByRoomId(String roomId);

}
