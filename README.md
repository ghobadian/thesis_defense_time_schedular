# Project Title
Thesis Defense Time Scheduler System

# Models
## Entities
- User
  - Student
      - BachelorStudent
      - MasterStudent
      - PhDStudent
  - Professor
  - Admin
- Thesis
- Project
- ThesisDefenseMeeting
- ThesisForm
  - BachelorThesisForm
  - MasterThesisForm
  - PhdThesisForm
- Field
- Department
  
See also the [class diagram](src/main/resources/diagrams/classes.mmd)

## DTOs



## Enums
Department
Role: used for authorization
TimePeriod

# Constraints
Each `Student` has an Instructor which is a `Professor`.
Students can only be registered by 'Admin'; therefore there is no student signup page required.


# Master Thesis Time Scheduling Process
MasterStudent Logs in.
`MasterStudent` creates a `MasterThesisForm`.
All `ThesisForm`s are sent to corresponding Instructors. Each Instructor can accept or reject a form.
If the form is rejected, the state of the form is set to REJECTED.
If the form is accepted by Instructor, It is sent to `Admin`
If the form is accepted by `Admin`, It is sent to `Department` manager which is also a `Professor`
If the form is accepted by manager, he/she suggests juries for the thesis defense. All juries are Professors.
Now each suggested professor must log in and specify the time that day can attend that specific meeting. Time is in 1 hour and 30 minutes `TimePeriod`s. Professors can specify time periods from today till n weeks later where n is specified in config.
After all suggested professors specify the time, two scenarios happen:
1) multiple or single common time period and date are available. All of them are shown to Student to choose from
2) No common time period and date was specified. Currently this halts the process. #TODO done in sprint 2 of development
Student Chooses the time period and date.

users can download project registration form. (tarif-project.pdf)


# Backend Endpoints
base: '/api/v1'

## Student
'/student/login'
'/student/create-form'

## Professor
'/professor/login': Accepts `Proffesor`
'/professor/{id}'
'/professor/give-time'
'/professor/'
'/professor'
'/professor'
'/professor'

## Admin
'/admin/register-student/': registers a single `Student`. Accepts `StudentRegistrationInputDTO` serialized as JSON
'/admin/register-students/': registers multiple `Student`s. Accepts list of `StudentRegistrationInputDTO` serialized as JSON






add single sign on feature with oauth 2.0 or SAML (priority: low, it just makes it more user-friendly)
# Security
## Authentication
JWT token that consists of academic email, phone number and `Role`

## Authorization
Role-based authorization based on api routing


# Questions


# Similar Projects
https://github.com/peii14/thesis-management-system
