package com.suman.Chat_App_Backend.Repository;


//import com.suman.Chat_App_Backend.Model.Admin;
import com.suman.Chat_App_Backend.entity.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {
	Admin findByAdminName(String adminName);}

