-- Clean existing data first
DELETE FROM thesis_defense_meeting;
DELETE FROM time_slot;
DELETE FROM thesis_form;
DELETE FROM student;
DELETE FROM professor;
DELETE FROM admin;
DELETE FROM users;
DELETE FROM field;
DELETE FROM department;

-- Reset auto-increment counters
ALTER TABLE department ALTER COLUMN id RESTART WITH 1;
ALTER TABLE field ALTER COLUMN id RESTART WITH 1;
ALTER TABLE users ALTER COLUMN id RESTART WITH 1;
ALTER TABLE thesis_form ALTER COLUMN id RESTART WITH 1;
ALTER TABLE thesis_defense_meeting ALTER COLUMN id RESTART WITH 1;
ALTER TABLE time_slot ALTER COLUMN id RESTART WITH 1;

-- Insert Departments
INSERT INTO department (id, name) VALUES (1, 'Computer Science');
INSERT INTO department (id, name) VALUES (2, 'Software Engineering');
INSERT INTO department (id, name) VALUES (3, 'Information Technology');

-- Insert Fields
INSERT INTO field (id, name) VALUES (1, 'Artificial Intelligence');
INSERT INTO field (id, name) VALUES (2, 'Software Architecture');
INSERT INTO field (id, name) VALUES (3, 'Data Science');

-- Insert Admin User
INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (1, 'admin@university.edu', '+989121234567', '$2a$10$slYQmyNdGzTn7ZLjXvqYaOPJH4Xk.57hW3EQQVMHaJn5J0h.jV/a6', 1, 'Admin', 'User');

INSERT INTO admin (id) VALUES (1);

-- Insert Professors
INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (2, 'prof1@university.edu', '+989121234568', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1, 'John', 'Smith');

INSERT INTO professor (id, is_manager) VALUES (2, false);

INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (3, 'prof2@university.edu', '+989121234569', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1, 'Jane', 'Doe');

INSERT INTO professor (id, is_manager) VALUES (3, false);

INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (4, 'manager@university.edu', '+989121234570', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1, 'Robert', 'Johnson');

INSERT INTO professor (id, is_manager) VALUES (4, true);

-- Insert Students
INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (5, 'student1@university.edu', '+989121234571', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1, 'Alice', 'Brown');

INSERT INTO student (id, student_number, instructor_id, field_id)
VALUES (5, '40011234', 2, 1);

INSERT INTO master_student (id)
VALUES (5);

INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (6, 'student2@university.edu', '+989121234572', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1, 'Bob', 'Wilson');

INSERT INTO student (id, student_number, instructor_id, field_id)
VALUES (6, '40011235', 3, 2);

INSERT INTO bachelor_student (id)
VALUES (6);

INSERT INTO users (id, email, phone_number, password, department_id, first_name, last_name)
VALUES (7, 'phd@university.edu', '+989121234573', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 2, 'Charlie', 'Davis');

INSERT INTO student (id, student_number, instructor_id, field_id)
VALUES (7, '40011236', 2, 3);

INSERT INTO phd_student (id)
VALUES (7);
