# Hướng dẫn Test API Bác sĩ - Bệnh nhân đang điều trị

## Mục đích
Test API để kiểm tra số lượng bệnh nhân đang được điều trị của bác sĩ có số điện thoại `0881000007`.

## Các API Endpoints được sử dụng

### 1. Đăng nhập
- **Method**: `POST`
- **URL**: `http://localhost:3000/auth/login`
- **Body**: 
  ```json
  {
    "phoneNumber": "0881000007",
    "password": "password_của_bác_sĩ"
  }
  ```
- **Response**: Trả về `accessToken` và thông tin bác sĩ

### 2. Lấy thông tin bác sĩ hiện tại
- **Method**: `GET`
- **URL**: `http://localhost:3000/auth/me`
- **Headers**: `Authorization: Bearer {accessToken}`

### 3. Lấy bệnh nhân đang điều trị (ACTIVE prescriptions)
- **Method**: `GET`
- **URL**: `http://localhost:3000/doctor/overview/active-patients?doctorId={doctorId}`
- **Headers**: `Authorization: Bearer {accessToken}`

### 4. Lấy tất cả bệnh nhân của bác sĩ
- **Method**: `GET`
- **URL**: `http://localhost:3000/doctor/patients/doctor/{doctorId}`
- **Headers**: `Authorization: Bearer {accessToken}`

### 5. Lấy tổng quan bác sĩ
- **Method**: `GET`
- **URL**: `http://localhost:3000/doctor/overview?doctorId={doctorId}`
- **Headers**: `Authorization: Bearer {accessToken}`

## Cách Test

### Option 1: Sử dụng Postman Collection

1. Import file `test_doctor_patients.postman_collection.json` vào Postman
2. Cập nhật password trong request "1. Login Doctor"
3. Chạy collection theo thứ tự:
   - 1. Login Doctor
   - 2. Get Doctor Info
   - 3. Get Active Patients (Đang điều trị)
   - 4. Get All Patients of Doctor
   - 5. Get Doctor Overview

### Option 2: Sử dụng Script Bash

1. Cập nhật password trong file `test_doctor_api.sh`
2. Chạy script:
   ```bash
   chmod +x test_doctor_api.sh
   ./test_doctor_api.sh
   ```

### Option 3: Test thủ công từng bước

#### Bước 1: Đăng nhập
```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "0881000007", "password": "your_password"}'
```

#### Bước 2: Lấy bệnh nhân đang điều trị
```bash
curl -X GET "http://localhost:3000/doctor/overview/active-patients?doctorId={doctorId}" \
  -H "Authorization: Bearer {accessToken}"
```

## Kết quả mong đợi

### Response cho bệnh nhân đang điều trị:
```json
{
  "items": [
    {
      "patientId": "patient-id-1",
      "patientName": "Nguyễn Văn A",
      "phoneNumber": "0123456789",
      "doctorId": "doctor-id",
      "doctorName": "Dr. Smith",
      "adherence": {
        "taken": 15,
        "scheduled": 20,
        "rate": 0.75
      }
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

### Response cho tổng quan:
```json
{
  "totalPrescriptions": 25,
  "activePatientsCount": 8,
  "adherenceRate": 0.85
}
```

## Lưu ý quan trọng

1. **Authentication**: Tất cả API đều yêu cầu Bearer token từ bước đăng nhập
2. **Permissions**: Chỉ Admin có thể xem bệnh nhân của bác sĩ khác, Doctor chỉ xem được bệnh nhân của mình
3. **Active Patients**: Chỉ tính bệnh nhân có đơn thuốc với status = "ACTIVE"
4. **Password**: Cần thay đổi password thực tế trong các request

## Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra token có hợp lệ không
- Token có thể đã hết hạn, cần đăng nhập lại

### Lỗi 403 Forbidden
- User không có quyền truy cập API này
- Kiểm tra role của user (DOCTOR hoặc ADMIN)

### Lỗi 404 Not Found
- Doctor ID không tồn tại
- Endpoint không đúng

### Không có bệnh nhân nào
- Bác sĩ có thể chưa tạo bệnh nhân nào
- Hoặc bệnh nhân chưa có đơn thuốc ACTIVE

## Kết quả cuối cùng

Sau khi chạy test, bạn sẽ biết được:
- **Số lượng bệnh nhân đang điều trị**: Bệnh nhân có đơn thuốc ACTIVE
- **Tổng số bệnh nhân**: Tất cả bệnh nhân do bác sĩ tạo
- **Tỷ lệ tuân thủ**: Tỷ lệ bệnh nhân uống thuốc đúng giờ
- **Chi tiết từng bệnh nhân**: Tên, số điện thoại, trạng thái tuân thủ
