# 📊 Module Architecture Analysis & Design

## 🏗️ TIGER Backend Structure (Reference)

### Module Organization Pattern

```
src/
  routes/
    admin/           # Admin-only features
    customer/        # Customer-facing features
    therapist/       # Therapist role features
    coach/           # Coach role features
    pt/              # Personal Trainer features
    receptionist/    # Receptionist features
    auth/            # Authentication
    profile/         # User profile management
    payment/         # Payment processing
  shared/            # Shared services, guards, pipes
  workers/           # Background jobs
```

### Module Components Pattern (TIGER)

Each module typically contains:

- `*.module.ts` - Module definition
- `*.controller.ts` - HTTP endpoints
- `*.service.ts` - Business logic
- `*.repo.ts` - Database operations
- `dto/` - Data Transfer Objects with Zod validation

---

## 🎯 CLIQUE DATING APP - Module Design

### Core Requirements

1. **Profile Management** - Create & view user profiles
2. **Matching System** - Like & match logic
3. **Scheduling** - Availability & date proposals

### Proposed Module Structure

```
src/
  routes/
    profiles/              # Profile CRUD
      - profiles.controller.ts
      - profiles.service.ts
      - profiles.repo.ts
      - dto/
        - create-profile.dto.ts
        - update-profile.dto.ts

    likes/                 # Like & Match logic
      - likes.controller.ts
      - likes.service.ts
      - likes.repo.ts
      - dto/
        - create-like.dto.ts

    matches/               # Match management
      - matches.controller.ts
      - matches.service.ts
      - matches.repo.ts

    availability/          # User availability slots
      - availability.controller.ts
      - availability.service.ts
      - availability.repo.ts
      - dto/
        - create-availability.dto.ts

    scheduling/            # Date scheduling logic
      - scheduling.controller.ts
      - scheduling.service.ts
      - scheduling.repo.ts

  shared/
    - config.ts
    - shared.module.ts
    - pipes/
      - zod-validation.pipe.ts
    - filters/
      - http-exception.filter.ts
    - interceptors/
      - transform.interceptor.ts

  prisma/
    - prisma.module.ts
    - prisma.service.ts
```

---

## 📋 Module Implementation Plan

### Phase 1: Core Setup ✅

- [x] Prisma setup with schema
- [x] SharedModule with PrismaService
- [x] Config service
- [x] ESLint + Prettier
- [x] Zod installation

### Phase 2: Profiles Module

- [ ] Create ProfilesModule
- [ ] Zod DTOs for create/update profile
- [ ] CRUD endpoints
- [ ] Repository pattern

### Phase 3: Likes & Matches Module

- [ ] Create LikesModule
- [ ] Like creation endpoint
- [ ] Match detection logic
- [ ] Bidirectional matching algorithm

### Phase 4: Availability & Scheduling

- [ ] Create AvailabilityModule
- [ ] Time slot selection
- [ ] Create SchedulingModule
- [ ] Slot intersection algorithm
- [ ] Date proposal logic

### Phase 5: Polish

- [ ] Error handling
- [ ] Validation messages
- [ ] Edge cases
- [ ] Testing

---

## 🔍 Key Differences from TIGER

| Aspect         | TIGER Backend                   | Clique Dating App                    |
| -------------- | ------------------------------- | ------------------------------------ |
| **Complexity** | Multi-role, multi-tenant        | Single-tenant, simple users          |
| **Auth**       | JWT, 2FA, roles, permissions    | No auth (email-based identification) |
| **Scale**      | Production-ready, optimized     | MVP prototype                        |
| **Features**   | 15+ modules, bookings, payments | 3 core modules                       |
| **Database**   | PostgreSQL with indexes         | SQLite (simple)                      |

---

## 💡 Architecture Decisions

### 1. **Repository Pattern**

- Separate database logic from business logic
- Easier testing and maintenance
- Follow TIGER's proven pattern

### 2. **Zod Validation**

- Type-safe DTOs
- Automatic validation
- Better error messages

### 3. **Module Separation**

- Each feature = separate module
- Clear boundaries
- Easier to test and extend

### 4. **Shared Module**

- Global services (Prisma, Config)
- Reusable pipes/filters
- Don't Repeat Yourself (DRY)

---

## 🚀 Next Steps

1. ✅ Setup Zod validation pipe
2. ✅ Create Profiles module with DTOs
3. ⏳ Create Likes module
4. ⏳ Create Matches module with detection logic
5. ⏳ Create Availability module
6. ⏳ Create Scheduling module with algorithm
7. ⏳ Integration testing
8. ⏳ README documentation

---

## 📝 Notes

- Keep it simple - this is an MVP for junior dev test
- Focus on working logic over perfect architecture
- Document key decisions in README
- Use TIGER patterns but don't over-engineer
