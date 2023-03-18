DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id: INT PRIMARY KEY NOT NULL,
    name: VARCHAR(30),
)

CREATE TABLE role (
    id: INT PRIMARY KEY,
    title: VARCHAR(30),
    salary: DECIMAL,
    department_id: INT,
    FOREIGN KEY (department_id) REFERENCES department(id) 
)

CREATE TABLE employee (
    id: INT PRIMARY KEY,
    first_name: VARCHAR(30),
    last_name: VARCHAR(30),
    role_id: INT, --reference role
    manager_id: INT, --reference the id of the manager employee
    FOREIGN KEY (role_id) REFERENCES role(id)
    FOREIGN KEY (manager_id) REFERENCES employee(id) -- null if the employee has no manager..
)