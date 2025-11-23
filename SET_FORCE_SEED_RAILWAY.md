# 🔧 Cách Set FORCE_SEED trên Railway

## Cách 1: Set Environment Variable trong Railway Dashboard

1. **Vào Railway Dashboard**: https://railway.app
2. **Chọn project** "nurturing-peace"
3. **Click vào service "medical"**
4. **Vào tab "Variables"** (ở trên cùng)
5. **Click "New Variable"**
6. **Thêm**:
   - **Name**: `FORCE_SEED`
   - **Value**: `true`
7. **Click "Add"**
8. **Quay lại terminal** và chạy:
   ```bash
   railway run npm run db:seed
   ```

## Cách 2: Chạy trong Railway Shell (Web)

1. **Vào Railway Dashboard** → Service "medical"
2. **Tab "Deployments"** → Click deployment mới nhất
3. **Tab "Shell"** hoặc **"Terminal"**
4. **Chạy lệnh**:
   ```bash
   FORCE_SEED=true npm run db:seed
   ```

## Cách 3: Dùng Railway CLI với env file

Tạo file `.env.railway`:
```
FORCE_SEED=true
```

Sau đó chạy:
```bash
railway run --env-file .env.railway npm run db:seed
```

