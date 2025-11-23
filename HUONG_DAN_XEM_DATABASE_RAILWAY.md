# 🗄️ Hướng Dẫn Xem Database Trên Railway

## 📋 Tổng Quan

Có nhiều cách để xem và quản lý database trên Railway. Hướng dẫn này sẽ giúp bạn xem toàn bộ dữ liệu trong database.

## 🚀 Cách 1: Dùng Prisma Studio (Khuyến nghị - Dễ nhất)

### Bước 1: Kết nối với Railway

```bash
# Đảm bảo đã login và link với project
railway login
railway link

# Chọn service "medical" (backend)
railway service
```

### Bước 2: Chạy Prisma Studio

```bash
# Chạy Prisma Studio trên Railway
railway run npx prisma studio
```

### Bước 3: Truy cập Prisma Studio

- Prisma Studio sẽ tự động mở browser
- Hoặc truy cập URL được hiển thị (thường là `http://localhost:5555`)
- **Lưu ý**: Prisma Studio chạy trên Railway server, bạn cần port forwarding để truy cập

### Port Forwarding (Nếu cần):

```bash
# Forward port 5555 từ Railway về local
railway run --service medical --port 5555:5555 npx prisma studio
```

## 🖥️ Cách 2: Dùng Railway Shell + Prisma CLI

### Bước 1: Vào Railway Shell

1. **Vào Railway Dashboard** → Service "medical"
2. **Tab "Deployments"** → Click deployment mới nhất
3. **Tab "Shell"** hoặc **"Terminal"**

### Bước 2: Chạy các lệnh Prisma

```bash
# Xem tất cả tables
npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# Xem tất cả users
npx prisma db execute --stdin <<< "SELECT id, \"phoneNumber\", \"fullName\", role, status FROM \"User\" LIMIT 100;"

# Xem tất cả doctors
npx prisma db execute --stdin <<< "SELECT u.id, u.\"phoneNumber\", u.\"fullName\", u.role, md.name as major FROM \"User\" u LEFT JOIN \"MajorDoctor\" md ON u.\"majorDoctorId\" = md.id WHERE u.role = 'DOCTOR';"

# Xem tất cả patients
npx prisma db execute --stdin <<< "SELECT u.id, u.\"phoneNumber\", u.\"fullName\", u.role FROM \"User\" u WHERE u.role = 'PATIENT';"

# Xem tất cả prescriptions
npx prisma db execute --stdin <<< "SELECT p.id, p.\"patientId\", p.\"doctorId\", p.status, p.\"startDate\", p.\"endDate\" FROM \"Prescription\" p LIMIT 50;"

# Đếm số lượng records trong mỗi table
npx prisma db execute --stdin <<< "SELECT 'User' as table_name, COUNT(*) as count FROM \"User\" UNION ALL SELECT 'Doctor', COUNT(*) FROM \"User\" WHERE role = 'DOCTOR' UNION ALL SELECT 'Patient', COUNT(*) FROM \"User\" WHERE role = 'PATIENT' UNION ALL SELECT 'Prescription', COUNT(*) FROM \"Prescription\" UNION ALL SELECT 'PrescriptionItem', COUNT(*) FROM \"PrescriptionItem\" UNION ALL SELECT 'AdherenceLog', COUNT(*) FROM \"AdherenceLog\" UNION ALL SELECT 'Alert', COUNT(*) FROM \"Alert\" UNION ALL SELECT 'Medication', COUNT(*) FROM \"Medication\" UNION ALL SELECT 'MajorDoctor', COUNT(*) FROM \"MajorDoctor\";"
```

## 🔌 Cách 3: Dùng Database Client (pgAdmin, DBeaver, TablePlus)

### Bước 1: Lấy Database Connection String

1. **Vào Railway Dashboard** → Service "medical" (hoặc database service)
2. **Tab "Variables"**
3. **Tìm biến `DATABASE_URL`**
4. **Copy connection string** (format: `postgresql://user:password@host:port/dbname?schema=public`)

### Bước 2: Kết nối với Database Client

#### Với pgAdmin:
1. Mở pgAdmin
2. Right-click "Servers" → "Create" → "Server"
3. **General tab**: Đặt tên (ví dụ: "Railway Medical DB")
4. **Connection tab**:
   - **Host**: Lấy từ DATABASE_URL (phần sau `@` và trước `:`)
   - **Port**: Lấy từ DATABASE_URL (sau `:` và trước `/`)
   - **Database**: Lấy từ DATABASE_URL (sau `/` và trước `?`)
   - **Username**: Lấy từ DATABASE_URL (sau `//` và trước `:`)
   - **Password**: Lấy từ DATABASE_URL (sau `:` và trước `@`)
5. Click "Save"

#### Với DBeaver:
1. Mở DBeaver
2. Click "New Database Connection" (icon database)
3. Chọn "PostgreSQL"
4. **Main tab**:
   - **Host**: Lấy từ DATABASE_URL
   - **Port**: Lấy từ DATABASE_URL
   - **Database**: Lấy từ DATABASE_URL
   - **Username**: Lấy từ DATABASE_URL
   - **Password**: Lấy từ DATABASE_URL
5. Click "Test Connection" → "Finish"

#### Với TablePlus:
1. Mở TablePlus
2. Click "Create a new connection"
3. Chọn "PostgreSQL"
4. **Paste connection string** vào hoặc điền thủ công:
   - **Host**: Lấy từ DATABASE_URL
   - **Port**: Lấy từ DATABASE_URL
   - **Database**: Lấy từ DATABASE_URL
   - **User**: Lấy từ DATABASE_URL
   - **Password**: Lấy từ DATABASE_URL
5. Click "Connect"

## 📊 Cách 4: Dùng Railway CLI với SQL Queries

### Kết nối và chạy SQL:

```bash
# Đảm bảo đã link với service
railway service

# Chạy SQL query
railway run npx prisma db execute --stdin <<< "YOUR_SQL_QUERY_HERE"

# Ví dụ: Xem tất cả users với thông tin chi tiết
railway run npx prisma db execute --stdin <<< "SELECT u.id, u.\"phoneNumber\", u.\"fullName\", u.role, u.status, u.\"createdAt\", md.name as major FROM \"User\" u LEFT JOIN \"MajorDoctor\" md ON u.\"majorDoctorId\" = md.id ORDER BY u.\"createdAt\" DESC LIMIT 50;"
```

## 🔍 Cách 5: Export Database ra File

### Export toàn bộ database:

```bash
# Vào Railway Shell
# Export schema
railway run npx prisma db execute --stdin <<< "SELECT * FROM \"User\";" > users.csv

# Hoặc dùng pg_dump (nếu có)
railway run pg_dump $DATABASE_URL > backup.sql
```

## 📝 Các Query Hữu Ích

### Xem tổng quan database:

```sql
-- Đếm số lượng records
SELECT 
  'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Doctors', COUNT(*) FROM "User" WHERE role = 'DOCTOR'
UNION ALL
SELECT 'Patients', COUNT(*) FROM "User" WHERE role = 'PATIENT'
UNION ALL
SELECT 'Prescriptions', COUNT(*) FROM "Prescription"
UNION ALL
SELECT 'PrescriptionItems', COUNT(*) FROM "PrescriptionItem"
UNION ALL
SELECT 'AdherenceLogs', COUNT(*) FROM "AdherenceLog"
UNION ALL
SELECT 'Alerts', COUNT(*) FROM "Alert"
UNION ALL
SELECT 'Medications', COUNT(*) FROM "Medication"
UNION ALL
SELECT 'MajorDoctors', COUNT(*) FROM "MajorDoctor";
```

### Xem users với thông tin đầy đủ:

```sql
SELECT 
  u.id,
  u."phoneNumber",
  u."fullName",
  u.role,
  u.status,
  u."createdAt",
  md.name as major_doctor
FROM "User" u
LEFT JOIN "MajorDoctor" md ON u."majorDoctorId" = md.id
ORDER BY u."createdAt" DESC;
```

### Xem prescriptions với thông tin bệnh nhân và bác sĩ:

```sql
SELECT 
  p.id,
  p.status,
  p."startDate",
  p."endDate",
  patient."fullName" as patient_name,
  patient."phoneNumber" as patient_phone,
  doctor."fullName" as doctor_name,
  doctor."phoneNumber" as doctor_phone
FROM "Prescription" p
LEFT JOIN "User" patient ON p."patientId" = patient.id
LEFT JOIN "User" doctor ON p."doctorId" = doctor.id
ORDER BY p."createdAt" DESC
LIMIT 50;
```

### Xem adherence logs:

```sql
SELECT 
  al.id,
  al."takenAt",
  al.status,
  al.amount,
  patient."fullName" as patient_name,
  medication.name as medication_name
FROM "AdherenceLog" al
LEFT JOIN "User" patient ON al."patientId" = patient.id
LEFT JOIN "PrescriptionItem" pi ON al."prescriptionItemId" = pi.id
LEFT JOIN "Medication" medication ON pi."medicationId" = medication.id
ORDER BY al."takenAt" DESC
LIMIT 100;
```

## 🛠️ Troubleshooting

### Lỗi: "Cannot connect to database"

**Kiểm tra**:
1. `DATABASE_URL` đã set đúng chưa?
2. Database service đang running chưa?
3. Network connection giữa services

**Giải pháp**:
```bash
# Test connection
railway run npx prisma db pull
```

### Lỗi: "Permission denied"

**Nguyên nhân**: User không có quyền truy cập database

**Giải pháp**: Kiểm tra DATABASE_URL có đúng user/password không

### Lỗi: "Table does not exist"

**Nguyên nhân**: Schema chưa được migrate

**Giải pháp**:
```bash
railway run npx prisma db push
```

## 🎯 Quick Start (Copy & Paste)

Nếu bạn muốn xem nhanh toàn bộ database:

```bash
# 1. Link với service
railway service

# 2. Xem tổng quan
railway run npx prisma db execute --stdin <<< "SELECT 'Users' as table_name, COUNT(*) as count FROM \"User\" UNION ALL SELECT 'Doctors', COUNT(*) FROM \"User\" WHERE role = 'DOCTOR' UNION ALL SELECT 'Patients', COUNT(*) FROM \"User\" WHERE role = 'PATIENT' UNION ALL SELECT 'Prescriptions', COUNT(*) FROM \"Prescription\" UNION ALL SELECT 'PrescriptionItems', COUNT(*) FROM \"PrescriptionItem\" UNION ALL SELECT 'AdherenceLogs', COUNT(*) FROM \"AdherenceLog\" UNION ALL SELECT 'Alerts', COUNT(*) FROM \"Alert\" UNION ALL SELECT 'Medications', COUNT(*) FROM \"Medication\" UNION ALL SELECT 'MajorDoctors', COUNT(*) FROM \"MajorDoctor\";"

# 3. Xem tất cả users
railway run npx prisma db execute --stdin <<< "SELECT id, \"phoneNumber\", \"fullName\", role, status FROM \"User\" ORDER BY \"createdAt\" DESC LIMIT 50;"
```

## 📞 Cần Giúp?

Nếu gặp lỗi:
1. Kiểm tra DATABASE_URL trong Railway Variables
2. Kiểm tra database service đang running
3. Xem logs trong Railway Dashboard

