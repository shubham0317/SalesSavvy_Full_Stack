package com.projects.salessavvy_app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projects.salessavvy_app.entities.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

}
