# 🎓 Thesis Management & Defense Scheduling System

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

A comprehensive, full-stack web application designed to streamline thesis submissions, approvals, jury assignments, and the complex process of scheduling defense meetings based on intersecting availabilities.

> **🏆 Bachelor Thesis Project**
> This project was developed as my official Bachelor Thesis. You can view the full academic documentation and presentation here:
> - 📄 [Bachelor Thesis Document (.docx)](docs/thesis_document_ghobadian.docx)
> - 📊 [Bachelor Thesis Presentation (.pptm)](docs/presentation.pptm)

## 🎥 Project Demonstration

Watch the full system workflow from student submission to defense scheduling:
<video src="docs/thesis_presentation.mp4" width="600" controls></video>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture & Tech Stack](#system-architecture--tech-stack)
- [Defense Scheduling Workflow](#defense-scheduling-workflow)
- [User Roles](#user-roles)
- [Getting Started](#getting-started)
- [API & Models](#api--models)
- [License & Contact](#license--contact)

---

## 🎯 Overview

The system automates the thesis defense scheduling process for academic institutions (Bachelor, Master, and PhD programs). It handles the entire lifecycle: from initial form creation by the student, through multi-level approvals (Instructors, Admins), to automated time-slot coordination among jury members to find the optimal defense time.

## ✨ Features

- **Automated Time Slot Coordination**: System calculates intersections of availability among all assigned jury members.
- **Multi-level Approval Workflow**: Instructor → Admin approval chain.
- **Role-Based Dashboards**: Distinct UI and permissions for Students, Professors, Managers, and Admins.
- **Comprehensive Management**: Full CRUD capabilities for users, departments, fields of study, and thesis forms.
- **System Statistics**: Real-time dashboard data for administrators.
- **Secure Authentication**: JWT-based stateless authentication with access/refresh tokens.

---

## 🛠️ System Architecture & Tech Stack

### Frontend
- **Framework**: React 18 & TypeScript
- **State Management**: Zustand (Client) & TanStack Query (Server)
- **Styling**: Tailwind CSS & Lucide React
- **Routing**: React Router v6

### Backend
- **Framework**: Spring Boot 3+ (Java 17+)
- **Database**: PostgreSQL (Prod) / H2 (Test)
- **Migration**: Liquibase
- **Security**: JWT (JSON Web Tokens) & Spring Security
- **Build Tool**: Maven

---

## 🔄 Defense Scheduling Workflow

1. **Form Creation**: Student submits a Thesis Form.
2. **Instructor Review**: Professor approves or rejects the submission.
3. **Admin Verification & Jury Assignment**: Admin verifies requirements, assigns jury members, and creates the meeting entity.
4. **Availability Collection**: Jury members provide their available time slots.
5. **Time Slot Resolution**: The backend calculates the intersection of availabilities.
6. **Student Selection**: Student picks the final time slot from the calculated intersections.
7. **Finalization & Scoring**: Professor schedules the location. Post-defense, the professor submits the final score (0-20).

---

## 👥 User Roles

| Role | Access Level | Responsibilities |
|------|-------------|------------------|
| **ADMIN** | Full System Access | Register students, manage departments/fields, final jury selection, system oversight. |
| **MANAGER** | Department Level | Jury selection and meeting scheduling management. |
| **PROFESSOR** | Faculty Member | Review forms, submit available time slots, grade defenses. |
| **STUDENT** | End User | Submit thesis forms, select defense times, view status. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+) & **npm/yarn**
- **Java 17+** & **Maven**
- **PostgreSQL**

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Configure database in application.yaml (default: postgres/dev123 on jdbc:postgresql://localhost:5432/myapp)

# Build and Run
./mvnw clean install
./mvnw spring-boot:run
*Backend runs on `http://localhost:8080/api/v1`*

### 2. Frontend Setup
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Ensure VITE_API_BASE_URL=http://localhost:8080/api/v1 is set

# Start development server
npm start
*Frontend runs on `http://localhost:3000`*
```
---

## 🗃️ API & Models

- **Authentication**: Bearer Token (JWT). Endpoints include `/auth/login` and `/auth/refresh`.
- **Core Entities**: `User` (Student, Professor, Admin), `ThesisForm`, `ThesisDefenseMeeting`, `TimeSlot`, `Department`, `Field`.
- **Form States**: `DRAFT`, `SUBMITTED`, `INSTRUCTOR_APPROVED`, `ADMIN_APPROVED`, `REJECTED`.
- **Meeting States**: `PENDING_JURY_AVAILABILITY`, `PENDING_STUDENT_SELECTION`, `SCHEDULED`, `COMPLETED`, `CANCELLED`.

*(For a full list of API endpoints, refer to the backend source code controllers).*

---

## 📄 License & Contact

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Developed by Koosha Ghobadian**
- 🌐 Website: [kghobad.ir](https://kghobad.ir)
- 💻 GitHub: [ghobadian](https://github.com/ghobadian)

*Made with ❤️ for Academic Excellence*
