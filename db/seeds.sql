INSERT INTO department (name)
VALUES ("Leadership"),
       ("Security"),
       ("Finance"),
       ("Legal"),
       ("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", 100000.00, 1),
       ("Head of Security", 50000.00, 2),
       ("Accountant", 55000.00, 3),
       ("Jr. Accountant", 30000.00, 3),
       ("para-Legal", 25500.00, 4),
       ("Lawyer", 45000.00, 4),
       ("Software Engineering", 60000.00, 5);

INSERT INTO employee_db (first_name, last_name, role_id, manager_id)
VALUES ("Sehar", "Uzair", 1, null),
       ("Jackey", "chen", 2, 1),
       ("jeff", "McDonald", 3, null),
       ("Alana", "Roberts", 3, 3),
       ("Tom", "Bakar", 4, 5),
       ("Ruby", "Adems", 4, 1),
       ("bill", "gates", 5, 1);    