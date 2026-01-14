package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.BannedUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BannedUserRepository extends MongoRepository<BannedUser, String> {
	boolean existsByRoomIdAndUsername(String roomId, String username);
	void deleteByRoomIdAndUsername(String roomId, String username);
	List<BannedUser> findByRoomId(String roomId);
}
