package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.UserSignup;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<UserSignup, String> {
	UserSignup findByEmail(String email);
	UserSignup findByUsername(String username);
//	List<UserSignup> findByRoomId(String roomId);
	List<UserSignup> findByJoinedRoomsContaining(String roomId);


}
