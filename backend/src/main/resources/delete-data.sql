-- Disable foreign key checks to avoid ordering issues
SET FOREIGN_KEY_CHECKS = 0;

-- Junction / Association tables
DELETE FROM timeslot_professor_association;
DELETE FROM defensemeeting_professor_association;

-- Time slots
DELETE FROM time_slot;

-- Thesis defense meetings
DELETE FROM thesis_defense_meeting;

-- Thesis forms
DELETE FROM thesis_form;

-- Student subtypes (child tables of student)
DELETE FROM bachelor_student;
DELETE FROM master_student;
DELETE FROM phd_student;

-- Student (child of users, references professor)
DELETE FROM student;

-- Professor (child of users)
DELETE FROM professor;

-- Admin (child of users)
DELETE FROM admin;

-- Users
DELETE FROM users;

-- Field (child of department)
DELETE FROM field;

-- Department
DELETE FROM department;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
