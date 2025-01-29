package com.suman.Chat_App_Backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {
	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {

		config.enableSimpleBroker("/topic"); //Configures where the server can send messages to clients.
		// /topic/messages

		config.setApplicationDestinationPrefixes("/app"); // Configures where clients can send messages to the server.



	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/chat")//connection establishment
				.setAllowedOrigins("http://localhost:5173")
				.withSockJS();
	}
}
