//package com.suman.Chat_App_Backend.Service;
//
//import org.springframework.stereotype.Service;
//import java.util.*;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//public class SessionTrackerService {
//
//	// ✅ Store both count and usernames
//	// roomId -> set of usernames
//	private final Map<String, Set<String>> activeUsersByRoom = new ConcurrentHashMap<>();
//
//	// 🟢 Called when user joins
//	public void userJoined(String roomId, String username) {
//		activeUsersByRoom
//				.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet())
//				.add(username);
//	}
//
//	// 🔴 Called when user leaves
//	public void userLeft(String roomId, String username) {
//		if (activeUsersByRoom.containsKey(roomId)) {
//			Set<String> users = activeUsersByRoom.get(roomId);
//			users.remove(username);
//			if (users.isEmpty()) {
//				activeUsersByRoom.remove(roomId);
//			}
//		}
//	}
//
//	// ✅ Return active user count (for compatibility with your existing code)
//	public int getActiveUsers(String roomId) {
//		return activeUsersByRoom.getOrDefault(roomId, Collections.emptySet()).size();
//	}
//
//	// ✅ Return list of active usernames (for “All Users” page)
//	public List<String> getActiveUsernames(String roomId) {
//		return new ArrayList<>(activeUsersByRoom.getOrDefault(roomId, Collections.emptySet()));
//	}
//}

package com.suman.Chat_App_Backend.Service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionTrackerService {

	// ✅ Store active users for each room
	private final Map<String, Set<String>> activeUsersByRoom = new ConcurrentHashMap<>();

	public void userJoined(String roomId, String username) {
		activeUsersByRoom.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(username);
		System.out.println("✅ " + username + " joined room: " + roomId);
	}

	public void userLeft(String roomId, String username) {
		Set<String> users = activeUsersByRoom.get(roomId);
		if (users != null) {
			users.remove(username);
			if (users.isEmpty()) {
				activeUsersByRoom.remove(roomId);
			}
			System.out.println("🚪 " + username + " left room: " + roomId);
		}
	}

	public List<String> getActiveUsernames(String roomId) {
		return new ArrayList<>(activeUsersByRoom.getOrDefault(roomId, Set.of()));
	}

	public int getActiveUserCount(String roomId) {
		return activeUsersByRoom.getOrDefault(roomId, Set.of()).size();
	}
}
