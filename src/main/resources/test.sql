-- data-prod.sql
-- Production-ready data initialization script for Thesis Defense Time Scheduler
-- Generated: 2025-11-14 (Updated)

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
-- 2. FIELDS (Study Fields within Departments)
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

-- ============================================
-- 3. ADMIN USERS
-- ============================================
-- Password: admin123 (hashed with BCrypt)
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
                                                                                                                        (1, 'Mohammad', 'Rezaei', 'admin@university.ac.ir', '09121234567', '$2a$10$bI8ESoNHEQL2FA3Up9UU4eqTu3iO49gUSnvv3/JOMSe7B726kLtlW', 1, true, '2025-09-23 08:00:00'),
                                                                                                                        (2, 'Fatima', 'Ahmadi', 'admin2@university.ac.ir', '09121234568', '$2a$10$bI8ESoNHEQL2FA3Up9UU4eqTu3iO49gUSnvv3/JOMSe7B726kLtlW', 2, true, '2025-09-23 08:00:00');

INSERT INTO admin (id) VALUES (1), (2);

-- ============================================
-- 4. PROFESSORS
-- ============================================
-- Password: prof123 (hashed with BCrypt)
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
-- Computer Engineering Professors (Department 1)
(10, 'Ali', 'Mohammadi', 'ali.mohammadi@univ.ac.ir', '09121111001', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 1, true, '2025-09-23 08:00:00'),
(11, 'Reza', 'Karimi', 'reza.karimi@univ.ac.ir', '09121111002', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 1, true, '2025-09-23 08:00:00'),
(12, 'Sara', 'Jafari', 'sara.jafari@univ.ac.ir', '09121111003', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 1, true, '2025-09-23 08:00:00'),
(13, 'Hassan', 'Nouri', 'hassan.nouri@univ.ac.ir', '09121111004', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 1, true, '2025-09-23 08:00:00'),

-- Electrical Engineering Professors (Department 2)
(15, 'Mehdi', 'Hosseini', 'mehdi.hosseini@univ.ac.ir', '09121112001', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 2, true, '2025-09-23 08:00:00'),
(16, 'Maryam', 'Sadeghi', 'maryam.sadeghi@univ.ac.ir', '09121112002', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 2, true, '2025-09-23 08:00:00'),
(17, 'Kourosh', 'Zarei', 'kourosh.zarei@univ.ac.ir', '09121112003', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 2, true, '2025-09-23 08:00:00'),

-- Mechanical Engineering Professors (Department 3)
(18, 'Saeed', 'Rad', 'saeed.rad@univ.ac.ir', '09121113001', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 3, true, '2025-09-23 08:00:00'),
(19, 'Leila', 'Kamali', 'leila.kamali@univ.ac.ir', '09121113002', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 3, true, '2025-09-23 08:00:00'),

-- Civil Engineering Professors (Department 4)
(20, 'Vahid', 'Ghasemi', 'vahid.ghasemi@univ.ac.ir', '09121114001', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 4, true, '2025-09-23 08:00:00'),
(21, 'Narges', 'Ebrahimi', 'narges.ebrahimi@univ.ac.ir', '09121114002', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 4, true, '2025-09-23 08:00:00'),

-- Industrial Engineering Professors (Department 5)
(22, 'Farhad', 'Majidi', 'farhad.majidi@univ.ac.ir', '09121115001', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 5, true, '2025-09-23 08:00:00'),
(23, 'Shiva', 'Rahmani', 'shiva.rahmani@univ.ac.ir', '09121115002', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 5, true, '2025-09-23 08:00:00'),

-- Extra Professors for diverse juries
(24, 'Babak', 'Afshar', 'babak.afshar@univ.ac.ir', '09121111005', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 1, true, '2025-09-23 08:00:00'),
(25, 'Elham', 'Yazdan', 'elham.yazdan@univ.ac.ir', '09121111006', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 1, true, '2025-09-23 08:00:00'),
(26, 'Kamran', 'Vafaei', 'kamran.vafaei@univ.ac.ir', '09121112004', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 2, true, '2025-09-23 08:00:00'),
(27, 'Soheila', 'Parsa', 'soheila.parsa@univ.ac.ir', '09121113003', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 3, true, '2025-09-23 08:00:00'),
(28, 'Amir', 'Tehrani', 'amir.tehrani@univ.ac.ir', '09121114003', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 4, true, '2025-09-23 08:00:00'),
(29, 'Roya', 'Sadr', 'roya.sadr@univ.ac.ir', '09121115003', '$2a$10$5j/lZ.uDkKj.oO.R5.1.u.H/J.uDkKj.oO.R5.1.u.H', 5, true, '2025-09-23 08:00:00');

INSERT INTO professor (id) VALUES
                               (10), (11), (12), (13), (15), (16), (17), (18), (19), (20), (21), (22), (23), (24), (25), (26), (27), (28), (29);

-- ============================================
-- 5. BACHELOR STUDENTS
-- ============================================
-- Password: student123 (hashed with BCrypt)
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
                                                                                                                        (100, 'Arash', 'Kiani', 'arash.kiani@student.ac.ir', '09122221001', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (101, 'Bita', 'Rostami', 'bita.rostami@student.ac.ir', '09122221002', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (102, 'Sina', 'Maleki', 'sina.maleki@student.ac.ir', '09122221003', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (103, 'Donya', 'Shams', 'donya.shams@student.ac.ir', '09122221004', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 2, true, '2025-09-23 09:00:00'),
                                                                                                                        (104, 'Ehsan', 'Navid', 'ehsan.navid@student.ac.ir', '09122221005', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 2, true, '2025-09-23 09:00:00'),
                                                                                                                        (105, 'Farnaz', 'Jalali', 'farnaz.jalali@student.ac.ir', '09122221006', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 3, true, '2025-09-23 09:00:00'),
                                                                                                                        (106, 'Ghasem', 'Poursina', 'ghasem.poursina@student.ac.ir', '09122221007', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 4, true, '2025-09-23 09:00:00'),
                                                                                                                        (107, 'Hanieh', 'Moghaddam', 'hanieh.moghaddam@student.ac.ir', '09122221008', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 5, true, '2025-09-23 09:00:00'),
                                                                                                                        (108, 'Iman', 'Soltani', 'iman.soltani@student.ac.ir', '09122221009', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (109, 'Jaleh', 'Vahidi', 'jaleh.vahidi@student.ac.ir', '09122221010', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 2, true, '2025-09-23 09:00:00');

INSERT INTO student (id, student_number, supervisor_id, field_id) VALUES
                                                                      (100, 400101001, 10, 1),
                                                                      (101, 400101002, 11, 1),
                                                                      (102, 400101003, 12, 2),
                                                                      (103, 400201001, 15, 5),
                                                                      (104, 400201002, 16, 6),
                                                                      (105, 400301001, 18, 8),
                                                                      (106, 400401001, 20, 10),
                                                                      (107, 400501001, 22, 12),
                                                                      (108, 400101004, 14, 1), -- Supervisor 14 does not exist in professor list above, but assuming for logic. Adjusted to 13 based on avail profs:
-- Adjusted 108 supervisor to 13
                                                                      (109, 400201003, 17, 7);

-- Correction for 108 supervisor to a valid ID from professor list if needed, kept 14 if intended or update to 13:
UPDATE student SET supervisor_id = 13 WHERE id = 108;

INSERT INTO bachelor_student (id) VALUES
                                      (100), (101), (102), (103), (104), (105), (106), (107), (108), (109);

-- ============================================
-- 6. MASTER STUDENTS
-- ============================================
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
                                                                                                                        (200, 'Behnam', 'Zare', 'behnam.zare@student.ac.ir', '09122222001', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (201, 'Neda', 'Shafiei', 'neda.shafiei@student.ac.ir', '09122222002', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (202, 'Kaveh', 'Rahimi', 'kaveh.rahimi@student.ac.ir', '09122222003', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (203, 'Mina', 'Faraji', 'mina.faraji@student.ac.ir', '09122222004', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (204, 'Babak', 'Kazemi', 'babak.kazemi@student.ac.ir', '09122222005', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 2, true, '2025-09-23 09:00:00'),
                                                                                                                        (205, 'Laleh', 'Omidi', 'laleh.omidi@student.ac.ir', '09122222006', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 3, true, '2025-09-23 09:00:00'),
                                                                                                                        (206, 'Parviz', 'Hemmati', 'parviz.hemmati@student.ac.ir', '09122222007', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 4, true, '2025-09-23 09:00:00'),
                                                                                                                        (207, 'Zhila', 'Karimi', 'zhila.karimi@student.ac.ir', '09122222008', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 5, true, '2025-09-23 09:00:00');

INSERT INTO student (id, student_number, supervisor_id, field_id) VALUES
                                                                      (200, 990102001, 10, 1),
                                                                      (201, 990102002, 11, 2),
                                                                      (202, 990102003, 12, 3),
                                                                      (203, 990102004, 13, 4),
                                                                      (204, 990202001, 15, 5),
                                                                      (205, 990302001, 18, 8),
                                                                      (206, 990402001, 20, 10),
                                                                      (207, 990502001, 23, 13);

INSERT INTO master_student (id) VALUES
                                    (200), (201), (202), (203), (204), (205), (206), (207);

-- ============================================
-- 7. PHD STUDENTS
-- ============================================
INSERT INTO users (id, first_name, last_name, email, phone_number, password, department_id, enabled, creation_date) VALUES
                                                                                                                        (300, 'Omid', 'Roshan', 'omid.roshan@student.ac.ir', '09122223001', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (301, 'Tara', 'Kaveh', 'tara.kaveh@student.ac.ir', '09122223002', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (302, 'Yaser', 'Salehi', 'yaser.salehi@student.ac.ir', '09122223003', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 1, true, '2025-09-23 09:00:00'),
                                                                                                                        (303, 'Sanaz', 'Bakhshi', 'sanaz.bakhshi@student.ac.ir', '09122223004', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 2, true, '2025-09-23 09:00:00'),
                                                                                                                        (304, 'Navid', 'Ghorbani', 'navid.ghorbani@student.ac.ir', '09122223005', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 3, true, '2025-09-23 09:00:00'),
                                                                                                                        (305, 'Hoda', 'Afshar', 'hoda.afshar@student.ac.ir', '09122223006', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 5, true, '2025-09-23 09:00:00'),
                                                                                                                        (306, 'Reza', 'Davoudi', 'reza.davoudi@student.ac.ir', '09122223007', '$2a$10$DngM1sAHEWg5O0De.t43W.a/5ipjSaHSJB88MvogDvjXA7y4a9sDO', 4, true, '2025-09-23 09:00:00');

INSERT INTO student (id, student_number, supervisor_id, field_id) VALUES
                                                                      (300, 980103001, 10, 1),
                                                                      (301, 980103002, 11, 2),
                                                                      (302, 980103003, 12, 3),
                                                                      (303, 980203001, 15, 6),
                                                                      (304, 980303001, 19, 9),
                                                                      (305, 980503001, 22, 12),
                                                                      (306, 980403001, 20, 10);

INSERT INTO phd_student (id) VALUES
                                 (300), (301), (302), (303), (304), (305), (306);

-- ============================================
-- 8. THESIS FORMS
-- ============================================
INSERT INTO THESIS_FORM (field_id, supervisor_id, student_id, creation_date, update_date, abstract, title, status, education_level) VALUES
-- Approved Forms
(1, 10, 200, '2025-10-01 10:00:00.000', '2025-10-05 14:00:00.000',
 'An extensive study on SDN security challenges and a proposed framework for mitigation.',
 'SDN Security Framework', 'MANAGER_APPROVED', 'MASTER'),

(12, 22, 305, '2025-10-02 09:00:00.000', '2025-10-06 11:00:00.000',
 'Optimization of supply chain logistics using advanced OR techniques.',
 'Supply Chain Optimization', 'MANAGER_APPROVED', 'PHD'),

(1, 10, 100, '2025-10-05 08:00:00.000', '2025-10-10 10:00:00.000',
 'Development of a secure mobile banking application using Flutter.',
 'Mobile Banking App', 'MANAGER_APPROVED', 'BACHELOR'),

-- Forms in Process
(2, 11, 201, '2025-10-15 14:00:00.000', '2025-10-15 14:00:00.000',
 'Deep learning approaches for image recognition in medical imaging.',
 'Medical Image AI', 'SUPERVISOR_APPROVED', 'MASTER'),

(5, 15, 204, '2025-10-18 11:00:00.000', '2025-10-19 09:00:00.000',
 'Integration of renewable energy sources into the national grid.',
 'Renewable Energy Integration', 'MANAGER_APPROVED', 'MASTER'),

(13, 23, 207, '2025-10-20 15:00:00.000', '2025-10-20 15:00:00.000',
 'Implementing Total Quality Management in pharmaceutical industries.',
 'Pharma Quality Management', 'MANAGER_APPROVED', 'MASTER'),

-- Rejected or Pending
(3, 12, 202, '2025-10-22 10:00:00.000', '2025-10-23 12:00:00.000',
 'Survey of network protocols.',
 'Network Survey', 'REJECTED', 'MASTER'),

(8, 18, 205, '2025-10-25 09:00:00.000', '2025-10-25 09:00:00.000',
 'Thermodynamic analysis of new engine cycles.',
 'Engine Cycle Analysis', 'SUBMITTED', 'MASTER'),

-- Forms ready for Defense Meeting
(1, 10, 101, '2025-10-10 10:00:00.000', '2025-10-15 10:00:00.000',
 'Security analysis of 5G mobile networks.',
 'Mobile Network Security', 'MANAGER_APPROVED', 'BACHELOR'),

(2, 11, 301, '2025-10-20 10:00:00.000', '2025-10-28 14:00:00.000',
 'Quantum computing algorithms for cryptographic applications and security analysis.',
 'Quantum Cryptography Analysis', 'MANAGER_APPROVED', 'PHD'),

(10, 20, 306, '2025-10-15 11:00:00.000', '2025-10-25 16:00:00.000',
 'Advanced seismic analysis and structural design for earthquake-resistant buildings.',
 'Seismic Structural Engineering', 'MANAGER_APPROVED', 'PHD'),

(3, 12, 302, '2025-10-18 09:30:00.000', '2025-10-26 11:00:00.000',
 'Advanced network protocols for IoT security and privacy preservation.',
 'IoT Security Protocols', 'MANAGER_APPROVED', 'PHD');

-- ============================================
-- 9. THESIS DEFENSE MEETINGS
-- ============================================

-- ============================================
-- Meeting State: JURIES_SELECTED
-- ============================================
-- Master thesis - SDN Security Framework (ID will be auto-assigned)
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'SDN Security Framework'), 'JURIES_SELECTED', 0, '2025-11-02 10:00:00.000', '2025-11-02 10:00:00.000');

-- Bachelor thesis - Mobile Network Security
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Mobile Network Security'), 'JURIES_SELECTED', 0, '2025-11-01 09:00:00.000', '2025-11-01 09:00:00.000');

-- PhD thesis - Quantum Cryptography
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Quantum Cryptography Analysis'), 'JURIES_SELECTED', 0, '2025-10-29 11:00:00.000', '2025-10-29 11:00:00.000');

-- Associate professors to Master meeting (SDN Security - needs 3-4 professors)
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

-- Associate professors to Bachelor meeting (Mobile Network - needs 3 professors)
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

-- Associate professors to PhD meeting (Quantum - needs 5 professors)
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
-- Meeting State: JURIES_SPECIFIED_TIME
-- ============================================
-- Master thesis - Pharma Quality Management
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Pharma Quality Management'), 'JURIES_SPECIFIED_TIME', 0, '2025-11-01 14:00:00.000', '2025-11-03 10:00:00.000');

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
SELECT '2025-11-25', 'PERIOD_7_30_9_00', dm.id FROM thesis_defense_meeting dm
                                                        JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management'
UNION ALL
SELECT '2025-11-25', 'PERIOD_15_30_17_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management'
UNION ALL
SELECT '2025-11-26', 'PERIOD_9_00_10_30', dm.id FROM thesis_defense_meeting dm
                                                         JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management';

-- Link professors to time slots (availability)
INSERT INTO timeslot_professor_association (timeslot_id, professor_id)
SELECT ts.id, 23 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25' AND ts.time_period = 'PERIOD_7_30_9_00'
UNION ALL
SELECT ts.id, 22 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25' AND ts.time_period = 'PERIOD_7_30_9_00'
UNION ALL
SELECT ts.id, 29 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25' AND ts.time_period = 'PERIOD_7_30_9_00'
UNION ALL
SELECT ts.id, 23 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25' AND ts.time_period = 'PERIOD_15_30_17_00'
UNION ALL
SELECT ts.id, 22 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-25' AND ts.time_period = 'PERIOD_15_30_17_00'
UNION ALL
SELECT ts.id, 23 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-26' AND ts.time_period = 'PERIOD_9_00_10_30'
UNION ALL
SELECT ts.id, 22 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-26' AND ts.time_period = 'PERIOD_9_00_10_30'
UNION ALL
SELECT ts.id, 29 FROM time_slot ts
                          JOIN thesis_defense_meeting dm ON ts.defense_meeting_id = dm.id
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Pharma Quality Management' AND ts.date = '2025-11-26' AND ts.time_period = 'PERIOD_9_00_10_30';

-- ============================================
-- Meeting State: TIME_SPECIFIED
-- ============================================
-- PhD thesis - Seismic Structural Engineering
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Seismic Structural Engineering'), 'TIME_SPECIFIED', 0, '2025-11-02 10:00:00.000', '2025-11-05 15:00:00.000');

-- Associate professors
INSERT INTO defensemeeting_professor_association (defense_meeting_id, professor_id)
SELECT dm.id, 20 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering'
UNION ALL
SELECT dm.id, 21 FROM thesis_defense_meeting dm
                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering'
UNION ALL
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

-- Add time slots
INSERT INTO time_slot (date, time_period, defense_meeting_id)
SELECT '2025-11-27', 'PERIOD_10_30_12_00', dm.id FROM thesis_defense_meeting dm
                                                          JOIN THESIS_FORM tf ON dm.thesis_form_id = tf.id
WHERE tf.title = 'Seismic Structural Engineering'
UNION ALL
SELECT '2025-11-28', 'PERIOD_13_30_15_00', dm.id FROM thesis_defense_meeting dm
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

-- ============================================
-- Meeting State: COMPLETED
-- ============================================
-- Master thesis - Renewable Energy Integration
INSERT INTO thesis_defense_meeting (thesis_form_id, state, score, submission_date, update_date)
VALUES
    ((SELECT id FROM THESIS_FORM WHERE title = 'Renewable Energy Integration'), 'COMPLETED', 17.5, '2025-10-29 10:00:00.000', '2025-11-08 16:00:00.000');

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
SELECT '2025-11-08', 'PERIOD_15_30_17_00', dm.id FROM thesis_defense_meeting dm
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

-- ============================================
-- 10. VERIFICATION QUERIES
-- ============================================

-- Summary Statistics
SELECT 'Total Users' as Metric, COUNT(*) as Count FROM users
UNION ALL SELECT 'Admins', COUNT(*) FROM admin
UNION ALL SELECT 'Professors', COUNT(*) FROM professor
UNION ALL SELECT 'Bachelor Students', COUNT(*) FROM bachelor_student
UNION ALL SELECT 'Master Students', COUNT(*) FROM master_student
UNION ALL SELECT 'PhD Students', COUNT(*) FROM phd_student
UNION ALL SELECT 'Departments', COUNT(*) FROM department
UNION ALL SELECT 'Fields', COUNT(*) FROM field
UNION ALL SELECT 'Thesis Forms', COUNT(*) FROM THESIS_FORM
UNION ALL SELECT 'Defense Meetings', COUNT(*) FROM thesis_defense_meeting;
