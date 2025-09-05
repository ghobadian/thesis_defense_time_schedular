-- Insert thesis forms for testing
INSERT INTO thesis_form (id, student_id, instructor_id, state, submission_date, field_id, student_type)
VALUES (1, 5, 2, 'SUBMITTED', NOW(), 1, 'MASTER');

INSERT INTO thesis_form (id, student_id, instructor_id, state, submission_date, field_id, student_type)
VALUES (2, 6, 3, 'DRAFT', NOW(), 2, 'BACHELOR');

-- Insert thesis for forms
INSERT INTO thesis (id, title, abstract_text, author_id, supervisor_id)
VALUES (1, 'AI in Healthcare', 'Abstract about AI in healthcare applications', 5, 2);

INSERT INTO thesis (id, title, abstract_text, author_id, supervisor_id)
VALUES (2, 'Web Development Best Practices', 'Abstract about modern web development', 6, 3);
