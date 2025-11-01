# Thesis Defense Time Scheduler System

A comprehensive web-based system for managing thesis defense scheduling in academic institutions. The system facilitates the entire workflow from thesis form submission to defense meeting scheduling, involving students, professors, admins, and department managers.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Models](#models)
- [Workflow](#workflow)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Installation](#installation)
- [Configuration](#configuration)
- [Future Enhancements](#future-enhancements)

## Overview

This system automates and streamlines the thesis defense scheduling process for Bachelor, Master, and PhD students. It handles form submissions, approvals, jury assignments, and time slot coordination among multiple stakeholders.

## Features

- **Multi-level Approval Workflow**: Instructor → Admin → Department Manager
- **Automated Time Slot Coordination**: Finds common availability among jury members
- **Role-Based Access Control**: Different permissions for Students, Professors, Admins
- **JWT Authentication**: Secure token-based authentication
- **Support for Multiple Academic Levels**: Bachelor, Master, and PhD programs
- **Department and Field Management**: Organized by academic departments and fields

## System Architecture

### Technology Stack
- **Backend**: Spring Boot (Java)
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: Actually don't care right now
- **API**: RESTful API (base path: `/api/v1`)

### Diagrams
- [Class Diagram](src/main/resources/diagrams/classes.mmd) (Out of date: TODO update) 
- [Workflow Flowchart](src/main/resources/diagrams/flowchart.mmd) (Out of date: TODO update)

## Models

### Core Entities

#### User Hierarchy (Abstract Base)
- **User** (Abstract)
  - `Student` (Abstract)
    - `BachelorStudent`
    - `MasterStudent`
    - `PhDStudent`
  - `Professor`
  - `Admin`

#### Forms and Meetings
- **ThesisForm** (Abstract)
  - `BachelorThesisForm`
  - `MasterThesisForm`
  - `PhDThesisForm`
- **ThesisDefenseMeeting**
- **TimeSlot**

#### Supporting Entities
- **Thesis**
- **Department**
- **Field**

### Key Relationships
- Each `Student` has one `Professor` as instructor
- Each `ThesisForm` is created by one `Student` and supervised by one `Professor`
- Each `ThesisDefenseMeeting` has multiple jury `Professor`s
- `TimeSlot`s track availability of multiple `Professor`s

### Enums
- **Department**: Academic departments
- **Role**: User roles for authorization (STUDENT, PROFESSOR, ADMIN)
- **TimePeriod**: 1.5-hour time slots for meetings
- **FormStatus**: DRAFT, SUBMITTED, INSTRUCTOR_APPROVED, ADMIN_APPROVED, MANAGER_APPROVED, REJECTED

## Workflow

### Master Thesis Scheduling Process

1. **Form Creation**: `MasterStudent` logs in and creates a `MasterThesisForm`
2. **Instructor Review**: Form is sent to the student's instructor
   - ✅ Accept → Proceed to Admin review
   - ❌ Reject → Process ends (status: REJECTED)
3. **Admin Review**: Approved forms are sent to `Admin`
   - ✅ Accept → Proceed to Department Manager
   - ❌ Reject → Process ends
4. **Department Manager Review**: Manager (who is a `Professor`) reviews
   - ✅ Accept → Suggest jury members and create `ThesisDefenseMeeting`
   - ❌ Reject → Process ends
5. **Jury Time Collection**: Each suggested professor specifies availability
   - Login via `/auth/login`
   - Specify available `TimePeriod`s and dates (1.5-hour slots)
   - Time range: Today to n days later (configured in system)
6. **Time Slot Resolution**:
   - **Scenario A**: Common time slots found → Show all options to student
   - **Scenario B**: No common time slots → Process halts (TODO: Sprint 2)
7. **Final Scheduling**: Student selects preferred time and date
8. **Finalization**: Manager finalizes the `ThesisDefenseMeeting`

### Additional Features
- Users can download project registration form (`tarif-project.pdf`)

## API Endpoints

**Base URL**: `/api/v1`

### Authentication
- `POST /auth/login`
  - Input: `LoginInputDTO` (JSON)
  - Output: `LoginOutputDTO`
- `POST /auth/refresh`
  - Input: `RefreshTokenRequestDTO` (JSON)
  - Output: `LoginOutputDTO`

### Student Endpoints
- `POST /student/create-form` - Create a new thesis form

### Professor Endpoints
- `GET /professor/{id}` - Get professor details
- `POST /professor/give-time` - Specify available time slots
- `GET /professor/` - List professors
- Additional professor endpoints (to be documented)

### Admin Endpoints
- `POST /admin/register-student/` 
  - Register a single student
  - Input: `StudentRegistrationInputDTO` (JSON)
- `POST /admin/register-students/`
  - Register multiple students
  - Input: `List<StudentRegistrationInputDTO>` (JSON)

## Security

### Authentication
- **Method**: JWT (JSON Web Tokens)
- **Token Contents**: 
  - Academic email
  - Phone number
  - User `Role`
- **Token Types**: Access token and refresh token

### Authorization
- **Method**: Role-Based Access Control (RBAC)
- **Implementation**: API route-based authorization
- **Roles**: STUDENT, PROFESSOR, ADMIN, MANAGER

### Constraints
- Students can only be registered by `Admin` users
- No student self-registration/signup page required
- Each student must have an assigned instructor

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd thesis-defense-scheduler

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```
## Configuration

### Application Properties
Configure the following in `application.properties` or `application.yml`:

- Database connection settings
- JWT secret and expiration times
- Maximum days ahead for time slot specification (n days)
- Email settings for notifications
- File upload settings

## Future Enhancements

### Planned Features (Priority Order)

1. **Sprint 2 Features**:
   - Handle scenario when no common time slots are available
   - Automated rescheduling suggestions
   - Notification system for all stakeholders

2. **Authentication Enhancement** (Low Priority):
   - Single Sign-On (SSO) with OAuth 2.0 or SAML
   - Integration with institutional authentication systems

3. **Additional Features**:
   - Email notifications at each workflow stage
   - Calendar integration (iCal/Google Calendar)
   - Meeting room reservation system
   - Document management and version control
   - Analytics dashboard for admins
   - Export reports (PDF/Excel)

## Similar Projects

- [Thesis Management System](https://github.com/peii14/thesis-management-system)

## Contributing

Just open a pull request. I would appreciate a comment for the PR if you have the time.

## License

Do whatever the fuck you want with this code

## Contact
You can find my contacts at my [site](https://kghobad.ir)

