package com.suman.Chat_App_Backend.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.suman.Chat_App_Backend.Repository.UserRepository;
import com.suman.Chat_App_Backend.entity.UserSignup;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public UserSignup getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	public UserSignup updateUser(UserSignup updatedUser) {
		UserSignup existingUser = userRepository.findById(updatedUser.getId())
				.orElseThrow(() -> new RuntimeException("User not found"));

		// only update editable fields
		existingUser.setEmail(updatedUser.getEmail());
		existingUser.setPhone(updatedUser.getPhone());
		existingUser.setPassword(updatedUser.getPassword());

		if (updatedUser.getPhoto() != null && updatedUser.getPhoto().length > 0) {
			existingUser.setPhoto(updatedUser.getPhoto());
		}

		return userRepository.save(existingUser);
	}
}
