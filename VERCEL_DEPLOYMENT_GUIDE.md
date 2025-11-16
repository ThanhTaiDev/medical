# Hướng Dẫn Deploy Project Medical Patient lên Vercel

## 📋 Tổng Quan Project

Project của bạn là một monorepo bao gồm:
- **Frontend** (`medical_management_fe`): React + Vite + TypeScript
- **Backend** (`medical_management_be`): NestJS + Fastify + Prisma + PostgreSQL

## 🎯 Chiến Lược Deploy

### Option 1: Deploy Frontend lên Vercel (Khuyến nghị)
Vercel là platform tốt nhất cho Frontend React. Backend có thể deploy riêng lên:
- Railway
- Render
- DigitalOcean
- AWS
- Vercel Serverless Functions (nếu chuyển đổi)

### Option 2: Deploy cả Frontend và Backend lên Vercel
Backend cần chuyển đổi sang Serverless Functions.

---

## 📝 Hướng Dẫn Deploy Frontend lên Vercel (Option 1)

### Bước 1: Chuẩn Bị Repository

1. **Đảm bảo code đã được push lên GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Bước 2: Tạo Project trên Vercel

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập
2. Click **"Add New Project"**
3. Import repository từ GitHub/GitLab của bạn

### Bước 3: Cấu Hình Build Settings

Khi tạo project, Vercel cần các thông tin sau:

**Framework Preset**: Vite (tự động detect)

**Root Directory**: `medical_management_fe`

**Build Command**: 
```bash
yarn build
```
hoặc
```bash
npm run build
```

**Output Directory**: `dist`

**Install Command**:
```bash
yarn install
```
hoặc
```bash
npm install
```

### Bước 4: Cấu Hình Environment Variables

Trong **Settings > Environment Variables**, thêm:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | URL của backend API |

**Lưu ý**: 
- Thay `https://your-backend-url.com/api` bằng URL backend thực tế của bạn
- Đảm bảo backend đã được deploy và có CORS cấu hình đúng
- Nếu backend chưa deploy, bạn có thể dùng URL test tạm thời

### Bước 5: Kiểm Tra vercel.json

File `medical_management_fe/vercel.json` đã có sẵn và đúng cấu hình:

```json
{
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

Cấu hình này đảm bảo React Router hoạt động đúng với client-side routing.

### Bước 6: Deploy

1. Click **"Deploy"**
2. Vercel sẽ tự động build và deploy
3. Sau khi deploy xong, bạn sẽ nhận được một URL như: `https://your-project.vercel.app`

### Bước 7: Kiểm Tra

1. Truy cập URL đã deploy
2. Kiểm tra console browser (F12) để xem có lỗi không
3. Test các chức năng chính của ứng dụng

---

## 🚀 Hướng Dẫn Deploy Backend

Backend NestJS cần database PostgreSQL, nên cần deploy trên platform hỗ trợ database.

### Option A: Deploy Backend lên Railway (Khuyến nghị)

1. Truy cập [railway.app](https://railway.app)
2. Tạo project mới
3. Add PostgreSQL database
4. Add service từ GitHub repository
5. Set Root Directory: `medical_management_be`
6. Set build command: `yarn install && yarn prisma generate && yarn build`
7. Set start command: `yarn start:prod`
8. Thêm environment variables:
   - `DATABASE_URL`: Từ PostgreSQL service
   - `FRONTEND_URL`: URL frontend trên Vercel
   - `NODE_ENV`: `production`
   - `BACKEND_PORT`: `3000`
   - Các biến môi trường khác (JWT_SECRET, etc.)

9. Chạy migration:
   ```bash
   yarn prisma migrate deploy
   ```

### Option B: Deploy Backend lên Render

1. Truy cập [render.com](https://render.com)
2. Tạo PostgreSQL database
3. Tạo Web Service từ GitHub
4. Cấu hình tương tự Railway

### Option C: Deploy Backend lên Vercel (Serverless)

⚠️ **Lưu ý**: NestJS cần chuyển đổi sang Serverless Functions, phức tạp hơn.

---

## ⚙️ Cấu Hình Bổ Sung

### 1. CORS trên Backend

Đảm bảo backend cho phép CORS từ domain Vercel:

Trong `medical_management_be/src/utils/utils.ts` hoặc file CORS config:

```typescript
Utils.SystemUtils.setupCors(app);
```

Cần đảm bảo `FRONTEND_URL` được set đúng trong environment variables.

### 2. Environment Variables Checklist

**Frontend (Vercel)**:
- ✅ `VITE_API_URL`: URL backend API

**Backend**:
- ✅ `DATABASE_URL`: PostgreSQL connection string
- ✅ `FRONTEND_URL`: URL frontend trên Vercel
- ✅ `NODE_ENV`: `production`
- ✅ `BACKEND_PORT`: Port (thường 3000 hoặc auto)
- ✅ `JWT_SECRET`: Secret key cho JWT (nếu có)
- ✅ Các biến môi trường khác theo config của bạn

### 3. Database Migration

Trước khi deploy production:
1. Backup database hiện tại
2. Chạy migrations:
   ```bash
   cd medical_management_be
   yarn prisma migrate deploy
   ```

### 4. Custom Domain (Optional)

1. Vào Vercel dashboard > Settings > Domains
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

---

## 🔍 Troubleshooting

### Lỗi Build Failed
- Kiểm tra logs trong Vercel dashboard
- Đảm bảo `package.json` có script `build`
- Kiểm tra TypeScript errors: `yarn build` local

### Lỗi API Connection
- Kiểm tra `VITE_API_URL` đã set đúng chưa
- Kiểm tra CORS trên backend
- Kiểm tra backend đã deploy và hoạt động chưa

### Lỗi Routing (404)
- Đảm bảo `vercel.json` có rewrite rules
- Kiểm tra React Router configuration

### Lỗi Environment Variables
- Đảm bảo variables bắt đầu bằng `VITE_` cho Vite
- Redeploy sau khi thêm/sửa environment variables

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [NestJS Deployment](https://docs.nestjs.com/recipes/prisma)
- [Railway Documentation](https://docs.railway.app)

---

## ✅ Checklist Trước Khi Deploy

- [ ] Code đã được commit và push lên Git
- [ ] Backend đã được deploy và có URL
- [ ] Database đã được setup và migrations đã chạy
- [ ] Environment variables đã được cấu hình
- [ ] CORS đã được cấu hình trên backend
- [ ] Build local thành công: `yarn build` trong `medical_management_fe`
- [ ] Test local với production API URL

---

## 🎉 Sau Khi Deploy

1. Test tất cả các chức năng chính
2. Kiểm tra performance với Lighthouse
3. Setup monitoring và error tracking (Sentry, LogRocket, etc.)
4. Cấu hình CI/CD để auto-deploy khi có code mới

---

**Chúc bạn deploy thành công! 🚀**

