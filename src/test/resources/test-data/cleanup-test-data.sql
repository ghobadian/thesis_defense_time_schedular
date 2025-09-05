-- Clean all test data in reverse order of dependencies
DELETE FROM time_slot;
DELETE FROM thesis_defense_meeting;
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
