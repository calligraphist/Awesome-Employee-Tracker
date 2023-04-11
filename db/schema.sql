-- dropping the database --
DROP DATABASE IF EXISTS employee_db;
-- Createing the database --
CREATE DATABASE employee_db;
-- Useing the db --
USE employee_db;

--creating table department--
CREATE TABLE department(
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "name"  to hold department name --
  name VARCHAR(30) NOT NULL,
);
--creating table roles--
CREATE TABLE roles(
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "title" to hold role title --
  title VARCHAR(30) NOT NULL,
  -- Makes a string column called "salary"  to hold role salary --
  salary DECIMAL(10,2) NOT NULL,
  -- Creates a numeric column called "department id " to hold reference to department to whoich role belongs to --
  department_id INT NOT NULL,
);

--creating table employee--
CREATE TABLE employee(
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "first name" to hold employee first name --
  first_name VARCHAR(30) NOT NULL,
  -- Makes a string column called "first name" to hold employee last name --
  last_name VARCHAR(30) NOT NULL,
  -- Creates a numeric column called "role id" to hold reference to employee role--
  role_id INT NOT NULL,
  -- Creates a numeric column called "manager id" to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)--
  manager_id INT,
);

