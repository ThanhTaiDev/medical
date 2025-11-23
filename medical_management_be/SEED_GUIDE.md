# 🌱 Hướng Dẫn Seed Database

## 📋 Tổng Quan

Seed data được sử dụng để tạo dữ liệu mẫu cho hệ thống. **Mặc định, seed sẽ KHÔNG chạy tự động** để tránh mất dữ liệu thật.

## 🔒 Bảo Vệ Dữ Liệu

Seed script có cơ chế bảo vệ:
- ✅ **Tự động kiểm tra**: Nếu database đã có dữ liệu, seed sẽ **KHÔNG chạy**
- ✅ **Force flag**: Chỉ seed khi có `FORCE_SEED=true` (cảnh báo: sẽ xóa toàn bộ dữ liệu)

## 🏠 Local Development

### Seed lần đầu (database trống):
```bash
cd medical_management_be
yarn db:seed
# hoặc
npm run db:seed
```

### Seed lại (xóa dữ liệu cũ):
```bash
FORCE_SEED=true yarn db:seed
```

### Seed với Docker:
```bash
docker-compose exec backend yarn db:seed
```

## 🚀 Production (Railway/Vercel)

### ⚠️ QUAN TRỌNG: Seed KHÔNG chạy tự động ở production!

### Cách 1: Seed qua Railway CLI

1. **Cài Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Kết nối với project**:
   ```bash
   railway link
   ```

3. **Chạy seed**:
   ```bash
   railway run yarn db:seed
   ```

### Cách 2: Seed qua Railway Console

1. Vào Railway Dashboard → Project → Backend Service
2. Vào tab **"Deployments"** → Click deployment mới nhất
3. Vào tab **"Logs"** → Click **"Shell"** (hoặc **"Terminal"**)
4. Chạy lệnh:
   ```bash
   yarn db:seed
   ```

### Cách 3: Seed qua Database Connection

Nếu có quyền truy cập database trực tiếp:

1. Kết nối với PostgreSQL database
2. Chạy seed script:
   ```bash
   # Set DATABASE_URL
   export DATABASE_URL="postgresql://user:pass@host:port/db"
   
   # Chạy seed
   yarn db:seed
   ```

## 📊 Dữ Liệu Seed

Seed sẽ tạo:

- **1 Admin user**: 
  - SĐT: `0901000000` (hoặc số đầu tiên từ generateVietnamPhone)
  - Password: `123123`
  - Role: `ADMIN`

- **10 Doctor users**:
  - SĐT: `0901000001` - `0901000010`
  - Password: `123123`
  - Role: `DOCTOR`
  - Mỗi doctor có chuyên khoa khác nhau

- **20 Patient users**:
  - SĐT: `0901001001` - `0901001020`
  - Password: `123123`
  - Role: `PATIENT`
  - Mỗi patient được gán cho 1 doctor ngẫu nhiên

- **16 Major Doctor categories**: Các chuyên khoa y tế

- **20 Medications**: Các loại thuốc phổ biến

- **Prescriptions**: Mỗi patient có 1-2 đơn thuốc với items

- **Adherence Logs**: Lịch sử uống thuốc

- **Alerts**: Một số cảnh báo mẫu

## 🔐 Đăng Nhập Sau Khi Seed

### Admin:
- SĐT: `0901000000` (hoặc số đầu tiên)
- Password: `123123`

### Doctor:
- SĐT: `0901000001`, `0901000002`, ... `0901000010`
- Password: `123123`

### Patient:
- SĐT: `0901001001`, `0901001002`, ... `0901001020`
- Password: `123123`

## ⚠️ Lưu Ý Quan Trọng

1. **KHÔNG seed ở production nếu đã có dữ liệu thật** - sẽ mất hết!
2. **Chỉ seed khi**:
   - Database mới, chưa có dữ liệu
   - Đang test/staging
   - Cần reset toàn bộ dữ liệu (dùng `FORCE_SEED=true`)

3. **Backup trước khi seed** nếu có dữ liệu quan trọng

4. **Dockerfile đã được sửa** - không seed tự động khi container khởi động

## 🛠️ Troubleshooting

### Seed không chạy vì đã có dữ liệu:
```
Database already has data. Skipping seed.
```
→ Đây là tính năng bảo vệ. Nếu muốn seed lại:
```bash
FORCE_SEED=true yarn db:seed
```

### Lỗi kết nối database:
- Kiểm tra `DATABASE_URL` đúng chưa
- Đảm bảo database đã sẵn sàng
- Kiểm tra network/firewall

### Seed chạy nhưng không có dữ liệu:
- Kiểm tra logs để xem có lỗi không
- Đảm bảo Prisma schema đã sync: `yarn prisma generate`
- Kiểm tra migrations: `yarn prisma migrate deploy`

