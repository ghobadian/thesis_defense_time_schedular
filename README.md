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

This system automates and streamlines the thesis defense scheduling process for Bachelor, Master, and PhD students. It handles form submissions, approvals, jury assignments, and time slot coordination among multiple stakeholders to find the optimal defense time.

## Features

- **Multi-level Approval Workflow**: Instructor → Admin → Department Manager.
- **Automated Time Slot Coordination**: Finds common availability among jury members (Instructors and Advisors).
- **Role-Based Access Control (RBAC)**: distinct permissions for Students, Professors, Admins, and Department Managers.
- **JWT Authentication**: Secure stateless authentication with Access and Refresh tokens.
- **Support for Multiple Academic Levels**: Bachelor, Master, and PhD programs.
- **Department and Field Management**: Organized by academic departments and specific fields of study.
- **System Statistics**: Dashboard data for administrators to track form statuses and meeting schedules.

## System Architecture

### Technology Stack
- **Backend**: Spring Boot 3+ (Java 17+)
- **Build Tool**: Maven
- **Database**: 
  - **Development/Prod**: PostgreSQL
  - **Test**: H2 In-Memory Database
- **Migration**: Liquibase
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API (base path: `/api/v1`)

### Diagrams
*See `src/main/resources/diagrams/` for Mermaid definitions.*

## Models

### Core Entities

#### User Hierarchy
- **User** (Abstract Base)
  - `Student` (Abstract): BachelorStudent, MasterStudent, PhDStudent
  - `Professor`: Can act as Instructor, Supervisor, Jury, or Department Manager
  - `Admin`: System administrators

#### Forms and Meetings
- **ThesisForm**: The central document created by students.
- **ThesisDefenseMeeting**: Represents the actual scheduled event.
- **TimeSlot**: Represents a specific 1.5-hour block of availability.

### Key Relationships
- A `Student` creates a `ThesisForm`.
- A `Professor` (Instructor) approves the form initially.
- An `Admin` verifies administrative requirements.
- A `Department Manager` (Professor role) finalizes the jury selection.
- A `ThesisDefenseMeeting` is generated upon final approval, triggering the scheduling phase.

### Enums
- **Role**: `STUDENT`, `PROFESSOR`, `ADMIN`
- **FormStatus**: `DRAFT`, `SUBMITTED`, `INSTRUCTOR_APPROVED`, `ADMIN_APPROVED`, `MANAGER_APPROVED`, `REJECTED`
- **MeetingState**: `PENDING_JURY_AVAILABILITY`, `PENDING_STUDENT_SELECTION`, `SCHEDULED`, `CANCELLED`

## Workflow

### Defense Scheduling Process

1.  **Form Creation**: Student logs in and submits a Thesis Form (Bachelor, Master, or PhD).
2.  **Instructor Review**:
    - ✅ Accept: Form moves to Admin.
    - ❌ Reject: Process ends (Status: REJECTED).
3.  **Admin Review**:
    - ✅ Accept: Form moves to Department Manager.
    - ❌ Reject: Process ends.
4.  **Manager Review & Jury Selection**:
    - Manager approves the form and assigns Jury members.
    - A `ThesisDefenseMeeting` is created with state `PENDING_JURY_AVAILABILITY`.
5.  **Availability Collection**:
    - Professors (Jury members) log in and provide their available time slots for the upcoming days.
6.  **Time Slot Resolution**:
    - The system calculates intersections of availability between all jury members.
    - State moves to `PENDING_STUDENT_SELECTION`.
7.  **Student Selection**:
    - Student views the intersecting time slots.
    - Student selects one slot.
8.  **Finalization**:
    - The meeting is confirmed (`SCHEDULED`).

## API Endpoints

**Base URL**: `/api/v1`

### Authentication (`/auth`)
- `POST /auth/login`: Authenticate and receive JWT access/refresh tokens.
- `POST /auth/refresh`: Rotate refresh tokens.

### Student (`/student`)
- `POST /student/create-form`: Submit a new thesis form.
- `GET /student/my-forms`: View status of submitted forms.
- `POST /student/select-time`: Finalize a defense time slot.

### Professor (`/professor`)
- `GET /professor/`: List all professors.
- `GET /professor/{id}`: Get details of a specific professor.
- `POST /professor/give-time`: Submit availability for a specific meeting.
- `GET /professor/pending-reviews`: List forms waiting for instructor approval.
- `POST /professor/approve-form`: Approve a student's form.

### Admin (`/admin`)
- `POST /admin/register-student/`: Register a single student.
- `POST /admin/register-students/`: Bulk register students via list.
- `GET /admin/stats`: Get system-wide statistics (counts of forms, meetings, users).

### Manager (`/manager`)
- `GET /manager/pending-approvals`: List forms approved by Admin waiting for Manager.
- `POST /manager/assign-jury`: Approve form and assign jury members.

### Metadata
- `GET /departments`: List available departments.
- `GET /fields`: List fields of study.

## Security

### Authentication
- **Method**: JWT (Bearer Token).
- **Token Payload**: Includes Subject (Email), Role, and Expiration.
- **Interceptor**: Custom `LoggingInterceptor` logs request duration and parameters.

### Authorization
- **RBAC**: Annotations and Security Config ensure only specific roles access specific endpoints.
- **Data Isolation**: Students can only view/edit their own forms.

## Installation

### Prerequisites
- Java 17 or higher
- Maven
- PostgreSQL (or Docker container)

### Steps
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd thesis-defense-scheduler
   ```

2. **Configure Database**
   Update `src/main/resources/application.yaml` with your PostgreSQL credentials or use the default:
    - User: `postgres`
    - Password: `dev123`
    - DB: `myapp`

3. **Build the project**
   ```bash
   ./mvnw clean install
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

## Configuration

Configuration is managed in `src/main/resources/application.yaml`.

### Key Properties

| Property | Description | Default |
| :--- | :--- | :--- |
| `jwt.secret` | Secret key for signing tokens | *[Change in Prod]* |
| `jwt.expiration` | Token validity in ms | `86400000` (24h) |
| `spring.datasource.url` | Database URL | `jdbc:postgresql://...` |
| `rate-limit.max-submitted-forms` | Max forms a student can have active | `3` |
| `frontend.url` | CORS allowed origin | `http://localhost:3000` |

## Future Enhancements

1. **Rescheduling Logic**: Handle scenarios where no common time slots exist (Scenario B).
2. **Notifications**: Email/SMS integration for status updates.
3. **Calendar Integration**: Export scheduled defenses to Google Calendar/iCal.
4. **Document Generation**: Auto-generate official PDF minutes for the defense meeting.

## Contributing

Pull requests are welcome. Please ensure tests pass before submitting.

## License

[MIT License](LICENSE) or as specified by the repository owner.

## Contact
You can find my contacts at my [site](https://kghobad.ir)
