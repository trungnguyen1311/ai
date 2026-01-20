# Prompt Triển khai Frontend: Admin Dashboard

## Yêu cầu Hệ thống

Triển khai trang Admin Dashboard trực quan bằng ReactJS và TailwindCSS.

## Các nhiệm vụ cụ thể:

1. **Cài đặt thư viện**: Cần `recharts` và `lucide-react`.
2. **Cập nhật Service**: Thêm phương thức `getDashboardStats` vào `admin.service.ts` để gọi endpoint `GET /api/admin/dashboard/stats`.
3. **Tạo trang mới**: `src/pages/AdminDashboardPage.tsx`.
4. **Cấu trúc UI**:
   - Sử dụng Grid layout để sắp xếp các Stats Cards.
   - Hiển thị 3-4 biểu đồ khác nhau (Pie, Area, Bar) để trực quan hóa dữ liệu từ API.
   - Thêm bộ lọc nhanh theo thời gian (Concept - 7 ngày, 30 ngày, 1 năm).
5. **Đăng ký Route**: Thêm route `/admin/dashboard` vào hệ thống định tuyến (chỉ cho Admin).
6. **Navigation**: Cập nhật Sidebar/Navbar để có liên kết dẫn đến Dashboard.

## Tiêu chuẩn Thẩm mỹ (WOW factors):

- Sử dụng các hiệu ứng chuyển cảnh mượt mà.
- Phối màu gradient cho các thẻ chỉ số.
- Tooltip tùy chỉnh trên biểu đồ để hiển thị thông tin chi tiết khi hover.
- Đảm bảo giao diện trông cao cấp (Premium look & feel).
