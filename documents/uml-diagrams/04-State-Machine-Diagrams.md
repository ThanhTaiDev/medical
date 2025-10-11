# UML State Machine Diagrams - Medical Management System

## Tổng Quan
Sơ đồ trạng thái UML mô tả các trạng thái và chuyển đổi trạng thái của các đối tượng quan trọng trong hệ thống quản lý y tế.

## 1. State Machine Diagram - Prescription States

```mermaid
stateDiagram-v2
    [*] --> CREATED : createPrescription()
    
    CREATED --> ACTIVE : activatePrescription()
    CREATED --> CANCELLED : cancelPrescription()
    
    ACTIVE --> COMPLETED : completePrescription()
    ACTIVE --> CANCELLED : cancelPrescription()
    ACTIVE --> ACTIVE : updatePrescription()
    
    COMPLETED --> [*] : prescriptionEnded()
    CANCELLED --> [*] : prescriptionEnded()
    
    note right of CREATED
        Đơn thuốc vừa được tạo
        Chưa có hiệu lực
    end note
    
    note right of ACTIVE
        Đơn thuốc đang hoạt động
        Bệnh nhân có thể uống thuốc
        Bác sĩ có thể chỉnh sửa
    end note
    
    note right of COMPLETED
        Đơn thuốc đã hoàn thành
        Không thể chỉnh sửa
        Có thể xem lịch sử
    end note
    
    note right of CANCELLED
        Đơn thuốc đã bị hủy
        Không thể chỉnh sửa
        Có thể xem lý do hủy
    end note
```

## 2. State Machine Diagram - User States

```mermaid
stateDiagram-v2
    [*] --> INACTIVE : createUser()
    
    INACTIVE --> ACTIVE : activateUser()
    INACTIVE --> BLOCKED : blockUser()
    INACTIVE --> [*] : deleteUser()
    
    ACTIVE --> INACTIVE : deactivateUser()
    ACTIVE --> BLOCKED : blockUser()
    ACTIVE --> [*] : deleteUser()
    
    BLOCKED --> ACTIVE : unblockUser()
    BLOCKED --> INACTIVE : deactivateUser()
    BLOCKED --> [*] : deleteUser()
    
    note right of INACTIVE
        User được tạo nhưng chưa kích hoạt
        Không thể đăng nhập
        Có thể kích hoạt hoặc xóa
    end note
    
    note right of ACTIVE
        User đang hoạt động bình thường
        Có thể đăng nhập và sử dụng hệ thống
        Có thể bị khóa hoặc vô hiệu hóa
    end note
    
    note right of BLOCKED
        User bị khóa tạm thời
        Không thể đăng nhập
        Có thể mở khóa
    end note
```

## 3. State Machine Diagram - AdherenceLog States

```mermaid
stateDiagram-v2
    [*] --> PENDING : createAdherenceLog()
    
    PENDING --> TAKEN : confirmTaken()
    PENDING --> MISSED : markMissed()
    PENDING --> SKIPPED : markSkipped()
    
    TAKEN --> TAKEN : updateTakenLog()
    MISSED --> MISSED : updateMissedLog()
    SKIPPED --> SKIPPED : updateSkippedLog()
    
    TAKEN --> [*] : logCompleted()
    MISSED --> [*] : logCompleted()
    SKIPPED --> [*] : logCompleted()
    
    note right of PENDING
        Nhật ký uống thuốc vừa được tạo
        Chờ bệnh nhân xác nhận
        Có thể xác nhận uống hoặc bỏ lỡ
    end note
    
    note right of TAKEN
        Bệnh nhân đã xác nhận uống thuốc
        Có thể cập nhật thông tin
        Được tính vào tỷ lệ tuân thủ
    end note
    
    note right of MISSED
        Bệnh nhân đã bỏ lỡ uống thuốc
        Có thể cập nhật lý do
        Không được tính vào tỷ lệ tuân thủ
    end note
    
    note right of SKIPPED
        Bệnh nhân đã bỏ qua uống thuốc
        Có thể cập nhật lý do
        Không được tính vào tỷ lệ tuân thủ
    end note
```

## 4. State Machine Diagram - Alert States

```mermaid
stateDiagram-v2
    [*] --> CREATED : createAlert()
    
    CREATED --> SENT : sendAlert()
    CREATED --> CANCELLED : cancelAlert()
    
    SENT --> READ : markAsRead()
    SENT --> RESOLVED : resolveAlert()
    SENT --> EXPIRED : alertExpired()
    
    READ --> RESOLVED : resolveAlert()
    READ --> EXPIRED : alertExpired()
    
    RESOLVED --> [*] : alertCompleted()
    EXPIRED --> [*] : alertCompleted()
    CANCELLED --> [*] : alertCompleted()
    
    note right of CREATED
        Cảnh báo vừa được tạo
        Chưa được gửi
        Có thể hủy hoặc gửi
    end note
    
    note right of SENT
        Cảnh báo đã được gửi
        Chờ người nhận phản hồi
        Có thể đánh dấu đã đọc hoặc đã xử lý
    end note
    
    note right of READ
        Cảnh báo đã được đọc
        Chờ xử lý
        Có thể đánh dấu đã xử lý
    end note
    
    note right of RESOLVED
        Cảnh báo đã được xử lý
        Không cần hành động thêm
        Có thể xem lịch sử
    end note
    
    note right of EXPIRED
        Cảnh báo đã hết hạn
        Không cần xử lý
        Có thể xem lịch sử
    end note
    
    note right of CANCELLED
        Cảnh báo đã bị hủy
        Không được gửi
        Có thể xem lịch sử
    end note
```

## 5. State Machine Diagram - Medication States

```mermaid
stateDiagram-v2
    [*] --> ACTIVE : createMedication()
    
    ACTIVE --> INACTIVE : deactivateMedication()
    ACTIVE --> ARCHIVED : archiveMedication()
    
    INACTIVE --> ACTIVE : activateMedication()
    INACTIVE --> ARCHIVED : archiveMedication()
    
    ARCHIVED --> [*] : medicationDeleted()
    
    note right of ACTIVE
        Thuốc đang hoạt động
        Có thể được sử dụng trong đơn thuốc
        Có thể vô hiệu hóa hoặc lưu trữ
    end note
    
    note right of INACTIVE
        Thuốc đã bị vô hiệu hóa
        Không thể sử dụng trong đơn thuốc mới
        Có thể kích hoạt lại hoặc lưu trữ
    end note
    
    note right of ARCHIVED
        Thuốc đã được lưu trữ
        Không thể sử dụng
        Có thể xóa hoàn toàn
    end note
```

## 6. State Machine Diagram - MajorDoctor States

```mermaid
stateDiagram-v2
    [*] --> ACTIVE : createMajorDoctor()
    
    ACTIVE --> INACTIVE : deactivateMajorDoctor()
    ACTIVE --> ARCHIVED : archiveMajorDoctor()
    
    INACTIVE --> ACTIVE : activateMajorDoctor()
    INACTIVE --> ARCHIVED : archiveMajorDoctor()
    
    ARCHIVED --> [*] : majorDoctorDeleted()
    
    note right of ACTIVE
        Chuyên khoa đang hoạt động
        Có thể được gán cho bác sĩ
        Có thể vô hiệu hóa hoặc lưu trữ
    end note
    
    note right of INACTIVE
        Chuyên khoa đã bị vô hiệu hóa
        Không thể gán cho bác sĩ mới
        Có thể kích hoạt lại hoặc lưu trữ
    end note
    
    note right of ARCHIVED
        Chuyên khoa đã được lưu trữ
        Không thể sử dụng
        Có thể xóa hoàn toàn
    end note
```

## 7. State Machine Diagram - WebSocket Connection States

```mermaid
stateDiagram-v2
    [*] --> CONNECTING : initiateConnection()
    
    CONNECTING --> AUTHENTICATING : connectionEstablished()
    CONNECTING --> DISCONNECTED : connectionFailed()
    
    AUTHENTICATING --> CONNECTED : authenticationSuccess()
    AUTHENTICATING --> DISCONNECTED : authenticationFailed()
    
    CONNECTED --> RECEIVING : startReceiving()
    CONNECTED --> SENDING : startSending()
    CONNECTED --> DISCONNECTED : disconnect()
    
    RECEIVING --> CONNECTED : messageProcessed()
    RECEIVING --> DISCONNECTED : connectionLost()
    
    SENDING --> CONNECTED : messageSent()
    SENDING --> DISCONNECTED : connectionLost()
    
    DISCONNECTED --> [*] : cleanupCompleted()
    
    note right of CONNECTING
        Đang thiết lập kết nối WebSocket
        Chờ phản hồi từ server
        Có thể thành công hoặc thất bại
    end note
    
    note right of AUTHENTICATING
        Đang xác thực JWT token
        Kiểm tra quyền truy cập
        Có thể thành công hoặc thất bại
    end note
    
    note right of CONNECTED
        Kết nối đã thành công
        Có thể gửi/nhận thông báo
        Có thể disconnect bất kỳ lúc nào
    end note
    
    note right of RECEIVING
        Đang nhận thông báo từ server
        Xử lý thông báo real-time
        Có thể quay lại trạng thái CONNECTED
    end note
    
    note right of SENDING
        Đang gửi thông báo đến server
        Chờ xác nhận gửi thành công
        Có thể quay lại trạng thái CONNECTED
    end note
    
    note right of DISCONNECTED
        Kết nối đã bị đóng
        Đang cleanup resources
        Sẽ chuyển về trạng thái cuối
    end note
```

## Mô Tả Chi Tiết

### 1. Prescription States
- **CREATED**: Đơn thuốc vừa được tạo, chưa có hiệu lực
- **ACTIVE**: Đơn thuốc đang hoạt động, bệnh nhân có thể uống thuốc
- **COMPLETED**: Đơn thuốc đã hoàn thành, không thể chỉnh sửa
- **CANCELLED**: Đơn thuốc đã bị hủy, không thể chỉnh sửa

### 2. User States
- **INACTIVE**: User được tạo nhưng chưa kích hoạt
- **ACTIVE**: User đang hoạt động bình thường
- **BLOCKED**: User bị khóa tạm thời

### 3. AdherenceLog States
- **PENDING**: Nhật ký uống thuốc vừa được tạo, chờ xác nhận
- **TAKEN**: Bệnh nhân đã xác nhận uống thuốc
- **MISSED**: Bệnh nhân đã bỏ lỡ uống thuốc
- **SKIPPED**: Bệnh nhân đã bỏ qua uống thuốc

### 4. Alert States
- **CREATED**: Cảnh báo vừa được tạo, chưa được gửi
- **SENT**: Cảnh báo đã được gửi, chờ phản hồi
- **READ**: Cảnh báo đã được đọc, chờ xử lý
- **RESOLVED**: Cảnh báo đã được xử lý
- **EXPIRED**: Cảnh báo đã hết hạn
- **CANCELLED**: Cảnh báo đã bị hủy

### 5. Medication States
- **ACTIVE**: Thuốc đang hoạt động, có thể sử dụng
- **INACTIVE**: Thuốc đã bị vô hiệu hóa
- **ARCHIVED**: Thuốc đã được lưu trữ

### 6. MajorDoctor States
- **ACTIVE**: Chuyên khoa đang hoạt động
- **INACTIVE**: Chuyên khoa đã bị vô hiệu hóa
- **ARCHIVED**: Chuyên khoa đã được lưu trữ

### 7. WebSocket Connection States
- **CONNECTING**: Đang thiết lập kết nối
- **AUTHENTICATING**: Đang xác thực
- **CONNECTED**: Kết nối đã thành công
- **RECEIVING**: Đang nhận thông báo
- **SENDING**: Đang gửi thông báo
- **DISCONNECTED**: Kết nối đã bị đóng

## Lợi Ích Của State Machine Diagrams

1. **Hiểu rõ trạng thái**: Giúp hiểu rõ các trạng thái và chuyển đổi trạng thái
2. **Thiết kế logic**: Hỗ trợ thiết kế logic xử lý trạng thái
3. **Phát hiện lỗi**: Dễ dàng phát hiện các trạng thái không hợp lệ
4. **Tài liệu hóa**: Tài liệu hóa các trạng thái cho team phát triển
5. **Testing**: Hỗ trợ thiết kế test cases cho các trạng thái
6. **Giao tiếp**: Giúp giao tiếp giữa team về logic trạng thái
