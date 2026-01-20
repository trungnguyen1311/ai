# Thiết kế Backend: Quản lý Cán bộ (Admin)

## 1. Kiến trúc Module

- **Module mới**: `AdminModule`
- **Thành phần**:
  - `AdminOfficerController`: Xử lý các HTTP requests.
  - `AdminOfficerService`: Xử lý logic nghiệp vụ và tương tác với Database.
  - `RolesGuard` & `JwtAuthGuard`: Đảm bảo chỉ những người dùng có `role: 'ADMIN'` mới được phép truy cập.

## 2. Mô hình Dữ liệu (TypeORM)

Sử dụng các Entity đã có:

- `User`: Để truy xuất thông tin tài khoản và cập nhật thuộc tính `isActive`.
- `OfficerProfile`: Để lấy thông tin chi tiết hồ sơ cán bộ.

## 3. Logic Nghiệp vụ

- **Lấy danh sách cán bộ**:
  - Thực hiện `join` giữa bảng `users` và `officer_profiles`.
  - Hỗ trợ phân trang (Skip/Take).
  - Lọc bỏ chính tài khoản Admin đang đăng nhập (tùy chọn) để tránh tự vô hiệu hóa bản thân.
- **Xem chi tiết hồ sơ**:
  - Truy vấn `OfficerProfile` kèm theo thông tin `User` dựa trên `userId`.
- **Cập nhật trạng thái**:
  - Tìm `User` theo ID.
  - Cập nhật trường `isActive` dựa trên giá trị boolean gửi lên.
  - Lưu vào database.

## 4. Bảo mật & Phân quyền

- Sử dụng `@UseGuards(JwtAuthGuard, RolesGuard)` trên toàn bộ Controller.
- `@Roles(UserRole.ADMIN)` để giới hạn quyền truy cập.
