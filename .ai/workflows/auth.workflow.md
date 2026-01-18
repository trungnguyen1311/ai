# AUTH WORKFLOW – ORCHESTRATION CHO PHÂN HỆ XÁC THỰC

## 1. Mục tiêu của Workflow

Workflow này mô tả **thứ tự điều phối các AI Agent** để triển khai phân hệ Auth dựa trên `auth.skill.md`, với mục tiêu:

* AI làm phần lớn công việc (≈80%)
* Human chỉ đóng vai trò **Reviewer / Approver**
* Hoàn thành trong thời gian ngắn (MVP 2 ngày)

---

## 2. Các Agent tham gia

* **Backend Agent**: xử lý toàn bộ logic xác thực phía server
* **Frontend Agent**: xây dựng luồng giao diện và kết nối API
* **UI Agent**: tinh chỉnh trải nghiệm và thẩm mỹ
* **Human Reviewer**: kiểm tra, duyệt, điều chỉnh nhỏ nếu cần

---

## 3. Input & Output tổng thể

### Input

* `auth.skill.md`
* Yêu cầu MVP (đăng ký, đăng nhập, phân quyền cơ bản)

### Output

* Backend Auth APIs hoạt động
* Frontend Auth Flow hoạt động
* UI Auth Screen rõ ràng, dễ demo

---

## 4. Workflow chi tiết theo từng bước

### Step 1 – Backend Design (Backend Agent)

**Mục tiêu:** Thiết kế nhanh cấu trúc backend cho Auth.

**Agent thực hiện:** Backend Agent

**Nhiệm vụ:**

* Đề xuất schema User tối thiểu
* Đề xuất danh sách API endpoints
* Đề xuất cách lưu token (JWT hoặc session)

**Ràng buộc:**

* Tuân theo `backend-development`
* Tuân theo `better-auth`
* Không over-engineering

**Output:**

* Bản thiết kế ngắn gọn (markdown hoặc comment)

---

### Step 2 – Backend Implementation (Backend Agent)

**Mục tiêu:** Sinh code backend chạy được cho Auth.

**Agent thực hiện:** Backend Agent

**Nhiệm vụ:**

* Implement các API đã thiết kế
* Hash mật khẩu
* Sinh & verify token
* Middleware phân quyền

**Human Checkpoint:**

* Reviewer chỉ kiểm tra:

  * API có đúng luồng không
  * Có crash logic không

**Output:**

* Backend auth APIs chạy được

---

### Step 3 – Frontend Auth Flow (Frontend Agent)

**Mục tiêu:** Kết nối UI với backend Auth.

**Agent thực hiện:** Frontend Agent

**Nhiệm vụ:**

* Tạo trang Login / Register
* Call API login / register
* Lưu token (localStorage hoặc cookie)
* Guard route theo trạng thái login

**Ràng buộc:**

* Tuân theo `frontend-development`
* Không xử lý logic bảo mật phía client

**Output:**

* Luồng đăng nhập / đăng ký hoạt động

---

### Step 4 – UI Refinement (UI Agent)

**Mục tiêu:** Cải thiện trải nghiệm người dùng.

**Agent thực hiện:** UI Agent

**Nhiệm vụ:**

* Căn chỉnh layout form
* Thêm loading / error state
* Đảm bảo responsive

**Ràng buộc:**

* Tuân theo `ui-styling`
* Tuân theo `aesthetic`
* Ưu tiên rõ ràng, không cầu kỳ

**Output:**

* UI Auth hoàn chỉnh, dễ demo

---

### Step 5 – Final Review & Lock Scope (Human Reviewer)

**Mục tiêu:** Chốt MVP Auth.

**Người thực hiện:** Human

**Checklist:**

* Đăng ký được
* Đăng nhập được
* Reload không mất session
* Admin / User phân luồng đúng

**Hành động:**

* Approve
* Không mở rộng scope

---

## 5. Nguyên tắc Automation (80/20)

* AI Agent sinh code & logic chính
* Human chỉ review & sửa lỗi nghiêm trọng
* Không refactor nếu không cần thiết

---

## 6. Điều kiện kết thúc Workflow

Workflow kết thúc khi:

* Auth chạy ổn định
* Demo được trong 3–5 phút
* Có thể reuse cho các workflow khác (Profile, Admin)

---

## 7. Ghi chú quan trọng

* Workflow này có thể copy & chỉnh sửa cho các phân hệ khác
* Không chỉnh sửa skill trong lúc workflow đang chạy
