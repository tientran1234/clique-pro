# Clique Dating App - Backend API 🚀

> A robust dating application API built with NestJS, Prisma, and PostgreSQL for Clique83.com technical assessment.

[![API Status](https://img.shields.io/badge/API-active-success)](https://clique-pro.onrender.com/api)
[![Database](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)
[![Framework](https://img.shields.io/badge/framework-NestJS-red)](https://nestjs.com/)

## 📡 API Endpoints

- **Base URL (Local)**: `http://localhost:3000/api`
- **Base URL (Production)**: `https://clique-pro.onrender.com/api`
- **API Documentation**: `https://clique-pro.onrender.com/api` (Swagger)

## ✨ Features

### 🔒 Core Architecture
- ✅ RESTful API design
- ✅ TypeScript for type safety
- ✅ Zod validation with nestjs-zod
- ✅ Prisma ORM for database management
- ✅ Repository pattern for data access
- ✅ Global exception handling
- ✅ CORS configuration
- ✅ Swagger API documentation

### 📚 Modules

#### 👤 Profiles Module
- Create, read, update, delete user profiles
- Search by email
- Pagination support

#### 💙 Likes Module  
- Send likes to other users
- Get all likes (sent/received)
- Automatic duplicate prevention

#### 💑 Matches Module
- Automatic match creation on mutual likes
- Get user's matches
- Get match details

#### 📅 Availability Module
- Set availability for meetings
- Day of week and time slot selection
- Find mutual availability
- Delete availability

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Validation**: Zod + nestjs-zod
- **API Docs**: Swagger/OpenAPI
- **Deployment**: Render

## 🏗️ Architecture

```
clique-pro/
├── src/
│   ├── routes/
│   │   ├── profiles/       # Profile management
│   │   │   ├── profiles.controller.ts
│   │   │   ├── profiles.service.ts
│   │   │   ├── profiles.repository.ts
│   │   │   ├── profiles.dto.ts
│   │   │   └── profiles.model.ts
│   │   ├── likes/         # Like system
│   │   ├── matches/       # Match logic
│   │   └── availability/  # Scheduling
│   ├── prisma/            # Prisma service
│   ├── shared/            # Shared utilities
│   │   ├── config.ts
│   │   ├── filters/       # Exception filters
│   │   ├── pipes/         # Validation pipes
│   │   └── decorator/     # Custom decorators
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration history
└── test/                  # E2E tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

```bash
# Clone repository
git clone <repository-url>
cd clique-pro

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables

Create `.env` file:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database_name"

# Application
PORT=3000
NODE_ENV=development

# CORS - Allowed origins (comma separated)
ALLOWED_ORIGINS="http://localhost:5173,https://clique-fe.vercel.app"

# JWT (for future auth implementation)
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

### Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# (Optional) Seed database
pnpm prisma db seed

# (Optional) Open Prisma Studio
pnpm prisma studio
```

### Running the Application

```bash
# Development mode (watch mode)
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

API will be available at: `http://localhost:3000/api`

## 📋 API Endpoints

### Profiles

```http
GET    /api/profiles           # Get all profiles (paginated)
GET    /api/profiles/:id       # Get profile by ID
GET    /api/profiles/by-email/:email  # Get profile by email
POST   /api/profiles           # Create new profile
PUT    /api/profiles/:id       # Update profile
DELETE /api/profiles/:id       # Delete profile
```

### Likes

```http
POST   /api/likes              # Send like
GET    /api/likes?userId=:id   # Get user's likes
```

### Matches

```http
GET    /api/matches?userId=:id  # Get user's matches
GET    /api/matches/:id         # Get match details
```

### Availability

```http
POST   /api/availability       # Set availability
GET    /api/availability?matchId=:id&userId=:id  # Get availability
DELETE /api/availability/:id   # Delete availability
```

### Example Requests

**Create Profile:**
```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "gender": "MALE",
    "bio": "Software engineer who loves hiking"
  }'
```

**Send Like:**
```bash
curl -X POST http://localhost:3000/api/likes \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "uuid-sender",
    "receiverId": "uuid-receiver"
  }'
```

## 📊 Database Schema

### Models

- **User**: User profiles (id, email, name, age, gender, bio)
- **Like**: Like relationships (id, senderId, receiverId)
- **Match**: Matched pairs (id, userAId, userBId)
- **Availability**: Meeting schedules (id, matchId, userId, dayOfWeek, timeSlot)

### Relationships

```
User ----< Like (sender)
User ----< Like (receiver)
User ----< Match (userA)
User ----< Match (userB)
Match ---< Availability
User ----< Availability
```

## 🔧 Development

### Available Scripts

```bash
pnpm start:dev       # Start dev server with watch mode
pnpm build           # Build for production
pnpm start:prod      # Start production server
pnpm test            # Run unit tests
pnpm test:e2e        # Run E2E tests
pnpm test:cov        # Test coverage
pnpm lint            # Run ESLint
pnpm format          # Format code with Prettier
pnpm prisma studio   # Open Prisma Studio GUI
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 🚢 Deployment

### Deploy to Render

The project includes `render.yaml` for easy deployment:

```yaml
services:
  - type: web
    name: clique-backend
    runtime: node
    buildCommand: pnpm install && pnpm prisma generate && pnpm build
    startCommand: sh start.sh
```

**Setup Steps:**

1. **Create PostgreSQL Database on Render**
   - Dashboard → New → PostgreSQL
   - Copy connection string

2. **Set Environment Variables**
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: Frontend URL

3. **Deploy**
   ```bash
   git push origin main
   ```
   Render will auto-deploy from GitHub.

4. **Verify**
   - Check logs for migration success
   - Test API endpoints

### Important Notes

⚠️ **Database**: Use PostgreSQL for production (not SQLite). SQLite is ephemeral on Render.

✅ **Migration**: Runs automatically via `start.sh` before app starts.

🔒 **Security**: Never commit `.env` file. Use environment variables on hosting platform.

## 📚 Documentation

- **API Docs**: Available at `/api` endpoint (Swagger UI)
- **Deployment Guide**: See [RENDER_SETUP.md](./RENDER_SETUP.md)
- **Architecture**: See [MODULE_ARCHITECTURE.md](./MODULE_ARCHITECTURE.md)

## 🐛 Troubleshooting

### Issue: "Table does not exist"
**Solution**: Run migrations:
```bash
pnpm prisma migrate deploy
```

### Issue: "Connection refused"
**Solution**: Check DATABASE_URL and ensure PostgreSQL is running.

### Issue: CORS errors
**Solution**: Add frontend URL to ALLOWED_ORIGINS environment variable.

### Issue: Port already in use
**Solution**: 
```bash
lsof -ti:3000 | xargs kill -9
```

## 📈 Future Enhancements

- [ ] JWT Authentication
- [ ] Real-time notifications (WebSocket)
- [ ] Image upload for profiles
- [ ] Advanced matching algorithm
- [ ] Message system
- [ ] Video call integration

## 🤝 Contributing

This is a technical assessment project for Clique83.com.

## 📄 License

MIT

## 👨‍💻 Author

Built for Clique83.com Web Developer Intern position.
