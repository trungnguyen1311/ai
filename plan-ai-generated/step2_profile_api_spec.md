# API Specification: Officer Profile

## Base URL
`/api/v1/profile`

## Endpoints

### 1. Get Current User Profile
**GET** `/me`

**Headers:**
- `Authorization`: `Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "uuid-...",
  "employeeId": "CB001",
  "fullName": "Nguyen Van A",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "nationalId": "079090...",
  "phoneNumber": "0987654321",
  "personalEmail": "a.nguyen@gmail.com",
  "address": "123 Street, City",
  "unionPosition": "Member",
  "department": "IT Dept",
  "joinDate": "2020-05-15",
  "isPartyMember": true
}
```

**Errors:**
- `401 Unauthorized`: Invalid/Missing Token.
- `404 Not Found`: Profile not created yet for this user.

---

### 2. Update Contact Information
**PATCH** `/me`

**Headers:**
- `Authorization`: `Bearer <token>`

**Body (JSON - Partial Update):**
```json
{
  "phoneNumber": "0912345678",
  "personalEmail": "new.email@gmail.com",
  "address": "456 New St"
}
```
*Note: Only these fields are accepted. Others are ignored or rejected.*

**Validation Rules:**
- `phoneNumber`: Optional, string, valid VN phone format.
- `personalEmail`: Optional, valid email.
- `address`: Optional, string, max 500 chars.

**Response (200 OK):**
- Returns the updated User Profile object (same structure as GET).

**Errors:**
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`.
