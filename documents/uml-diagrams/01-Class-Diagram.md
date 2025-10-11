# UML Class Diagram - Medical Management System

## Tổng Quan
Sơ đồ lớp UML mô tả cấu trúc các lớp, thuộc tính, phương thức và mối quan hệ giữa chúng trong hệ thống quản lý y tế.

## Sơ Đồ Lớp

```mermaid
classDiagram
    %% Core Entities
    class User {
        +String id
        +String phoneNumber
        +String password
        +String fullName
        +UserRole role
        +UserStatus status
        +DateTime createdAt
        +DateTime updatedAt
        +DateTime deletedAt
        +String createdBy
        +String majorDoctorId
        +validateUser(credentials) User
        +hashPassword(password) String
        +comparePassword(password) Boolean
    }

    class PatientProfile {
        +String id
        +String userId
        +Gender gender
        +DateTime birthDate
        +String address
        +DateTime createdAt
        +DateTime updatedAt
    }

    class PatientMedicalHistory {
        +String id
        +String patientId
        +String[] conditions
        +String[] allergies
        +String[] surgeries
        +String familyHistory
        +String lifestyle
        +String[] currentMedications
        +String notes
        +Json extras
        +DateTime createdAt
        +DateTime updatedAt
    }

    class MajorDoctorTable {
        +String id
        +String code
        +String name
        +String nameEn
        +String description
        +Boolean isActive
        +Int sortOrder
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Medication {
        +String id
        +String name
        +String strength
        +String form
        +String unit
        +String description
        +Boolean isActive
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Prescription {
        +String id
        +String patientId
        +String doctorId
        +PrescriptionStatus status
        +DateTime startDate
        +DateTime endDate
        +String notes
        +DateTime createdAt
        +DateTime updatedAt
        +createPrescription(data) Prescription
        +updatePrescription(data) Prescription
        +cancelPrescription(reason) Boolean
        +getAdherenceRate() Double
    }

    class PrescriptionItem {
        +String id
        +String prescriptionId
        +String medicationId
        +String dosage
        +Int frequencyPerDay
        +String[] timesOfDay
        +Int durationDays
        +String route
        +String instructions
        +DateTime createdAt
        +DateTime updatedAt
    }

    class AdherenceLog {
        +String id
        +String prescriptionId
        +String prescriptionItemId
        +String patientId
        +DateTime takenAt
        +AdherenceStatus status
        +String amount
        +String notes
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Alert {
        +String id
        +String prescriptionId
        +String patientId
        +String doctorId
        +AlertType type
        +String message
        +Boolean resolved
        +DateTime createdAt
        +DateTime updatedAt
        +createAlert(data) Alert
        +resolveAlert() Boolean
        +sendNotification() Boolean
    }

    %% Enums
    class UserRole {
        <<enumeration>>
        ADMIN
        DOCTOR
        PATIENT
    }

    class UserStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
        BLOCKED
    }

    class Gender {
        <<enumeration>>
        MALE
        FEMALE
        OTHER
    }

    class PrescriptionStatus {
        <<enumeration>>
        ACTIVE
        COMPLETED
        CANCELLED
    }

    class AdherenceStatus {
        <<enumeration>>
        TAKEN
        MISSED
        SKIPPED
    }

    class AlertType {
        <<enumeration>>
        MISSED_DOSE
        LOW_ADHERENCE
        OTHER
    }

    %% Services
    class AuthService {
        +login(credentials) AuthResult
        +register(userData) User
        +generateToken(user) String
        +validateToken(token) User
        +refreshToken(token) String
    }

    class PrescriptionService {
        +createPrescription(data) Prescription
        +updatePrescription(id, data) Prescription
        +getPrescription(id) Prescription
        +getPatientPrescriptions(patientId) Prescription[]
        +getDoctorPrescriptions(doctorId) Prescription[]
        +calculateAdherenceRate(prescriptionId) Double
    }

    class NotificationService {
        +sendMedicationReminder(patientId, prescriptionId) Boolean
        +sendLowAdherenceAlert(doctorId, patientId) Boolean
        +sendPrescriptionUpdate(patientId, prescriptionId) Boolean
        +scheduleReminder(prescriptionItemId, time) Boolean
    }

    class ReportService {
        +generateOverviewReport() ReportData
        +generateAdherenceReport(patientId, period) ReportData
        +generatePrescriptionReport(doctorId, period) ReportData
        +exportReport(data, format) File
    }

    %% Controllers
    class AuthController {
        +login(credentials) AuthResult
        +register(userData) User
        +logout() Boolean
        +me() User
    }

    class PrescriptionController {
        +createPrescription(data) Prescription
        +getPrescription(id) Prescription
        +updatePrescription(id, data) Prescription
        +deletePrescription(id) Boolean
    }

    class DoctorPrescriptionController {
        +createPrescription(data) Prescription
        +getMyPrescriptions() Prescription[]
        +getPatientPrescriptions(patientId) Prescription[]
        +updatePrescription(id, data) Prescription
    }

    class PatientPrescriptionController {
        +getMyPrescriptions() Prescription[]
        +getPrescriptionSchedule() ScheduleData
        +confirmTaken(prescriptionId, data) AdherenceLog
        +markMissed(prescriptionId, reason) AdherenceLog
    }

    %% Relationships
    User ||--o{ PatientProfile : "has"
    User ||--o{ PatientMedicalHistory : "has"
    User ||--o{ Prescription : "doctor creates"
    User ||--o{ Prescription : "patient receives"
    User ||--o{ AdherenceLog : "creates"
    User ||--o{ Alert : "receives"
    User }o--|| MajorDoctorTable : "belongs to"

    MajorDoctorTable ||--o{ User : "contains"

    Prescription ||--o{ PrescriptionItem : "contains"
    Prescription ||--o{ AdherenceLog : "has"
    Prescription ||--o{ Alert : "generates"

    PrescriptionItem }o--|| Medication : "uses"
    PrescriptionItem ||--o{ AdherenceLog : "tracks"

    AdherenceLog }o--|| Prescription : "belongs to"
    AdherenceLog }o--o| PrescriptionItem : "belongs to"

    Alert }o--|| Prescription : "belongs to"
    Alert }o--|| User : "sent to"

    %% Service Dependencies
    AuthService ..> User : "manages"
    PrescriptionService ..> Prescription : "manages"
    PrescriptionService ..> PrescriptionItem : "manages"
    NotificationService ..> Alert : "sends"
    ReportService ..> Prescription : "analyzes"
    ReportService ..> AdherenceLog : "analyzes"

    %% Controller Dependencies
    AuthController ..> AuthService : "uses"
    PrescriptionController ..> PrescriptionService : "uses"
    DoctorPrescriptionController ..> PrescriptionService : "uses"
    PatientPrescriptionController ..> PrescriptionService : "uses"
```

## Mô Tả Chi Tiết

### 1. Core Entities

#### User
- **Mục đích**: Đại diện cho tất cả người dùng trong hệ thống (Admin, Doctor, Patient)
- **Thuộc tính chính**: id, phoneNumber, password, fullName, role, status
- **Phương thức**: validateUser(), hashPassword(), comparePassword()

#### Prescription
- **Mục đích**: Đại diện cho đơn thuốc điện tử
- **Thuộc tính chính**: id, patientId, doctorId, status, startDate, endDate
- **Phương thức**: createPrescription(), updatePrescription(), cancelPrescription(), getAdherenceRate()

#### PrescriptionItem
- **Mục đích**: Đại diện cho từng thuốc trong đơn thuốc
- **Thuộc tính chính**: id, prescriptionId, medicationId, dosage, frequencyPerDay, timesOfDay

#### AdherenceLog
- **Mục đích**: Ghi lại lịch sử uống thuốc của bệnh nhân
- **Thuộc tính chính**: id, prescriptionId, patientId, takenAt, status, amount

#### Alert
- **Mục đích**: Đại diện cho các cảnh báo và thông báo trong hệ thống
- **Thuộc tính chính**: id, type, message, resolved, createdAt

### 2. Services

#### AuthService
- **Mục đích**: Xử lý authentication và authorization
- **Phương thức**: login(), register(), generateToken(), validateToken()

#### PrescriptionService
- **Mục đích**: Quản lý đơn thuốc và tính toán tuân thủ
- **Phương thức**: createPrescription(), updatePrescription(), calculateAdherenceRate()

#### NotificationService
- **Mục đích**: Gửi thông báo và nhắc nhở
- **Phương thức**: sendMedicationReminder(), sendLowAdherenceAlert(), scheduleReminder()

#### ReportService
- **Mục đích**: Tạo báo cáo và thống kê
- **Phương thức**: generateOverviewReport(), generateAdherenceReport(), exportReport()

### 3. Controllers

#### AuthController
- **Mục đích**: Xử lý HTTP requests cho authentication
- **Endpoints**: /auth/login, /auth/register, /auth/logout, /auth/me

#### PrescriptionController
- **Mục đích**: Xử lý HTTP requests cho đơn thuốc (Admin)
- **Endpoints**: /admin/prescriptions/*

#### DoctorPrescriptionController
- **Mục đích**: Xử lý HTTP requests cho đơn thuốc (Doctor)
- **Endpoints**: /doctor/prescriptions/*

#### PatientPrescriptionController
- **Mục đích**: Xử lý HTTP requests cho đơn thuốc (Patient)
- **Endpoints**: /patient/prescriptions/*

### 4. Mối Quan Hệ

#### One-to-Many Relationships
- User → PatientProfile (1:1)
- User → PatientMedicalHistory (1:1)
- User → Prescription (1:N) - Doctor creates many prescriptions
- User → Prescription (1:N) - Patient receives many prescriptions
- Prescription → PrescriptionItem (1:N)
- Prescription → AdherenceLog (1:N)
- Prescription → Alert (1:N)

#### Many-to-One Relationships
- PrescriptionItem → Medication (N:1)
- AdherenceLog → Prescription (N:1)
- AdherenceLog → PrescriptionItem (N:1)
- Alert → Prescription (N:1)
- Alert → User (N:1)

#### Many-to-Many Relationships
- User ↔ MajorDoctorTable (N:M) - Doctors can belong to multiple specialties

### 5. Enumerations

#### UserRole
- ADMIN: Quản trị viên
- DOCTOR: Bác sĩ
- PATIENT: Bệnh nhân

#### PrescriptionStatus
- ACTIVE: Đang hoạt động
- COMPLETED: Đã hoàn thành
- CANCELLED: Đã hủy

#### AdherenceStatus
- TAKEN: Đã uống
- MISSED: Đã bỏ lỡ
- SKIPPED: Đã bỏ qua

#### AlertType
- MISSED_DOSE: Bỏ lỡ thuốc
- LOW_ADHERENCE: Tuân thủ thấp
- OTHER: Khác

## Lợi Ích Của Sơ Đồ Lớp

1. **Hiểu rõ cấu trúc**: Sơ đồ giúp hiểu rõ cấu trúc các lớp và mối quan hệ
2. **Thiết kế hệ thống**: Hỗ trợ thiết kế và phát triển hệ thống
3. **Tài liệu hóa**: Tài liệu hóa cấu trúc code cho team phát triển
4. **Bảo trì**: Dễ dàng bảo trì và mở rộng hệ thống
5. **Giao tiếp**: Giúp giao tiếp giữa các thành viên team về thiết kế hệ thống
