# API Contracts: Admin Dashboard

## 1. Lấy tổng hợp thông số Dashboard

- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Auth**: Required (Bearer Token - Admin only)

### Cấu trúc Response (Success: 200 OK)

```json
{
  "officerStats": {
    "total": 125,
    "byStatus": {
      "active": 120,
      "inactive": 5
    },
    "byDepartment": [
      { "type": "OFFICE", "count": 25 },
      { "type": "ORGANIZATION", "count": 30 },
      { "type": "PROPAGANDA_EDUCATION", "count": 20 },
      { "type": "POLICIES_LAWS", "count": 25 },
      { "type": "WOMEN_AFFAIRS", "count": 25 }
    ],
    "byPosition": [
      { "type": "PRESIDENT", "count": 5 },
      { "type": "VICE_PRESIDENT", "count": 10 },
      { "type": "EXECUTIVE_COMMITTEE_MEMBER", "count": 30 },
      { "type": "BOARD_MEMBER", "count": 20 },
      { "type": "SPECIALIZED_OFFICER", "count": 60 }
    ]
  },
  "timeStats": {
    "joinTrend": [
      { "label": "2023-01", "count": 10 },
      { "label": "2023-02", "count": 15 },
      { "label": "2023-03", "count": 8 }
      // ... tiếp tục 12 tháng gần nhất
    ]
  },
  "fundStats": {
    "totalAmount": 1500000000,
    "currency": "VND",
    "byDepartment": [
      { "type": "OFFICE", "amount": 300000000 },
      { "type": "ORGANIZATION", "amount": 400000000 }
      // ...
    ],
    "yearlyTrend": [
      { "year": 2021, "amount": 1000000000 },
      { "year": 2022, "amount": 1200000000 },
      { "year": 2023, "amount": 1500000000 }
    ]
  }
}
```

## 2. Các mã lỗi có thể gặp

- `401 Unauthorized`: Chưa đăng nhập hoặc Token hết hạn.
- `403 Forbidden`: Người dùng không có quyền Admin.
- `500 Internal Server Error`: Lỗi xử lý logic phía server hoặc lỗi kết nối database.
