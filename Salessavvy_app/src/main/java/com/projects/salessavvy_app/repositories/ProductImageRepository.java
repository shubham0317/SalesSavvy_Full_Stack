
package com.projects.salessavvy_app.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.projects.salessavvy_app.entities.ProductImage;

public interface ProductImageRepository extends JpaRepository <ProductImage,Integer>{

	List<ProductImage> findByProduct_ProductId(Integer productId);
	
	
	
	@Query("DELETE FROM ProductImage pi WHERE pi.product.productId = :productId")
	void deleteByProductId(Integer productId);
	
}
