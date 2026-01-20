# Kế hoạch Triển khai Frontend: Admin Officer Management

## 1. Kiến trúc Trang & Thành phần

- **AdminOfficerListPage**:
  - Bảng hiển thị danh sách cán bộ.
  - Bộ lọc cơ bản (Search theo tên).
  - Phân trang (Pagination).
  - Nút chuyển đổi trạng thái (Toggle Switch) cho `isActive`.
- **AdminOfficerDetailPage**:
  - Hiển thị chi tiết hồ sơ (Read-only).
  - Nút quay lại danh sách.
- **AdminNavigation**:
  - Bổ sung menu điều hướng cho Admin trong `Dashboard` hoặc Header.

## 2. Quản lý Trạng thái & API

- Sử dụng `Axios` để gọi các API đã định nghĩa ở Step 2.
- Lưu trữ danh sách cán bộ trong local state của component.
- Xử lý trạng thái Loading và Error cho từng hành động (tải danh sách, cập nhật trạng thái).

## 3. Thiết kế Giao diện (Aesthetics)

- **Bảng (Table)**: Sử dụng thiết kế hiện đại, hàng xen kẽ màu (zebra stripes), hiệu ứng hover.
- **Trạng thái (Status Badge)**:
  - `Active`: Badge màu xanh lục sữa (Emerald green) nhẹ.
  - `Inactive`: Badge màu đỏ nhạt (Rose/Red) nhẹ.
- **Toggle Switch**: Hoạt ảnh mượt mà khi chuyển đổi trạng thái.
- **Responsive**: Ẩn một số cột ít quan trọng trên thiết bị di động.

## 4. Phân nhiệm vụ cụ thể

- Cập nhật `App.tsx` hoặc router để thêm các route bảo vệ (Protected Routes) chỉ dành cho Admin.
- Tạo `AdminOfficerService.ts` trong frontend để quản lý các lệnh gọi API.
