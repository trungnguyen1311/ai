# Implementation Plan - Tagging & Change Tracking

## Backend Implementation

### 1. Database & Entities

- Update `OfficerProfile` entity:
  - Add `tags: string[]` column.
- Create `OfficerHistory` entity:
  - `id: uuid`
  - `officerId: string`
  - `type: 'unit' | 'status'`
  - `oldValue: string`
  - `newValue: string`
  - `note: string`
  - `changeDate: Date`

### 2. DTOs

- Update `OfficerQueryDto` to include `tags` filter.
- Update `UpdateOfficerDto` if needed to include `tags`.

### 3. Service Logic (`AdminOfficerService`)

- Update `update` method:
  - Detect changes in `department` (unit).
  - Detect changes in `isActive` (status).
  - Create history records.
- Implement `getHistory(officerId)` method.
- Update `findAll` to filter by tags.

### 4. Controller

- Add `GET /admin/officers/:id/history` endpoint.

## Frontend Implementation

### 1. Services

- Add `getOfficerHistory(id)` to `adminService`.

### 2. Officer List Page

- Add Tag filter to the search bar/filter section.

### 3. Officer Detail Page

- Add Tags management section (Predefined tags: "Cán bộ nguồn", "Chuẩn bị nghỉ hưu", "Cán bộ nữ", "Cán bộ trẻ").
- Add History timeline section.
