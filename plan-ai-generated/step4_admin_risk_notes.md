# Ghi chú Rủi ro & Khuyến nghị (Risk Notes & Recommendations)

## 1. Khuyến nghị Kỹ thuật

- **Ngăn Admin tự khóa tài khoản**: Bổ sung kiểm tra `if (targetUserId === currentAdminId) throw Error` ở service backend.
- **Xử lý Loading State**: Thêm hiệu ứng Skeleton loading cho bảng để mang lại cảm giác mượt mà hơn khi chuyển trang hoặc fetch dữ liệu.
- **Log hành động**: Đề xuất tạo một bảng `admin_logs` để ghi lại mỗi khi Admin thay đổi trạng thái tài khoản của cán bộ (Ai đã khóa, khóa ai, vào lúc nào).

## 2. Rủi ro về Nghiệp vụ

- **Dữ liệu chưa hoàn thiện**: Đối với các cán bộ mới đăng ký qua module Auth nhưng chưa qua module Profile để điền tài liệu, Admin sẽ thấy dữ liệu trống (mã nhân viên, chức vụ). Cần có quy trình nhắc nhở người dùng hoàn thiện hồ sơ.
- **Xác nhận hành động quan trọng**: Hành động "Vô hiệu hóa" là hành động gây gián đoạn công việc, nên có một Dialog xác nhận (Confirmation Dialog) thay vì chỉ click là thực hiện ngay để tránh bấm nhầm.
