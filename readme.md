# 🛒 Sales Savvy

Sales Savvy is a full-stack e-commerce web application designed for small and medium-sized businesses. The platform aims to provide separate experiences for administrators and customers, covering user management, product catalog management, shopping, order processing, and payment integration.

The project is being developed as the final application of a Java Full Stack development learning journey, combining backend development, frontend development, database management, authentication, and deployment concepts.

---

## 📌 Project Overview

Sales Savvy is designed to simplify online sales and improve customer interactions through a centralized e-commerce platform.

The application provides two primary user roles:

- **Admin** – Manage users, products, categories, orders, and payment-related information.
- **Customer** – Register, log in, browse products, manage a shopping cart, place orders, make payments, and track orders.

---

## 🎯 Objectives

The main objectives of Sales Savvy are:

- Build a complete full-stack e-commerce application.
- Implement separate Admin and Customer workflows.
- Develop REST APIs using Spring Boot.
- Build an interactive frontend using React.js.
- Store and manage application data using MySQL.
- Implement secure user authentication.
- Integrate a payment gateway.
- Containerize the application using Docker.
- Create a scalable structure that allows future features to be added easily.

---

## 👥 User Roles

### 👨‍💼 Admin

Admins are responsible for managing and monitoring the platform.

Planned Admin capabilities include:

- Create, update, and delete users.
- Assign roles such as Admin or Customer.
- Add, edit, and delete products.
- Manage product categories, tags, and images.
- View and manage customer orders.
- Approve, cancel, and ship orders.
- Update order statuses.
- View payment details.
- Generate sales and performance reports.

### 🛍️ Customer

Customers use the platform to browse and purchase products.

Planned Customer capabilities include:

- Create an account.
- Log in securely.
- Manage personal information.
- Browse products.
- Search products by name, category, or tags.
- View product details, price, and availability.
- Add products to the shopping cart.
- Update or remove cart items.
- Place orders.
- Select shipping options.
- Make online payments.
- View purchase history.
- Track order status.

---

## ✨ Planned Features

### 🔐 Authentication & User Management

- Separate Admin and Customer login workflows.
- Customer registration.
- Email verification.
- Secure password storage.
- JWT-based authentication.
- Role-based access control.
- User account management.

### 📦 Product Catalog Management

- Product creation and management.
- Product categories.
- Product tags.
- Product images.
- Product availability.
- Product search and filtering.
- Product details and pricing.

### 🛒 Shopping Cart

Customers will be able to:

- Add products to the cart.
- Remove products from the cart.
- Update product quantities.
- View product details.
- Calculate the total cart value.

### 📋 Order Management

Customers will be able to:

- Place orders.
- Select shipping options.
- View order history.
- Track order status.

Order statuses will include:

```text
Pending → Approved → Shipped → Delivered