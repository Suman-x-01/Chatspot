package com.suman.Chat_App_Backend.Service;

import com.suman.Chat_App_Backend.Repository.ComplaintRepository;
import com.suman.Chat_App_Backend.Repository.RoomRepository;
import com.suman.Chat_App_Backend.entity.Admin;
import com.suman.Chat_App_Backend.entity.Complaint;
import com.suman.Chat_App_Backend.entity.Room;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

	private final RoomRepository roomRepository;
	private final ComplaintRepository complaintRepository;
	private final SessionTrackerService sessionTrackerService;

	// ✅ Single constructor injection — all dependencies initialized here
	public AdminService(RoomRepository roomRepository,
	                    ComplaintRepository complaintRepository,
	                    SessionTrackerService sessionTrackerService) {
		this.roomRepository = roomRepository;
		this.complaintRepository = complaintRepository;
		this.sessionTrackerService = sessionTrackerService;
	}

	public List<Room> getAllRooms() {
		return roomRepository.findAll();
	}

	public Room getRoomInfo(String roomId) {
		return roomRepository.findByRoomId(roomId);
	}

	public void deleteRoom(String roomId) {
		Room room = roomRepository.findByRoomId(roomId);
		if (room != null) {
			roomRepository.delete(room);
		}
	}

//	public int getActiveUserCount(String roomId) {
//		return sessionTrackerService.getActiveUsers(roomId);
//	}

	public List<Complaint> getComplaintsForRoom(String roomId) {
		return complaintRepository.findByRoomId(roomId);
	}
}
