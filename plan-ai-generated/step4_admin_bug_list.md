# Danh sách Lỗi & Rủi ro (Bug List & Risks): Admin Officer Management

## 1. Danh sách Lỗi tiềm ẩn (Bug List)

- **Lỗi hiển thị khi Profile chưa tồn tại**: Nếu một User mới đăng ký nhưng chưa tạo Profile, trang danh sách có thể hiển thị các trường "Chưa cập nhật" hoặc "N/A". Tuy nhiên, nếu logic join backend không xử lý tốt (Inner join thay vì Left join), user đó có thể biến mất khỏi danh sách.
- **Lỗi đồng bộ state**: Khi toggle trạng thái thành công, nếu local state không cập nhật ngay, người dùng có thể tưởng rằng hành động thất bại.
- **Token hết hạn**: Nếu JWT token hết hạn trong lúc Admin đang thực hiện tác vụ, hệ thống cần xử lý redirect về login thay vì đứng yên hoặc báo lỗi server chung chung.

## 2. Ghi chú Rủi ro (Risk Notes)

- **Rủi ro tự khóa mình**: Admin hiện tại có thể tìm thấy chính mình trong danh sách và vô hiệu hóa tài khoản của mình. Cần bổ sung logic backend để ngăn Admin thực hiện tác vụ trên chính ID của họ.
- **Hiệu năng**: Khi số lượng cán bộ lên đến hàng ngàn, việc join và đếm (findAndCount) cần được tối ưu bằng Index trên các cột `email` và `userId`.
- **An ninh dữ liệu**: Admin có thể xem được thông tin nhạy cảm (CCCD, Số điện thoại cá nhân). Cần đảm bảo log được lưu lại khi Admin truy cập xem chi tiết hồ sơ để phục vụ truy vết sau này.
