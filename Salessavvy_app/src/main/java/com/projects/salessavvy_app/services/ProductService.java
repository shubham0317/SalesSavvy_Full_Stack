package com.projects.salessavvy_app.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projects.salessavvy_app.entities.Category;
import com.projects.salessavvy_app.entities.Product;
import com.projects.salessavvy_app.entities.ProductImage;
import com.projects.salessavvy_app.repositories.CategoryRepository;
import com.projects.salessavvy_app.repositories.ProductImageRepository;
import com.projects.salessavvy_app.repositories.ProductRepository;

@Service
public class ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private ProductImageRepository productImageRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	public List<Product> getProductByCategory(String categoryName) {
		
		if(categoryName != null && !categoryName.isEmpty()) {
			Optional<Category> categoryOpt = categoryRepository.findByCategoryName(categoryName);
			  
			  if(categoryOpt.isPresent()) {
				  Category category = categoryOpt.get();
				  return productRepository.findByCategory_CategoryId(category.getCategoryId());
			  } else {
				  throw new RuntimeException("Category not found");
			  }
		} else {
			return productRepository.findAll();
		}
	}
	
	public List<String> getProductImage(Integer productId) {
		List<ProductImage> productImages = productImageRepository.findByProduct_ProductId(productId);
		List <String> imageUrls = new ArrayList<>();
		
		for(ProductImage image: productImages) {
			imageUrls.add(image.getImageUrl());
		}
		return imageUrls;
	}
	
}
