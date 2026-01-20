# Thiết kế Backend: Admin Dashboard

## 1. Kiến trúc

- Sử dụng mô hình Controller-Service tiêu chuẩn của NestJS.
- Dashboard sẽ được tích hợp vào `AdminModule` để tận dụng các guard phân quyền đã có.
- Dữ liệu được tính toán thông qua `DashboardService`.

## 2. Xử lý Dữ liệu

### A. Thống kê Cán bộ (Officer Statistics)

- Sử dụng TypeORM `Repository` của `OfficerProfile`.
- Dùng `createQueryBuilder` để thực hiện các phép `COUNT` và `GROUP BY` theo:
  - `department`
  - `unionPosition`
  - `isActive` (từ entity `User`)
- **Hiệu năng**: Các câu lệnh aggregation đơn giản trên bảng `officer_profiles` có khoảng vài nghìn bản ghi sẽ thực thi nhanh chóng.

### B. Thống kê theo Thời gian (Time-based Trend)

- Truy vấn `joinDate` từ `OfficerProfile`.
- Nhóm theo tháng/năm.
- Định dạng dữ liệu trả về dạng mảng các object `{ label: string, value: number }` phù hợp cho các thư viện biểu đồ như Recharts hoặc Chart.js.

### C. Quỹ Công đoàn (Union Fund - Mock Data)

- Do hiện tại hệ thống chưa có module quản lý tài chính chi tiết, `DashboardService` sẽ trả về dữ liệu giả lập (mock data) có cấu trúc thực tế.
- Mục tiêu: Demo giao diện và các chỉ số tài chính cơ bản.
- Cấu trúc dữ liệu giả lập sẽ dựa trên danh sách các `Department` hiện có để đảm bảo tính nhất quán.

## 3. Bảo mật & Phân quyền

- **Endpoint**: `/api/admin/dashboard/*`
- **Guard**: Cần có `JwtAuthGuard` và `RolesGuard(UserRole.ADMIN)`.
- **Ràng buộc**: Chỉ Admin mới có quyền truy cập các API này.
