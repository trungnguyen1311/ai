# User Profile Extension Notes

## Overview

This document details the additive updates made to the Union Officer Management System to extend the User (Officer) Profile.

## Newly Added Fields

### Personal Information

- `dateOfBirth` (Date): Ngày sinh
- `gender` (Enum: Male, Female, Other): Giới tính
- `nationalId` (String): CCCD / CMND

### Union & Work Information

- `unitName` (String): Đơn vị công tác (External Organization)
- `workStatus` (Enum: ACTIVE, TRANSFERRED, RETIRED): Tình trạng công tác

### Professional Profile

- `education` (Text): Trình độ & học vấn
- `experience` (Text): Kinh nghiệm công tác & nghiên cứu
- `skills` (Text): Kỹ năng & năng lực
- `achievements` (Text): Thành tích – khen thưởng – kỷ luật

## Database & Schema

- **Entity Modified**: `OfficerProfile` (Linked 1:1 with `User`)
- **Existing Columns**: strict adherence to "DO NOT remove or rename" rule. All existing columns (`fullName`, `phoneNumber`, `personalEmail`, `address`, `unionPosition`, `department`, `joinDate`, `employeeId`, `isPartyMember`, `tags`) remain untouched.

## Assumptions for MVP

1. **Self-Editing**: Users are permitted to edit all new fields, including `WorkStatus` and `UnitName`, via their profile page. No approval workflow is currently enforced.
2. **Work Status**: The `WorkStatus` is implemented as an Enum (`ACTIVE`, `TRANSFERRED`, `RETIRED`). It defaults to `ACTIVE`.
3. **Data Types**: Professional profile fields are implemented as `TEXT` to allow flexibility for the MVP phase.
4. **Unit Name**: `unitName` is added as a separate string field to capture the officer's working unit, distinct from the internal Union `department` (e.g., Ban Tuyên giáo).
