package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.Admin;
import com.suman.Chat_App_Backend.entity.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {
	List<Complaint> findByRoomId(String roomId);
}

