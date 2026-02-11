# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Thesis Defense Time Scheduler - A Spring Boot application for managing thesis defense scheduling for different student levels (Bachelor, Master, PhD).

## Development Environment
- Java Version: 21
- Build Tool: Maven
- Framework: Spring Boot 3.4.4

## Key Commands
- Build project: `./mvnw clean package`
- Run tests: `./mvnw test`
- Run application: `./mvnw spring-boot:run`

## Architecture Highlights
- Entities: Student (BachelorStudent, MasterStudent, PhDStudent), Professor, Thesis, ThesisDefenseMeeting
- Authentication: JWT-based with role-based authorization
- Backend API Base: '/api/v1'

## Key Workflow
1. Student logs in and creates a thesis form
2. Instructor reviews and can accept/reject the form
3. Admin and Department manager approve
4. Professors specify available time slots
5. Student chooses final defense time

## Todo Features
- Implement Single Sign-On (OAuth 2.0 or SAML)
- Improve scenario when no common time slots are available

## Security Notes
- JWT tokens include academic email, phone number, and Role
- Authorization is role-based and managed through API routing