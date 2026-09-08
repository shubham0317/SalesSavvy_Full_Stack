package com.projects.salessavvy_app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.projects.salessavvy_app.entities.Product;

public interface ProductRepository extends JpaRepository<Product,Integer> {

	
	List<Product> findByCategory_CategoryId(Integer categoryId);
	
	@Query("SELECT p.category.categoryName From Product p WHERE p.productId = :productId")
	String findByCategoryNameByProductId(int productId);
}