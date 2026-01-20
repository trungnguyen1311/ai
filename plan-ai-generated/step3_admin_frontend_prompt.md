# Prompt gợi ý triển khai Frontend: Admin Officer Management

Dưới đây là mô tả chi tiết để AI có thể thực hiện phần code Frontend:

## 1. Yêu cầu chung

- Ngôn ngữ: ReactJS (TypeScript).
- Styling: Vanilla CSS kết hợp Tailwind CSS (nếu dự án đang dùng).
- API Client: Axios.

## 2. Các trang cần tạo mới

### `AdminOfficerListPage.tsx`

- Fetch dữ liệu từ `GET /admin/officers`.
- Render bảng với các cột: Họ tên, Email, Chức vụ, Phòng ban, Trạng thái (Toggle).
- Khi toggle thay đổi, gọi API `PATCH /admin/officers/:id/status`. Hiển thị Toast thông báo thành công.
- Có nút "Xem" để điều hướng sang trang chi tiết.

### `AdminOfficerDetailPage.tsx`

- Lấy ID từ URL params.
- Fetch chi tiết từ `GET /admin/officers/:id`.
- Hiển thị toàn bộ thông tin hồ sơ dưới dạng Dashboard/Card sang trọng. Toàn bộ là Read-only.

## 3. Cập nhật hệ thống

### `AppRouter.tsx` (hoặc nơi cấu hình Route)

- Thêm route: `/admin/officers` và `/admin/officers/:id`.
- Đảm bảo có logic check `user.role === 'ADMIN'`. Nếu không phải admin mà truy cập thì redirect về `/dashboard` hoặc trang 403.

### `Navigation.tsx`

- Nếu người dùng đăng nhập là Admin, hiển thị thêm mục "Quản lý Cán bộ" trên thanh điều hướng.

## 4. Giao diện & Trải nghiệm

- Ưu tiên tính thẩm mỹ cao (Premium design).
- Hiệu ứng chuyển động nhẹ khi tải danh sách.
- Thông báo (Notification/Toast) rõ ràng khi thực hiện các tác vụ quản trị.
