# Domain Enemies: Union Officer Profile

## 1. Core Entity: `OfficerProfile`
This entity represents the extended detailed profile of a user who is a Union Officer. It is linked 1:1 with the implemented Authentication `User` entity.

### Conceptual Fields

#### Identity (Immutable by User in MVP)
- `UserID` (Link to Auth system)
- `EmployeeID` (Mã nhân viên / Mã cán bộ)
- `FullName` (Họ và tên)
- `DateOfBirth` (Ngày sinh)
- `Gender` (Giới tính)
- `NationalID` (CCCD/CMND)

#### Contact Info (Mutable by User)
- `PhoneNumber` (Số điện thoại)
- `PersonalEmail` (Email cá nhân)
- `Address` (Địa chỉ liên hệ)

#### Union Professional Data (Immutable by User)
- `UnionPosition` (Chức vụ công đoàn - e.g., Chủ tịch, Ủy viên BCH)
- `Department/Unit` (Phòng ban / Đơn vị công tác)
- `JoinDate` (Ngày tham gia công đoàn)
- `IsPartyMember` (Là Đảng viên: Boolean)

## 2. Relationships
- **User -> OfficerProfile**: One-to-One.
    - A User account in the system corresponds to exactly one Officer Profile.
- **OfficerProfile -> UnionDepartment** (Conceptual): Many-to-One.
    - (Future scope: Reference to a master list of departments).

## 3. Data Sensitivity Classification
- **Public/Internal Visible**: Name, Department, Union Position.
- **Private (User & Admin only)**: Phone, Personal Email, Address, National ID, DOB.
