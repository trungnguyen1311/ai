# Phạm vi Dự án (MVP Scope): Admin – Union Officer Management

## 1. Hiện diện trong MVP (IN Scope)

- **Giao diện Danh sách**:
  - Hiển thị danh sách cán bộ có phân trang cơ bản.
  - Hiển thị các cột: Tên, Email, Chức vụ, Trạng thái.
- **Giao diện Chi tiết**:
  - Hiển thị đầy đủ các trường thông tin trong hồ sơ cán bộ (Họ tên, ngày sinh, giới tính, số điện thoại, email, chức vụ, bộ phận, ngày tham gia).
  - Chế độ: Chỉ xem (Read-only).
- **Hành động Quản trị**:
  - Kích hoạt tài khoản (Activate).
  - Vô hiệu hóa tài khoản (Deactivate).
- **Bảo mật**:
  - Kiểm tra quyền Admin tại cả Frontend và Backend (Middleware/Guards).

## 2. Ngoài phạm vi MVP (OUT of Scope - Tương lai)

- **Thống kê & Báo cáo**: Biểu đồ phân bố cán bộ theo chức vụ, phòng ban, hoặc báo cáo số lượng tài khoản mới.
- **Tìm kiếm & Lọc nâng cao**: Tìm kiếm theo nhiều tiêu chí phức tạp hoặc lọc theo phòng ban (sẽ được bổ sung sau MVP).
- **Chỉnh sửa hồ sơ bởi Admin**: Admin không sửa thông tin cá nhân của cán bộ (tránh sai lệch dữ liệu, cán bộ tự chịu trách nhiệm về hồ sơ của mình).
- **Xóa tài khoản**: Chức năng xóa vĩnh viễn dữ liệu khỏi database không nằm trong MVP để đảm bảo tính toàn vẹn lịch sử.
- **Quản lý Phân quyền nâng cao**: Tạo/Sửa/Xóa các Role hoặc Permission tùy chỉnh.
- **Gửi thông báo**: Gửi email thông báo cho cán bộ khi tài khoản bị vô hiệu hóa.
