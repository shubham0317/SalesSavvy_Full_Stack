package com.projects.salessavvy_app.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.projects.salessavvy_app.entities.User;
import com.projects.salessavvy_app.repositories.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;
	
	private final BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = new BCryptPasswordEncoder();
	}
	
	public User registerUser(User user) {
		
		if(userRepository.findByUsername(user.getUsername()).isPresent()) {
			throw new RuntimeException("username is already taken");
		}
		
		if(userRepository.findByEmail(user.getEmail()).isPresent()) {
			throw new RuntimeException("Email is already taken");
		}
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
		
		return userRepository.save(user);
		
	}
	
}
