# Kế hoạch Sản phẩm: Admin Dashboard – Báo cáo & Thống kê

## 1. Mục tiêu cốt lõi

- Cung cấp cái nhìn tổng quan nhanh chóng về tình hình cán bộ công đoàn dành cho cấp quản lý.
- Hỗ trợ ra quyết định dựa trên dữ liệu và phục vụ công tác báo cáo cho ban lãnh đạo.
- Xây dựng giao diện dashboard trực quan, hiện đại, sẵn sàng cho việc trình diễn (demo-ready).

## 2. Các phân mục Dashboard (Conceptual)

- **Hàng chỉ số tổng quát (Top Stats Cards)**: Hiển thị các con số quan trọng nhất như Tổng số cán bộ, Số cán bộ mới trong tháng, Tổng quỹ công đoàn hiện tại.
- **Phân tích Cơ cấu Cán bộ (Demographic Analysis)**:
  - Biểu đồ tròn thể hiện tỷ lệ cán bộ theo **Phòng ban (Department)**.
  - Biểu đồ cột chồng thể hiện **Chức vụ công đoàn (Union Position)** tại từng phòng ban.
  - Biểu đồ tròn thể hiện trạng thái hoạt động (Active vs Inactive).
- **Biến động Nhân sự (Growth Trend)**: Biểu đồ đường (Area Chart) thể hiện xu hướng số lượng cán bộ gia nhập hệ thống theo các mốc thời gian (tháng/năm).
- **Tổng quan Tài chính (Financial Overview)**:
  - Biểu đồ cột thể hiện nguồn thu/kinh phí công đoàn phân bổ cho từng đơn vị.
  - Biểu đồ đường xu hướng nguồn quỹ qua các năm.

## 3. Làm rõ khái niệm "Doanh thu" (Revenue)

Trong ngữ cảnh hệ thống quản lý Công đoàn:

- **Revenue (Nguồn thu)**: Ở đây được hiểu là **Quỹ công đoàn (Union Fund)** hoặc **Ngân sách hoạt động (Operational Budget)** của tổ chức.
- **Nguồn gốc**: Đến từ công đoàn phí, kinh phí công đoàn cấp trên cấp, hoặc các nguồn thu hợp pháp khác theo quy định.
- **Mục đích**: Dữ liệu này chỉ mang tính chất báo cáo thống kê tổng quát phục vụ demo, không thay thế cho các phần mềm kế toán tài chính chuyên dụng.
- **Đặc tính**: Dữ liệu chỉ đọc (read-only) trên dashboard, được tổng hợp từ các nguồn dữ liệu hệ thống.
