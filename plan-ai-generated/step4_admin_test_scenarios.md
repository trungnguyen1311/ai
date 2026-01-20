# Kịch bản Kiểm thử (Test Scenarios): Admin Officer Management

## 1. Kiểm tra Phân quyền (Access Control)

- **Scenario 1.1**: Đăng nhập tài khoản User thường, cố tình truy cập `/admin/officers`.
  - **Kỳ vọng**: Bị chặn bởi hệ thống Router (không thấy nội dung trang) và API trả về 403 Forbidden.
- **Scenario 1.2**: Đăng nhập tài khoản Admin, truy cập `/admin/officers`.
  - **Kỳ vọng**: Hiển thị danh sách cán bộ bình thường.

## 2. Kiểm tra Danh sách & Phân trang

- **Scenario 2.1**: Kiểm tra hiển thị bảng.
  - **Kỳ vọng**: Các cột (Tên, Email, Chức vụ, Trạng thái) hiển thị đúng dữ liệu từ backend.
- **Scenario 2.2**: Kiểm tra phân trang khi có >10 cán bộ.
  - **Kỳ vọng**: Các nút phân trang xuất hiện, bấm trang 2 tải đúng dữ liệu trang 2.

## 3. Kiểm tra Quản lý Trạng thái (Activation/Deactivation)

- **Scenario 3.1**: Tắt (Deactivate) một cán bộ đang hoạt động.
  - **Kỳ vọng**: Nút switch đổi màu, gọi API thành công, cán bộ đó sau khi logout sẽ không thể login lại.
- **Scenario 3.2**: Bật (Activate) một cán bộ đang bị chặn.
  - **Kỳ vọng**: Nút switch đổi màu, gọi API thành công, cán bộ đó có thể login lại.

## 4. Kiểm tra Chi tiết Hồ sơ

- **Scenario 4.1**: Bấm vào nút "Chi tiết" của một cán bộ.
  - **Kỳ vọng**: Chuyển trang đúng ID, hiển thị đầy đủ các thông tin (Mã NV, Ngày sinh, CCCD, v.v.).
- **Scenario 4.2**: Kiểm tra tính chất Read-only.
  - **Kỳ vọng**: Không có nút "Lưu" hoặc "Chỉnh sửa" trên giao diện chi tiết của Admin.
