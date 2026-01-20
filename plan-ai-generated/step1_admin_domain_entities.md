# Các Thực thể Domain (Conceptual Domain Entities)

## 1. Cán bộ (Officer / User)

Đây là thực thể trung tâm đại diện cho một người dùng trong hệ thống (cán bộ công đoàn).

- **Định danh (ID)**: Mã định danh duy nhất.
- **Thông tin định danh**: Email (duy nhất), Số điện thoại.
- **Thông tin cá nhân**: Họ và tên, Ngày sinh, CCCD.
- **Thông tin công tác**: Chức vụ, Đơn vị/Phòng ban.
- **Trạng thái (Status)**:
  - `ACTIVE`: Tài khoản đang hoạt động bình thường.
  - `INACTIVE`: Tài khoản bị vô hiệu hóa, không thể đăng nhập.

## 2. Tài khoản (Account / Auth)

Liên kết chặt chẽ với thực thể Cán bộ để xử lý xác thực.

- **Mật khẩu (Password)**: Được mã hóa.
- **Vai trò (Role)**: Phân biệt `ADMIN` và `USER`.
- **Liên kết**: Trỏ đến thực thể Cán bộ tương ứng.

## 3. Mối quan hệ (Relationships)

- **1-1 giữa Account và Officer**: Mỗi tài khoản gắn liền với một hồ sơ cán bộ duy nhất.
- **Admin quản lý Officer**: Thực thể Admin (cũng là một Account với Role=ADMIN) có quyền tác động lên thuộc tính `Status` của thực thể Officer.
