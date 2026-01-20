# Danh sách lỗi tiềm ẩn & Rủi ro (Bug List & Risk Notes)

## 1. Lỗi tiềm ẩn (Potential Bugs)

- **Cột Database**: Nếu PostgreSQL sử dụng camelCase cho cột mà không có nháy kép, TypeORM query raw có thể gặp lỗi. Đã phòng ngừa bằng cách sử dụng `join_date` trong `TO_CHAR`.
- **Date Format**: Hàm `TO_CHAR(join_date, 'YYYY-MM')` phụ thuộc vào định dạng ngày của hệ thống database. Cần đảm bảo cột `join_date` là kiểu `Date` hoặc `Timestamp`.
- **Empty State**: Recharts có thể hiển thị cảnh báo console nếu dữ liệu mảng trống.

## 2. Rủi ro kỹ thuật (Technical Risks)

- **Hiệu năng Aggregation**: Khi số lượng cán bộ lên tới hàng chục nghìn, việc `COUNT` và `GROUP BY` tại mỗi lần load trang có thể làm chậm Dashboard.
  - _Giải pháp_: Cần cân nhắc sử dụng Cache (Redis) hoặc Materialized View nếu quy mô dữ liệu lớn.
- **Dữ liệu giả lập**: Dữ liệu tài chính hiện đang là mock. User có thể nhầm lẫn đây là dữ liệu thực tế.
  - _Lưu ý_: Cần có ghi chú "Dữ liệu minh họa" trên giao diện nếu cần thiết.
- **Dependencies**: Việc cài đặt thêm `recharts` làm tăng dung lượng bundle của frontend. Đã kiểm tra và thấy nằm trong mức cho phép đối với ứng dụng quản trị.

## 3. Ghi chú triển khai

- Đảm bảo biến môi trường `VITE_API_URL` được cấu hình đúng trên môi trường deploy.
- Cần chạy migration nếu có thay đổi về schema (hiện tại Dashboard chỉ dùng schema cũ nên không cần).
