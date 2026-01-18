# AUTH SKILL – XÁC THỰC & QUẢN LÝ TÀI KHOẢN

## Technology Stack
- Frontend: ReactJS
- Backend: NestJS
- Database: PostgreSQL

## 1. Mục tiêu (Goal)

Xây dựng phân hệ **Xác thực & Quản lý tài khoản** cho hệ thống quản lý cán bộ công đoàn, đảm bảo:

* Đăng ký / đăng nhập hoạt động ổn định
* Có xác thực email (mock hoặc real)
* Phân quyền cơ bản (Admin / User)
* Đủ dùng cho MVP trong 2 ngày

Skill này **không yêu cầu code đẹp**, ưu tiên **đúng luồng – chạy được – dễ demo**.

---

## 2. Phạm vi chức năng (Scope)

### Bao gồm

* Đăng ký tài khoản (email + mật khẩu)
* Đăng nhập / đăng xuất
* Quên mật khẩu (mock flow)
* Đổi mật khẩu
* Lưu session / token
* Phân quyền cơ bản: Admin / User

### Không bao gồm (Out of scope)

* OAuth (Google, Facebook)
* Bảo mật nâng cao (Explainable hashing, rate limit phức tạp)
* RBAC chi tiết theo nghiệp vụ

---

## 3. Agent tham gia & trách nhiệm

### 3.1 Backend Agent

**Vai trò:** Xây dựng toàn bộ logic xác thực phía server.

**Nhiệm vụ:**

* Thiết kế model User
* API endpoints: register, login, logout, forgot-password, change-password
* Hash mật khẩu
* Sinh và validate token (JWT hoặc session đơn giản)
* Middleware kiểm tra quyền

**Ràng buộc bắt buộc:**

* Tuân theo `backend-development`
* Tuân theo `better-auth`
* Ưu tiên đơn giản, dễ debug

---

### 3.2 Frontend Agent

**Vai trò:** Kết nối UI với API, đảm bảo luồng sử dụng mượt.

**Nhiệm vụ:**

* Trang đăng ký
* Trang đăng nhập
* Trang đổi mật khẩu
* Lưu trạng thái đăng nhập (localStorage / cookie)
* Guard route (chưa login thì redirect)

**Ràng buộc bắt buộc:**

* Tuân theo `frontend-development`
* Không hardcode logic bảo mật

---

### 3.3 UI Agent

**Vai trò:** Thiết kế trải nghiệm người dùng cơ bản, rõ ràng.

**Nhiệm vụ:**

* Layout form auth nhất quán
* Trạng thái loading / error / success rõ ràng
* Responsive mobile + desktop

**Ràng buộc bắt buộc:**

* Tuân theo `ui-styling`
* Tuân theo `aesthetic`
* Không overdesign

---

## 4. Reference Capability Skills

Skill này **PHẢI tham chiếu** các capability skills sau:

* backend-development
* better-auth
* frontend-development
* ui-styling
* aesthetic

---

## 5. Luồng nghiệp vụ chính (Workflow)

### 5.1 Đăng ký

1. User nhập email + mật khẩu
2. Backend validate dữ liệu
3. Hash mật khẩu
4. Lưu user với role = User
5. (Optional) Gửi email xác thực (mock)
6. Trả kết quả thành công

### 5.2 Đăng nhập

1. User nhập email + mật khẩu
2. Backend kiểm tra hash
3. Sinh token
4. Frontend lưu token
5. Redirect vào dashboard

### 5.3 Phân quyền

* Admin: truy cập admin routes
* User: truy cập profile cá nhân

---

## 6. Định nghĩa dữ liệu tối thiểu (Minimal Schema)

**User**

* id
* email
* passwordHash
* role (ADMIN | USER)
* isActive
* createdAt

---

## 7. Tiêu chí hoàn thành (Definition of Done)

* Có thể đăng ký và đăng nhập thành công
* Reload page vẫn giữ trạng thái login
* Admin và User có luồng khác nhau
* Không crash
* Demo được trong 3–5 phút

---

## 8. Nguyên tắc AI Agent phải tuân thủ

* Không tự ý mở rộng scope
* Không thêm công nghệ phức tạp nếu không cần
* Ưu tiên hoàn thành nhanh, ổn định
* Dev (human) đóng vai trò Reviewer, không phải coder chính

---

## 9. Ghi chú cho Reviewer (Human)

* Có thể chấp nhận code xấu nếu chạy được
* Chỉ sửa khi có bug nghiêm trọng
* Đánh giá theo luồng, không theo style code
