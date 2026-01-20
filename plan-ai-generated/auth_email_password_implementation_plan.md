# Email Verification & Password Recovery - Implementation Plan (MVP)

**Ngày tạo:** 2026-01-20  
**Dự án:** Union Officer Management System  
**Phạm vi:** Email Verification + Password Recovery (Normal Users Only)

---

## 1. Tổng quan

### Mục tiêu

Triển khai 2 tính năng bảo mật cơ bản cho hệ thống:

1. **Email Verification**: Xác thực email sau khi đăng ký
2. **Password Recovery**: Khôi phục mật khẩu qua email

### Ràng buộc kỹ thuật

- ✅ MVP only - không over-engineering
- ✅ Email-based verification ONLY (không SMS)
- ✅ Simple token-based verification
- ✅ Không redesign auth system hiện tại
- ✅ Chỉ ADD fields vào User entity, không thay đổi cấu trúc hiện tại
- ✅ Không sử dụng external auth services (Firebase, Auth0, etc.)
- ✅ Áp dụng cho NORMAL USERS ONLY

---

## 2. Backend Implementation

### 2.1. Database Schema Changes

**Thêm vào User Entity** (`user.entity.ts`):

```typescript
// Email Verification Fields
@Column({ default: false })
isEmailVerified: boolean;

@Column({ nullable: true })
emailVerificationToken: string;

@Column({ nullable: true })
emailVerificationTokenExpiresAt: Date;

// Password Reset Fields
@Column({ nullable: true })
passwordResetToken: string;

@Column({ nullable: true })
passwordResetTokenExpiresAt: Date;
```

### 2.2. Email Service

**Tạo module mới:** `src/email/`

Files cần tạo:

- `email.module.ts`
- `email.service.ts`

**Chức năng:**

- Sử dụng `nodemailer`
- Config qua environment variables
- 2 email templates:
  - Email verification
  - Password reset

**Environment Variables cần thêm:**

```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
FRONTEND_URL=
```

### 2.3. Auth Service Updates

**Cập nhật `auth.service.ts`:**

1. **Registration Flow:**
   - Tạo user với `isEmailVerified = false`
   - Generate verification token (random string + expiry)
   - Lưu token vào database
   - Gửi email verification
   - Return success message (không auto-login)

2. **Login Flow:**
   - Kiểm tra `isEmailVerified`
   - Nếu `false` → reject với error message rõ ràng
   - Nếu `true` → proceed như bình thường

3. **Email Verification:**
   - Validate token + expiry
   - Mark `isEmailVerified = true`
   - Clear verification token
   - Return success

4. **Forgot Password:**
   - Validate email exists (không reveal nếu không tồn tại)
   - Generate reset token
   - Lưu token + expiry
   - Gửi email với reset link
   - Return generic success message

5. **Reset Password:**
   - Validate token + expiry
   - Update password (hash mới)
   - Invalidate reset token
   - Return success (không auto-login)

### 2.4. Auth Controller Updates

**Thêm endpoints vào `auth.controller.ts`:**

```typescript
POST /auth/verify-email
  Body: { token: string }
  Response: { success: boolean, message: string }

POST /auth/forgot-password
  Body: { email: string }
  Response: { success: boolean, message: string }

POST /auth/reset-password
  Body: { token: string, newPassword: string }
  Response: { success: boolean, message: string }
```

### 2.5. Security Rules

- ✅ Tokens phải single-use
- ✅ Expired tokens phải bị reject
- ✅ Passwords luôn được hash (bcrypt)
- ✅ Không reveal email existence trong forgot password
- ✅ Token expiry: 24 hours cho email verification, 1 hour cho password reset

---

## 3. Frontend Implementation

### 3.1. Email Verification Flow

**Sau khi register thành công:**

- Show message: "Vui lòng kiểm tra email để xác thực tài khoản"
- Không auto-login
- Redirect về login page

**Tạo page mới:** `VerifyEmailPage.tsx`

- Route: `/verify-email`
- Read token from query params (`?token=xxx`)
- Call API `POST /auth/verify-email`
- Show loading state
- Show success → redirect to login
- Show error → display error message

### 3.2. Password Recovery Flow

**Tạo page:** `ForgotPasswordPage.tsx`

- Route: `/forgot-password`
- Form: email input
- Call API `POST /auth/forgot-password`
- Show generic success message
- Link từ login page

**Tạo page:** `ResetPasswordPage.tsx`

- Route: `/reset-password`
- Read token from query params (`?token=xxx`)
- Form: new password + confirm password
- Basic validation (match passwords)
- Call API `POST /auth/reset-password`
- Show success → redirect to login
- Show error → display error message

### 3.3. UI/UX Requirements

- ✅ TailwindCSS only
- ✅ Không redesign existing pages
- ✅ Clear instructions
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive (mobile + desktop)

### 3.4. Service Updates

**Cập nhật `authService.ts`:**

```typescript
verifyEmail(token: string)
forgotPassword(email: string)
resetPassword(token: string, newPassword: string)
```

### 3.5. Routing Updates

**Thêm routes vào router:**

```typescript
/verify-email
/forgot-password
/reset-password
```

---

## 4. Out of Scope (Explicit)

❌ Admin password reset  
❌ SMS verification  
❌ OAuth / social login  
❌ Resend verification email  
❌ Password strength policies (beyond basic)  
❌ CAPTCHA  
❌ Rate limiting  
❌ Email HTML templates (plain text OK)  
❌ Background jobs / queues

---

## 5. Implementation Order

### Phase 1: Backend Setup

1. ✅ Install nodemailer
2. ✅ Update User entity với new fields
3. ✅ Create migration
4. ✅ Create Email module + service
5. ✅ Update Auth service với verification logic
6. ✅ Update Auth controller với new endpoints
7. ✅ Update environment variables

### Phase 2: Backend Testing

1. ✅ Test registration → email sent
2. ✅ Test email verification → user activated
3. ✅ Test login blocked nếu not verified
4. ✅ Test forgot password → email sent
5. ✅ Test reset password → password updated

### Phase 3: Frontend Implementation

1. ✅ Update RegisterPage → show verification message
2. ✅ Create VerifyEmailPage
3. ✅ Create ForgotPasswordPage
4. ✅ Create ResetPasswordPage
5. ✅ Update authService
6. ✅ Update routing
7. ✅ Add links (login → forgot password)

### Phase 4: Integration Testing

1. ✅ Test full registration → verification → login flow
2. ✅ Test full forgot → reset → login flow
3. ✅ Test error cases (expired tokens, invalid tokens)

---

## 6. Assumptions & Limitations

### Assumptions

- SMTP server credentials sẽ được cung cấp qua .env
- Frontend URL sẽ được config qua .env
- Email delivery là synchronous (không queue)
- Plain text email templates là acceptable cho MVP

### Limitations

- Không có resend verification email
- Không có email HTML templates
- Không có rate limiting
- Không có CAPTCHA
- Token expiry cố định (không configurable)
- Không track số lần reset password

---

## 7. Files sẽ được tạo/sửa

### Backend - New Files

- `src/email/email.module.ts`
- `src/email/email.service.ts`
- `src/migrations/XXXX-add-email-verification-fields.ts`

### Backend - Modified Files

- `src/users/user.entity.ts`
- `src/auth/auth.service.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.module.ts`
- `src/app.module.ts`
- `.env`
- `.env.example`

### Frontend - New Files

- `src/pages/VerifyEmailPage.tsx`
- `src/pages/ForgotPasswordPage.tsx`
- `src/pages/ResetPasswordPage.tsx`

### Frontend - Modified Files

- `src/pages/RegisterPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/services/authService.ts`
- `src/routes/index.tsx`

---

## 8. Stop Condition

Task hoàn thành khi:

- ✅ User có thể register → nhận email → verify → login
- ✅ User có thể forgot password → nhận email → reset → login
- ✅ Login bị block nếu email chưa verified
- ✅ All error cases được handle properly
- ✅ Documentation được tạo tại `/plan-ai-generated/auth_email_password_notes.md`

**Sau khi hoàn thành, STOP và chờ Human Reviewer approval.**

---

## 9. Next Steps After Approval

Không có. Task này là standalone và không trigger các modules khác.
