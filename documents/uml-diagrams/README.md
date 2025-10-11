# UML Diagrams Documentation

## Tổng Quan

Thư mục này chứa các sơ đồ UML chi tiết cho hệ thống quản lý y tế. Các sơ đồ UML giúp hiểu rõ cấu trúc, quy trình, và tương tác trong hệ thống.

## Danh Sách Sơ Đồ UML

### 1. 📊 Class Diagram
**File**: `01-Class-Diagram.md`
**Mô tả**: Sơ đồ lớp UML mô tả cấu trúc các lớp, thuộc tính, phương thức và mối quan hệ giữa chúng.

**Nội dung chính**:
- Core Entities: User, Prescription, PrescriptionItem, AdherenceLog, Alert
- Services: AuthService, PrescriptionService, NotificationService, ReportService
- Controllers: AuthController, PrescriptionController, DoctorPrescriptionController
- Enumerations: UserRole, PrescriptionStatus, AdherenceStatus, AlertType
- Relationships: One-to-Many, Many-to-One, Many-to-Many

### 2. 🔄 Sequence Diagrams
**File**: `02-Sequence-Diagrams.md`
**Mô tả**: Sơ đồ tuần tự UML mô tả luồng tương tác giữa các đối tượng trong các use case quan trọng.

**Nội dung chính**:
- Kê Đơn Thuốc Điện Tử
- Xác Nhận Uống Thuốc
- Gửi Nhắc Nhở Uống Thuốc
- Tạo Cảnh Báo Tuân Thủ Thấp
- WebSocket Connection Management
- Authentication Flow

### 3. 🎯 Activity Diagrams
**File**: `03-Activity-Diagrams.md`
**Mô tả**: Sơ đồ hoạt động UML mô tả các quy trình nghiệp vụ và luồng công việc.

**Nội dung chính**:
- Quy Trình Kê Đơn Thuốc
- Quy Trình Uống Thuốc của Bệnh Nhân
- Quy Trình Giám Sát Tuân Thủ
- Quy Trình Tạo Cảnh Báo Tự Động
- Quy Trình Xử Lý WebSocket Connection
- Quy Trình Authentication

### 4. 🔄 State Machine Diagrams
**File**: `04-State-Machine-Diagrams.md`
**Mô tả**: Sơ đồ trạng thái UML mô tả các trạng thái và chuyển đổi trạng thái của các đối tượng.

**Nội dung chính**:
- Prescription States: CREATED → ACTIVE → COMPLETED/CANCELLED
- User States: INACTIVE → ACTIVE → BLOCKED
- AdherenceLog States: PENDING → TAKEN/MISSED/SKIPPED
- Alert States: CREATED → SENT → READ → RESOLVED
- Medication States: ACTIVE → INACTIVE → ARCHIVED
- MajorDoctor States: ACTIVE → INACTIVE → ARCHIVED
- WebSocket Connection States: CONNECTING → AUTHENTICATING → CONNECTED

### 5. 🏗️ Component Diagrams
**File**: `05-Component-Diagrams.md`
**Mô tả**: Sơ đồ thành phần UML mô tả cấu trúc các thành phần và mối quan hệ giữa chúng.

**Nội dung chính**:
- System Architecture: Frontend, API Gateway, Application, Data Access, Database layers
- Prescription Module: Controllers, Services, Business Logic, Data Models
- Notification Module: Controllers, Services, External Providers, Infrastructure
- Authentication Module: Controllers, Services, Security, External Dependencies
- Database Layer: ORM Layer, Repository Layer, Database Services, Data Models

## Cách Sử Dụng

### 1. Đọc Sơ Đồ
- Bắt đầu với **Class Diagram** để hiểu cấu trúc hệ thống
- Đọc **Sequence Diagrams** để hiểu luồng tương tác
- Xem **Activity Diagrams** để hiểu quy trình nghiệp vụ
- Tham khảo **State Machine Diagrams** để hiểu trạng thái
- Đọc **Component Diagrams** để hiểu kiến trúc hệ thống

### 2. Sử Dụng Cho Phát Triển
- **Thiết kế**: Sử dụng Class Diagram để thiết kế database schema
- **Implement**: Sử dụng Sequence Diagrams để implement API endpoints
- **Testing**: Sử dụng Activity Diagrams để thiết kế test cases
- **Debug**: Sử dụng State Machine Diagrams để debug trạng thái
- **Architecture**: Sử dụng Component Diagrams để thiết kế kiến trúc

### 3. Sử Dụng Cho Tài Liệu
- **Onboarding**: Sử dụng để onboard team members mới
- **Training**: Sử dụng để training team về hệ thống
- **Documentation**: Sử dụng để tài liệu hóa hệ thống
- **Communication**: Sử dụng để giao tiếp giữa team

## Công Cụ Tạo Sơ Đồ

### 1. Mermaid
- **Sử dụng**: Tất cả sơ đồ trong tài liệu này được tạo bằng Mermaid
- **Lợi ích**: Dễ đọc, dễ chỉnh sửa, có thể render trực tiếp
- **Syntax**: Sử dụng Mermaid syntax cho các loại sơ đồ khác nhau

### 2. Các Công Cụ Khác
- **Draw.io**: Có thể sử dụng để tạo sơ đồ phức tạp hơn
- **Lucidchart**: Công cụ chuyên nghiệp cho UML diagrams
- **PlantUML**: Công cụ text-based cho UML diagrams
- **Visio**: Microsoft Visio cho enterprise diagrams

## Lưu Ý

### 1. Cập Nhật Sơ Đồ
- Sơ đồ cần được cập nhật khi có thay đổi trong hệ thống
- Đảm bảo tính nhất quán giữa các sơ đồ
- Sử dụng version control để theo dõi thay đổi

### 2. Chất Lượng Sơ Đồ
- Sơ đồ phải rõ ràng và dễ hiểu
- Sử dụng naming convention nhất quán
- Thêm notes và mô tả khi cần thiết

### 3. Bảo Mật
- Không bao gồm thông tin nhạy cảm trong sơ đồ
- Sử dụng placeholder cho sensitive data
- Đảm bảo sơ đồ không expose internal architecture

## Liên Hệ

Nếu có câu hỏi hoặc cần hỗ trợ về UML diagrams, vui lòng liên hệ với team phát triển.

## Tài Liệu Liên Quan

- [Use Cases Documentation](../use-cases/README.md)
- [System Architecture Documentation](../USE_CASES_AND_ERD.md)
- [API Documentation](../../medical_management_be/docs/api.md)
- [Database Schema](../../medical_management_be/prisma/schema.prisma)
