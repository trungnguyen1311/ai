# Kịch bản Kiểm thử: Admin Dashboard

## 1. Kiểm thử Phân quyền (Permission Testing)

- **Scenario 1**: User có role `USER` truy cập trực tiếp `/admin/dashboard`.
  - **Expectation**: Hệ thống chuyển hướng về `/dashboard` hoặc hiển thị trang 403 Forbidden.
- **Scenario 2**: User chưa đăng nhập truy cập `/admin/dashboard`.
  - **Expectation**: Chuyển hướng về trang `/login`.
- **Scenario 3**: Admin truy cập thành công và thấy menu "Admin Dashboard" ở sidebar.

## 2. Kiểm thử Dữ liệu (Data Testing)

- **Scenario 4**: Dashboard khi hệ thống chưa có cán bộ nào.
  - **Expectation**: Biểu đồ hiển thị trạng thái "No data" hoặc trống, các Cards hiển thị số 0. Không bị crash.
- **Scenario 5**: Kiểm tra tính nhất quán dữ liệu giữa Dashboard và trang Danh sách cán bộ.
  - **Expectation**: Tổng số lượng cán bộ trên Dashboard Card phải khớp với tổng số bản ghi trong danh sách.
- **Scenario 6**: Kiểm tra dữ liệu giả lập (Mock data) của phần Tài chính.
  - **Expectation**: Hiển thị đúng các con số và biểu đồ cột theo ban ngành như đã định nghĩa trong service.

## 3. Kiểm thử Giao diện & Trải nghiệm (UI/UX Testing)

- **Scenario 7**: Kiểm tra Responsive trên Mobile.
  - **Expectation**: Các Cards xếp chồng lên nhau, biểu đồ co giãn theo chiều rộng màn hình (ResponsiveContainer hoạt động tốt).
- **Scenario 8**: Kiểm tra hiệu ứng Hover/Tooltip.
  - **Expectation**: Khi đưa chuột vào biểu đồ tròn, Tooltip hiện tên phòng ban và số lượng chính xác.
- **Scenario 9**: Kiểm tra trạng thái Loading.
  - **Expectation**: Hiển thị Spinner/Skeleton trong lúc chờ API phản hồi.
