# 🔧 Sửa Lỗi Crash Trên Railway

## 🐛 Nguyên Nhân Crash

Service bị crash do 2 vấn đề chính:

### 1. Lỗi Prisma Migration (P3005)
- **Lỗi**: "The database schema is not empty"
- **Nguyên nhân**: Database đã có schema/data nhưng chưa có migration history
- **Giải pháp**: Sử dụng fallback với `db push` nếu `migrate deploy` fail

### 2. PORT Configuration
- Railway tự động set biến `PORT` 
- Code đã xử lý đúng: `process.env.PORT || 9944`

## ✅ Đã Sửa

1. **Dockerfile**: Thêm fallback logic cho migration
   - Thử `migrate deploy` trước
   - Nếu fail → dùng `db push` (cho database đã có schema)

## 🚀 Cách Kiểm Tra Logs

### Trên Railway Dashboard:

1. **Vào service "medical"**
2. **Click tab "Deploy Logs"** hoặc **"HTTP Logs"**
3. **Xem lỗi cụ thể**:
   - Tìm dòng có "Error"
   - Tìm dòng có "P3005" (nếu là lỗi migration)
   - Tìm dòng có "Cannot connect" (nếu là lỗi database)

### Các Tab Logs:

- **Build Logs**: Lỗi khi build Docker image
- **Deploy Logs**: Lỗi khi chạy container
- **HTTP Logs**: Lỗi khi ứng dụng đang chạy

## 🔍 Các Lỗi Thường Gặp

### 1. P3005 - Database Schema Not Empty
```
Error: P3005
The database schema is not empty
```

**Giải pháp**: Đã sửa trong Dockerfile - sẽ tự động dùng `db push`

### 2. Cannot Connect to Database
```
Error: Can't reach database server
```

**Kiểm tra**:
- ✅ `DATABASE_URL` đã set đúng chưa?
- ✅ Database service đang running chưa?
- ✅ Network connection giữa services

### 3. Port Already in Use
```
Error: Port 9900 is already in use
```

**Giải pháp**: Railway tự động set PORT, không cần lo

### 4. Missing Environment Variables
```
Error: JWT_ACCESS_TOKEN_SECRET_KEY is required
```

**Kiểm tra**: Vào Settings → Variables → Đảm bảo đã set đủ biến

## 📝 Checklist Sau Khi Deploy

Sau khi push code mới:

1. ✅ **Vào Railway** → Service "medical"
2. ✅ **Xem tab "Deploy Logs"** → Kiểm tra có lỗi không
3. ✅ **Nếu vẫn crash**:
   - Xem chi tiết lỗi trong logs
   - Kiểm tra Environment Variables
   - Kiểm tra Database connection
4. ✅ **Nếu thành công**:
   - Service status = "Running"
   - Có thể access URL

## 🛠️ Cách Fix Thủ Công (Nếu Cần)

### Nếu vẫn bị lỗi migration:

1. **Vào Railway Shell** (xem RAILWAY_SHELL_GUIDE.md)
2. **Chạy lệnh**:
   ```bash
   # Baseline migration (nếu database đã có schema)
   npx prisma migrate resolve --applied <migration_name>
   
   # Hoặc push schema trực tiếp
   npx prisma db push --accept-data-loss
   ```

### Nếu lỗi database connection:

1. **Kiểm tra DATABASE_URL** trong Settings → Variables
2. **Format đúng**: `postgresql://user:pass@host:port/db?schema=public`
3. **Test connection**:
   ```bash
   npx prisma db pull
   ```

## 📞 Next Steps

1. **Commit và push** code đã sửa
2. **Railway sẽ tự động redeploy**
3. **Kiểm tra logs** sau khi deploy
4. **Nếu vẫn lỗi** → Xem chi tiết trong logs và fix tiếp

