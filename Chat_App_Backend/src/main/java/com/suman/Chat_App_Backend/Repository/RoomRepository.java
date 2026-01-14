package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface RoomRepository extends MongoRepository<Room, String> {
//	Room findByRoomId(String roomId);
Room findByRoomId(String roomId);
	Room findByRoomName(String roomName);
}
