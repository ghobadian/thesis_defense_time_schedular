-- Insert Departments
INSERT INTO department (id, name) VALUES
                                      (1, 'Computer Science'),
                                      (2, 'Electrical Engineering'),
                                      (3, 'Mechanical Engineering'),
                                      (4, 'Mathematics'),
                                      (5, 'Physics');

-- Insert Fields
INSERT INTO field (id, name) VALUES
                                 (1, 'Software Engineering'),
                                 (2, 'Artificial Intelligence'),
                                 (3, 'Computer Networks'),
                                 (4, 'Database Systems'),
                                 (5, 'Cybersecurity'),
                                 (6, 'Machine Learning'),
                                 (7, 'Data Science'),
                                 (8, 'Computer Graphics');

-- Insert Users (base table)
-- Admins
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id) VALUES
                                                                                                (1, 'Ali', 'Ahmadi', 'ali.ahmadi@kntu.ac.ir', '09121234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
                                                                                                (2, 'Sara', 'Mohammadi', 'sara.mohammadi@kntu.ac.ir', '09122234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 2);

-- Professors
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id) VALUES
                                                                                                (3, 'Dr. Reza', 'Karimi', 'reza.karimi@kntu.ac.ir', '09123234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
                                                                                                (4, 'Dr. Maryam', 'Hosseini', 'maryam.hosseini@kntu.ac.ir', '09124234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
                                                                                                (5, 'Dr. Hassan', 'Najafi', 'hassan.najafi@kntu.ac.ir', '09125234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
                                                                                                (6, 'Dr. Zahra', 'Ebrahimi', 'zahra.ebrahimi@kntu.ac.ir', '09126234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 2),
                                                                                                (7, 'Dr. Mohammad', 'Rezaei', 'mohammad.rezaei@kntu.ac.ir', '09127234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 2),
                                                                                                (8, 'Dr. Fateme', 'Moradi', 'fateme.moradi@kntu.ac.ir', '09128234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 3);

-- Students
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id) VALUES
-- Bachelor Students
(9, 'Ahmad', 'Yousefi', 'ahmad.yousefi@student.kntu.ac.ir', '09351234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
(10, 'Neda', 'Rahmani', 'neda.rahmani@student.kntu.ac.ir', '09352234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
(11, 'Saeed', 'Ghorbani', 'saeed.ghorbani@student.kntu.ac.ir', '09353234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
-- Master Students
(12, 'Elham', 'Bagheri', 'elham.bagheri@student.kntu.ac.ir', '09361234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
(13, 'Mehdi', 'Akbari', 'mehdi.akbari@student.kntu.ac.ir', '09362234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 2),
(14, 'Nasim', 'Jafari', 'nasim.jafari@student.kntu.ac.ir', '09363234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
-- PhD Students
(15, 'Hossein', 'Shariati', 'hossein.shariati@student.kntu.ac.ir', '09371234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1),
(16, 'Parisa', 'Nazari', 'parisa.nazari@student.kntu.ac.ir', '09372234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 2),
(17, 'Vahid', 'Rostami', 'vahid.rostami@student.kntu.ac.ir', '09373234567', '$2a$10$8eqmHKB.AP5xrtgUYwymC.n80ewYKEBshcjONp41x6LJkDzQlrioa', 1);

-- Insert Admin records
INSERT INTO admin (id) VALUES (1), (2);

-- Insert Professor records
INSERT INTO professor (id, is_manager) VALUES
                                           (3, true),   -- Dr. Reza Karimi is a department manager
                                           (4, false),
                                           (5, false),
                                           (6, true),   -- Dr. Zahra Ebrahimi is a department manager
                                           (7, false),
                                           (8, false);

-- Insert Student records (base student table)
INSERT INTO student (id, student_number, instructor_id, field_id) VALUES
-- Bachelor Students
(9, '98001234', 3, 1),
(10, '98001235', 4, 2),
(11, '98001236', 5, 3),
-- Master Students
(12, '99002001', 3, 1),
(13, '99002002', 6, 4),
(14, '99002003', 4, 6),
-- PhD Students
(15, '97003001', 3, 2),
(16, '97003002', 6, 5),
(17, '97003003', 5, 7);

-- Insert Bachelor Student records
INSERT INTO bachelor_student (id) VALUES (9), (10), (11);

-- Insert Master Student records
INSERT INTO master_student (id) VALUES (12), (13), (14);

-- Insert PhD Student records
INSERT INTO phd_student (id) VALUES (15), (16), (17);

-- Insert Thesis records
INSERT INTO thesis (id, title, abstract_text, author_id, supervisor_id) VALUES
                                                                            (1, 'Development of a Smart Home System Using IoT', 'This thesis presents the design and implementation of a comprehensive smart home system...', 9, 3),
                                                                            (2, 'Machine Learning Approaches for Network Intrusion Detection', 'This research explores various machine learning algorithms for detecting network intrusions...', 12, 3),
                                                                            (3, 'Advanced Data Mining Techniques for Big Data Analytics', 'This dissertation investigates novel data mining techniques specifically designed for big data environments...', 15, 3);

-- Insert Thesis Form records
INSERT INTO thesis_form (id, student_id, instructor_id, state, submission_date, field_id, student_type) VALUES
                                                                                                            (1, 9, 3, 'DRAFT', '2024-01-15', 1, 'BACHELOR'),
                                                                                                            (2, 12, 3, 'INSTRUCTOR_APPROVED', '2024-01-20', 1, 'MASTER'),
                                                                                                            (3, 15, 3, 'MANAGER_APPROVED', '2024-01-10', 2, 'PHD');

-- Insert suggested juries for thesis forms
INSERT INTO thesis_form_suggested_juries (thesis_form_id, professor_id) VALUES
                                                                            (1, 4), (1, 5),
                                                                            (2, 4), (2, 5), (2, 7),
                                                                            (3, 4), (3, 5), (3, 6), (3, 7);

-- Insert Thesis Defense Meetings
INSERT INTO thesis_defense_meeting (id, thesis_form_id, selected_date, selected_time) VALUES
                                                                                          (1, 3, '2024-02-15', 'PERIOD_7_30_9_00'),
                                                                                          (2, 2, '2024-02-20', 'PERIOD_9_00_10_30');

-- Insert juries for defense meetings
INSERT INTO defense_meeting_juries (meeting_id, professor_id) VALUES
                                                                  (1, 3), (1, 4), (1, 5), (1, 6),
                                                                  (2, 3), (2, 4), (2, 7);

-- Insert Time Slots
INSERT INTO time_slot (id, date, time_period) VALUES
                                                                      (1, '2024-02-15', 'PERIOD_7_30_9_00'),
                                                                      (2, '2024-02-15', 'PERIOD_9_00_10_30'),
                                                                      (3, '2024-02-16', 'PERIOD_10_30_12_00'),
                                                                      (4, '2024-02-20', 'PERIOD_7_30_9_00'),
                                                                      (5, '2024-02-20', 'PERIOD_15_30_17_00'),
                                                                      (6, '2024-02-21', 'PERIOD_7_30_9_00');

-- Insert available professors for time slots
INSERT INTO time_slot_available_professors (time_slot_id, professor_id) VALUES
                                                                            (1, 3), (1, 4), (1, 5), (1, 6),
                                                                            (2, 3), (2, 4), (2, 5),
                                                                            (3, 3), (3, 5), (3, 6),
                                                                            (4, 3), (4, 4), (4, 7),
                                                                            (5, 3), (5, 4), (5, 7),
                                                                            (6, 3), (6, 7);

-- Set auto-increment starting values for next insertions
ALTER TABLE department AUTO_INCREMENT = 6;
ALTER TABLE field AUTO_INCREMENT = 9;
ALTER TABLE users AUTO_INCREMENT = 18;
ALTER TABLE thesis AUTO_INCREMENT = 4;
ALTER TABLE thesis_form AUTO_INCREMENT = 4;
ALTER TABLE thesis_defense_meeting AUTO_INCREMENT = 3;
ALTER TABLE time_slot AUTO_INCREMENT = 7;
