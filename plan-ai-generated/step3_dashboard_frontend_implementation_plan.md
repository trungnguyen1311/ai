# Kế hoạch Triển khai Frontend: Admin Dashboard

## 1. Công nghệ & Thư viện

- **Framework**: ReactJS + TailwindCSS.
- **Thư viện Biểu đồ**: `recharts` (phổ biến, dễ tùy biến và responsive tốt).
- **Icons**: `lucide-react` (visual sạch sẽ, hiện đại).
- **Quản lý State**: React Hooks (useState, useEffect) kết hợp Axios cho API calls.

## 2. Cấu trúc Trang (Layout)

Trang Admin Dashboard sẽ bao gồm:

- **Header**: Tiêu đề trang và các nút thao tác nhanh (ví dụ: Refresh dữ liệu).
- **Hàng chỉ số (KPI Cards)**: 4 thẻ hiển thị Tổng số cán bộ, Đang hoạt động, Tổng quỹ, và Tỷ lệ tăng trưởng (giả lập).
- **Khu vực Biểu đồ**:
  - Grid 2 cột: Biểu đồ tròn (Cơ cấu phòng ban) và Biểu đồ cột (Phân bổ chức vụ).
  - Hàng đầy đủ: Biểu đồ đường/vùng (Xu hướng cán bộ gia nhập).
  - Hàng đầy đủ: Biểu đồ tài chính (Kinh phí theo đơn vị).

## 3. Các thành phần chính (Components)

- `StatCard`: Thể hiện con số tổng quát kèm icon và màu sắc đặc trưng.
- `OfficerDistributionChart`: Biểu đồ tròn/cột cho nhân sự.
- `FundTrendChart`: Biểu đồ xu hướng tài chính.
- `DashboardSkeleton`: Hiệu ứng loading dạng skeleton để tăng trải nghiệm người dùng.

## 4. Luồng dữ liệu (Data Flow)

1. User truy cập `/admin/dashboard`.
2. `AdminDashboardPage` gọi API `adminService.getDashboardStats()`.
3. Dữ liệu trả về được phân phối xuống các component biểu đồ.
4. Xử lý lỗi: Hiển thị thông báo nếu API lỗi hoặc người dùng không có quyền.

## 5. Thẩm mỹ & Trải nghiệm (Aesthetics)

- Sử dụng bảng màu hiện đại (Modern color palette: Indigo, Emerald, Amber, Rose).
- Hiệu ứng Hover trên các thẻ và biểu đồ.
- Tận dụng Glassmorphism cho các container nếu phù hợp.
- Responsive phối hợp tốt trên cả màn hình Desktop lớn và Tablet.
