-- Sample Data Insertion Script for Timetable Management System
-- ITUM University Timetable Management

USE timetable_db;

-- ============================================
-- 1. USERS TABLE - Insert sample users
-- ============================================
-- Note: Passwords are hashed using bcrypt (cost 10)
-- Default password for all users: "password123"

-- Admin Users
INSERT INTO users (name, email, password, role) VALUES
('System Administrator', 'admin@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'ADMIN'),
('IT Support Admin', 'itadmin@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'ADMIN');

-- Faculty Users (Instructors)
INSERT INTO users (name, email, password, role) VALUES
('Dr. John Smith', 'john.smith@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Prof. Sarah Johnson', 'sarah.johnson@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Dr. Michael Brown', 'michael.brown@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Prof. Emily Davis', 'emily.davis@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Dr. Robert Wilson', 'robert.wilson@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Prof. Lisa Anderson', 'lisa.anderson@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Dr. James Taylor', 'james.taylor@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY'),
('Prof. Maria Garcia', 'maria.garcia@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'FACULTY');

-- Student Users
INSERT INTO users (name, email, password, role) VALUES
('Student One', 'student1@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'STUDENT'),
('Student Two', 'student2@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'STUDENT'),
('Student Three', 'student3@itum.edu', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'STUDENT');

-- ============================================
-- 2. MODULES TABLE - Insert sample modules
-- ============================================
-- Note: module_leader_id references users.id (faculty members)
-- Assuming faculty IDs start from 3 (after 2 admins)

INSERT INTO modules (module_code, module_name, module_leader_id, credits) VALUES
('CS101', 'Introduction to Computer Science', 3, 3),
('CS201', 'Data Structures and Algorithms', 3, 4),
('CS301', 'Database Systems', 4, 4),
('CS302', 'Software Engineering', 4, 4),
('CS401', 'Web Development', 5, 3),
('CS402', 'Mobile Application Development', 5, 3),
('MATH101', 'Calculus I', 6, 3),
('MATH201', 'Linear Algebra', 6, 4),
('PHYS101', 'Physics Fundamentals', 7, 3),
('PHYS201', 'Advanced Physics', 7, 4),
('ENG101', 'English Composition', 8, 2),
('ENG201', 'Technical Writing', 8, 3),
('NET101', 'Computer Networks', 9, 4),
('NET201', 'Network Security', 9, 4),
('AI101', 'Introduction to Artificial Intelligence', 10, 4);

-- ============================================
-- 3. ROOMS TABLE - Insert sample rooms
-- ============================================

-- Lecture Halls
INSERT INTO rooms (room_name, room_type, capacity, building, floor) VALUES
('LH101', 'LECTURE_HALL', 100, 'Main Building', 1),
('LH102', 'LECTURE_HALL', 150, 'Main Building', 1),
('LH201', 'LECTURE_HALL', 200, 'Main Building', 2),
('LH202', 'LECTURE_HALL', 120, 'Main Building', 2),
('LH301', 'LECTURE_HALL', 80, 'Main Building', 3);

-- Labs
INSERT INTO rooms (room_name, room_type, capacity, building, floor) VALUES
('LAB101', 'LAB', 30, 'Science Building', 1),
('LAB102', 'LAB', 30, 'Science Building', 1),
('LAB201', 'LAB', 40, 'Science Building', 2),
('LAB202', 'LAB', 40, 'Science Building', 2),
('LAB301', 'LAB', 25, 'Science Building', 3),
('CSLAB101', 'LAB', 35, 'Computer Science Building', 1),
('CSLAB102', 'LAB', 35, 'Computer Science Building', 1);

-- Seminar Rooms
INSERT INTO rooms (room_name, room_type, capacity, building, floor) VALUES
('SEM101', 'SEMINAR', 20, 'Main Building', 1),
('SEM102', 'SEMINAR', 25, 'Main Building', 1),
('SEM201', 'SEMINAR', 30, 'Main Building', 2),
('SEM202', 'SEMINAR', 20, 'Main Building', 2);

-- Studios
INSERT INTO rooms (room_name, room_type, capacity, building, floor) VALUES
('STUDIO101', 'STUDIO', 15, 'Arts Building', 1),
('STUDIO201', 'STUDIO', 20, 'Arts Building', 2);

-- Offices
INSERT INTO rooms (room_name, room_type, capacity, building, floor) VALUES
('OFF101', 'OFFICE', 1, 'Faculty Building', 1),
('OFF102', 'OFFICE', 1, 'Faculty Building', 1),
('OFF201', 'OFFICE', 1, 'Faculty Building', 2),
('OFF202', 'OFFICE', 1, 'Faculty Building', 2);

-- ============================================
-- 4. TIMETABLE_SLOTS TABLE - Insert sample timetable entries
-- ============================================
-- Note: All foreign keys must reference existing records
-- Format: module_id, instructor_id, room_id, day, start_time, end_time, session_type

-- Monday Schedule
INSERT INTO timetable_slots (module_id, instructor_id, room_id, day, start_time, end_time, session_type) VALUES
(1, 3, 1, 'MONDAY', '08:00:00', '09:30:00', 'LECTURE'),  -- CS101 - Dr. John Smith - LH101
(2, 3, 2, 'MONDAY', '10:00:00', '11:30:00', 'LECTURE'),  -- CS201 - Dr. John Smith - LH102
(3, 4, 3, 'MONDAY', '13:00:00', '14:30:00', 'LECTURE'),  -- CS301 - Prof. Sarah Johnson - LH201
(4, 4, 4, 'MONDAY', '15:00:00', '16:30:00', 'LECTURE'),  -- CS302 - Prof. Sarah Johnson - LH202
(5, 5, 6, 'MONDAY', '08:00:00', '10:00:00', 'LAB'),      -- CS401 - Dr. Michael Brown - CSLAB101
(6, 5, 7, 'MONDAY', '10:00:00', '12:00:00', 'LAB'),      -- CS402 - Dr. Michael Brown - CSLAB102
(7, 6, 5, 'MONDAY', '14:00:00', '15:30:00', 'LECTURE'),  -- MATH101 - Prof. Emily Davis - LH301
(8, 6, 1, 'MONDAY', '16:00:00', '17:30:00', 'LECTURE');  -- MATH201 - Prof. Emily Davis - LH101

-- Tuesday Schedule
INSERT INTO timetable_slots (module_id, instructor_id, room_id, day, start_time, end_time, session_type) VALUES
(1, 3, 6, 'TUESDAY', '08:00:00', '10:00:00', 'LAB'),      -- CS101 Lab - Dr. John Smith - CSLAB101
(2, 3, 7, 'TUESDAY', '10:00:00', '12:00:00', 'LAB'),      -- CS201 Lab - Dr. John Smith - CSLAB102
(3, 4, 1, 'TUESDAY', '13:00:00', '14:30:00', 'LECTURE'),  -- CS301 - Prof. Sarah Johnson - LH101
(9, 7, 2, 'TUESDAY', '09:00:00', '10:30:00', 'LECTURE'),  -- PHYS101 - Dr. Robert Wilson - LH102
(10, 7, 3, 'TUESDAY', '11:00:00', '12:30:00', 'LECTURE'), -- PHYS201 - Dr. Robert Wilson - LH201
(11, 8, 13, 'TUESDAY', '14:00:00', '15:30:00', 'SEMINAR'), -- ENG101 - Prof. Lisa Anderson - SEM101
(12, 8, 14, 'TUESDAY', '16:00:00', '17:30:00', 'SEMINAR'), -- ENG201 - Prof. Lisa Anderson - SEM102
(13, 9, 4, 'TUESDAY', '08:00:00', '09:30:00', 'LECTURE'),  -- NET101 - Dr. James Taylor - LH202
(14, 9, 5, 'TUESDAY', '10:00:00', '11:30:00', 'LECTURE');  -- NET201 - Dr. James Taylor - LH301

-- Wednesday Schedule
INSERT INTO timetable_slots (module_id, instructor_id, room_id, day, start_time, end_time, session_type) VALUES
(4, 4, 1, 'WEDNESDAY', '08:00:00', '09:30:00', 'LECTURE'), -- CS302 - Prof. Sarah Johnson - LH101
(5, 5, 2, 'WEDNESDAY', '10:00:00', '11:30:00', 'LECTURE'), -- CS401 - Dr. Michael Brown - LH102
(6, 5, 3, 'WEDNESDAY', '13:00:00', '14:30:00', 'LECTURE'), -- CS402 - Dr. Michael Brown - LH201
(7, 6, 15, 'WEDNESDAY', '09:00:00', '10:30:00', 'TUTORIAL'), -- MATH101 Tutorial - Prof. Emily Davis - SEM201
(8, 6, 16, 'WEDNESDAY', '11:00:00', '12:30:00', 'TUTORIAL'), -- MATH201 Tutorial - Prof. Emily Davis - SEM202
(9, 7, 8, 'WEDNESDAY', '14:00:00', '16:00:00', 'LAB'),      -- PHYS101 Lab - Dr. Robert Wilson - LAB101
(10, 7, 9, 'WEDNESDAY', '16:00:00', '18:00:00', 'LAB'),    -- PHYS201 Lab - Dr. Robert Wilson - LAB102
(15, 10, 4, 'WEDNESDAY', '08:00:00', '09:30:00', 'LECTURE'), -- AI101 - Prof. Maria Garcia - LH202
(15, 10, 10, 'WEDNESDAY', '10:00:00', '12:00:00', 'LAB');   -- AI101 Lab - Prof. Maria Garcia - LAB201

-- Thursday Schedule
INSERT INTO timetable_slots (module_id, instructor_id, room_id, day, start_time, end_time, session_type) VALUES
(1, 3, 1, 'THURSDAY', '08:00:00', '09:30:00', 'LECTURE'),   -- CS101 - Dr. John Smith - LH101
(2, 3, 2, 'THURSDAY', '10:00:00', '11:30:00', 'LECTURE'),   -- CS201 - Dr. John Smith - LH102
(3, 4, 6, 'THURSDAY', '13:00:00', '15:00:00', 'LAB'),       -- CS301 Lab - Prof. Sarah Johnson - CSLAB101
(4, 4, 7, 'THURSDAY', '15:00:00', '17:00:00', 'LAB'),       -- CS302 Lab - Prof. Sarah Johnson - CSLAB102
(11, 8, 1, 'THURSDAY', '09:00:00', '10:30:00', 'LECTURE'),  -- ENG101 - Prof. Lisa Anderson - LH101
(12, 8, 2, 'THURSDAY', '11:00:00', '12:30:00', 'LECTURE'),  -- ENG201 - Prof. Lisa Anderson - LH102
(13, 9, 11, 'THURSDAY', '14:00:00', '16:00:00', 'LAB'),     -- NET101 Lab - Dr. James Taylor - LAB202
(14, 9, 12, 'THURSDAY', '16:00:00', '18:00:00', 'LAB');     -- NET201 Lab - Dr. James Taylor - LAB301

-- Friday Schedule
INSERT INTO timetable_slots (module_id, instructor_id, room_id, day, start_time, end_time, session_type) VALUES
(5, 5, 1, 'FRIDAY', '08:00:00', '09:30:00', 'LECTURE'),     -- CS401 - Dr. Michael Brown - LH101
(6, 5, 2, 'FRIDAY', '10:00:00', '11:30:00', 'LECTURE'),     -- CS402 - Dr. Michael Brown - LH102
(7, 6, 3, 'FRIDAY', '13:00:00', '14:30:00', 'LECTURE'),     -- MATH101 - Prof. Emily Davis - LH201
(8, 6, 4, 'FRIDAY', '15:00:00', '16:30:00', 'LECTURE'),     -- MATH201 - Prof. Emily Davis - LH202
(9, 7, 5, 'FRIDAY', '09:00:00', '10:30:00', 'LECTURE'),     -- PHYS101 - Dr. Robert Wilson - LH301
(10, 7, 1, 'FRIDAY', '11:00:00', '12:30:00', 'LECTURE'),    -- PHYS201 - Dr. Robert Wilson - LH101
(15, 10, 2, 'FRIDAY', '14:00:00', '15:30:00', 'LECTURE'),   -- AI101 - Prof. Maria Garcia - LH102
(15, 10, 13, 'FRIDAY', '16:00:00', '17:30:00', 'SEMINAR');  -- AI101 Seminar - Prof. Maria Garcia - SEM201

-- ============================================
-- Verification Queries (Optional - to check inserted data)
-- ============================================

-- Count records in each table
-- SELECT 'Users' as TableName, COUNT(*) as Count FROM users
-- UNION ALL
-- SELECT 'Modules', COUNT(*) FROM modules
-- UNION ALL
-- SELECT 'Rooms', COUNT(*) FROM rooms
-- UNION ALL
-- SELECT 'Timetable Slots', COUNT(*) FROM timetable_slots;

-- View sample timetable
-- SELECT 
--     t.day,
--     t.start_time,
--     t.end_time,
--     m.module_code,
--     m.module_name,
--     u.name AS instructor,
--     r.room_name,
--     t.session_type
-- FROM timetable_slots t
-- JOIN modules m ON t.module_id = m.id
-- JOIN users u ON t.instructor_id = u.id
-- JOIN rooms r ON t.room_id = r.id
-- ORDER BY FIELD(t.day, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'), t.start_time;


