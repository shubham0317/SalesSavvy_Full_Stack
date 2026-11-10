package com.projects.salessavvy_app.admin.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.projects.salessavvy_app.entities.Category;
import com.projects.salessavvy_app.entities.Product;
import com.projects.salessavvy_app.entities.ProductImage;
import com.projects.salessavvy_app.repositories.CartRepository;
import com.projects.salessavvy_app.repositories.CategoryRepository;
import com.projects.salessavvy_app.repositories.ProductImageRepository;
import com.projects.salessavvy_app.repositories.ProductRepository;

@Service
public class AdminProductService {

	    private final ProductRepository productRepository;
	    private final ProductImageRepository productImageRepository;
	    private final CategoryRepository categoryRepository;
	    private final CartRepository cartRepository;
	    
	    public AdminProductService(ProductRepository productRepository, ProductImageRepository productImageRepository, CategoryRepository categoryRepository, CartRepository cartRepository) {
	        this.productRepository = productRepository;
	        this.productImageRepository = productImageRepository;
	        this.categoryRepository = categoryRepository;
	        this.cartRepository = cartRepository;
	    }
	    
	    public Product addProductWithImage(String name, String description, Double price, Integer stock, Integer categoryId, String imageUrl) {
	        // Validate the category
	        Optional<Category> category = categoryRepository.findById(categoryId);
	        if (category.isEmpty()) {
	            throw new IllegalArgumentException("Invalid category ID");
	        }

	        // Create and save the product
	        Product product = new Product();
	        product.setName(name);
	        product.setDescription(description);
	        product.setPrice(BigDecimal.valueOf(price));
	        product.setStock(stock);
	        product.setCategory(category.get());
	        product.setCreatedAt(LocalDateTime.now());
	        product.setUpdatedAt(LocalDateTime.now());

	        Product savedProduct = productRepository.save(product);

	        // Create and save the product image
	        if (imageUrl != null && !imageUrl.isEmpty()) {
	            ProductImage productImage = new ProductImage();
	            productImage.setProduct(savedProduct);
	            productImage.setImageUrl(imageUrl);
	            productImageRepository.save(productImage);
	        } else {
	            throw new IllegalArgumentException("Product image URL cannot be empty");
	        }

	        return savedProduct;
	    }
        
	    public void deleteProduct(Integer productId) {
	        // Check if the product exists
	        if (!productRepository.existsById(productId)) {
	            throw new IllegalArgumentException("Product not found");
	        }

	        // 1. Delete cart items referencing this product
	        cartRepository.deleteAllCartItemsByProductId(productId);

	        // 2. Delete product images
	        productImageRepository.deleteByProductId(productId);

	        // 3. Finally delete the product
	        productRepository.deleteById(productId);
	    }
	
}
