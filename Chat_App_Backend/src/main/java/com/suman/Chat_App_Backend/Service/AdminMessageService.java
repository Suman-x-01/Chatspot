package com.suman.Chat_App_Backend.Service;

import com.suman.Chat_App_Backend.Repository.AdminMessageRepository;
import com.suman.Chat_App_Backend.entity.AdminMessage;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminMessageService {

	private final AdminMessageRepository repo;

	public AdminMessageService(AdminMessageRepository repo) {
		this.repo = repo;
	}

	public AdminMessage create(String username, String text, String type) {
		AdminMessage msg = new AdminMessage(username, text, type);
		return repo.save(msg);
	}

	public List<AdminMessage> getMessages(String username) {
		return repo.findByUsernameOrderByTimestampDesc(username);
	}

	public long getUnread(String username) {
		return repo.countByUsernameAndReadIsFalse(username);
	}

	public Optional<AdminMessage> markRead(String id) {
		Optional<AdminMessage> opt = repo.findById(id);
		opt.ifPresent(msg -> {
			msg.setRead(true);
			repo.save(msg);
		});
		return opt;
	}

	public boolean delete(String id) {
		if (!repo.existsById(id)) return false;
		repo.deleteById(id);
		return true;
	}

	public List<AdminMessage> getAll() {
		return repo.findAll();
	}
}
