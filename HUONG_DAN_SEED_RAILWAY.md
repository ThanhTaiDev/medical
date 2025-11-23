# 🌱 Hướng Dẫn Chạy Seed Tạo Data Trên Railway

## 📋 Tổng Quan

Hướng dẫn này sẽ giúp bạn chạy seed để tạo dữ liệu mẫu trên Railway production.

## ⚠️ Lưu Ý Quan Trọng

- **Seed sẽ XÓA TOÀN BỘ dữ liệu hiện tại** nếu database đã có data
- **Chỉ chạy seed khi**:
  - Database mới, chưa có dữ liệu
  - Cần reset toàn bộ dữ liệu (test/staging)
  - Đã backup dữ liệu quan trọng

## 🚀 Cách 1: Qua Railway Web Interface (Khuyến nghị)

### Bước 1: Truy Cập Shell/Terminal

1. **Vào Railway Dashboard**: https://railway.app
2. **Chọn project** của bạn (ví dụ: "nurturing-peace")
3. **Click vào service "medical"** (backend service)
4. **Vào tab "Deployments"** (ở trên cùng, bên cạnh "Logs", "Settings")
5. **Click vào deployment mới nhất** (deployment có timestamp gần nhất)
6. **Trong deployment detail**, tìm tab **"Shell"** hoặc **"Terminal"**
7. **Click vào tab đó** → Shell sẽ mở ra

### Bước 2: Chạy Seed

Trong shell, chạy lệnh:

```bash
# Kiểm tra xem đã có dữ liệu chưa
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"

# Nếu database trống (count = 0), chạy seed bình thường:
yarn db:seed

# Nếu database đã có dữ liệu, bạn cần force seed (sẽ XÓA HẾT):
FORCE_SEED=true yarn db:seed
```

### Bước 3: Kiểm Tra Kết Quả

Sau khi seed xong, kiểm tra:

```bash
# Đếm số users
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"

# Xem danh sách users
npx prisma db execute --stdin <<< "SELECT \"phoneNumber\", \"fullName\", role FROM \"User\" LIMIT 10;"
```

## 🖥️ Cách 2: Qua Railway CLI (Nếu không tìm thấy Shell trên web)

### Bước 1: Cài Đặt Railway CLI

```bash
# Cài đặt Railway CLI
npm i -g @railway/cli

# Hoặc dùng yarn
yarn global add @railway/cli
```

### Bước 2: Đăng Nhập và Kết Nối

```bash
# Đăng nhập Railway
railway login

# Kết nối với project
railway link

# Chọn:
# 1. Project của bạn (ví dụ: "nurturing-peace")
# 2. Service "medical" (backend service)
```

### Bước 3: Chạy Seed

```bash
# Seed bình thường (nếu database trống)
railway run yarn db:seed

# Force seed (nếu database đã có dữ liệu - SẼ XÓA HẾT)
railway run FORCE_SEED=true yarn db:seed
```

## 📊 Dữ Liệu Sẽ Được Tạo

Sau khi seed thành công, bạn sẽ có:

### 👤 Users:
- **1 Admin**: 
  - SĐT: `0901000000` (hoặc số đầu tiên)
  - Password: `123123`
  - Role: `ADMIN`

- **10 Doctors**: 
  - SĐT: `0901000001` - `0901000010`
  - Password: `123123`
  - Role: `DOCTOR`
  - Mỗi doctor có chuyên khoa khác nhau

- **20 Patients**: 
  - SĐT: `0901001001` - `0901001020`
  - Password: `123123`
  - Role: `PATIENT`
  - Mỗi patient được gán cho 1 doctor

### 📚 Dữ Liệu Khác:
- **16 Major Doctor categories** (Chuyên khoa)
- **20 Medications** (Thuốc)
- **Prescriptions** (Đơn thuốc) - Mỗi patient có 1-2 đơn
- **Prescription Items** (Chi tiết đơn thuốc)
- **Adherence Logs** (Lịch sử uống thuốc)
- **Alerts** (Cảnh báo)

## 🔐 Đăng Nhập Sau Khi Seed

### Admin:
```
SĐT: 0901000000
Password: 123123
```

### Doctor (ví dụ):
```
SĐT: 0901000001
Password: 123123
```

### Patient (ví dụ):
```
SĐT: 0901001001
Password: 123123
```

## 🐛 Troubleshooting

### Lỗi: "Database already has data. Skipping seed."

**Nguyên nhân**: Database đã có dữ liệu, seed script tự động bảo vệ.

**Giải pháp**: 
```bash
# Force seed (sẽ xóa hết dữ liệu cũ)
FORCE_SEED=true yarn db:seed
```

### Lỗi: "Cannot connect to database"

**Kiểm tra**:
1. Database service đang running chưa?
2. `DATABASE_URL` đã set đúng chưa?
3. Network connection giữa services

**Giải pháp**:
```bash
# Test connection
npx prisma db pull

# Nếu fail, kiểm tra DATABASE_URL trong Settings → Variables
```

### Lỗi: "Command not found: yarn"

**Giải pháp**: Dùng npm thay vì yarn
```bash
npm run db:seed
# hoặc
FORCE_SEED=true npm run db:seed
```

### Lỗi: "Prisma schema not found"

**Giải pháp**: Đảm bảo đang ở đúng directory
```bash
# Kiểm tra
ls prisma/schema.prisma

# Nếu không có, có thể cần chạy từ root của backend
cd /app
yarn db:seed
```

## ✅ Checklist

Trước khi seed:
- [ ] Đã backup dữ liệu quan trọng (nếu có)
- [ ] Đã kiểm tra database có dữ liệu chưa
- [ ] Đã chuẩn bị force seed nếu cần

Sau khi seed:
- [ ] Kiểm tra số lượng users đã tạo
- [ ] Test đăng nhập với admin/doctor/patient
- [ ] Kiểm tra prescriptions và data khác

## 📝 Ví Dụ Lệnh Đầy Đủ

```bash
# 1. Vào shell/terminal trên Railway

# 2. Kiểm tra dữ liệu hiện tại
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"

# 3. Chạy seed
# Nếu database trống:
yarn db:seed

# Nếu database đã có dữ liệu:
FORCE_SEED=true yarn db:seed

# 4. Kiểm tra kết quả
npx prisma db execute --stdin <<< "SELECT \"phoneNumber\", \"fullName\", role FROM \"User\" ORDER BY \"createdAt\" LIMIT 20;"

# 5. Test đăng nhập (qua API hoặc frontend)
# Admin: 0901000000 / 123123
# Doctor: 0901000001 / 123123
# Patient: 0901001001 / 123123
```

## 🎯 Quick Start (Copy & Paste)

Nếu bạn muốn seed nhanh, copy toàn bộ block này vào shell:

```bash
# Force seed (xóa hết và tạo lại)
FORCE_SEED=true yarn db:seed && echo "✅ Seed completed!" && npx prisma db execute --stdin <<< "SELECT COUNT(*) as total_users FROM \"User\";"
```

## 📞 Cần Giúp?

Nếu gặp lỗi:
1. Copy toàn bộ error message
2. Kiểm tra logs trong tab "Deploy Logs"
3. Kiểm tra Environment Variables trong Settings

