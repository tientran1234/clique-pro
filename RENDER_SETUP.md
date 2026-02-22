# 🚀 Hướng dẫn Deploy lên Render

## Vấn đề với SQLite trên Render

❌ **SQLite không hoạt động trên Render vì:**

- Render dùng **ephemeral filesystem** → file bị xóa sau mỗi deploy
- Data sẽ **MẤT HẾT** sau mỗi lần:
  - Deploy code mới
  - Restart service
  - Scale up/down

✅ **Giải pháp: Dùng PostgreSQL** (giống Tiger project trên VPS)

---

## Bước 1: Tạo PostgreSQL Database trên Render

### Option A: Dùng Render PostgreSQL (Free)

1. **Vào Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Điền thông tin:
   - **Name**: `clique-db`
   - **Database**: `clique_dating`
   - **User**: `clique_user` (auto-generated)
   - **Region**: `Singapore`
   - **Plan**: **Free**
4. Click **"Create Database"**
5. **Copy Internal Database URL** (dạng: `postgresql://user:pass@...`)

### Option B: Dùng Neon/Supabase (Free + Better)

#### Neon (Recommended):

1. Vào: https://neon.tech
2. Sign up → Create Project
3. Region: **Singapore**
4. Copy **Connection String**

#### Supabase:

1. Vào: https://supabase.com
2. New Project → Region: **Singapore**
3. Settings → Database → Copy **Connection String** (mode: Session)

---

## Bước 2: Update render.yaml

File `render.yaml` đã được update với PostgreSQL:

```yaml
services:
  - type: web
    name: clique-backend
    runtime: node
    region: singapore
    plan: free
    buildCommand: pnpm install && pnpm prisma generate && pnpm build
    startCommand: sh start.sh
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: clique-db # Tên database từ Bước 1
          property: connectionString
      - key: ALLOWED_ORIGINS
        value: https://clique-fe.vercel.app

databases:
  - name: clique-db
    databaseName: clique_dating
    plan: free
    region: singapore
```

**Hoặc nếu dùng External Database (Neon/Supabase):**

```yaml
envVars:
  - key: DATABASE_URL
    value: postgresql://user:pass@host.neon.tech/clique_dating?sslmode=require
```

---

## Bước 3: Update Prisma Schema

**File đã update:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"  // ✅ Đổi từ sqlite
  url      = env("DATABASE_URL")
}
```

---

## Bước 4: Tạo Migration cho PostgreSQL

```bash
# Xóa migration cũ (SQLite)
rm -rf prisma/migrations

# Tạo migration mới cho PostgreSQL
# (Cần update DATABASE_URL trong .env sang PostgreSQL trước)
pnpm prisma migrate dev --name init_postgresql
```

---

## Bước 5: Deploy lên Render

```bash
git add .
git commit -m "feat: Switch to PostgreSQL for production stability"
git push
```

Render sẽ tự động:

1. Detect `render.yaml` thay đổi
2. **Tạo PostgreSQL database** (nếu dùng internal DB)
3. Link DATABASE_URL vào service
4. Run migration: `pnpm prisma migrate deploy`
5. Start app

---

## Bước 6: Verify

1. **Check Logs** trên Render Dashboard:

   ```
   ====================================
   📦 Running Prisma Migrations...
   ====================================
   Applying migration `20260222_init_postgresql`
   ✅ Migrations completed successfully!
   ```

2. **Test API**:
   ```bash
   curl https://clique-pro.onrender.com/api/profiles
   ```

---

## So sánh: Tiger (VPS) vs Clique (Render)

| Feature     | Tiger (VPS)      | Clique (Render)            |
| ----------- | ---------------- | -------------------------- |
| Database    | PostgreSQL ✅    | SQLite → **PostgreSQL** ✅ |
| Persistence | Docker Volume ✅ | Managed DB ✅              |
| Migration   | Once ✅          | Every deploy ⚠️            |
| Data Loss   | Never ✅         | Never (with PG) ✅         |
| Setup       | Docker Compose   | render.yaml                |

---

## Troubleshooting

### Lỗi: "Table does not exist"

→ Migration chưa chạy

```bash
# SSH vào Render (nếu có)
pnpm prisma migrate deploy
```

### Lỗi: "Connection refused"

→ DATABASE_URL sai

- Check Environment Variables trên Render Dashboard
- Đảm bảo có `?sslmode=require` cho external DB

### Migration conflict

→ Reset database (⚠️ XÓA DATA)

```bash
pnpm prisma migrate reset
```

---

## Development vs Production

### Development (Local):

- SQLite: `file:./dev.db` ✅ Đơn giản
- Hoặc PostgreSQL local với Docker

### Production (Render):

- **PostgreSQL** only ✅ Persistent

---

## Next Steps

- [ ] Setup PostgreSQL database
- [ ] Update DATABASE_URL environment variable
- [ ] Deploy và verify migration chạy thành công
- [ ] Test tất cả API endpoints
- [ ] Setup backup strategy (Render auto-backup for paid plans)
