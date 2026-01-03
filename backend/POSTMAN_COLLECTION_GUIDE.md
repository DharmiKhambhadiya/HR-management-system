# Postman Collection Guide - Dayflow HRMS API

## 📦 Collection Overview

Complete Postman collection organized by **11 modules** matching your route structure.

## 🗂️ Modules Structure

### 1. Authentication
- **POST** `/auth/login` - Step 1: Get OTP
- **POST** `/auth/verify-otp` - Step 2: Get Access Token
- **POST** `/auth/register` - Register Employee (HR Only)
- **PUT** `/auth/change-password` - Change Password
- **POST** `/auth/refresh-token` - Refresh Access Token

### 2. Profile
- **GET** `/profile/:userId` - Get Profile
- **PUT** `/profile/:userId` - Update Profile
- **POST** `/profile/:userId/upload-picture` - Upload Profile Picture

### 3. Dashboard
- **GET** `/dashboard` - Get Dashboard Data

### 4. Attendance
- **POST** `/attendance/check-in` - Check In
- **POST** `/attendance/check-out` - Check Out
- **GET** `/attendance` - Get Attendance Records

### 5. Leave Type (HR Only) ⭐ NEW
- **POST** `/leave-type` - Create Leave Type
- **GET** `/leave-type` - Get All Leave Types
- **GET** `/leave-type/:leaveTypeId` - Get Leave Type By ID
- **PUT** `/leave-type/:leaveTypeId` - Update Leave Type
- **DELETE** `/leave-type/:leaveTypeId` - Delete Leave Type

### 6. Leave Management
- **POST** `/leave/apply` - Apply for Leave
- **GET** `/leave` - Get Leave Requests
- **PUT** `/leave/:leaveId/approve` - Approve/Reject Leave (HR Only)

### 7. Holiday Calendar (HR Only) ⭐ NEW
- **POST** `/holiday` - Create/Update Holiday Calendar
- **GET** `/holiday/all` - Get All Holiday Calendars
- **GET** `/holiday/:year` - Get Holiday Calendar By Year
- **DELETE** `/holiday/:year` - Delete Holiday Calendar

### 8. Payroll
- **GET** `/payroll/:employeeId` - Get Salary Information
- **PUT** `/payroll/:employeeId/structure` - Update Salary Structure (HR Only)
- **POST** `/payroll/:employeeId/payslip` - Generate Payslip

### 9. Admin (HR Only)
- **GET** `/admin/employees` - Get All Employees
- **PUT** `/admin/employees/:employeeId/status` - Update Employee Status

### 10. Notifications
- **GET** `/notifications` - Get Notifications
- **PUT** `/notifications/:notificationId/read` - Mark Notification as Read

### 11. Health Check
- **GET** `/health` - Health Check

## 🔑 Collection Variables

The collection uses these variables (automatically set by test scripts):

- `baseUrl` - Base API URL (default: `http://localhost:5001/api/v1`)
- `accessToken` - JWT Access Token (auto-set after login)
- `tempToken` - Temporary token for OTP verification
- `userId` - Current user ID
- `employeeId` - Employee ID
- `attendanceId` - Attendance record ID
- `leaveId` - Leave request ID
- `leaveTypeId` - Leave type ID
- `notificationId` - Notification ID

## 📝 Important Notes

### ✅ Updated for New Architecture

1. **Leave Management:**
   - Now uses `leaveTypeId` (ObjectId) instead of `leaveType` (enum)
   - Uses `fromDate`/`toDate` instead of `startDate`/`endDate`
   - Make sure to create Leave Types first (Module 5) before applying for leave

2. **Role Changes:**
   - `ADMIN` → `HR` in the backend
   - HR-only endpoints are marked in the collection

3. **New Modules:**
   - **Leave Type Management** - Configure leave types (HR only)
   - **Holiday Calendar** - Manage yearly holidays (HR only)

### 🚀 Quick Start

1. **Import Collection:**
   - Open Postman
   - Click Import
   - Select `Dayflow-HRMS-API.postman_collection.json`

2. **Set Base URL:**
   - Collection variables → `baseUrl`
   - Default: `http://localhost:5001/api/v1`

3. **Login Flow:**
   - Run "Login - Step 1: Get OTP"
   - Check email for OTP
   - Run "Verify OTP - Step 2: Get Access Token"
   - Token automatically saved to `accessToken` variable

4. **Create Leave Type (HR):**
   - Run "Create Leave Type" (Module 5)
   - Save `leaveTypeId` for applying leaves

5. **Apply for Leave:**
   - Use `leaveTypeId` from Step 4
   - Run "Apply for Leave" (Module 6)

## 🔐 Authentication

Most endpoints require authentication:
- Header: `Authorization: Bearer {{accessToken}}`
- Token auto-populated after login

## 🎯 Usage Tips

1. **Variables are auto-set:** Login scripts automatically save tokens
2. **Follow module order:** Create Leave Types before applying leaves
3. **HR endpoints:** Marked with "(HR Only)" - need HR role
4. **Test scripts:** Some requests auto-save IDs for next requests

## 📊 Total Endpoints

- **Authentication:** 5 endpoints
- **Profile:** 3 endpoints
- **Dashboard:** 1 endpoint
- **Attendance:** 3 endpoints
- **Leave Type:** 5 endpoints (NEW)
- **Leave Management:** 3 endpoints
- **Holiday Calendar:** 4 endpoints (NEW)
- **Payroll:** 3 endpoints
- **Admin:** 2 endpoints
- **Notifications:** 2 endpoints
- **Health Check:** 1 endpoint

**Total: 32 endpoints** organized in 11 modules

---

**Note:** This collection matches your current route structure and includes all new modules (Holiday, LeaveType) with updated field names for the new architecture.

