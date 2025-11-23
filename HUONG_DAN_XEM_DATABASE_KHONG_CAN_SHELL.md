# 🗄️ Xem Database Không Cần Shell/Terminal Trên Web

## 🎯 Cách 1: Dùng Railway CLI Từ Local (Khuyến nghị)

### Bước 1: Cài đặt Railway CLI (nếu chưa có)

```bash
npm install -g @railway/cli
```

### Bước 2: Login và Link

```bash
# Login
railway login

# Link với project
cd medical_management_be
railway link

# Chọn project "nurturing-peace"
# Chọn service "medical"
```

### Bước 3: Chạy Prisma Studio

```bash
# Chạy Prisma Studio với port forwarding
railway run npx prisma studio --port 5555
```

**Lưu ý**: Prisma Studio sẽ chạy trên Railway server. Để truy cập từ browser, bạn cần:

1. **Mở terminal khác** và chạy port forwarding:
```bash
railway connect 5555
```

2. Hoặc dùng Railway CLI với port forwarding tự động:
```bash
railway run --port 5555 npx prisma studio
```

3. Truy cập: `http://localhost:5555`

### Bước 4: Chạy SQL Queries

```bash
# Xem tổng quan database
railway run npx prisma db execute --stdin <<< "SELECT 'Users' as table_name, COUNT(*) as count FROM \"User\" UNION ALL SELECT 'Doctors', COUNT(*) FROM \"User\" WHERE role = 'DOCTOR' UNION ALL SELECT 'Patients', COUNT(*) FROM \"User\" WHERE role = 'PATIENT' UNION ALL SELECT 'Prescriptions', COUNT(*) FROM \"Prescription\";"

# Xem tất cả users
railway run npx prisma db execute --stdin <<< "SELECT id, \"phoneNumber\", \"fullName\", role, status FROM \"User\" ORDER BY \"createdAt\" DESC LIMIT 50;"
```

## 🔌 Cách 2: Dùng Database Client (pgAdmin, DBeaver, TablePlus) - Tốt nhất

### Bước 1: Lấy Database Connection String

1. **Vào Railway Dashboard**: https://railway.app
2. **Chọn project** "nurturing-peace"
3. **Click vào service "medical"** (hoặc service database nếu có riêng)
4. **Vào tab "Variables"**
5. **Tìm và copy biến `DATABASE_URL`**

Format thường là:
```
postgresql://user:password@host:port/dbname?schema=public
```

### Bước 2: Parse Connection String

Từ `DATABASE_URL`, bạn sẽ có:
- **Host**: Phần sau `@` và trước `:`
- **Port**: Phần sau `:` và trước `/`
- **Database**: Phần sau `/` và trước `?`
- **Username**: Phần sau `postgresql://` và trước `:`
- **Password**: Phần sau `:` và trước `@`

**Ví dụ**:
```
postgresql://postgres:abc123@containers-us-west-123.railway.app:5432/railway
```

Parse ra:
- Host: `containers-us-west-123.railway.app`
- Port: `5432`
- Database: `railway`
- Username: `postgres`
- Password: `abc123`

### Bước 3: Kết nối với Database Client

#### Option A: TablePlus (Dễ nhất, đẹp nhất)

1. **Download TablePlus**: https://tableplus.com/
2. **Mở TablePlus** → Click "Create a new connection"
3. **Chọn "PostgreSQL"**
4. **Có 2 cách**:

   **Cách 1: Paste connection string trực tiếp**
   - Click "Import from URL"
   - Paste `DATABASE_URL` vào
   - Click "Import"

   **Cách 2: Điền thủ công**
   - **Name**: Railway Medical DB
   - **Host**: Lấy từ DATABASE_URL
   - **Port**: Lấy từ DATABASE_URL
   - **User**: Lấy từ DATABASE_URL
   - **Password**: Lấy từ DATABASE_URL
   - **Database**: Lấy từ DATABASE_URL

5. **Click "Connect"**

#### Option B: DBeaver (Miễn phí, mạnh mẽ)

1. **Download DBeaver**: https://dbeaver.io/
2. **Mở DBeaver** → Click "New Database Connection" (icon database)
3. **Chọn "PostgreSQL"** → Next
4. **Main tab**:
   - **Host**: Lấy từ DATABASE_URL
   - **Port**: Lấy từ DATABASE_URL
   - **Database**: Lấy từ DATABASE_URL
   - **Username**: Lấy từ DATABASE_URL
   - **Password**: Lấy từ DATABASE_URL
5. **Click "Test Connection"** → "Finish"

#### Option C: pgAdmin (Chuyên nghiệp)

1. **Download pgAdmin**: https://www.pgadmin.org/
2. **Mở pgAdmin** → Right-click "Servers" → "Create" → "Server"
3. **General tab**:
   - **Name**: Railway Medical DB
4. **Connection tab**:
   - **Host name/address**: Lấy từ DATABASE_URL
   - **Port**: Lấy từ DATABASE_URL
   - **Maintenance database**: Lấy từ DATABASE_URL
   - **Username**: Lấy từ DATABASE_URL
   - **Password**: Lấy từ DATABASE_URL
5. **Click "Save"**

### Bước 4: Xem Database

Sau khi kết nối, bạn có thể:
- ✅ Xem tất cả tables
- ✅ Xem dữ liệu trong mỗi table
- ✅ Chạy SQL queries
- ✅ Export data
- ✅ Edit data trực tiếp

## 🌐 Cách 3: Tạo API Endpoint Để Xem Data

Nếu bạn muốn xem qua browser, có thể tạo API endpoint tạm thời:

### Tạo file mới: `medical_management_be/src/modules/admin/admin.controller.ts`

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { RolesGuard } from '@/core/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('db-overview')
  async getDbOverview() {
    const users = await this.databaseService.client.user.count();
    const doctors = await this.databaseService.client.user.count({
      where: { role: 'DOCTOR' }
    });
    const patients = await this.databaseService.client.user.count({
      where: { role: 'PATIENT' }
    });
    const prescriptions = await this.databaseService.client.prescription.count();
    
    return {
      users,
      doctors,
      patients,
      prescriptions
    };
  }

  @Get('users')
  async getUsers() {
    return this.databaseService.client.user.findMany({
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
```

Sau đó truy cập:
- `https://your-backend-url/api/admin/db-overview`
- `https://your-backend-url/api/admin/users`

## 📊 Cách 4: Dùng Script Node.js

Tạo file `view-db.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Xem tổng quan
  const users = await prisma.user.count();
  const doctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
  const patients = await prisma.user.count({ where: { role: 'PATIENT' } });
  const prescriptions = await prisma.prescription.count();

  console.log('=== Database Overview ===');
  console.log(`Users: ${users}`);
  console.log(`Doctors: ${doctors}`);
  console.log(`Patients: ${patients}`);
  console.log(`Prescriptions: ${prescriptions}`);

  // Xem users
  console.log('\n=== Users ===');
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      phoneNumber: true,
      fullName: true,
      role: true,
      status: true
    },
    take: 20
  });
  console.table(allUsers);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Chạy:
```bash
cd medical_management_be
railway run node view-db.js
```

## 🎯 Khuyến nghị

**Cách tốt nhất**: Dùng **TablePlus** hoặc **DBeaver**
- ✅ Giao diện đẹp, dễ sử dụng
- ✅ Xem và edit data trực tiếp
- ✅ Chạy SQL queries
- ✅ Export/Import data
- ✅ Không cần shell/terminal

**Cách nhanh nhất**: Dùng **Railway CLI từ local**
- ✅ Chạy Prisma Studio
- ✅ Chạy SQL queries
- ✅ Không cần mở Railway web

## 📝 Quick Start với TablePlus

1. **Download TablePlus**: https://tableplus.com/
2. **Lấy DATABASE_URL** từ Railway Variables
3. **Mở TablePlus** → "Create a new connection" → "PostgreSQL"
4. **Click "Import from URL"** → Paste DATABASE_URL
5. **Click "Import"** → Done! 🎉

## 🔍 Troubleshooting

### Lỗi: "Cannot connect to database"

**Kiểm tra**:
1. DATABASE_URL đã copy đúng chưa?
2. Database service đang running chưa?
3. Firewall có chặn connection không?

**Giải pháp**:
- Railway database thường cho phép connection từ bất kỳ đâu
- Nếu vẫn lỗi, kiểm tra DATABASE_URL format

### Lỗi: "Connection timeout"

**Nguyên nhân**: Database có thể đang sleep (Railway free tier)

**Giải pháp**: 
- Gửi một request đến backend để "đánh thức" database
- Hoặc upgrade Railway plan

### Lỗi: "Authentication failed"

**Nguyên nhân**: Username/Password sai

**Giải pháp**: 
- Copy lại DATABASE_URL từ Railway Variables
- Đảm bảo không có space hoặc ký tự đặc biệt

## 📞 Cần Giúp?

Nếu gặp vấn đề:
1. Kiểm tra DATABASE_URL trong Railway Variables
2. Thử kết nối bằng TablePlus (dễ nhất)
3. Hoặc dùng Railway CLI từ local


