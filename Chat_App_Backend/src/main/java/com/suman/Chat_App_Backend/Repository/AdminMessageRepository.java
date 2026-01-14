package com.suman.Chat_App_Backend.Repository;

import com.suman.Chat_App_Backend.entity.AdminMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdminMessageRepository extends MongoRepository<AdminMessage, String> {

	List<AdminMessage> findByUsernameOrderByTimestampDesc(String username);

	long countByUsernameAndReadIsFalse(String username);
}
