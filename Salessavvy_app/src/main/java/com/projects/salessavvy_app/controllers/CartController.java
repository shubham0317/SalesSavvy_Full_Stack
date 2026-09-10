package com.projects.salessavvy_app.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projects.salessavvy_app.entities.User;
import com.projects.salessavvy_app.repositories.UserRepository;
import com.projects.salessavvy_app.services.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/cart")
public class CartController {

	@Autowired
	private CartService cartService;
	
	@Autowired	
	private UserRepository userRepository;
	
	
	@PostMapping("/add")
	@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	public ResponseEntity<Void> addToCart(@RequestBody Map<String, Object> request) {
		
		String username = (String) request.get("username");
		int productId = (int) request.get("productId");
		
		//Handle quantity: Default to 1 if not provided
		int quantity = request.containsKey("quantity") ? (int) request.get("quantity") : 1;
		
		//Fetch the user using username
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + username));
		
		
		//Add the product to cart
		cartService.addToCart(user.getUserId(), productId, quantity);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	//Fetch all cart items for the user(based on username)
	@GetMapping("/items")
	public ResponseEntity<Map<String,Object>> getCartItems(HttpServletRequest request) {
		
		//Fetch user by username to get the userId
		User user = (User) request.getAttribute("authenticatedUser");
		
		
		//Call the service to get cart items for the user
		Map<String, Object> cartItems = cartService.getCartItems(user.getUserId());
		return ResponseEntity.ok(cartItems);
		
	}
	
	@GetMapping("/items/count")
	public ResponseEntity<Integer> getCartItemCount(
	        HttpServletRequest request) {

	    User user = (User) request.getAttribute("authenticatedUser");

	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    int count = cartService.countTotalItems(user.getUserId());

	    return ResponseEntity.ok(count);
	}
	
	@PutMapping("/update")
	public ResponseEntity<Void> updateCartItemQuantity(@RequestBody Map<String, Object> request) {
		
		String username = (String) request.get("username");
		int productId = (int) request.get("productId");
		int quantity = (int) request.get("quantity");
		
		
		//Fetch the user using username
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
		
		//Update the cart item quantity
		cartService.updateCartItemQuantity(user.getUserId(),productId,quantity);
		return ResponseEntity.status(HttpStatus.OK).build();
		
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<Void> deleteCartItem(@RequestBody Map<String, Object> request) {
		
		String username = (String) request.get("username");
		int  productId = (int) request.get("productId");
		
		//Fetch the user using username
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("User not founf with username: " + username));
		
		//Delete the cart item
		cartService.deleteCartItem(user.getUserId(),productId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		
		
	}
	
	
	
	
}
