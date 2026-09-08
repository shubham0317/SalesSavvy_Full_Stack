package com.projects.salessavvy_app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projects.salessavvy_app.entities.Category;

public interface CategoryRepository extends JpaRepository <Category,Integer>{

	Optional<Category> findByCategoryName(String categoryName);
	
}
