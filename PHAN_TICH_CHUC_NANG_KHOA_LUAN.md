# PHÂN TÍCH CHỨC NĂNG HỆ THỐNG QUẢN LÝ Y TẾ

## PHẦN 1: CÔNG NGHỆ SỬ DỤNG

### Backend

**Ngôn ngữ lập trình:** TypeScript (ES2021)

**Framework:** NestJS 11.x - Framework Node.js theo kiến trúc modular, hỗ trợ dependency injection và decorators

**Thư viện chính:**
- **Fastify** - HTTP server framework thay thế Express, tối ưu hiệu năng
- **Prisma** 6.8.2 - ORM (Object-Relational Mapping) cho PostgreSQL
- **Passport** - Middleware xác thực với Local Strategy và JWT Strategy
- **JWT** (@nestjs/jwt) - Xử lý token xác thực
- **bcryptjs** - Mã hóa mật khẩu
- **class-validator & class-transformer** - Validation và transform dữ liệu
- **Zod** - Schema validation runtime
- **Socket.io** - WebSocket cho real-time communication
- **BullMQ** - Queue management cho background jobs
- **@nestjs/schedule** - Task scheduling (cron jobs)

**Kiến trúc:** Modular architecture với separation of concerns: Controller → Service → Database Service → Prisma Client

### Frontend

**Framework:** React 19.x với TypeScript

**Build tool:** Vite 6.x - Build tool hiện đại, hỗ trợ HMR (Hot Module Replacement)

**State management:**
- **TanStack Query (React Query)** 5.x - Server state management, caching, synchronization
- **React Hooks** - Local component state

**Routing:** React Router DOM 7.x - Client-side routing

**UI Libraries:**
- **Radix UI** - Headless UI components (Dialog, Select, Dropdown, Tabs, etc.)
- **Tailwind CSS** 4.x - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

**Data visualization:**
- **ECharts** & **echarts-for-react** - Biểu đồ và visualization
- **Recharts** - React charting library

**Form handling:**
- **React Hook Form** - Form state management
- **Zod** - Schema validation kết hợp với @hookform/resolvers

**HTTP Client:** Axios - Promise-based HTTP client

### Database

**Hệ quản trị cơ sở dữ liệu:** PostgreSQL

**ORM:** Prisma Client - Type-safe database client với auto-generated types

**Migration:** Prisma Migrate - Quản lý schema versioning và migrations

**Query method:** Prisma Query API - Type-safe queries với support cho relations, filtering, pagination

### Giao tiếp & Hạ tầng

**API Protocol:** RESTful API

**Real-time Communication:** WebSocket (Socket.io) - Cho notifications và real-time updates

**Containerization:** Docker - Containerization cho deployment

**Deployment:** Render.com (Backend), Vercel (Frontend có thể)

**Environment:** Node.js runtime environment

**Configuration:** Environment variables (.env) với @nestjs/config

### Công cụ & Công nghệ khác

**Authentication:**
- JWT (JSON Web Tokens) - Access token và refresh token
- Passport Local Strategy - Xác thực bằng username/password
- Passport JWT Strategy - Xác thực bằng JWT token
- HTTP-only cookies - Lưu trữ token an toàn

**Validation:**
- Zod schemas - Runtime type validation
- class-validator decorators - DTO validation
- Custom validation pipes - NestJS validation pipeline

**Error Handling:**
- Global exception filter - Xử lý lỗi tập trung
- Custom error service - Chuẩn hóa error responses

**Logging:**
- Custom Logger Service - Structured logging
- Request logger middleware - Log HTTP requests

**Testing:**
- Jest - Testing framework
- Supertest - HTTP assertion library cho E2E testing

**Development Tools:**
- ESLint - Code linting
- Prettier - Code formatting
- TypeScript - Static type checking
- SWC - Fast TypeScript/JavaScript compiler

---

## PHẦN 2: PHÂN TÍCH CHỨC NĂNG

---

## CHỨC NĂNG 1: QUẢN LÝ CHUYÊN KHOA

### 1. Mô tả nghiệp vụ (Business Logic)

**Đối tượng sử dụng:**
- **ADMIN** - Quản trị viên hệ thống có toàn quyền quản lý chuyên khoa
- **DOCTOR** - Bác sĩ có quyền xem danh sách chuyên khoa để tham khảo

**Mục đích nghiệp vụ:**
Chức năng quản lý chuyên khoa cho phép hệ thống tổ chức và phân loại các bác sĩ theo chuyên môn y khoa. Đây là nền tảng để gán bác sĩ vào đúng chuyên khoa, hỗ trợ bệnh nhân tìm kiếm bác sĩ phù hợp, và quản lý cấu trúc tổ chức của hệ thống y tế.

**Vấn đề thực tế được giải quyết:**
Trong môi trường y tế thực tế, việc quản lý chuyên khoa thủ công gặp nhiều khó khăn:
- Khó khăn trong việc cập nhật thông tin chuyên khoa khi có thay đổi
- Thiếu tính nhất quán trong cách phân loại và đặt tên chuyên khoa
- Khó khăn trong việc tìm kiếm và lọc chuyên khoa khi số lượng lớn
- Không có cơ chế kiểm soát việc xóa chuyên khoa đang được sử dụng bởi bác sĩ
- Thiếu khả năng vô hiệu hóa tạm thời chuyên khoa mà không mất dữ liệu

Hệ thống tự động hóa giải quyết các vấn đề trên thông qua việc cung cấp giao diện quản lý tập trung, validation dữ liệu, và ràng buộc toàn vẹn dữ liệu.

### 2. Quy trình xử lý (Workflow)

#### 2.1. Tạo mới chuyên khoa

**Bước 1: Người dùng thao tác**
- Admin truy cập trang quản lý chuyên khoa
- Click nút "Tạo mới" để mở dialog form
- Điền thông tin: mã chuyên khoa (code), tên tiếng Việt, tên tiếng Anh (tùy chọn), mô tả (tùy chọn), thứ tự sắp xếp
- Click "Lưu" để submit form

**Bước 2: Frontend xử lý và gửi dữ liệu**
- Frontend validate form bằng Zod schema (client-side validation)
- Kiểm tra các trường bắt buộc: code, name
- Nếu validation thành công, gọi API `POST /major-doctors` với payload:
  ```json
  {
    "code": "DA_LIEU",
    "name": "Da liễu",
    "nameEn": "Dermatology",
    "description": "Chuyên khoa da liễu",
    "isActive": true,
    "sortOrder": 0
  }
  ```
- Gửi kèm JWT token trong Authorization header

**Bước 3: Backend tiếp nhận request**
- Controller `MajorController.create()` nhận request
- JWT Guard kiểm tra token hợp lệ và extract user info
- Kiểm tra quyền: chỉ ADMIN mới được phép tạo
- Validation Pipe (ZodValidationPipe) validate DTO theo schema

**Bước 4: Service xử lý business logic**
- `MajorService.create()` được gọi
- Kiểm tra mã chuyên khoa đã tồn tại chưa bằng query: `findUnique({ where: { code } })`
- Nếu mã đã tồn tại → throw ConflictException
- Nếu chưa tồn tại → tạo mới record trong bảng `MajorDoctorTable` bằng Prisma `create()`

**Bước 5: Trả kết quả về frontend**
- Backend trả về object chuyên khoa vừa tạo (bao gồm id, timestamps)
- Frontend nhận response, hiển thị toast success
- Invalidate React Query cache để refetch danh sách
- Đóng dialog và reset form

#### 2.2. Xem danh sách chuyên khoa

**Bước 1: Người dùng thao tác**
- Admin/Doctor truy cập trang quản lý chuyên khoa
- Hệ thống tự động load danh sách khi component mount

**Bước 2: Frontend gửi request**
- Gọi API `GET /major-doctors` với query params:
  - `page`: số trang (mặc định 1)
  - `limit`: số lượng mỗi trang (mặc định 10)
  - `search`: từ khóa tìm kiếm (tùy chọn)
  - `isActive`: lọc theo trạng thái (tùy chọn)
  - `sortBy`: trường sắp xếp (mặc định createdAt)
  - `sortOrder`: thứ tự (asc/desc)

**Bước 3: Backend xử lý**
- Controller nhận request và kiểm tra quyền (ADMIN hoặc DOCTOR)
- Service `findAll()` xây dựng điều kiện WHERE:
  - Nếu có `search`: tìm trong `name`, `code`, `nameEn` (case-insensitive)
  - Nếu có `isActive`: filter theo trạng thái
- Thực hiện query với pagination: `findMany({ skip, take, orderBy, include: { _count: { select: { doctors: true } } } })`
- Đếm tổng số records: `count({ where })`
- Tính toán pagination metadata (totalPages, hasNextPage, etc.)

**Bước 4: Trả kết quả**
- Response format:
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```
- Frontend render danh sách vào bảng, hiển thị pagination controls

#### 2.3. Cập nhật chuyên khoa

**Bước 1-2:** Tương tự tạo mới, nhưng gọi `PATCH /major-doctors/:id`

**Bước 3: Backend validation**
- Kiểm tra chuyên khoa tồn tại: `findUnique({ where: { id } })`
- Nếu cập nhật `code`: kiểm tra code mới không trùng với code khác
- Nếu trùng → throw ConflictException

**Bước 4: Cập nhật dữ liệu**
- `update({ where: { id }, data: updateDto })`
- Trả về record đã cập nhật

#### 2.4. Xóa chuyên khoa

**Bước 1:** Admin click nút xóa, xác nhận trong dialog

**Bước 2:** Gọi `DELETE /major-doctors/:id`

**Bước 3: Backend kiểm tra ràng buộc**
- Query chuyên khoa kèm `_count.doctors` (số bác sĩ đang sử dụng)
- Nếu `_count.doctors > 0` → throw ConflictException với message rõ ràng
- Nếu không có bác sĩ nào → thực hiện `delete({ where: { id } })`

### 3. Phân tích truy vấn dữ liệu (Database Interaction)

**Bảng chính:** `MajorDoctorTable`

**Các thao tác CRUD:**

**CREATE:**
- INSERT vào bảng `MajorDoctorTable`
- Các trường: `id` (UUID auto-generated), `code`, `name`, `nameEn`, `description`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`

**READ:**
- SELECT với WHERE conditions (search, isActive filter)
- JOIN với bảng `User` (relation `doctors`) để đếm số bác sĩ: `include: { _count: { select: { doctors: true } } }`
- Pagination: `skip` và `take`
- Sorting: `orderBy`

**UPDATE:**
- UPDATE bảng `MajorDoctorTable` WHERE `id = ?`
- Có thể cập nhật một phần các trường (partial update)

**DELETE:**
- DELETE từ bảng `MajorDoctorTable` WHERE `id = ?`
- Có kiểm tra ràng buộc: không cho xóa nếu có bác sĩ đang sử dụng

**Quan hệ dữ liệu:**
- `MajorDoctorTable` có quan hệ 1-n với `User` (một chuyên khoa có nhiều bác sĩ)
- Foreign key: `User.majorDoctorId` → `MajorDoctorTable.id`

**Truy vấn đặc biệt:**
- `GET /major-doctors/active`: SELECT chỉ các record có `isActive = true`, sắp xếp theo `sortOrder`, chỉ lấy các trường cần thiết cho dropdown

### 4. Luồng dữ liệu & tính nhất quán

**Dữ liệu đầu vào (Create/Update):**
- `code` (string, required, unique) - Mã định danh chuyên khoa, không được trùng
- `name` (string, required) - Tên tiếng Việt
- `nameEn` (string, optional) - Tên tiếng Anh
- `description` (string, optional) - Mô tả
- `isActive` (boolean, default: true) - Trạng thái hoạt động
- `sortOrder` (number, default: 0) - Thứ tự sắp xếp

**Kiểm soát tính nhất quán:**
- **Uniqueness constraint:** Mã chuyên khoa (`code`) phải unique, được kiểm tra ở cả database level (unique index) và application level (service validation)
- **Referential integrity:** Không cho phép xóa chuyên khoa nếu có bác sĩ đang sử dụng (kiểm tra `_count.doctors`)
- **Status constraint:** Không cho phép vô hiệu hóa chuyên khoa nếu có bác sĩ đang sử dụng (khi update status)
- **Validation:** Zod schema đảm bảo kiểu dữ liệu và format đúng trước khi lưu vào database

### 5. Phân quyền & bảo mật

**Quyền truy cập:**

**ADMIN:**
- ✅ Tạo mới chuyên khoa (`POST /major-doctors`)
- ✅ Xem danh sách (`GET /major-doctors`)
- ✅ Xem chi tiết (`GET /major-doctors/:id`)
- ✅ Cập nhật (`PATCH /major-doctors/:id`)
- ✅ Cập nhật trạng thái (`PATCH /major-doctors/:id/status`)
- ✅ Xóa (`DELETE /major-doctors/:id`)

**DOCTOR:**
- ❌ Không được tạo, cập nhật, xóa
- ✅ Chỉ được xem danh sách (`GET /major-doctors`)
- ✅ Xem danh sách active (`GET /major-doctors/active`)

**PATIENT:**
- ❌ Không có quyền truy cập chức năng này

**Cơ chế bảo mật:**
- Tất cả endpoints đều yêu cầu JWT authentication (trừ `/active` có thể public)
- JWT Guard kiểm tra token hợp lệ và extract user info
- Controller method `ensureAdmin()` kiểm tra role trước khi cho phép thao tác
- HTTP-only cookies lưu trữ token, giảm nguy cơ XSS attack

**Lý do phân quyền:**
- Chuyên khoa là dữ liệu cấu trúc quan trọng của hệ thống, chỉ admin mới có quyền thay đổi
- Bác sĩ cần xem để tham khảo khi đăng ký hoặc cập nhật thông tin
- Phân quyền đảm bảo tính toàn vẹn dữ liệu và tránh thay đổi không mong muốn

---

## CHỨC NĂNG 2: XEM BÁO CÁO TỔNG QUAN

### 1. Mô tả nghiệp vụ (Business Logic)

**Đối tượng sử dụng:**
- **ADMIN** - Quản trị viên hệ thống, người cần theo dõi tổng quan hoạt động của hệ thống

**Mục đích nghiệp vụ:**
Chức năng báo cáo tổng quan cung cấp cho quản trị viên cái nhìn tổng thể về tình trạng hoạt động của hệ thống quản lý y tế. Báo cáo tập trung vào các chỉ số quan trọng như số lượng đơn thuốc, số bệnh nhân đang điều trị, và tỷ lệ tuân thủ điều trị.

**Vấn đề thực tế được giải quyết:**
Trong quản lý y tế, việc theo dõi và đánh giá hiệu quả hoạt động là rất quan trọng nhưng thường gặp khó khăn:
- Khó khăn trong việc tổng hợp dữ liệu từ nhiều nguồn khác nhau
- Thiếu công cụ để tính toán các chỉ số quan trọng như tỷ lệ tuân thủ
- Không có giao diện trực quan để xem tổng quan nhanh chóng
- Mất thời gian để thống kê thủ công từ các bảng dữ liệu riêng lẻ
- Khó khăn trong việc so sánh và đánh giá xu hướng

Hệ thống tự động hóa việc tính toán và hiển thị các chỉ số quan trọng, giúp quản trị viên nhanh chóng nắm bắt tình hình và đưa ra quyết định quản lý.

### 2. Quy trình xử lý (Workflow)

#### 2.1. Xem báo cáo tổng quan

**Bước 1: Người dùng thao tác**
- Admin đăng nhập và truy cập trang Dashboard
- Hệ thống tự động load báo cáo tổng quan khi component mount
- Admin có thể chọn bác sĩ cụ thể từ dropdown để xem báo cáo theo bác sĩ (nếu có)

**Bước 2: Frontend gửi request**
- Component `DashboardHomepage` sử dụng React Query hook `useOverviewData()`
- Gọi API `GET /admin/reports/overview`
- Nếu có chọn bác sĩ, có thể gửi kèm `doctorId` trong query params
- Gửi kèm JWT token trong Authorization header

**Bước 3: Backend tiếp nhận request**
- Controller `ReportsController.overview()` nhận request
- JWT Guard kiểm tra token hợp lệ
- Kiểm tra quyền: chỉ ADMIN mới được truy cập
- Nếu không phải ADMIN → throw HttpException 403 Forbidden

**Bước 4: Service tính toán dữ liệu**
- `ReportsService.overview()` được gọi
- Thực hiện các query song song bằng `Promise.all()` để tối ưu performance:
  - Đếm tổng số đơn thuốc: `prescription.count()`
  - Đếm số bệnh nhân đang hoạt động: `user.count({ where: { status: ACTIVE } })`
  - Đếm số log tuân thủ (đã uống thuốc): `adherenceLog.count({ where: { status: TAKEN } })`
  - Đếm tổng số prescription items: `prescriptionItem.count()`
- Tính toán tỷ lệ tuân thủ: `adherenceRate = totalTakenLogs / totalPrescriptionItems` (nếu mẫu số > 0)

**Bước 5: Trả kết quả về frontend**
- Response format:
  ```json
  {
    "totalPrescriptions": 150,
    "activePatients": 45,
    "adherenceRate": 0.85
  }
  ```
- Frontend nhận dữ liệu và render:
  - Hiển thị các số liệu trong cards/metrics
  - Vẽ biểu đồ pie chart (ECharts) so sánh số đơn thuốc và số bệnh nhân
  - Hiển thị tỷ lệ tuân thủ dưới dạng phần trăm với màu sắc phù hợp

**Bước 6: Cập nhật real-time (nếu có)**
- React Query tự động refetch theo interval hoặc khi có mutation liên quan
- WebSocket có thể push update nếu có thay đổi quan trọng

### 3. Phân tích truy vấn dữ liệu (Database Interaction)

**Các bảng liên quan:**

**Bảng chính:**
- `Prescription` - Đếm tổng số đơn thuốc
- `User` - Đếm số bệnh nhân đang hoạt động (status = ACTIVE)
- `AdherenceLog` - Đếm số lần bệnh nhân đã uống thuốc (status = TAKEN)
- `PrescriptionItem` - Đếm tổng số items trong tất cả đơn thuốc

**Các thao tác truy vấn:**

**SELECT COUNT operations:**
1. `SELECT COUNT(*) FROM "Prescription"` - Tổng số đơn thuốc
2. `SELECT COUNT(*) FROM "User" WHERE status = 'ACTIVE'` - Số bệnh nhân đang hoạt động
3. `SELECT COUNT(*) FROM "AdherenceLog" WHERE status = 'TAKEN'` - Số log tuân thủ
4. `SELECT COUNT(*) FROM "PrescriptionItem"` - Tổng số items

**Tính toán:**
- Tỷ lệ tuân thủ = `totalTakenLogs / totalPrescriptionItems`
- Nếu mẫu số = 0 → trả về 0 để tránh chia cho 0

**Tối ưu hóa:**
- Sử dụng `Promise.all()` để thực hiện các COUNT query song song, giảm thời gian response
- Chỉ đếm số lượng, không cần JOIN hoặc load dữ liệu chi tiết
- Có thể cache kết quả trong một khoảng thời gian ngắn để giảm tải database

**Mở rộng (nếu filter theo bác sĩ):**
- Thêm WHERE condition: `WHERE doctorId = ?` cho các query liên quan đến prescription
- JOIN với bảng `User` để filter theo bác sĩ cụ thể

### 4. Luồng dữ liệu & tính nhất quán

**Dữ liệu đầu vào:**
- Không có input từ user (chỉ là GET request)
- Có thể có query param `doctorId` (optional) để filter theo bác sĩ

**Dữ liệu đầu ra:**
- `totalPrescriptions` (number) - Tổng số đơn thuốc trong hệ thống
- `activePatients` (number) - Số bệnh nhân có status = ACTIVE
- `adherenceRate` (number, 0-1) - Tỷ lệ tuân thủ điều trị

**Tính nhất quán:**
- Dữ liệu được tính toán real-time từ database, đảm bảo luôn phản ánh trạng thái hiện tại
- Các COUNT query đảm bảo tính chính xác bằng cách đếm trực tiếp từ database
- Tỷ lệ tuân thủ được tính toán dựa trên dữ liệu thực tế, không phải giá trị lưu trữ sẵn
- Xử lý edge case: chia cho 0 được xử lý bằng điều kiện kiểm tra

### 5. Phân quyền & bảo mật

**Quyền truy cập:**

**ADMIN:**
- ✅ Xem báo cáo tổng quan (`GET /admin/reports/overview`)

**DOCTOR:**
- ❌ Không có quyền truy cập endpoint này
- Có thể có báo cáo riêng cho doctor (không nằm trong scope phân tích này)

**PATIENT:**
- ❌ Không có quyền truy cập

**Cơ chế bảo mật:**
- Endpoint yêu cầu JWT authentication
- Controller kiểm tra role: `if (user.roles !== UserRole.ADMIN) throw Forbidden`
- Dữ liệu báo cáo là thông tin tổng hợp, không chứa thông tin nhạy cảm cá nhân
- Response không expose chi tiết về từng bệnh nhân hoặc đơn thuốc cụ thể

**Lý do phân quyền:**
- Báo cáo tổng quan là công cụ quản lý quan trọng, chỉ dành cho quản trị viên
- Dữ liệu tổng hợp có thể chứa thông tin về hiệu quả hoạt động của hệ thống, cần được bảo vệ
- Phân quyền đảm bảo chỉ người có trách nhiệm mới được xem và đánh giá hiệu quả hệ thống

---

## CHỨC NĂNG 3: QUẢN LÝ ĐƠN THUỐC

### 1. Mô tả nghiệp vụ (Business Logic)

**Đối tượng sử dụng:**
- **DOCTOR** - Bác sĩ tạo, cập nhật, xem đơn thuốc cho bệnh nhân của mình
- **ADMIN** - Quản trị viên xem và quản lý tất cả đơn thuốc trong hệ thống
- **PATIENT** - Bệnh nhân xem đơn thuốc của chính mình

**Mục đích nghiệp vụ:**
Chức năng quản lý đơn thuốc là trung tâm của hệ thống quản lý y tế, cho phép bác sĩ kê đơn thuốc cho bệnh nhân, theo dõi quá trình điều trị, và quản lý lịch sử điều trị. Đơn thuốc bao gồm nhiều items (thuốc), mỗi item có thông tin về liều lượng, tần suất, thời điểm uống, và thời gian điều trị.

**Vấn đề thực tế được giải quyết:**
Trong thực tế, việc quản lý đơn thuốc thủ công gặp nhiều thách thức:
- Khó khăn trong việc theo dõi nhiều đơn thuốc đồng thời cho một bệnh nhân
- Thiếu cơ chế kiểm tra trùng lặp đơn thuốc đang điều trị
- Khó khăn trong việc quản lý lịch uống thuốc phức tạp (nhiều lần trong ngày, thời điểm cụ thể)
- Không có hệ thống cảnh báo khi có đơn thuốc trùng lặp hoặc xung đột
- Thiếu công cụ để theo dõi tuân thủ điều trị của bệnh nhân
- Khó khăn trong việc cập nhật và hủy đơn thuốc khi cần thiết

Hệ thống tự động hóa giải quyết các vấn đề trên thông qua việc quản lý tập trung, validation nghiệp vụ, và tích hợp với hệ thống nhắc nhở và theo dõi tuân thủ.

### 2. Quy trình xử lý (Workflow)

#### 2.1. Tạo mới đơn thuốc

**Bước 1: Người dùng thao tác**
- Doctor chọn bệnh nhân từ danh sách
- Click "Tạo đơn thuốc" để mở form
- Điền thông tin đơn thuốc:
  - Chọn bệnh nhân (patientId)
  - Ngày bắt đầu, ngày kết thúc (tùy chọn)
  - Ghi chú (tùy chọn)
- Thêm các items (thuốc):
  - Chọn thuốc từ danh sách (medicationId)
  - Nhập liều lượng (dosage)
  - Số lần uống mỗi ngày (frequencyPerDay)
  - Thời điểm uống trong ngày (timesOfDay - array)
  - Số ngày điều trị (durationDays)
  - Đường dùng (route - tùy chọn)
  - Hướng dẫn (instructions - tùy chọn)
- Click "Lưu" để submit

**Bước 2: Frontend xử lý và gửi dữ liệu**
- Validate form: kiểm tra các trường bắt buộc
- Validate business rules: ít nhất 1 item, timesOfDay không trống
- Gọi API `POST /doctor/prescriptions` với payload:
  ```json
  {
    "patientId": "uuid",
    "startDate": "2024-01-01",
    "endDate": "2024-01-15",
    "notes": "Ghi chú",
    "items": [
      {
        "medicationId": "uuid",
        "dosage": "500mg",
        "frequencyPerDay": 2,
        "timesOfDay": ["08:00", "20:00"],
        "durationDays": 7,
        "route": "Oral",
        "instructions": "Uống sau ăn"
      }
    ]
  }
  ```
- Gửi kèm JWT token

**Bước 3: Backend tiếp nhận request**
- Controller `DoctorPrescriptionsController.createPrescription()` nhận request
- JWT Guard kiểm tra token và extract user (doctor)
- Kiểm tra quyền: user phải có role DOCTOR
- Validation Pipe validate DTO structure

**Bước 4: Service xử lý business logic**

**4.1. Validation dữ liệu:**
- Kiểm tra bệnh nhân tồn tại: `user.findUnique({ where: { id: patientId } })`
- Kiểm tra bệnh nhân có role PATIENT: `if (patient.role !== 'PATIENT') throw BadRequestException`
- Kiểm tra bác sĩ tồn tại và có role DOCTOR
- Validate medications: kiểm tra tất cả medicationId tồn tại và đang active
  ```typescript
  medications = medication.findMany({ where: { id: { in: medicationIds }, isActive: true } })
  if (medications.length !== medicationIds.length) throw BadRequestException
  ```

**4.2. Kiểm tra trùng lặp đơn thuốc:**
- Query các đơn thuốc đang ACTIVE của bệnh nhân:
  ```typescript
  activePrescriptions = prescription.findMany({
    where: {
      patientId,
      status: ACTIVE,
      OR: [{ endDate: null }, { endDate: { gte: now } }]
    },
    include: { items: true }
  })
  ```
- Với mỗi item mới, so sánh với từng item trong đơn thuốc đang điều trị:
  - So sánh: medicationId, dosage, durationDays, timesOfDay, route
  - Nếu trùng → throw ConflictException với message rõ ràng

**4.3. Tạo đơn thuốc:**
- Sử dụng Prisma nested create để tạo prescription và items trong một transaction:
  ```typescript
  prescription.create({
    data: {
      patientId,
      doctorId,
      startDate,
      endDate,
      notes,
      items: {
        create: items.map(item => ({ ... }))
      }
    },
    include: { patient, doctor, items: { include: { medication } } }
  })
  ```

**Bước 5: Trả kết quả về frontend**
- Response bao gồm đơn thuốc vừa tạo kèm thông tin patient, doctor, và items với medication details
- Frontend hiển thị toast success
- Invalidate React Query cache
- Có thể redirect hoặc refresh danh sách đơn thuốc

#### 2.2. Xem danh sách đơn thuốc

**Bước 1:** Doctor/Admin/Patient truy cập trang quản lý đơn thuốc

**Bước 2:** Frontend gọi API tương ứng:
- Doctor: `GET /doctor/prescriptions?patientId=...&status=...`
- Admin: `GET /admin/prescriptions?page=...&limit=...`
- Patient: `GET /patient/prescriptions`

**Bước 3:** Backend filter theo role:
- Doctor: chỉ lấy đơn thuốc của chính doctor đó (`where: { doctorId: user.id }`)
- Admin: lấy tất cả (có thể filter theo doctorId, patientId)
- Patient: chỉ lấy đơn thuốc của chính patient đó (`where: { patientId: user.id }`)

**Bước 4:** Service query với pagination, sorting, filtering

**Bước 5:** Trả về danh sách kèm pagination metadata

#### 2.3. Cập nhật đơn thuốc

**Bước 1-2:** Tương tự tạo mới, nhưng gọi `PATCH /doctor/prescriptions/:id`

**Bước 3:** Service validation:
- Kiểm tra đơn thuốc tồn tại
- Kiểm tra quyền: doctor chỉ được cập nhật đơn của chính mình
- Nếu cập nhật items: validate medications, kiểm tra trùng lặp (nếu cần)

**Bước 4:** Update logic:
- Nếu cập nhật items: xóa items cũ, tạo items mới (vì quan hệ 1-n)
- Update các trường khác: status, startDate, endDate, notes

#### 2.4. Xem chi tiết đơn thuốc

**Bước 1:** User click vào đơn thuốc trong danh sách

**Bước 2:** Gọi `GET /prescriptions/:id`

**Bước 3:** Service query với include đầy đủ:
- Prescription details
- Patient info
- Doctor info
- Items với medication details
- Adherence logs (nếu có)

**Bước 4:** Trả về object đầy đủ, frontend render chi tiết

### 3. Phân tích truy vấn dữ liệu (Database Interaction)

**Bảng chính:** `Prescription`

**Bảng phụ:**
- `PrescriptionItem` - Chi tiết các thuốc trong đơn (quan hệ 1-n với Prescription)
- `User` - Thông tin bệnh nhân và bác sĩ (quan hệ n-1)
- `Medication` - Thông tin thuốc (quan hệ n-1 với PrescriptionItem)
- `AdherenceLog` - Lịch sử uống thuốc (quan hệ n-1 với Prescription và PrescriptionItem)

**Các thao tác CRUD:**

**CREATE:**
- INSERT vào `Prescription` với các trường: `id`, `patientId`, `doctorId`, `status`, `startDate`, `endDate`, `notes`, `createdAt`, `updatedAt`
- INSERT vào `PrescriptionItem` (nested create) với các trường: `id`, `prescriptionId`, `medicationId`, `dosage`, `frequencyPerDay`, `timesOfDay` (array), `durationDays`, `route`, `instructions`

**READ:**
- SELECT từ `Prescription` với WHERE conditions (filter theo doctorId, patientId, status)
- JOIN với `User` (patient và doctor) để lấy thông tin
- JOIN với `PrescriptionItem` để lấy danh sách items
- JOIN `PrescriptionItem` với `Medication` để lấy thông tin thuốc
- Có thể JOIN với `AdherenceLog` để lấy lịch sử tuân thủ
- Pagination: `skip` và `take`
- Sorting: `orderBy createdAt DESC` (mặc định)

**UPDATE:**
- UPDATE `Prescription` WHERE `id = ?`
- Nếu cập nhật items: DELETE tất cả `PrescriptionItem` WHERE `prescriptionId = ?`, sau đó INSERT items mới

**DELETE:**
- Có thể soft delete (cập nhật status = CANCELLED) hoặc hard delete
- CASCADE delete: khi xóa Prescription, các PrescriptionItem và AdherenceLog liên quan cũng bị xóa (nếu có onDelete: Cascade)

**Quan hệ dữ liệu:**
- `Prescription` n-1 với `User` (patient): `prescription.patientId → user.id`
- `Prescription` n-1 với `User` (doctor): `prescription.doctorId → user.id`
- `PrescriptionItem` n-1 với `Prescription`: `prescriptionItem.prescriptionId → prescription.id`
- `PrescriptionItem` n-1 với `Medication`: `prescriptionItem.medicationId → medication.id`
- `AdherenceLog` n-1 với `Prescription`: `adherenceLog.prescriptionId → prescription.id`
- `AdherenceLog` n-1 với `PrescriptionItem` (optional): `adherenceLog.prescriptionItemId → prescriptionItem.id`

**Truy vấn đặc biệt - Kiểm tra trùng lặp:**
```typescript
// Tìm các đơn thuốc đang ACTIVE
activePrescriptions = prescription.findMany({
  where: {
    patientId,
    status: ACTIVE,
    OR: [{ endDate: null }, { endDate: { gte: now } }]
  },
  include: { items: true }
})

// So sánh từng item mới với items trong đơn đang điều trị
// Kiểm tra: medicationId, dosage, durationDays, timesOfDay, route
```

### 4. Luồng dữ liệu & tính nhất quán

**Dữ liệu đầu vào (Create/Update):**
- `patientId` (UUID, required) - ID bệnh nhân
- `doctorId` (UUID, required) - ID bác sĩ (tự động lấy từ JWT token khi là doctor)
- `startDate` (Date, optional, default: now) - Ngày bắt đầu
- `endDate` (Date, optional) - Ngày kết thúc
- `notes` (string, optional) - Ghi chú
- `items` (array, required, min: 1) - Danh sách thuốc:
  - `medicationId` (UUID, required) - ID thuốc
  - `dosage` (string, required) - Liều lượng
  - `frequencyPerDay` (number, required) - Số lần uống mỗi ngày
  - `timesOfDay` (string[], required, không rỗng) - Thời điểm uống (ví dụ: ["08:00", "20:00"])
  - `durationDays` (number, required) - Số ngày điều trị
  - `route` (string, optional) - Đường dùng
  - `instructions` (string, optional) - Hướng dẫn

**Kiểm soát tính nhất quán:**
- **Referential integrity:** 
  - `patientId` và `doctorId` phải tồn tại trong bảng `User` và có role đúng
  - `medicationId` trong items phải tồn tại và `isActive = true`
- **Business rule - Trùng lặp:** Không cho phép tạo đơn thuốc trùng với đơn đang điều trị (cùng medication, dosage, durationDays, timesOfDay, route)
- **Status constraint:** Đơn thuốc có status: ACTIVE, COMPLETED, CANCELLED
- **Date validation:** `endDate` phải >= `startDate` (nếu có)
- **Array validation:** `timesOfDay` phải có ít nhất 1 phần tử, số phần tử phải = `frequencyPerDay`
- **Transaction:** Tạo prescription và items trong một transaction để đảm bảo atomicity

### 5. Phân quyền & bảo mật

**Quyền truy cập:**

**DOCTOR:**
- ✅ Tạo đơn thuốc cho bệnh nhân của mình (`POST /doctor/prescriptions`)
- ✅ Xem danh sách đơn thuốc của chính mình (`GET /doctor/prescriptions`)
- ✅ Xem chi tiết đơn thuốc của chính mình (`GET /prescriptions/:id`)
- ✅ Cập nhật đơn thuốc của chính mình (`PATCH /doctor/prescriptions/:id`)
- ❌ Không được xem/sửa đơn thuốc của doctor khác

**ADMIN:**
- ✅ Xem tất cả đơn thuốc (`GET /admin/prescriptions`)
- ✅ Xem chi tiết bất kỳ đơn thuốc nào (`GET /admin/prescriptions/:id`)
- ✅ Cập nhật bất kỳ đơn thuốc nào (`PATCH /admin/prescriptions/:id`)
- ✅ Xóa đơn thuốc (`DELETE /admin/prescriptions/:id`)
- ✅ Filter theo doctorId, patientId

**PATIENT:**
- ✅ Xem danh sách đơn thuốc của chính mình (`GET /patient/prescriptions`)
- ✅ Xem chi tiết đơn thuốc của chính mình (`GET /prescriptions/:id`)
- ❌ Không được tạo, cập nhật, xóa đơn thuốc

**Cơ chế bảo mật:**
- Tất cả endpoints yêu cầu JWT authentication
- Controller kiểm tra role và filter dữ liệu theo quyền:
  - Doctor: tự động filter `where: { doctorId: user.id }`
  - Patient: tự động filter `where: { patientId: user.id }`
  - Admin: không filter, có thể xem tất cả
- Validation đảm bảo doctorId trong request khớp với user.id (tránh doctor A tạo đơn cho doctor B)
- Kiểm tra quyền khi update: doctor chỉ được update đơn của chính mình

**Lý do phân quyền:**
- Đơn thuốc chứa thông tin y tế nhạy cảm, cần được bảo vệ theo quy định bảo mật y tế
- Bác sĩ chỉ nên quản lý đơn thuốc của chính mình để đảm bảo trách nhiệm và tính chính xác
- Bệnh nhân chỉ được xem đơn của mình, không được chỉnh sửa để tránh thay đổi không mong muốn
- Admin cần quyền xem tất cả để quản lý và giám sát hệ thống
- Phân quyền đảm bảo tính toàn vẹn dữ liệu và tuân thủ quy định y tế

---

## KẾT LUẬN

Ba chức năng được phân tích trên đây thể hiện các khía cạnh quan trọng của hệ thống quản lý y tế: quản lý cấu trúc dữ liệu (chuyên khoa), theo dõi và đánh giá (báo cáo tổng quan), và nghiệp vụ cốt lõi (quản lý đơn thuốc). Mỗi chức năng được thiết kế với phân quyền rõ ràng, validation nghiệp vụ chặt chẽ, và đảm bảo tính nhất quán dữ liệu thông qua các ràng buộc ở cả application level và database level.

