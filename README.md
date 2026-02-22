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

---

## 📚 Technical Implementation Details

### 🏗️ Architecture Overview

**Pattern**: Repository Pattern with Service Layer

```
Controller → Service → Repository → Prisma → PostgreSQL
     ↓          ↓          ↓
   HTTP      Business    Data
  Layer      Logic      Access
```

**Benefits:**
- Clear separation of concerns
- Easy to test (mock repositories)
- Maintainable and scalable
- Follows NestJS best practices

### 🔄 Match Logic Implementation

**Algorithm:**

```typescript
// When User A likes User B
async createLike(senderId: A, receiverId: B) {
  // 1. Create like record
  await db.like.create({ senderId: A, receiverId: B })
  
  // 2. Check for mutual like
  const reverseLike = await db.like.findFirst({
    where: { 
      senderId: B, 
      receiverId: A 
    }
  })
  
  // 3. If mutual like exists → Create match
  if (reverseLike) {
    await db.match.create({
      userAId: min(A, B),  // Always smaller ID first
      userBId: max(A, B)   // For unique constraint
    })
  }
}
```

**Key Features:**
- Atomic transaction (all or nothing)
- Duplicate prevention via unique constraints
- Bidirectional check for mutual likes
- Match created automatically, no polling needed

### 📅 Availability Matching Logic

**Finding Common Slots:**

```typescript
async findCommonSlots(matchId: string) {
  // 1. Get User A's availability
  const userASlots = await db.availability.findMany({
    where: { matchId, userId: userA }
  })
  
  // 2. Get User B's availability  
  const userBSlots = await db.availability.findMany({
    where: { matchId, userId: userB }
  })
  
  // 3. Find overlapping slots
  const common = userASlots.filter(slotA => 
    userBSlots.some(slotB => 
      slotA.dayOfWeek === slotB.dayOfWeek &&
      slotA.timeSlot === slotB.timeSlot
    )
  )
  
  // 4. Return first match or null
  return common[0] || null
}
```

**Database Schema for Availability:**
```prisma
model Availability {
  id         String @id @default(uuid())
  matchId    String
  userId     String
  dayOfWeek  String  // "MONDAY", "TUESDAY", etc.
  timeSlot   String  // "MORNING", "AFTERNOON", "EVENING", "NIGHT"
  
  // Unique: One slot per match per user per time
  @@unique([matchId, userId, dayOfWeek, timeSlot])
}
```

**Time Slot Definitions:**
- **MORNING**: 06:00 - 12:00
- **AFTERNOON**: 12:00 - 18:00  
- **EVENING**: 18:00 - 22:00
- **NIGHT**: 22:00 - 02:00

### 🗄️ Data Persistence Strategy

**Why PostgreSQL?**

1. **Relational Data**
   - Users have many Likes
   - Matches reference two Users
   - Foreign keys ensure data integrity

2. **Production Ready**
   - ACID transactions
   - Data survives restarts
   - Backup and recovery
   - Concurrent access

3. **Scalability**
   - Indexed queries
   - Connection pooling
   - Horizontal scaling possible

**vs Local Storage:**
- ❌ Limited to single browser
- ❌ Lost when cache cleared
- ❌ No multi-user support
- ❌ No data validation

## 📈 Future Enhancements

### If Given More Time

**1. Specific Date Selection**
- Current: Select "Monday" (any Monday)
- Improved: Select "Feb 24, 2026" (specific date in next 3 weeks)
- Implementation: Add `date` field (Date type) to Availability model
- Benefit: More precise scheduling

**2. JWT Authentication**
- Secure login/logout
- Protected routes
- Role-based access
- Session management

**3. Real-time Notifications (WebSocket)**
- Instant "You got a like!" notification
- "It's a Match!" popup in real-time
- Online/offline status
- Typing indicators in chat

**4. Image Upload**
- Profile pictures (Cloudinary/S3)
- Multiple photos gallery
- Photo verification
- Face detection for safety

**5. Advanced Matching Algorithm**
- Interest-based scoring
- Geographic distance
- Age compatibility ranges
- Activity level matching
- Machine learning recommendations

**6. Chat System**
- Real-time messaging
- Read receipts
- Message history
- Block/report users

**7. Performance Optimizations**
- Redis caching for hot data
- Database query optimization
- CDN for static assets
- Lazy loading for images

---

## 💡 Suggested New Features (Product Ideas)

### 1️⃣ Smart Matching Score
**What**: AI-powered compatibility score (0-100%)
- Analyze bio keywords for common interests
- Age difference weighting
- Response time patterns
- Success rate of previous matches

**Why**:
- Higher quality matches = higher user satisfaction
- Reduces "swipe fatigue"
- Personalized experience
- Differentiates from competitors

**Technical**: 
- NLP for bio analysis (OpenAI API)
- Scoring algorithm in backend
- Cache scores for performance

### 2️⃣ Video Speed Dating
**What**: 3-minute video calls before deciding to match
- Browse profiles → Request video call
- If both accept → Auto-schedule 3-min call
- After call → Both decide to match or pass

**Why**:
- Reduces catfishing (verify identity)
- Saves time vs text chatting
- Modern Gen Z preference
- Increases commitment (face-to-face)

**Technical**:
- WebRTC integration (Twilio/Agora)
- Real-time signaling server
- Call scheduling queue
- Timer enforcement

### 3️⃣ Group Date Coordination
**What**: Match 4-6 people for group activities
- Users opt-in to "group date" mode
- System finds compatible group (interests, age, location)
- Suggests group activity (bowling, escape room, restaurant)
- Reduces first-date pressure

**Why**:
- Less intimidating for shy users
- Safer (public setting with friends)
- More fun/memorable
- Unique feature in market

**Technical**:
- Complex matching algorithm (3+ users)
- Activity suggestion API (Yelp/Google Places)
- Group chat functionality
- Consensus-based scheduling

---

## 🤝 Contributing

This is a technical assessment project for Clique83.com.

## 📄 License

MIT

## 👨‍💻 Author

Built for Clique83.com Web Developer Intern position.
