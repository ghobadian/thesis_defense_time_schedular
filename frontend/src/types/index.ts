export enum UserRole {
    ADMIN = 'ADMIN',
    PROFESSOR = 'PROFESSOR',
    MANAGER = 'MANAGER',
    STUDENT = 'STUDENT'
}

export enum StudentType {
    BACHELOR = 'BACHELOR',
    MASTER = 'MASTER',
    PHD = 'PHD'
}

export enum FormState {
    SUBMITTED = 'SUBMITTED',
    INSTRUCTOR_APPROVED = 'INSTRUCTOR_APPROVED',
    INSTRUCTOR_REJECTED = 'INSTRUCTOR_REJECTED',
    INSTRUCTOR_REVISION_REQUESTED = 'INSTRUCTOR_REVISION_REQUESTED',
    ADMIN_APPROVED = 'ADMIN_APPROVED',
    ADMIN_REJECTED = 'ADMIN_REJECTED',
    ADMIN_REVISION_REQUESTED_FOR_STUDENT = 'ADMIN_REVISION_REQUESTED_FOR_STUDENT',
    ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR = 'ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR',
    MANAGER_APPROVED = 'MANAGER_APPROVED',
    MANAGER_REJECTED = 'MANAGER_REJECTED',
    MANAGER_REVISION_REQUESTED_FOR_STUDENT = 'MANAGER_REVISION_REQUESTED_FOR_STUDENT',
    MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR = 'MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR',
    MANAGER_REVISION_REQUESTED_FOR_ADMIN = 'MANAGER_REVISION_REQUESTED_FOR_ADMIN',
}

export enum MeetingState {
    JURIES_SELECTED = 'JURIES_SELECTED',
    JURIES_SPECIFIED_TIME = 'JURIES_SPECIFIED_TIME',
    STUDENT_SPECIFIED_TIME = 'STUDENT_SPECIFIED_TIME',
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED'
}

export enum TimePeriod {
    PERIOD_7_30_9_00 = 'PERIOD_7_30_9_00',
    PERIOD_9_00_10_30 = 'PERIOD_9_00_10_30',
    PERIOD_10_30_12_00 = 'PERIOD_10_30_12_00',
    PERIOD_13_30_15_00 = 'PERIOD_13_30_15_00',
    PERIOD_15_30_17_00 = 'PERIOD_15_30_17_00'
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: String;
    role: UserRole;
    field: Field;
}

export interface Student extends User {
    studentNumber: number;
    studentType: StudentType;
    department: DepartmentSummary;
    instructor: Professor;
    creationDate: string;
    isGraduated: boolean;
}

export interface StudentUpdateRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    studentNumber: number;
    studentType: StudentType;
    departmentId: number;
    fieldId: number;
    instructorId: number;
    password?: string;
}

export interface Professor extends User {
    department: DepartmentSummary;
    manager: boolean;
}

export interface Admin extends User {}

export interface DepartmentSummary {
    id: number;
    name: string;
}

export interface DepartmentDetail {
    id: number;
    name: string;
    studentCount: number;
    professorCount: number;
    fieldCount: number;
    activeThesisCount: number;
}

export interface Field {
    id: number;
    name: string;
    department: DepartmentSummary;
}

export interface ThesisForm {
    fieldName: string;
    id: number;
    title: string;
    abstractText: string;
    studentId: string;
    studentNumber: number;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    instructorId: number;
    instructorFirstName: string;
    instructorLastName: string;
    field: Field;
    state: FormState;
    suggestedJuryIds: number[];
    createdAt: string;
    updatedAt: string;
    rejectionReason?: string;
    revisionMessage?: string;
    revisionRequestedAt?: string;
    submittedAt?: string;
    instructorReviewedAt?: string;
    adminReviewedAt?: string;
    managerReviewedAt?: string;
}


export interface TimeSlot {
    id: number;
    date: string;
    timePeriod: TimePeriod;
}

export interface Meeting {
    id: number;
    thesis: ThesisForm;
    state: MeetingState;
    selectedTimeSlot?: TimeSlot;
    location?: string;
    juryMembers: SimpleUser[];
    juriesScores: Record<string, number>;
    createdAt: string;
    score: number;
}

export interface AvailableTime {
    meetingId: number;
    timeSlots: TimeSlot[];
}


export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    role: UserRole;
    userId: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ThesisFormInput {
    title: string;
    abstractText: string;
    studentId: number;
    instructorId: number;
}

export interface TimeSlotSelectionInput {
    meetingId: number;
    timeSlotId: number;
}



export interface ProfessorTimeSlots {
    user: SimpleUser;
    timeslots: TimeSlot[];
}

export interface SimpleUser {
    id: number;
    firstName: string;
    lastName: string;
}

export interface MeetingTimeSlotsResponse {
    meetingId: number;
    juryMemberTimeSlots: ProfessorTimeSlots[];
    intersections: TimeSlot[];
}

export enum RevisionTarget {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR',
    ADMIN = 'ADMIN'
}

export interface ProfessorSearch {
    search?: string;
    departmentId?: number;
    page?: number;
    limit?: number;
}

export interface ProfessorRegistrationInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    departmentId: number;
    fieldId: number;
    password: string;
    manager: boolean;
}