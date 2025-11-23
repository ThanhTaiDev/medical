# 🖥️ Hướng Dẫn Truy Cập Shell/Terminal Trên Railway

## 📍 Cách 1: Qua Tab Deployments (Khuyến nghị)

1. **Vào Railway Dashboard** → Chọn project của bạn
2. **Click vào Backend Service** (service "medical")
3. **Vào tab "Deployments"** (ở trên cùng, bên cạnh "Logs", "Settings")
4. **Click vào deployment mới nhất** (deployment có timestamp gần nhất)
5. **Trong deployment detail**, bạn sẽ thấy:
   - Tab "Logs" (đang xem)
   - Tab "Shell" hoặc **"Terminal"** ← Click vào đây!
6. **Shell/Terminal sẽ mở ra** → Bạn có thể chạy lệnh như:
   ```bash
   yarn db:seed
   ```

## 📍 Cách 2: Qua Service Settings

1. **Vào Railway Dashboard** → Chọn project
2. **Click vào Backend Service** ("medical")
3. **Vào tab "Settings"**
4. **Scroll xuống** tìm phần **"Deploy"** hoặc **"Shell"**
5. Có thể có nút **"Open Shell"** hoặc **"Terminal"**

## 📍 Cách 3: Qua Observability Tab

1. **Vào tab "Observability"** (ở trên cùng)
2. Tìm phần **"Shell"** hoặc **"Terminal"**
3. Click để mở terminal

## 📍 Cách 4: Sử dụng Railway CLI (Nếu không tìm thấy Shell trên web)

### Cài đặt Railway CLI:
```bash
npm i -g @railway/cli
```

### Đăng nhập:
```bash
railway login
```

### Kết nối với project:
```bash
railway link
# Chọn project và service của bạn
```

### Chạy lệnh trong shell:
```bash
railway run yarn db:seed
```

## 🔍 Nếu Không Tìm Thấy Shell/Terminal

### Kiểm tra:
1. ✅ Đảm bảo bạn đang ở đúng **service** (backend service, không phải database)
2. ✅ Đảm bảo deployment đã **hoàn thành** (không phải đang deploy)
3. ✅ Thử **refresh** trang
4. ✅ Kiểm tra xem có **quyền truy cập** không

### Alternative: Sử dụng Railway CLI
Nếu không tìm thấy shell trên web interface, dùng Railway CLI là cách tốt nhất:

```bash
# Cài đặt
npm i -g @railway/cli

# Login
railway login

# Link với project
railway link

# Chạy seed
railway run yarn db:seed
```

## 📸 Vị Trí Shell Trong Railway UI

```
Railway Dashboard
├── Project: "nurturing-peace"
│   ├── Service: "medical" (Backend)
│   │   ├── Tab: "Architecture"
│   │   ├── Tab: "Observability"
│   │   ├── Tab: "Logs" ← Bạn đang ở đây
│   │   ├── Tab: "Settings"
│   │   └── Tab: "Deployments" ← Vào đây
│   │       └── Click deployment mới nhất
│   │           ├── Tab: "Logs"
│   │           └── Tab: "Shell" hoặc "Terminal" ← ĐÂY!
│   │
│   └── Service: "PostgreSQL" (Database)
```

## ⚠️ Lưu Ý

- Shell chỉ có sẵn khi service đang **running**
- Nếu service đang **restarting** hoặc **stopped**, shell có thể không khả dụng
- Shell chạy trong **container** của service, không phải local machine

## 🎯 Sau Khi Mở Shell

Chạy lệnh seed:
```bash
yarn db:seed
```

Hoặc nếu muốn force seed:
```bash
FORCE_SEED=true yarn db:seed
```

