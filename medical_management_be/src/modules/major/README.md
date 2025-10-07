# Major Doctor Module

Module quản lý chuyên khoa bác sĩ trong hệ thống quản lý y tế.

## Tổng quan

Module này cung cấp các API để thực hiện CRUD operations cho bảng `MajorDoctorTable`, quản lý thông tin các chuyên khoa bác sĩ trong hệ thống.

## Cấu trúc

```
major/
├── dto/
│   ├── create-major-doctor.dto.ts    # DTO cho tạo mới chuyên khoa
│   ├── update-major-doctor.dto.ts    # DTO cho cập nhật chuyên khoa
│   ├── query-major-doctor.dto.ts     # DTO cho query và phân trang
│   └── index.ts                      # Export tất cả DTOs
├── major.controller.ts               # Controller xử lý HTTP requests
├── major.service.ts                  # Service chứa business logic
├── major.module.ts                   # Module definition
├── index.ts                          # Export module
└── README.md                         # Tài liệu này
```

## API Endpoints

### 1. Tạo mới chuyên khoa
- **POST** `/major-doctors`
- **Quyền**: Chỉ ADMIN
- **Body**: `CreateMajorDoctorDto`

### 2. Lấy danh sách chuyên khoa
- **GET** `/major-doctors`
- **Quyền**: ADMIN, DOCTOR
- **Query params**: `QueryMajorDoctorDto` (phân trang, tìm kiếm, lọc)

### 3. Lấy danh sách chuyên khoa đang hoạt động
- **GET** `/major-doctors/active`
- **Quyền**: Tất cả user đã đăng nhập
- **Mục đích**: Cho dropdown/select

### 4. Lấy chi tiết chuyên khoa
- **GET** `/major-doctors/:id`
- **Quyền**: ADMIN, DOCTOR
- **Response**: Thông tin chi tiết + danh sách bác sĩ thuộc chuyên khoa

### 5. Cập nhật chuyên khoa
- **PATCH** `/major-doctors/:id`
- **Quyền**: Chỉ ADMIN
- **Body**: `UpdateMajorDoctorDto`

### 6. Cập nhật trạng thái hoạt động
- **PATCH** `/major-doctors/:id/status`
- **Quyền**: Chỉ ADMIN
- **Body**: `{ isActive: boolean }`

### 7. Xóa chuyên khoa
- **DELETE** `/major-doctors/:id`
- **Quyền**: Chỉ ADMIN
- **Lưu ý**: Không thể xóa nếu có bác sĩ đang sử dụng

## DTOs

### CreateMajorDoctorDto
```typescript
{
  code: string;           // Mã chuyên khoa (unique)
  name: string;           // Tên chuyên khoa (tiếng Việt)
  nameEn?: string;        // Tên tiếng Anh (optional)
  description?: string;   // Mô tả (optional)
  isActive?: boolean;     // Trạng thái hoạt động (default: true)
  sortOrder?: number;     // Thứ tự hiển thị (default: 0)
}
```

### UpdateMajorDoctorDto
- Tất cả fields của `CreateMajorDoctorDto` nhưng đều optional

### QueryMajorDoctorDto
```typescript
{
  page?: number;          // Trang hiện tại (default: 1)
  limit?: number;         // Số lượng/trang (default: 10, max: 100)
  search?: string;        // Tìm kiếm theo tên/mã
  isActive?: boolean;     // Lọc theo trạng thái
  sortBy?: string;        // Sắp xếp theo field (default: 'sortOrder')
  sortOrder?: 'asc'|'desc'; // Thứ tự sắp xếp (default: 'asc')
}
```

## Business Logic

### Validation Rules
1. **Mã chuyên khoa**: Phải unique, không được trùng
2. **Tên chuyên khoa**: Bắt buộc, không được để trống
3. **Xóa chuyên khoa**: Không thể xóa nếu có bác sĩ đang sử dụng
4. **Vô hiệu hóa**: Không thể vô hiệu hóa nếu có bác sĩ đang sử dụng

### Error Handling
- `ConflictException`: Khi mã chuyên khoa trùng lặp
- `NotFoundException`: Khi không tìm thấy chuyên khoa
- `ConflictException`: Khi cố gắng xóa/vô hiệu hóa chuyên khoa đang được sử dụng

## Database Schema

```sql
model MajorDoctorTable {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  nameEn      String?
  description String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  doctors User[]  // Quan hệ với bảng User
}
```

## Usage Examples

### Tạo chuyên khoa mới
```bash
POST /major-doctors
{
  "code": "TIM_MACH",
  "name": "Tim mạch",
  "nameEn": "Cardiology",
  "description": "Chuyên khoa tim mạch và huyết áp",
  "sortOrder": 3
}
```

### Lấy danh sách với phân trang
```bash
GET /major-doctors?page=1&limit=10&search=tim&isActive=true&sortBy=name&sortOrder=asc
```

### Cập nhật trạng thái
```bash
PATCH /major-doctors/{id}/status
{
  "isActive": false
}
```

## Testing

Module đã được tích hợp với:
- Zod validation cho input validation
- JWT authentication
- Role-based authorization
- Prisma ORM với PostgreSQL
- Global exception handling

## Dependencies

- `@nestjs/common`
- `nestjs-prisma`
- `zod`
- `@prisma/client`
