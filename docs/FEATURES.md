# Features & Capabilities

This document details the features available in the LAB_UAI system, categorized by user role.

## User Roles

The system supports the following roles, each with specific permissions:

1.  **Admin (Administrator)**: Full system access.
2.  **Dosen (Lecturer)**: Academic oversight and practical module management.
3.  **Mahasiswa (Student)**: Borrowing items and submitting academic reports.
4.  **Asisten (Lab Assistant)**: Assisting with daily lab operations.

## Feature Breakdown

### 1. User Management (Admin)
- **Create User**: Register new accounts manually.
- **Role Assignment**: Assign one of the 4 roles to users.
- **Batch Updates**: Update multiple user details (e.g., student batch year).
- **Deletion**: Remove user accounts.

### 2. Inventory Management
- **Item Catalog**: View all available lab equipment.
- **Add/Edit Items**: Admins can add new tools or update their status (Good/Broken).
- **Loan Process**:
    - Students request items for a specific date range.
    - Admins/Assistants validate (Approve/Reject) the request.
    - Status tracking: Pending -> Validated -> Returned.

### 3. Room Booking
- **Calendar View**: See room availability.
- **Reservation**: Book specific procedure/lab rooms for classes or events.
- **Conflict Detection**: Prevents double-booking (implied).

### 4. Academic Portal
- **Practical Modules**:
    - Lecturers upload module materials (PDFs).
    - Students download modules.
- **Reports (Laporan Praktikum)**:
    - Students upload reports after sessions.
    - Lecturers grade reports.
- **Schedules**: View practical session timetables.

### 5. Governance
- **Document Repository**: Store SOPs (Standard Operating Procedures) and LPJs (Accountability Reports).
- **Version Control**: Manage document updates.

### 6. Authentication
- **Secure Login**: Using Email/NIM and Password.
- **Session Management**: Secure cookies for persistent login.
