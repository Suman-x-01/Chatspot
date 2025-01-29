package com.suman.Chat_App_Backend.Service;

import com.suman.Chat_App_Backend.Repository.RoomRepository;
import com.suman.Chat_App_Backend.entity.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {
	@Autowired
	private RoomRepository roomRepository;
	public Room getRoom(String id){
		roomRepository.findById(id);
		return roomRepository.findByRoomId( id);
	}
}
