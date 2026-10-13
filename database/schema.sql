CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30),
  course VARCHAR(100),
  department VARCHAR(120),
  year_of_study INT,
  status VARCHAR(20) DEFAULT 'Active'
);

-- Spring Boot JPA can create/update the table automatically.
-- This SQL file is included if you prefer to create the database manually.
