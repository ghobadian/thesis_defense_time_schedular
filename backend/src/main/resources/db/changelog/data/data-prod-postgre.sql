-- data-prod.sql
-- Production-ready data initialization script for Thesis Defense Time Scheduler
-- Generated: 2025-11-24 (Updated - Comprehensive Test Coverage)

-- ============================================
-- 1. DEPARTMENTS
-- ============================================
INSERT INTO department (id, name) VALUES
                                      (1, 'Computer Engineering'),
                                      (2, 'Electrical Engineering'),
                                      (3, 'Mechanical Engineering'),
                                      (4, 'Civil Engineering'),
                                      (5, 'Industrial Engineering');

-- ============================================
-- 2. FIELDS (Study Fields within AdminDepartmentsPage)
-- ============================================
INSERT INTO field (id, name, department_id, active) VALUES
-- Computer Engineering Fields
(1, 'Software Engineering', 1, true),
(2, 'Artificial Intelligence', 1, true),
(3, 'Computer Networks', 1, true),
(4, 'Database Systems', 1, true),

-- Electrical Engineering Fields
(5, 'Power Systems', 2, true),
(6, 'Electronics', 2, true),
(7, 'Telecommunications', 2, true),

-- Mechanical Engineering Fields
(8, 'Thermodynamics', 3, true),
(9, 'Manufacturing', 3, true),

-- Civil Engineering Fields
(10, 'Structural Engineering', 4, true),
(11, 'Transportation Engineering', 4, true),

-- Industrial Engineering Fields
(12, 'Operations Research', 5, true),
(13, 'Quality Management', 5, true);

-- Inactive field for testing
INSERT INTO field (id, name, department_id, active) VALUES
    (14, 'Legacy Computer Graphics', 1, false);

-- ============================================
-- 3. ADMIN USERS
-- ============================================
-- Password: admin123 (hashed with BCrypt)
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
(1, 'Mohammad', 'Rezaei', 'admin@university.ac.ir', '09121234567', '$2a$10$LZLBvCmFxTicp0mKCc2rVutt.LS.dGUBDYGzxL3bdcXLz9cYkWhOK', 1, true, '2025-09-23 08:00:00'),
(2, 'Fatima', 'Ahmadi', 'admin2@university.ac.ir', '09121234568', '$2a$10$LZLBvCmFxTicp0mKCc2rVutt.LS.dGUBDYGzxL3bdcXLz9cYkWhOK', 2, true, '2025-09-23 08:00:00'),
(3, 'Ali', 'Karimi', 'admin3@university.ac.ir', '09121234569', '$2a$10$LZLBvCmFxTicp0mKCc2rVutt.LS.dGUBDYGzxL3bdcXLz9cYkWhOK', 3, true, '2025-09-23 08:00:00'),
(4, 'Sara', 'Hosseini', 'admin4@university.ac.ir', '09121234570', '$2a$10$LZLBvCmFxTicp0mKCc2rVutt.LS.dGUBDYGzxL3bdcXLz9cYkWhOK', 4, true, '2025-09-23 08:00:00');

INSERT INTO admin (id) VALUES (1), (2), (3), (4);

-- ============================================
-- 4. PROFESSORS (30 professors across all departments)
-- ============================================
-- Password: prof123 (hashed with BCrypt)
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
-- Computer Engineering Professors (10-19)
(10, 'Reza', 'Mohammadi', 'r.mohammadi@university.ac.ir', '09131234567', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),
(11, 'Maryam', 'Alavi', 'm.alavi@university.ac.ir', '09131234568', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),
(12, 'Hassan', 'Rahimi', 'h.rahimi@university.ac.ir', '09131234569', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),
(13, 'Zahra', 'Jamali', 'z.jamali@university.ac.ir', '09131234570', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),
(14, 'Mehdi', 'Naseri', 'm.naseri@university.ac.ir', '09131234571', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),

-- Electrical Engineering Professors (15-19)
(15, 'Ahmad', 'Mousavi', 'a.mousavi@university.ac.ir', '09131234572', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 2, true, '2025-09-23 09:00:00'),
(16, 'Leila', 'Salehi', 'l.salehi@university.ac.ir', '09131234573', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 2, true, '2025-09-23 09:00:00'),
(17, 'Hossein', 'Abbasi', 'h.abbasi@university.ac.ir', '09131234574', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 2, true, '2025-09-23 09:00:00'),

-- Mechanical Engineering Professors (18-21)
(18, 'Parisa', 'Rahmani', 'p.rahmani@university.ac.ir', '09131234575', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 3, true, '2025-09-23 09:00:00'),
(19, 'Javad', 'Kazemi', 'j.kazemi@university.ac.ir', '09131234576', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 3, true, '2025-09-23 09:00:00'),

-- Civil Engineering Professors (20-23)
(20, 'Neda', 'Hashemi', 'n.hashemi@university.ac.ir', '09131234577', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 4, true, '2025-09-23 09:00:00'),
(21, 'Saeed', 'Moradi', 's.moradi@university.ac.ir', '09131234578', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 4, true, '2025-09-23 09:00:00'),

-- Industrial Engineering Professors (22-29)
(22, 'Somayeh', 'Bagheri', 's.bagheri@university.ac.ir', '09131234579', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 5, true, '2025-09-23 09:00:00'),
(23, 'Kamran', 'Azizi', 'k.azizi@university.ac.ir', '09131234580', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 5, true, '2025-09-23 09:00:00'),

-- Additional professors for jury panels (24-29)
(24, 'Amir', 'Sadeghi', 'a.sadeghi@university.ac.ir', '09131234581', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),
(25, 'Narges', 'Tavakoli', 'n.tavakoli@university.ac.ir', '09131234582', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, true, '2025-09-23 09:00:00'),
(26, 'Davood', 'Yousefi', 'd.yousefi@university.ac.ir', '09131234583', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 2, true, '2025-09-23 09:00:00'),
(27, 'Fatemeh', 'Akbari', 'f.akbari@university.ac.ir', '09131234584', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 3, true, '2025-09-23 09:00:00'),
(28, 'Behzad', 'Farahani', 'b.farahani@university.ac.ir', '09131234585', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 4, true, '2025-09-23 09:00:00'),
(29, 'Mina', 'Ghorbani', 'm.ghorbani@university.ac.ir', '09131234586', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 5, true, '2025-09-23 09:00:00'),

-- Disabled professor for testing
(30, 'Disabled', 'Professor', 'disabled@university.ac.ir', '09131234587', '$2a$10$wyi4g4s2S6z7zvs3INH3cu6wwS12/7wbyYvsNGlkp4RiL8ZQG3o/2', 1, false, '2025-09-23 09:00:00');

INSERT INTO professor (id, is_manager) VALUES
-- Managers (can approve PhD theses)
(10, true),  -- Computer Engineering Manager
(15, true),  -- Electrical Engineering Manager
(18, true),  -- Mechanical Engineering Manager
(20, true),  -- Civil Engineering Manager
(22, true),  -- Industrial Engineering Manager

-- Regular professors
(11, false), (12, false), (13, false), (14, false),
(16, false), (17, false),
(19, false),
(21, false),
(23, false), (24, false), (25, false), (26, false),
(27, false), (28, false), (29, false),
(30, false);

-- ============================================
-- 5. BACHELOR STUDENTS
-- ============================================
-- Password: student123 (hashed with BCrypt)
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date, field_id) VALUES
-- Computer Engineering Students (100-105)
(100, 'Ali', 'Nejati', 'a.nejati@student.university.ac.ir', '09141234567', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-25 10:00:00', 1),
(101, 'Mahsa', 'Amini', 'm.amini@student.university.ac.ir', '09141234568', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-25 10:00:00', 2),
(102, 'Hamed', 'Rostami', 'h.rostami@student.university.ac.ir', '09141234569', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-25 10:00:00', 2),

-- Electrical Engineering Students (103-105)
(103, 'Negar', 'Shams', 'n.shams@student.university.ac.ir', '09141234570', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-25 10:00:00', 5),
(104, 'Amin', 'Zarei', 'a.zarei@student.university.ac.ir', '09141234571', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-25 10:00:00', 6),

-- Civil Engineering Students (106-107)
(106, 'Elham', 'Sharifi', 'e.sharifi@student.university.ac.ir', '09141234572', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 4, true, '2025-09-25 10:00:00', 10),

-- Industrial Engineering Students (107-109)
(107, 'Pouya', 'Forouzan', 'p.forouzan@student.university.ac.ir', '09141234573', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 5, true, '2025-09-25 10:00:00', 12),

-- Telecommunications (108-109)
(108, 'Niloofar', 'Ebrahimi', 'n.ebrahimi@student.university.ac.ir', '09141234574', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-25 10:00:00', 1),
(109, 'Omid', 'Ghafari', 'o.ghafari@student.university.ac.ir', '09141234575', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-25 10:00:00', 7),

-- Additional bachelor students (110-115)
(110, 'Sanaz', 'Mirzaei', 's.mirzaei@student.university.ac.ir', '09141234576', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-25 10:00:00', 4),
(111, 'Arash', 'Soltani', 'a.soltani@student.university.ac.ir', '09141234577', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-25 10:00:00', 5),
(112, 'Golnaz', 'Maleki', 'g.maleki@student.university.ac.ir', '09141234578', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 3, true, '2025-09-25 10:00:00', 8),
(113, 'Sina', 'Asadi', 's.asadi@student.university.ac.ir', '09141234579', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 4, true, '2025-09-25 10:00:00', 11),
(114, 'Yasmin', 'Sadri', 'y.sadri@student.university.ac.ir', '09141234580', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 5, true, '2025-09-25 10:00:00', 13),
(115, 'Ramin', 'Jafari', 'r.jafari@student.university.ac.ir', '09141234581', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-25 10:00:00', 3);

INSERT INTO student (id, student_number, instructor_id) VALUES
                                                                      (100, 401101001, 10),
                                                                      (101, 401101002, 11),
                                                                      (102, 401101003, 11),
                                                                      (103, 401201001, 15),
                                                                      (104, 401201002, 16),
                                                                      (106, 401401001, 20),
                                                                      (107, 401501001, 22),
                                                                      (108, 401101004, 14),
                                                                      (109, 401201003, 17),
                                                                      (110, 401101005, 12),
                                                                      (111, 401201004, 15),
                                                                      (112, 401301001, 18),
                                                                      (113, 401401002, 21),
                                                                      (114, 401501002, 23),
                                                                      (115, 401101006, 13);

INSERT INTO bachelor_student (id) VALUES
                                      (100), (101), (102), (103), (104), (106), (107), (108), (109),
                                      (110), (111), (112), (113), (114), (115);

-- ============================================
-- 6. MASTER STUDENTS
-- ============================================
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date, field_id) VALUES
-- Computer Engineering Master Students (200-203)
(200, 'Pedram', 'Nasiri', 'p.nasiri@student.university.ac.ir', '09151234567', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-24 10:00:00', 1),
(201, 'Setareh', 'Faraji', 's.faraji@student.university.ac.ir', '09151234568', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-24 10:00:00', 2),
(202, 'Ehsan', 'Zare', 'e.zare@student.university.ac.ir', '09151234569', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-24 10:00:00', 3),
(203, 'Nadia', 'Zahedi', 'n.zahedi@student.university.ac.ir', '09151234570', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-24 10:00:00', 1),

-- Electrical Engineering Master Students (204-207)
(204, 'Navid', 'Kiani', 'n.kiani@student.university.ac.ir', '09151234571', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-24 10:00:00', 5),
(205, 'Shiva', 'Ramezani', 's.ramezani@student.university.ac.ir', '09151234572', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-24 10:00:00', 7),
(206, 'Erfan', 'Hosseinpour', 'e.hosseinpour@student.university.ac.ir', '09151234573', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 3, true, '2025-09-24 10:00:00', 8),
(207, 'Kimia', 'Nouri', 'k.nouri@student.university.ac.ir', '09151234574', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-24 10:00:00', 6),

-- Mechanical/Civil/Industrial Master Students (208-214)
(208, 'Milad', 'Rezapour', 'm.rezapour@student.university.ac.ir', '09151234575', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 3, true, '2025-09-24 10:00:00', 9),
(209, 'Rozita', 'Safavi', 'r.safavi@student.university.ac.ir', '09151234576', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 4, true, '2025-09-24 10:00:00', 11),
(210, 'Babak', 'Mohseni', 'b.mohseni@student.university.ac.ir', '09151234577', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 5, true, '2025-09-24 10:00:00', 13),
(211, 'Dorsa', 'Taghavi', 'd.taghavi@student.university.ac.ir', '09151234578', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-24 10:00:00', 4),
(212, 'Kaveh', 'Parvizi', 'k.parvizi@student.university.ac.ir', '09151234579', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-24 10:00:00', 5),
(213, 'Sepideh', 'Lotfi', 's.lotfi@student.university.ac.ir', '09151234580', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 3, true, '2025-09-24 10:00:00', 8),
(214, 'Morteza', 'Habibi', 'm.habibi@student.university.ac.ir', '09151234581', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 4, true, '2025-09-24 10:00:00', 10);

INSERT INTO student (id, student_number, instructor_id) VALUES
                                                                      (200, 402101001, 10),
                                                                      (201, 402101002, 11),
                                                                      (202, 402101003, 12),
                                                                      (203, 402101004, 13),
                                                                      (204, 402201001, 15),
                                                                      (205, 402201002, 16),
                                                                      (206, 402301001, 18),
                                                                      (207, 402201003, 17),
                                                                      (208, 402301002, 19),
                                                                      (209, 402401001, 21),
                                                                      (210, 402501001, 23),
                                                                      (211, 402101005, 13),
                                                                      (212, 402201004, 15),
                                                                      (213, 402301003, 18),
                                                                      (214, 402401002, 20);

INSERT INTO master_student (id) VALUES
                                    (200), (201), (202), (203), (204), (205), (206), (207),
                                    (208), (209), (210), (211), (212), (213), (214);

-- ============================================
-- 7. PHD STUDENTS
-- ============================================
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date, field_id) VALUES
-- PhD Students (300-310)
(300, 'Mojtaba', 'Esmaili', 'm.esmaili@student.university.ac.ir', '09161234567', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-23 10:00:00', 2),
(301, 'Vida', 'Daneshvar', 'v.daneshvar@student.university.ac.ir', '09161234568', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-23 10:00:00', 1),
(302, 'Kourosh', 'Khalili', 'k.khalili@student.university.ac.ir', '09161234569', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-23 10:00:00', 3),
(303, 'Azadeh', 'Ghasemi', 'a.ghasemi@student.university.ac.ir', '09161234570', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-23 10:00:00', 7),
(304, 'Vahid', 'Bahrami', 'v.bahrami@student.university.ac.ir', '09161234571', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-23 10:00:00', 5),
(305, 'Mahdieh', 'Taheri', 'm.taheri@student.university.ac.ir', '09161234572', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 3, true, '2025-09-23 10:00:00', 8),
(306, 'Saeid', 'Moslemi', 's.moslemi@student.university.ac.ir', '09161234573', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 4, true, '2025-09-23 10:00:00', 10),
(307, 'Elaheh', 'Norouzi', 'e.norouzi@student.university.ac.ir', '09161234574', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 5, true, '2025-09-23 10:00:00', 12),
(308, 'Dariush', 'Saberi', 'd.saberi@student.university.ac.ir', '09161234575', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 1, true, '2025-09-23 10:00:00', 4),
(309, 'Banafsheh', 'Ahmadian', 'b.ahmadian@student.university.ac.ir', '09161234576', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 2, true, '2025-09-23 10:00:00', 6),
(310, 'Farhad', 'Shakeri', 'f.shakeri@student.university.ac.ir', '09161234577', '$2a$10$Ji8MmZJ0ESOoNy3TmOb5pemnC1.LHyPSAWVQfdX9QXADL8s2Pz5Wa', 3, true, '2025-09-23 10:00:00', 9);

INSERT INTO student (id, student_number, instructor_id) VALUES
                                                                      (300, 403101001, 10),
                                                                      (301, 403101002, 11),
                                                                      (302, 403101003, 13),
                                                                      (303, 403201001, 15),
                                                                      (304, 403201002, 16),
                                                                      (305, 403301001, 18),
                                                                      (306, 403401001, 20),
                                                                      (307, 403501001, 22),
                                                                      (308, 403101004, 12),
                                                                      (309, 403201003, 17),
                                                                      (310, 403301002, 19);

INSERT INTO phd_student (id) VALUES
                                 (300), (301), (302), (303), (304), (305), (306), (307), (308), (309), (310);

-- ============================================
-- 8. THESIS FORMS - COMPREHENSIVE SCENARIOS
-- ============================================

-- ============================================
-- Scenario 1: SUBMITTED Forms (Pending Instructor Review)
-- ============================================
INSERT INTO THESIS_FORM (FIELD_ID, INSTRUCTOR_ID, STUDENT_ID, SUBMISSION_DATE, UPDATE_DATE, ABSTRACT_TEXT, TITLE, STATE, STUDENT_TYPE)
VALUES
    -- Bachelor submissions (5 cases)
    (1, 14, 108, '2025-11-12 09:30:00.000', '2025-11-12 09:30:00.000',
     'Deep learning approach for sentiment analysis using transformer-based models and attention mechanisms.',
     'Sentiment Analysis Using Deep Learning', 'SUBMITTED', 'BACHELOR'),

    (5, 15, 103, '2025-11-11 14:20:00.000', '2025-11-11 14:20:00.000',
     'Optimization of power grid stability using machine learning predictive models for renewable energy integration.',
     'Smart Grid Stability Optimization', 'SUBMITTED', 'BACHELOR'),

    (4, 12, 110, '2025-11-13 10:15:00.000', '2025-11-13 10:15:00.000',
     'Design and implementation of a distributed database management system for big data applications.',
     'Distributed Database System Design', 'SUBMITTED', 'BACHELOR'),

    (8, 18, 112, '2025-11-14 08:45:00.000', '2025-11-14 08:45:00.000',
     'Thermodynamic analysis of heat exchanger efficiency in industrial applications.',
     'Heat Exchanger Optimization', 'SUBMITTED', 'BACHELOR'),

    (11, 21, 113, '2025-11-15 11:30:00.000', '2025-11-15 11:30:00.000',
     'Traffic flow modeling and simulation for urban road networks.',
     'Urban Traffic Modeling System', 'SUBMITTED', 'BACHELOR'),

    -- Master submissions (5 cases)
    (7, 16, 205, '2025-11-10 11:00:00.000', '2025-11-10 11:00:00.000',
     'Novel antenna design for 5G telecommunications with improved bandwidth and efficiency.',
     '5G Antenna Design and Implementation', 'SUBMITTED', 'MASTER'),

    (9, 19, 208, '2025-11-09 08:30:00.000', '2025-11-09 08:30:00.000',
     'Manufacturing process optimization using lean principles and automation.',
     'Lean Manufacturing Implementation', 'SUBMITTED', 'MASTER'),

    (1, 10, 200, '2025-11-08 14:00:00.000', '2025-11-08 14:00:00.000',
     'Advanced software architecture patterns for microservices-based systems.',
     'Microservices Architecture Design', 'SUBMITTED', 'MASTER'),

    (5, 15, 212, '2025-11-11 16:20:00.000', '2025-11-11 16:20:00.000',
     'Smart power distribution systems with IoT integration and real-time monitoring.',
     'IoT-Based Smart Power Grid', 'SUBMITTED', 'MASTER'),

    (8, 18, 213, '2025-11-12 09:00:00.000', '2025-11-12 09:00:00.000',
     'Computational fluid dynamics simulation for turbomachinery applications.',
     'CFD Analysis in Turbomachinery', 'SUBMITTED', 'MASTER'),

    -- PhD submissions (5 cases)
    (12, 22, 307, '2025-11-08 10:00:00.000', '2025-11-08 10:00:00.000',
     'Multi-objective optimization for supply chain networks using genetic algorithms and simulation.',
     'Supply Chain Network Optimization', 'SUBMITTED', 'PHD'),

    (2, 11, 301, '2025-11-07 13:30:00.000', '2025-11-07 13:30:00.000',
     'Advanced machine learning techniques for predictive maintenance in industrial systems.',
     'AI-Based Predictive Maintenance', 'SUBMITTED', 'PHD'),

    (6, 17, 309, '2025-11-09 10:45:00.000', '2025-11-09 10:45:00.000',
     'Advanced electronic circuit design for low-power embedded systems using novel materials.',
     'Low-Power Electronics Design', 'SUBMITTED', 'PHD'),

    (9, 19, 310, '2025-11-10 14:20:00.000', '2025-11-10 14:20:00.000',
     'Advanced manufacturing techniques using additive manufacturing and topology optimization.',
     'Additive Manufacturing Optimization', 'SUBMITTED', 'PHD'),

    (4, 13, 308, '2025-11-11 11:00:00.000', '2025-11-11 11:00:00.000',
     'Blockchain-based distributed database systems for secure data management.',
     'Blockchain Database Architecture', 'SUBMITTED', 'PHD');

-- ============================================
-- Scenario 2: INSTRUCTOR_APPROVED Forms (Pending Admin Review)
-- ============================================
INSERT INTO THESIS_FORM (FIELD_ID, INSTRUCTOR_ID, STUDENT_ID, SUBMISSION_DATE, UPDATE_DATE, ABSTRACT_TEXT, TITLE, STATE, STUDENT_TYPE)
VALUES
    -- Bachelor instructor approved (4 cases)
    (2, 11, 101, '2025-11-05 10:00:00.000', '2025-11-07 14:00:00.000',
     'Machine learning algorithms for image recognition using convolutional neural networks.',
     'Image Recognition with CNNs', 'INSTRUCTOR_APPROVED', 'BACHELOR'),

    (6, 16, 104, '2025-11-04 14:30:00.000', '2025-11-06 16:00:00.000',
     'Design and implementation of low-power electronic circuits for IoT devices.',
     'Low-Power IoT Electronics', 'INSTRUCTOR_APPROVED', 'BACHELOR'),

    (13, 23, 114, '2025-11-06 09:00:00.000', '2025-11-08 10:30:00.000',
     'Quality control systems implementation in manufacturing environments.',
     'Manufacturing Quality Control', 'INSTRUCTOR_APPROVED', 'BACHELOR'),

    (3, 13, 115, '2025-11-07 11:15:00.000', '2025-11-09 13:45:00.000',
     'Network security protocols for cloud-based infrastructure.',
     'Cloud Network Security Protocols', 'INSTRUCTOR_APPROVED', 'BACHELOR'),

    -- Master instructor approved (4 cases)
    (2, 11, 201, '2025-11-04 09:00:00.000', '2025-11-06 14:30:00.000',
     'Reinforcement learning for autonomous systems navigation and decision making.',
     'RL-Based Autonomous Navigation', 'INSTRUCTOR_APPROVED', 'MASTER'),

    (6, 17, 207, '2025-11-03 13:00:00.000', '2025-11-05 15:00:00.000',
     'Advanced signal processing techniques for wireless communication systems.',
     'Advanced Signal Processing', 'INSTRUCTOR_APPROVED', 'MASTER'),

    (4, 13, 211, '2025-11-03 09:45:00.000', '2025-11-06 15:30:00.000',
     'Database optimization techniques for large-scale distributed systems with NoSQL integration.',
     'Distributed Database Optimization', 'INSTRUCTOR_APPROVED', 'MASTER'),

    (10, 20, 214, '2025-11-05 10:30:00.000', '2025-11-07 12:00:00.000',
     'Structural health monitoring using smart sensors and machine learning algorithms.',
     'Smart Structural Health Monitoring', 'INSTRUCTOR_APPROVED', 'MASTER'),

    -- PhD instructor approved (3 cases)
    (7, 17, 303, '2025-11-02 11:00:00.000', '2025-11-05 14:00:00.000',
     'Advanced telecommunications protocols for next-generation wireless networks with AI integration.',
     'AI-Enhanced Wireless Protocols', 'INSTRUCTOR_APPROVED', 'PHD'),

    (10, 20, 306, '2025-11-01 09:30:00.000', '2025-11-04 11:30:00.000',
     'Seismic design optimization using machine learning and finite element analysis.',
     'ML-Based Seismic Design', 'INSTRUCTOR_APPROVED', 'PHD'),

    (5, 15, 304, '2025-11-03 10:00:00.000', '2025-11-06 13:00:00.000',
     'Advanced power system optimization using artificial intelligence and renewable energy integration.',
     'AI Power System Optimization', 'INSTRUCTOR_APPROVED', 'PHD');

-- ============================================
-- Scenario 3: ADMIN_APPROVED Forms (Master/Bachelor ready, PhD waiting for manager)
-- ============================================
INSERT INTO THESIS_FORM (FIELD_ID, INSTRUCTOR_ID, STUDENT_ID, SUBMISSION_DATE, UPDATE_DATE, ABSTRACT_TEXT, TITLE, STATE, STUDENT_TYPE)
VALUES
    -- Bachelor admin approved (3 cases - ready for defense meeting)
    (10, 20, 106, '2025-11-02 10:00:00.000', '2025-11-05 11:00:00.000',
     'Seismic analysis software for earthquake-resistant building design.',
     'Seismic Analysis Tool', 'ADMIN_APPROVED', 'BACHELOR'),

    (12, 22, 107, '2025-11-01 14:00:00.000', '2025-11-04 16:00:00.000',
     'Operations research models for warehouse layout optimization.',
     'Warehouse Layout Optimization', 'ADMIN_APPROVED', 'BACHELOR'),

    (5, 15, 111, '2025-11-03 08:30:00.000', '2025-11-06 10:00:00.000',
     'Power system reliability analysis using probabilistic methods.',
     'Power System Reliability Analysis', 'ADMIN_APPROVED', 'BACHELOR'),

    -- Master admin approved (3 cases - ready for defense meeting)
    (8, 18, 206, '2025-10-31 09:00:00.000', '2025-11-03 10:00:00.000',
     'Thermal analysis of internal combustion engines using finite element methods.',
     'Engine Thermal Analysis', 'ADMIN_APPROVED', 'MASTER'),

    (11, 21, 209, '2025-10-30 13:00:00.000', '2025-11-02 15:00:00.000',
     'Traffic flow optimization in urban transportation networks using machine learning.',
     'Urban Traffic Flow Optimization', 'ADMIN_APPROVED', 'MASTER'),

    (1, 10, 203, '2025-11-01 10:00:00.000', '2025-11-04 12:00:00.000',
     'Software testing automation framework for continuous integration pipelines.',
     'CI/CD Testing Framework', 'ADMIN_APPROVED', 'MASTER'),

    -- PhD admin approved (3 cases - waiting for manager approval)
    (8, 18, 305, '2025-11-01 13:45:00.000', '2025-11-04 09:00:00.000',
     'Advanced computational fluid dynamics simulation for turbine blade optimization in high-temperature environments.',
     'CFD Analysis for Turbine Design', 'ADMIN_APPROVED', 'PHD'),

    (1, 10, 300, '2025-10-28 11:00:00.000', '2025-11-01 14:00:00.000',
     'Quantum machine learning algorithms for cryptographic applications.',
     'Quantum ML Cryptography', 'ADMIN_APPROVED', 'PHD'),

    (3, 13, 302, '2025-10-29 10:30:00.000', '2025-11-02 12:30:00.000',
     'Advanced network security architectures for critical infrastructure protection.',
     'Critical Infrastructure Network Security', 'ADMIN_APPROVED', 'PHD');

-- ============================================
-- Scenario 4: MANAGER_APPROVED Forms (Ready for Defense Scheduling)
-- ============================================
INSERT INTO THESIS_FORM (FIELD_ID, INSTRUCTOR_ID, STUDENT_ID, SUBMISSION_DATE, UPDATE_DATE, ABSTRACT_TEXT, TITLE, STATE, STUDENT_TYPE)
VALUES
    -- Bachelor manager approved (3 cases - can create defense meeting)
    (7, 17, 109, '2025-10-25 10:00:00.000', '2025-10-30 12:00:00.000',
     'Network security framework for mobile telecommunications.',
     'Mobile Network Security', 'MANAGER_APPROVED', 'BACHELOR'),

    (2, 11, 102, '2025-10-24 09:00:00.000', '2025-10-29 11:00:00.000',
     'Computer vision system for automated quality control in manufacturing.',
     'Automated Quality Control System', 'MANAGER_APPROVED', 'BACHELOR'),

    (1, 10, 100, '2025-10-26 14:00:00.000', '2025-10-31 16:00:00.000',
     'Web application security testing framework using automated penetration testing.',
     'Web Security Testing Framework', 'MANAGER_APPROVED', 'BACHELOR'),

    -- Master manager approved (4 cases - can create defense meeting)
    (3, 12, 202, '2025-10-28 09:00:00.000', '2025-11-01 10:00:00.000',
     'Implementation of SDN-based network security framework with intrusion detection capabilities.',
     'SDN Security Framework', 'MANAGER_APPROVED', 'MASTER'),

    (13, 23, 210, '2025-10-26 13:00:00.000', '2025-10-31 15:00:00.000',
     'Quality management systems for pharmaceutical manufacturing.',
     'Pharma Quality Management', 'MANAGER_APPROVED', 'MASTER'),

    (5, 15, 204, '2025-10-23 08:00:00.000', '2025-10-28 10:00:00.000',
     'Renewable energy integration in power distribution systems.',
     'Renewable Energy Integration', 'MANAGER_APPROVED', 'MASTER'),

    (2, 11, 200, '2025-10-22 10:30:00.000', '2025-10-27 13:00:00.000',
     'Deep reinforcement learning for robotic manipulation and control.',
     'Deep RL for Robotics', 'MANAGER_APPROVED', 'MASTER'),

    -- PhD manager approved (4 cases - can create defense meeting)
    (1, 11, 301, '2025-10-20 10:00:00.000', '2025-10-28 14:00:00.000',
     'Quantum computing algorithms for cryptographic applications and security analysis.',
     'Quantum Cryptography Analysis', 'MANAGER_APPROVED', 'PHD'),

    (10, 19, 306, '2025-10-15 11:00:00.000', '2025-10-25 16:00:00.000',
     'Advanced seismic analysis and structural design for earthquake-resistant buildings.',
     'Seismic Structural Engineering', 'MANAGER_APPROVED', 'PHD'),

    (3, 12, 302, '2025-10-18 09:30:00.000', '2025-10-26 11:00:00.000',
     'Advanced network protocols for IoT security and privacy preservation.',
     'IoT Security Protocols', 'MANAGER_APPROVED', 'PHD'),

    (12, 22, 307, '2025-10-19 14:00:00.000', '2025-10-27 16:30:00.000',
     'Advanced optimization algorithms for large-scale supply chain management.',
     'Supply Chain Optimization Algorithms', 'MANAGER_APPROVED', 'PHD');

-- ============================================
-- 9. THESIS DEFENSE MEETINGS
-- ============================================

-- ============================================
-- Meeting State: JURIES_SELECTED (3 meetings - one for each degree)
-- ============================================

-- Master thesis - SDN Security Framework
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'SDN Security Framework'), 'JURIES_SELECTED', '2025-11-02 10:00:00.000', '2025-11-02 10:00:00.000');

-- Associate professors to Master meeting (3-4 professors required)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 12 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'SDN Security Framework'
UNION ALL
SELECT dm.id, 13 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'SDN Security Framework'
UNION ALL
SELECT dm.id, 24 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'SDN Security Framework';

-- Bachelor thesis - Mobile Network Security
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Mobile Network Security'), 'JURIES_SELECTED', '2025-11-01 09:00:00.000', '2025-11-01 09:00:00.000');

-- Associate professors to Bachelor meeting (3 professors required)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 17 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Mobile Network Security'
UNION ALL
SELECT dm.id, 16 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Mobile Network Security'
UNION ALL
SELECT dm.id, 26 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Mobile Network Security';

-- PhD thesis - Quantum Cryptography
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Quantum Cryptography Analysis'), 'JURIES_SELECTED', '2025-10-29 11:00:00.000', '2025-10-29 11:00:00.000');

-- Associate professors to PhD meeting (5 professors required)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 11 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Quantum Cryptography Analysis'
UNION ALL
SELECT dm.id, 10 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Quantum Cryptography Analysis'
UNION ALL
SELECT dm.id, 13 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Quantum Cryptography Analysis'
UNION ALL
SELECT dm.id, 24 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Quantum Cryptography Analysis'
UNION ALL
SELECT dm.id, 25 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Quantum Cryptography Analysis';

-- ============================================
-- Meeting State: JURIES_SPECIFIED_TIME (2 meetings)
-- ============================================

-- Master thesis - Pharma Quality Management
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Pharma Quality Management'), 'JURIES_SPECIFIED_TIME', '2025-11-01 14:00:00.000', '2025-11-03 10:00:00.000');

-- Associate professors
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 23 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management'
UNION ALL
SELECT dm.id, 22 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management'
UNION ALL
SELECT dm.id, 29 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management';

-- Add time slots
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-25'::date, 'PERIOD_7_30_9_00', dm.id FROM thesis_defense_meeting dm
                                                        JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management'
UNION ALL
SELECT '2025-11-25'::date, 'PERIOD_15_30_17_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management'
UNION ALL
SELECT '2025-11-26'::date, 'PERIOD_9_00_10_30', dm.id FROM thesis_defense_meeting dm
                                                         JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management';

-- Link professors to time slots (availability)
INSERT INTO timeslot_professor_association (timeslot_id, professor_id)
SELECT ts.id, 23 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25'::date AND ts.time_period = 'PERIOD_7_30_9_00'
UNION ALL
SELECT ts.id, 22 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25'::date AND ts.time_period = 'PERIOD_7_30_9_00'
UNION ALL
SELECT ts.id, 29 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25'::date AND ts.time_period = 'PERIOD_7_30_9_00'
UNION ALL
SELECT ts.id, 23 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25'::date AND ts.time_period = 'PERIOD_15_30_17_00'
UNION ALL
SELECT ts.id, 22 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25'::date AND ts.time_period = 'PERIOD_15_30_17_00'
UNION ALL
SELECT ts.id, 23 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-26'::date AND ts.time_period = 'PERIOD_9_00_10_30'
UNION ALL
SELECT ts.id, 22 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-26'::date AND ts.time_period = 'PERIOD_9_00_10_30'
UNION ALL
SELECT ts.id, 29 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-26'::date AND ts.time_period = 'PERIOD_9_00_10_30';

-- PhD thesis - IoT Security Protocols
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'IoT Security Protocols'), 'JURIES_SELECTED', '2025-10-27 09:00:00.000'::date, '2025-10-30 11:00:00.000'::date);

-- Associate professors (5 for PhD)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 12 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols'
UNION ALL
SELECT dm.id, 13 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols'
UNION ALL
SELECT dm.id, 14 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols'
UNION ALL
SELECT dm.id, 24 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols'
UNION ALL
SELECT dm.id, 25 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols';

-- Add time slots for IoT Security
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-28'::date, 'PERIOD_10_30_12_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols'
UNION ALL
SELECT '2025-11-28'::date, 'PERIOD_13_30_15_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols'
UNION ALL
SELECT '2025-11-29', 'PERIOD_7_30_9_00', dm.id FROM thesis_defense_meeting dm
                                                        JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols';

-- Link professors to IoT Security time slots
INSERT INTO timeslot_professor_association (timeslot_id, professor_id)
SELECT ts.id, 12 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_10_30_12_00'
UNION ALL
SELECT ts.id, 13 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_10_30_12_00'
UNION ALL
SELECT ts.id, 14 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_10_30_12_00'
UNION ALL
SELECT ts.id, 24 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_10_30_12_00'
UNION ALL
SELECT ts.id, 12 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_13_30_15_00'
UNION ALL
SELECT ts.id, 13 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_13_30_15_00'
UNION ALL
SELECT ts.id, 24 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_13_30_15_00'
UNION ALL
SELECT ts.id, 25 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'IoT Security Protocols' AND ts.date = '2025-11-28'::date AND ts.time_period = 'PERIOD_13_30_15_00';

-- ============================================
-- Meeting State: SCHEDULED (2 meetings)
-- ============================================

-- PhD thesis - Seismic Structural Engineering
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date, location)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Seismic Structural Engineering'), 'SCHEDULED', '2025-10-26 09:00:00.000'::date, '2025-11-05 15:00:00.000'::date, 'Room 207');

-- Associate professors (5 for PhD)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 28 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering'
UNION ALL
SELECT dm.id, 18 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering'
UNION ALL
SELECT dm.id, 19 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering';

-- Insert selected time slot
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-20'::date, 'PERIOD_13_30_15_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering';

-- Update meeting with selected time slot
UPDATE thesis_defense_meeting
SET selected_time_slot_id = (
    SELECT ts.id FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
    WHERE tf.title = 'Seismic Structural Engineering'
    )
WHERE thesis_form_id = (SELECT id FROM THESIS_FORM WHERE title = 'Seismic Structural Engineering');

-- Bachelor thesis - Automated Quality Control System
INSERT INTO thesis_defense_meeting (thesis_form_id, state, submission_date, update_date, location)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Automated Quality Control System'), 'SCHEDULED', '2025-11-01 10:00:00.000', '2025-11-06 14:00:00.000', 'Room 321');

-- Associate professors (3 for Bachelor)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 11 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Automated Quality Control System'
UNION ALL
SELECT dm.id, 14 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Automated Quality Control System'
UNION ALL
SELECT dm.id, 24 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Automated Quality Control System';

-- Insert selected time slot
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-22'::date, 'PERIOD_9_00_10_30', dm.id FROM thesis_defense_meeting dm
                                                         JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Automated Quality Control System';

-- Update meeting with selected time slot
UPDATE thesis_defense_meeting
SET selected_time_slot_id = (
    SELECT ts.id FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
    WHERE tf.title = 'Automated Quality Control System'
    )
WHERE thesis_form_id = (SELECT id FROM THESIS_FORM WHERE title = 'Automated Quality Control System');

-- ============================================
-- Meeting State: COMPLETED (3 meetings)
-- ============================================

-- Master thesis - Renewable Energy Integration
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date, location)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Renewable Energy Integration'), 'COMPLETED', 17.5, '2025-10-29 10:00:00.000'::date, '2025-11-08 16:00:00.000'::date, 'Room 123');

-- Associate professors
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 15 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Renewable Energy Integration'
UNION ALL
SELECT dm.id, 16 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Renewable Energy Integration'
UNION ALL
SELECT dm.id, 17 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Renewable Energy Integration'
UNION ALL
SELECT dm.id, 26 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Renewable Energy Integration';

-- Insert completed time slot
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-08'::date, 'PERIOD_15_30_17_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Renewable Energy Integration';

-- Update with selected time
UPDATE thesis_defense_meeting
SET selected_time_slot_id = (
    SELECT ts.id FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
    WHERE tf.title = 'Renewable Energy Integration'
    )
WHERE thesis_form_id = (SELECT id FROM THESIS_FORM WHERE title = 'Renewable Energy Integration');

-- Master thesis - Deep RL for Robotics
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date, location)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Deep RL for Robotics'), 'COMPLETED', 18.0, '2025-10-28 09:00:00.000'::date, '2025-11-07 15:30:00.000'::date, 'Room 123');

-- Associate professors
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 10 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Deep RL for Robotics'
UNION ALL
SELECT dm.id, 11 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Deep RL for Robotics'
UNION ALL
SELECT dm.id, 25 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Deep RL for Robotics';

-- Insert completed time slot
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-07'::date, 'PERIOD_13_30_15_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Deep RL for Robotics';

-- Update with selected time
UPDATE thesis_defense_meeting
SET selected_time_slot_id = (
    SELECT ts.id FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
    WHERE tf.title = 'Deep RL for Robotics'
    )
WHERE thesis_form_id = (SELECT id FROM THESIS_FORM WHERE title = 'Deep RL for Robotics');

-- PhD thesis - Supply Chain Optimization Algorithms
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date, location)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Supply Chain Optimization Algorithms'), 'COMPLETED', 19.0, '2025-10-28 08:00:00.000'::date, '2025-11-10 17:00:00.000'::date, 'Room 123');

-- Associate professors (5 for PhD)
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 22 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Supply Chain Optimization Algorithms'
UNION ALL
SELECT dm.id, 23 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Supply Chain Optimization Algorithms'
UNION ALL
SELECT dm.id, 29 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Supply Chain Optimization Algorithms'
UNION ALL
SELECT dm.id, 10 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Supply Chain Optimization Algorithms'
UNION ALL
SELECT dm.id, 11 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Supply Chain Optimization Algorithms';

-- Insert completed time slot
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-10'::date, 'PERIOD_15_30_17_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Supply Chain Optimization Algorithms';

-- Update with selected time
UPDATE thesis_defense_meeting
SET selected_time_slot_id = (
    SELECT ts.id FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
    WHERE tf.title = 'Supply Chain Optimization Algorithms'
    )
WHERE thesis_form_id = (SELECT id FROM THESIS_FORM WHERE title = 'Supply Chain Optimization Algorithms');

-- ============================================
-- 10. ADDITIONAL TEST SCENARIOS
-- ============================================

-- Edge case: Student with multiple thesis submissions (testing rejection/resubmission)
INSERT INTO THESIS_FORM (FIELD_ID, INSTRUCTOR_ID, STUDENT_ID, SUBMISSION_DATE, UPDATE_DATE, ABSTRACT_TEXT, TITLE, STATE, STUDENT_TYPE)
VALUES
    (1, 10, 100, '2025-10-15 10:00:00.000'::date, '2025-10-15 10:00:00.000'::date,
     'Initial submission - rejected and resubmitted.',
     'Web Security Testing Framework v1', 'SUBMITTED', 'BACHELOR');

-- Edge case: Professor with maximum jury participation (testing availability)
-- Already covered through existing meetings

-- ============================================
-- 11. VERIFICATION QUERIES
-- ============================================

-- Summary Statistics
SELECT 'Total Users' as Metric, COUNT(*) as Count FROM users
UNION ALL SELECT 'Admins', COUNT(*) FROM admin
UNION ALL SELECT 'Professors', COUNT(*) FROM professor
UNION ALL SELECT 'Manager Professors', COUNT(*) FROM professor WHERE is_manager = true
UNION ALL SELECT 'Bachelor Students', COUNT(*) FROM bachelor_student
UNION ALL SELECT 'Master Students', COUNT(*) FROM master_student
UNION ALL SELECT 'PhD Students', COUNT(*) FROM phd_student
UNION ALL SELECT 'AdminDepartmentsPage', COUNT(*) FROM department
UNION ALL SELECT 'Fields', COUNT(*) FROM field
UNION ALL SELECT 'Active Fields', COUNT(*) FROM field WHERE active = true
UNION ALL SELECT 'Thesis Forms', COUNT(*) FROM THESIS_FORM
UNION ALL SELECT 'Defense Meetings', COUNT(*) FROM thesis_defense_meeting;

-- Thesis Forms by State
SELECT 'Thesis Forms by State:' as Summary, NULL as State, NULL as Count
UNION ALL
SELECT '', state, COUNT(*) FROM THESIS_FORM GROUP BY state
ORDER BY State;

-- Defense Meetings by State
SELECT 'Defense Meetings by State:' as Summary, NULL as State, NULL as Count
UNION ALL
SELECT '', state, COUNT(*) FROM thesis_defense_meeting GROUP BY state
ORDER BY State;

-- Thesis Forms by Student Type
SELECT 'Thesis Forms by Student Type:' as Summary, NULL as Type, NULL as Count
UNION ALL
SELECT '', student_type, COUNT(*) FROM THESIS_FORM GROUP BY student_type
ORDER BY Type;

-- Defense Meetings by Student Type
SELECT 'Defense Meetings by Student Type:' as Summary, NULL as Type, NULL as Count
UNION ALL
SELECT '', tf.student_type, COUNT(*)
FROM thesis_defense_meeting dm
         JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
GROUP BY tf.student_type
ORDER BY Type;

-- Professor Jury Participation Count
SELECT 'Professor Jury Participation:' as Summary, '' as Professor, NULL as Meetings
UNION ALL
SELECT '', CONCAT(u.first_name, ' ', u.last_name), COUNT(*)
FROM defensemeeting_professor_association dpa
         JOIN professor p ON dpa.professor_id = p.id
         JOIN users u ON p.id = u.id
GROUP BY p.id, u.first_name, u.last_name
ORDER BY Professor;

-- Time Slots Count
SELECT 'Time Slots:' as Summary, NULL as Date, NULL as Period, NULL as Count
UNION ALL
SELECT '', date, time_period, COUNT(*)
FROM time_slot
GROUP BY date, time_period
ORDER BY Date, Period;

-- Students per Instructor
-- SELECT 'Students per Instructor:' as Summary, '' as Instructor, NULL as Count
-- UNION ALL
-- SELECT '', CONCAT(u.first_name, ' ', u.last_name), COUNT(*)
-- FROM student s
--          JOIN professor p ON s.instructor_id = p.id
--          JOIN users u ON p.id = u.id
-- GROUP BY p.id, u.first_name, u.last_name
-- ORDER BY Instructor;

-- ============================================
-- 12. ADDITIONAL SAMPLE TIME SLOTS FOR TESTING
-- ============================================

-- Add some standalone time slots for future meeting scheduling tests
-- These are not yet associated with defense meetings
INSERT INTO time_slot (date, time_period, defense_meeting_id)
VALUES
    ('2025-11-30'::date, 'PERIOD_7_30_9_00', NULL),
    ('2025-11-30'::date, 'PERIOD_9_00_10_30', NULL),
    ('2025-11-30'::date, 'PERIOD_10_30_12_00', NULL),
    ('2025-12-01'::date, 'PERIOD_13_30_15_00', NULL),
    ('2025-12-01'::date, 'PERIOD_15_30_17_00', NULL);

-- ============================================
-- END OF PRODUCTION DATA INITIALIZATION
-- ============================================
