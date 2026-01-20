# Phạm vi Dự án (Project Scope) - Dashboard Reporting

Tài liệu này xác định rõ những gì sẽ được thực hiện và những gì nằm ngoài phạm vi của tính năng Dashboard trong giai đoạn MVP.

## 1. Trong phạm vi (IN Scope)

- **Đối tượng sử dụng**: Giới hạn cho người dùng có quyền **Admin tổng** và **Admin đơn vị**.
- **Tính năng chính**: Giao diện Dashboard hiển thị các biểu đồ và thẻ thông số (Cards).
- **Loại dữ liệu**:
  - Thống kê cán bộ dựa trên dữ liệu thực tế trong hệ thống.
  - Thống kê tài chính (Quỹ) dựa trên các giá trị tổng hợp giả lập (Conceptual).
- **Trực quan hóa**: Sử dụng các loại biểu đồ cơ bản (Pie chart, Bar chart, Line chart).

## 2. Ngoài phạm vi (OUT Scope)

- **Xuất dữ liệu**: Không hỗ trợ xuất file Excel, PDF, CSV trong giai đoạn này.
- **Báo cáo chi tiết**: Không bao gồm việc xem danh sách chi tiết các bản ghi cấu thành nên số liệu trên biểu đồ (Drill-down).
- **Tùy chỉnh biểu đồ**: Không có chức năng kéo thả hoặc tự tạo biểu đồ theo yêu cầu người dùng (Ad-hoc reporting).
- **Kế toán**: Không xử lý các nghiệp vụ kế toán, thu chi chi tiết hoặc hóa đơn.

## 3. Ràng buộc & Giả định (Constraints & Assumptions)

- **Chỉ phục vụ Demo**: Dữ liệu và biểu đồ được thiết kế để gây ấn tượng trong các buổi trình diễn tính năng.
- **Không thiết kế lại Database**: Sử dụng các trường dữ liệu hiện có trong thực thể `OfficerProfile` và `User`.
- **Hiệu năng**: Các chỉ số được tính toán real-time hoặc thông qua các API tổng hợp đơn giản, chưa tối ưu cho Big Data (do quy mô MVP nhỏ).
- **Quyền truy cập**: Không có Dashboard dành cho người dùng bình thường (User level).
