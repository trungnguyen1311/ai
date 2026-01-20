# Kế hoạch Sản phẩm: Quản lý Cán bộ Công đoàn (Dành cho Admin)

## 1. Mục tiêu Kinh doanh (Business Goals)

- **Tập trung quản lý**: Cung cấp một giao diện tập trung để Admin có thể theo dõi toàn bộ danh sách cán bộ công đoàn trong hệ thống.
- **Kiểm soát an ninh**: Cho phép Admin kiểm soát quyền truy cập của cán bộ bằng cách kích hoạt hoặc vô hiệu hóa tài khoản ngay lập tức khi cần thiết (ví dụ: khi cán bộ luân chuyển công tác hoặc rời tổ chức).
- **Tra cứu thông tin**: Giúp Admin nhanh chóng tìm kiếm và xem chi tiết hồ sơ của bất kỳ cán bộ nào để phục vụ công tác điều hành.

## 2. Tính năng dành cho Admin (MVP Focus)

- **Danh sách Cán bộ (Officer Listing)**:
  - Hiển thị danh sách toàn bộ cán bộ công đoàn dưới dạng bảng.
  - Các thông tin cơ bản: Họ tên, Email, Chức vụ, Phòng ban, Trạng thái tài khoản.
- **Chi tiết Hồ sơ (Officer Profile Details)**:
  - Xem thông tin chi tiết của một cán bộ được chọn.
  - Bao gồm thông tin cá nhân và thông tin công tác (chế độ chỉ xem - read-only).
- **Quản lý Tài khoản (Account Management)**:
  - Nút chuyển đổi trạng thái (Toggle) giữa "Hoạt động" (Active) và "Vô hiệu hóa" (Inactive).
  - Cập nhật trạng thái tức thì để ngăn chặn hoặc cho phép đăng nhập.

## 3. Vai trò và Phân quyền (Roles & Permissions)

- **Admin**:
  - Quyền truy cập: Toàn quyền truy cập vào trang Quản lý Cán bộ.
  - Hành động: Xem danh sách, xem chi tiết, thay đổi trạng thái tài khoản.
- **User (Cán bộ thông thường)**:
  - Quyền truy cập: Không có quyền truy cập vào các tính năng này.
  - Hành động: Bị chặn bởi hệ thống phân quyền (Unauthorized).

## 4. Trải nghiệm Người dùng (User Experience)

- Giao diện đơn giản, tập trung vào hiệu suất.
- Trạng thái tài khoản cần được hiển thị rõ ràng bằng màu sắc (ví dụ: Xanh cho Active, Đỏ/Xám cho Inactive).
- Phản hồi nhanh sau khi Admin thực hiện thay đổi trạng thái.
