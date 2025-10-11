# UML Activity Diagrams - Medical Management System

## Tổng Quan
Sơ đồ hoạt động UML mô tả các quy trình nghiệp vụ và luồng công việc trong hệ thống quản lý y tế.

## 1. Activity Diagram - Quy Trình Kê Đơn Thuốc

```mermaid
flowchart TD
    A[Doctor truy cập trang tạo đơn thuốc] --> B[Chọn bệnh nhân]
    B --> C{Bệnh nhân có tồn tại?}
    C -->|Không| D[Hiển thị lỗi: Bệnh nhân không tồn tại]
    C -->|Có| E[Hiển thị thông tin bệnh nhân]
    E --> F[Thêm thuốc vào đơn]
    F --> G[Chọn thuốc từ danh mục]
    G --> H{Thuốc có tồn tại?}
    H -->|Không| I[Hiển thị lỗi: Thuốc không tồn tại]
    H -->|Có| J[Kiểm tra tương tác thuốc]
    J --> K{Có tương tác thuốc?}
    K -->|Có| L[Hiển thị cảnh báo tương tác]
    K -->|Không| M[Nhập thông tin thuốc]
    L --> N{Bác sĩ xác nhận tiếp tục?}
    N -->|Không| O[Chọn thuốc khác]
    N -->|Có| M
    M --> P[Nhập liều lượng]
    P --> Q[Nhập tần suất uống]
    Q --> R[Chọn thời gian uống]
    R --> S[Nhập thời gian điều trị]
    S --> T[Thêm ghi chú]
    T --> U{Có thêm thuốc khác?}
    U -->|Có| F
    U -->|Không| V[Nhập ghi chú đơn thuốc]
    V --> W[Xem lại đơn thuốc]
    W --> X{Bác sĩ xác nhận tạo đơn?}
    X -->|Không| Y[Chỉnh sửa đơn thuốc]
    X -->|Có| Z[Tạo đơn thuốc]
    Y --> W
    Z --> AA[Gửi thông báo cho bệnh nhân]
    AA --> BB[Hoàn thành]
    D --> CC[Kết thúc]
    I --> CC
    O --> CC
```

## 2. Activity Diagram - Quy Trình Uống Thuốc của Bệnh Nhân

```mermaid
flowchart TD
    A[Bệnh nhân nhận thông báo nhắc uống thuốc] --> B[Kiểm tra thông báo]
    B --> C{Đến giờ uống thuốc?}
    C -->|Chưa| D[Chờ đến giờ]
    C -->|Đến rồi| E[Bệnh nhân truy cập trang xác nhận]
    D --> C
    E --> F[Hiển thị danh sách thuốc cần uống]
    F --> G[Bệnh nhân chọn thuốc]
    G --> H{Bệnh nhân đã uống thuốc?}
    H -->|Chưa| I[Chọn lý do chưa uống]
    I --> J[Đánh dấu bỏ lỡ thuốc]
    J --> K[Tạo AdherenceLog với status MISSED]
    H -->|Đã uống| L[Xác nhận đã uống thuốc]
    L --> M[Nhập số lượng đã uống]
    M --> N[Nhập thời gian uống]
    N --> O[Thêm ghi chú]
    O --> P[Tạo AdherenceLog với status TAKEN]
    K --> Q[Cập nhật trạng thái đơn thuốc]
    P --> Q
    Q --> R[Gửi thông báo cho bác sĩ]
    R --> S{Còn thuốc khác cần uống?}
    S -->|Có| T[Chọn thuốc tiếp theo]
    S -->|Không| U[Hoàn thành]
    T --> G
```

## 3. Activity Diagram - Quy Trình Giám Sát Tuân Thủ

```mermaid
flowchart TD
    A[Bác sĩ truy cập trang giám sát tuân thủ] --> B[Hệ thống load danh sách bệnh nhân]
    B --> C[Hiển thị tỷ lệ tuân thủ của từng bệnh nhân]
    C --> D{Bác sĩ muốn xem chi tiết?}
    D -->|Không| E[Hiển thị dashboard tổng quan]
    D -->|Có| F[Chọn bệnh nhân]
    F --> G[Hiển thị chi tiết tuân thủ]
    G --> H[Hiển thị biểu đồ tuân thủ theo thời gian]
    H --> I[Hiển thị nhật ký uống thuốc]
    I --> J{Tỷ lệ tuân thủ có thấp?}
    J -->|Không| K[Hiển thị thông báo: Tuân thủ tốt]
    J -->|Có| L[Hiển thị cảnh báo: Tuân thủ thấp]
    L --> M{Bác sĩ muốn gửi nhắc nhở?}
    M -->|Không| N[Quay lại danh sách]
    M -->|Có| O[Nhập nội dung nhắc nhở]
    O --> P[Gửi nhắc nhở cho bệnh nhân]
    P --> Q[Tạo Alert record]
    Q --> R[Gửi thông báo real-time]
    R --> S[Hoàn thành]
    K --> N
    E --> T[Kết thúc]
    N --> T
    S --> T
```

## 4. Activity Diagram - Quy Trình Tạo Cảnh Báo Tự Động

```mermaid
flowchart TD
    A[Cron job chạy hàng ngày lúc 9:00] --> B[Lấy danh sách bệnh nhân đang điều trị]
    B --> C[Với mỗi bệnh nhân]
    C --> D[Lấy AdherenceLog trong 7 ngày gần nhất]
    D --> E[Tính tổng số lần uống thuốc]
    E --> F[Tính số lần đã uống thuốc]
    F --> G[Tính tỷ lệ tuân thủ]
    G --> H{Tỷ lệ tuân thủ < 70%?}
    H -->|Không| I[Bỏ qua bệnh nhân này]
    H -->|Có| J[Kiểm tra cảnh báo đã tồn tại]
    J --> K{Đã có cảnh báo trong 24h?}
    K -->|Có| L[Bỏ qua để tránh spam]
    K -->|Không| M[Tạo cảnh báo LOW_ADHERENCE]
    M --> N[Lấy thông tin bác sĩ điều trị]
    N --> O[Tạo Alert record]
    O --> P[Gửi thông báo cho bác sĩ]
    P --> Q[Gửi email cảnh báo]
    Q --> R[Ghi log hoạt động]
    I --> S{Còn bệnh nhân khác?}
    L --> S
    R --> S
    S -->|Có| C
    S -->|Không| T[Hoàn thành quá trình kiểm tra]
    T --> U[Kết thúc]
```

## 5. Activity Diagram - Quy Trình Xử Lý WebSocket Connection

```mermaid
flowchart TD
    A[Client gửi WebSocket connection request] --> B[Hệ thống nhận connection request]
    B --> C[Kiểm tra JWT token]
    C --> D{Token có hợp lệ?}
    D -->|Không| E[Từ chối kết nối]
    D -->|Có| F[Lấy thông tin user từ token]
    F --> G[Kiểm tra quyền truy cập]
    G --> H{User có quyền?}
    H -->|Không| I[Từ chối kết nối]
    H -->|Có| J[Tạo WebSocket connection]
    J --> K[Join user vào room theo role]
    K --> L[Join user vào room theo ID]
    L --> M[Join user vào room theo prescription]
    M --> N[Gửi thông báo kết nối thành công]
    N --> O[Theo dõi connection]
    O --> P{Connection còn hoạt động?}
    P -->|Có| Q[Nhận và xử lý thông báo]
    Q --> R[Gửi thông báo đến client]
    R --> P
    P -->|Không| S[Cleanup connection]
    S --> T[Leave user khỏi các rooms]
    T --> U[Ghi log disconnect]
    U --> V[Đóng connection]
    E --> W[Kết thúc]
    I --> W
    V --> W
```

## 6. Activity Diagram - Quy Trình Authentication

```mermaid
flowchart TD
    A[Client gửi request đăng nhập] --> B[Hệ thống nhận credentials]
    B --> C[Validate phoneNumber format]
    C --> D{PhoneNumber hợp lệ?}
    D -->|Không| E[Trả về lỗi: PhoneNumber không hợp lệ]
    D -->|Có| F[Tìm user theo phoneNumber]
    F --> G{User có tồn tại?}
    G -->|Không| H[Trả về lỗi: User không tồn tại]
    G -->|Có| I[So sánh password]
    I --> J{Password đúng?}
    J -->|Không| K[Trả về lỗi: Password không đúng]
    J -->|Có| L[Kiểm tra trạng thái user]
    L --> M{User có ACTIVE?}
    M -->|Không| N[Trả về lỗi: User đã bị khóa]
    M -->|Có| O[Tạo access token]
    O --> P[Tạo refresh token]
    P --> Q[Lưu refresh token vào database]
    Q --> R[Set refresh token cookie]
    R --> S[Ghi log đăng nhập]
    S --> T[Trả về access token và user data]
    E --> U[Kết thúc]
    H --> U
    K --> U
    N --> U
    T --> U
```

## Mô Tả Chi Tiết

### 1. Quy Trình Kê Đơn Thuốc
- **Mục đích**: Mô tả quy trình bác sĩ tạo đơn thuốc điện tử
- **Các bước chính**:
  1. Chọn bệnh nhân và validate
  2. Thêm thuốc và kiểm tra tương tác
  3. Nhập thông tin chi tiết thuốc
  4. Xem lại và xác nhận đơn thuốc
  5. Tạo đơn thuốc và gửi thông báo

### 2. Quy Trình Uống Thuốc của Bệnh Nhân
- **Mục đích**: Mô tả quy trình bệnh nhân uống thuốc và xác nhận
- **Các bước chính**:
  1. Nhận thông báo nhắc uống thuốc
  2. Xác nhận đã uống hoặc đánh dấu bỏ lỡ
  3. Tạo AdherenceLog record
  4. Cập nhật trạng thái đơn thuốc
  5. Gửi thông báo cho bác sĩ

### 3. Quy Trình Giám Sát Tuân Thủ
- **Mục đích**: Mô tả quy trình bác sĩ giám sát tuân thủ uống thuốc
- **Các bước chính**:
  1. Xem danh sách bệnh nhân và tỷ lệ tuân thủ
  2. Xem chi tiết tuân thủ của từng bệnh nhân
  3. Phát hiện tuân thủ thấp
  4. Gửi nhắc nhở cho bệnh nhân
  5. Tạo cảnh báo và thông báo

### 4. Quy Trình Tạo Cảnh Báo Tự Động
- **Mục đích**: Mô tả quy trình hệ thống tự động tạo cảnh báo
- **Các bước chính**:
  1. Cron job chạy hàng ngày
  2. Tính tỷ lệ tuân thủ cho từng bệnh nhân
  3. Phát hiện tuân thủ thấp
  4. Tạo cảnh báo và gửi cho bác sĩ
  5. Ghi log hoạt động

### 5. Quy Trình Xử Lý WebSocket Connection
- **Mục đích**: Mô tả quy trình quản lý kết nối WebSocket
- **Các bước chính**:
  1. Xác thực JWT token
  2. Tạo WebSocket connection
  3. Join user vào các rooms
  4. Xử lý thông báo real-time
  5. Cleanup khi disconnect

### 6. Quy Trình Authentication
- **Mục đích**: Mô tả quy trình đăng nhập và xác thực
- **Các bước chính**:
  1. Validate thông tin đăng nhập
  2. Kiểm tra user và password
  3. Tạo access token và refresh token
  4. Set cookie và ghi log
  5. Trả về kết quả đăng nhập

## Lợi Ích Của Activity Diagrams

1. **Hiểu rõ quy trình**: Giúp hiểu rõ quy trình nghiệp vụ từ đầu đến cuối
2. **Phát hiện lỗi**: Dễ dàng phát hiện các điểm có thể xảy ra lỗi
3. **Tối ưu hóa**: Hỗ trợ tối ưu hóa quy trình nghiệp vụ
4. **Tài liệu hóa**: Tài liệu hóa quy trình cho team phát triển
5. **Giao tiếp**: Giúp giao tiếp giữa team về quy trình nghiệp vụ
6. **Testing**: Hỗ trợ thiết kế test cases cho quy trình
