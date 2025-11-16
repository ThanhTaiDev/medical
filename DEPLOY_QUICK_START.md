# 🚀 Quick Start: Deploy lên Vercel

## Tóm Tắt Nhanh (5 Phút)

### 1. Frontend - Deploy lên Vercel

```bash
# Bước 1: Đảm bảo code đã push lên Git
git add .
git commit -m "Ready for deployment"
git push

# Bước 2: Truy cập vercel.com và import project
# Bước 3: Cấu hình như sau:
```

**Cấu hình Vercel:**
- **Root Directory**: `medical_management_fe`
- **Framework Preset**: Vite
- **Build Command**: `yarn build` hoặc `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `yarn install` hoặc `npm install`

**Environment Variables:**
- `VITE_API_URL` = `https://your-backend-api.com/api`

### 2. Backend - Deploy lên Railway/Render

**Cấu hình Railway:**
- Root Directory: `medical_management_be`
- Build Command: `yarn install && yarn prisma generate && yarn build`
- Start Command: `yarn start:prod`

**Environment Variables:**
- `DATABASE_URL` = (từ PostgreSQL service)
- `FRONTEND_URL` = (URL frontend Vercel)
- `NODE_ENV` = `production`

### 3. Kiểm Tra

✅ Build thành công
✅ Frontend truy cập được
✅ API kết nối thành công
✅ Không có lỗi CORS

---

Xem chi tiết trong `VERCEL_DEPLOYMENT_GUIDE.md`

