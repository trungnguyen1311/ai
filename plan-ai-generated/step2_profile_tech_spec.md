# Technical Specification: Union Officer Profile Management

## 1. Architecture Overview
We will implement a new `ProfileModule` in the NestJS backend and a `ProfilePage` in the React frontend.

### Backend (NestJS)
- **Module**: `ProfileModule`
- **Controller**: `ProfileController` (`/api/v1/profile`)
- **Service**: `ProfileService`
- **Entity**: `OfficerProfile` (TypeORM)
- **Guards**: `JwtAuthGuard` (Applied to all endpoints)

### Frontend (React)
- **Page**: `ProfilePage`
- **Components**:
    - `ProfileHeader`: Avatar, Name, Role.
    - `PersonalDetailsCard`: Phone, Email, Address (Editable).
    - `WorkDetailsCard`: Position, Dept, Party Member (Read-only).
- **State Management**: React Query (for fetching/caching profile data).

## 2. Database Design (PostgreSQL)

### Table: `officer_profiles`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Defaults to uuid_generate_v4() | Primary Key |
| user_id | UUID | FK -> users.id, Unique, Not Null | Link to Auth User |
| employee_id | VARCHAR(50) | Unique, Not Null | Mã cán bộ |
| full_name | VARCHAR(100) | Not Null | Họ và tên |
| date_of_birth | DATE | Nullable | |
| gender | VARCHAR(20) | Check IN ('Male', 'Female', 'Other') | |
| national_id | VARCHAR(20) | Unique | CCCD/CMND |
| phone_number | VARCHAR(20) | | Mutable |
| personal_email | VARCHAR(100) | | Mutable |
| address | TEXT | | Mutable |
| union_position | VARCHAR(100) | Not Null | Chức vụ |
| department | VARCHAR(100) | Not Null | Đơn vị |
| join_date | DATE | Not Null | |
| is_party_member | BOOLEAN | Default FALSE | Đảng viên |
| created_created | TIMESTAMP | Default NOW() | |
| updated_at | TIMESTAMP | Default NOW() | |

## 3. Data Flow
1.  **User Login**: User logs in -> gets JWT -> stored in Frontend.
2.  **Fetch Profile**:
    - Frontend sends `GET /profile/me` with Bearer Token.
    - Backend extracts `userId` from Token.
    - `ProfileService` queries `officer_profiles` where `user_id` = `token.sub`.
    - Returns JSON.
3.  **Update Profile**:
    - Frontend sends `PATCH /profile/me` with JSON body `{ phoneNumber, address, ... }`.
    - Backend validates payload (DTO).
    - `ProfileService` updates fields.
    - Returns updated profile.

## 4. Security & Validation
- **Authentication**: All routes constrained by valid JWT.
- **Authorization**: Users can only access/edit their OWN profile (enforced by `req.user.id`).
- **Input Validation (class-validator)**:
    - `phoneNumber`: Regex validation for VN phone numbers.
    - `personalEmail`: Standard Email validation.
    - `address`: Max length 500 chars.
