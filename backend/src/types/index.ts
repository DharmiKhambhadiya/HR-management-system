export enum Role {
    HR = 'HR',
    EMPLOYEE = 'EMPLOYEE'
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    HALF_DAY = 'HALF_DAY',
    LEAVE = 'LEAVE',
    HOLIDAY = 'HOLIDAY'
}

export enum EmploymentType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT'
}

export enum HolidayType {
    NATIONAL = 'NATIONAL',
    OPTIONAL = 'OPTIONAL'
}

export enum LeaveRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum PayrollStatus {
    GENERATED = 'GENERATED',
    PAID = 'PAID'
}

export enum LeaveType {
    PAID = 'PAID',
    SICK = 'SICK',
    UNPAID = 'UNPAID'
}

export enum LeaveStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    TERMINATED = 'TERMINATED'
}

export enum NotificationType {
    LEAVE_APPROVED = 'LEAVE_APPROVED',
    LEAVE_REJECTED = 'LEAVE_REJECTED',
    LEAVE_APPLIED = 'LEAVE_APPLIED',
    ATTENDANCE_REGULARIZATION = 'ATTENDANCE_REGULARIZATION',
    PAYROLL = 'PAYROLL',
    SYSTEM = 'SYSTEM'
}

export interface AuthUser {
    id: string;
    email: string;
    role: Role;
    loginId: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

export interface LocationData {
    latitude: number;
    longitude: number;
}
