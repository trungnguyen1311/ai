# Hợp đồng API (API Contracts): Admin Officer Management

Toàn bộ các API dưới đây yêu cầu Header: `Authorization: Bearer <JWT_TOKEN>` của tài khoản Admin.

## 1. Lấy danh sách cán bộ

- **Endpoint**: `GET /admin/officers`
- **Tham số Query**:
  - `page`: Số trang (mặc định 1)
  - `limit`: Số bản ghi mỗi trang (mặc định 10)
- **Phản hồi thành công (200 OK)**:

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "abc@example.com",
      "fullName": "Nguyễn Văn A",
      "role": "USER",
      "isActive": true,
      "unionPosition": "Chủ tịch",
      "department": "Phòng Công nghệ"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## 2. Xem chi tiết hồ sơ cán bộ

- **Endpoint**: `GET /admin/officers/:id`
- **Phản hồi thành công (200 OK)**:

```json
{
  "id": "uuid",
  "email": "abc@example.com",
  "isActive": true,
  "profile": {
    "fullName": "Nguyễn Văn A",
    "employeeId": "NV001",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "nationalId": "123456789",
    "phoneNumber": "0901234567",
    "personalEmail": "personal@gmail.com",
    "address": "Địa chỉ liên lạc...",
    "unionPosition": "Chủ tịch",
    "department": "Phòng Công nghệ",
    "joinDate": "2020-01-01",
    "isPartyMember": false
  }
}
```

## 3. Cập nhật trạng thái tài khoản

- **Endpoint**: `PATCH /admin/officers/:id/status`
- **Body**:

```json
{
  "isActive": false
}
```

- **Phản hồi thành công (200 OK)**:

```json
{
  "message": "Trạng thái tài khoản đã được cập nhật thành công",
  "isActive": false
}
```

- **Lỗi thường gặp**:
  - `403 Forbidden`: Nếu không phải Admin.
  - `404 Not Found`: Nếu không tìm thấy User ID.
