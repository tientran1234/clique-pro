# Clique Mini Dating App - Backend API 🚀

> REST API được xây dựng với NestJS cho bài test kỹ thuật vị trí Web Developer Intern tại Clique83.com

## 🔗 Live API

- **Base URL**: https://clique-pro.onrender.com/api
- **API Docs**: https://clique-pro.onrender.com/api (Swagger)

## 🛠️ Công nghệ sử dụng

- **NestJS 11** + TypeScript
- **Prisma ORM** - Truy cập database
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **Swagger** - API documentation

## 🚀 Cài đặt nhanh

```bash
# Cài đặt dependencies
pnpm install

# Setup môi trường
cp .env.example .env
# Cấu hình DATABASE_URL

# Setup database
pnpm prisma migrate deploy
pnpm prisma generate

# Chạy development
pnpm start:dev
```

API chạy tại: http://localhost:3000/api

## ✅ Tính năng đã hoàn thành

### Phần A - CRUD Profile ✅

- Tạo, đọc, cập nhật, xóa profiles
- Validation với Zod schemas
- Kiểm tra email unique
- Validation độ tuổi (18-100)

### Phần B - Hệ thống Like & Match ✅

- Gửi like với phòng chống duplicate
- Lấy danh sách likes đã gửi/nhận
- **Logic auto-match**: Tạo match khi phát hiện mutual like
- Lưu trữ match trong database

### Phần C - Đặt lịch hẹn ✅

- Đặt availability (ngày + khung giờ)
- Validate availability trong vòng 3 tuần
- **Tự động tìm slot trùng đầu tiên** giữa 2 users
- Trả về ngày hẹn hoặc thông báo "không trùng"

## 📁 Cấu trúc dự án

```
clique-pro/
├── prisma/
│   ├── schema.prisma      # Database schema (4 models)
│   └── migrations/        # Lịch sử migration
├── src/
│   ├── routes/
│   │   ├── profiles/      # Profile CRUD
│   │   ├── likes/         # Hệ thống like
│   │   ├── matches/       # Logic match
│   │   └── availability/  # Logic scheduling
│   ├── prisma/            # Prisma service
│   └── main.ts
└── package.json
```

## 🗄️ Database Schema

```prisma
model Profile {
  id      String   @id @default(uuid())
  email   String   @unique
  name    String
  age     Int
  gender  Gender   @default(OTHER)
  bio     String
  createdAt DateTime @default(now())
}

model Like {
  id         String   @id @default(uuid())
  senderId   String
  receiverId String
  createdAt  DateTime @default(now())
  @@unique([senderId, receiverId])
}

model Match {
  id        String   @id @default(uuid())
  userAId   String
  userBId   String
  matchedAt DateTime @default(now())
  hasScheduledDate Boolean @default(false)
  proposedDate     DateTime?
  proposedTime     String?
}

model Availability {
  id        String   @id @default(uuid())
  userId    String
  matchId   String
  date      DateTime
  startTime String   # Định dạng HH:mm
  endTime   String   # Định dạng HH:mm
}
```

## 🎯 Triển khai Logic cốt lõi

### 1. Logic Match (Backend)

**File**: `src/routes/likes/likes.service.ts`

```typescript
async create(dto: CreateLikeDto) {
  // 1. Tạo Like record
  const like = await this.likesRepo.create(dto);

  // 2. Kiểm tra nếu receiver đã like sender (reverse like)
  const reverseLike = await this.likesRepo.findOne({
    senderId: dto.receiverId,
    receiverId: dto.senderId,
  });

  // 3. Nếu có mutual like → Tạo Match
  if (reverseLike) {
    const match = await this.matchesRepo.create({
      userAId: dto.senderId,
      userBId: dto.receiverId,
    });

    return {
      like,
      isMatch: true,
      matchId: match.id,
    };
  }

  return { like, isMatch: false };
}
```

**Điểm quan trọng**:

- ✅ Phòng chống duplicate với unique constraint `[senderId, receiverId]`
- ✅ Tạo match ngay lập tức khi có mutual like
- ✅ Match là hai chiều (không quan trọng ai like trước)

### 2. Logic tìm slot trùng (Backend)

**File**: `src/routes/availability/availability.service.ts`

```typescript
async create(dto: CreateAvailabilityDto) {
  // 1. Tạo availability slots cho user hiện tại
  const slots = await Promise.all(
    dto.slots.map(slot => this.availabilityRepo.create({
      userId: dto.userId,
      matchId: dto.matchId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }))
  );

  // 2. Lấy match và ID của user kia
  const match = await this.matchesRepo.findById(dto.matchId);
  const otherUserId = match.userAId === dto.userId
    ? match.userBId
    : match.userAId;

  // 3. Lấy tất cả availabilities của cả 2 users
  const myAvails = await this.availabilityRepo.findByMatchAndUser(
    dto.matchId,
    dto.userId
  );
  const theirAvails = await this.availabilityRepo.findByMatchAndUser(
    dto.matchId,
    otherUserId
  );

  // 4. Tìm slot trùng đầu tiên
  const commonSlot = this.findFirstCommonSlot(myAvails, theirAvails);

  // 5. Nếu tìm thấy, cập nhật match với proposed date/time
  if (commonSlot) {
    await this.matchesRepo.update(dto.matchId, {
      hasScheduledDate: true,
      proposedDate: commonSlot.date,
      proposedTime: commonSlot.time,
    });
  }

  return {
    slots,
    commonSlot,
    message: commonSlot
      ? `Lịch hẹn: ${commonSlot.date} lúc ${commonSlot.time}`
      : 'Đang chờ người kia set availability',
  };
}

private findFirstCommonSlot(myAvails, theirAvails) {
  for (const mine of myAvails) {
    for (const theirs of theirAvails) {
      // Cùng ngày?
      if (!isSameDay(mine.date, theirs.date)) continue;

      // Giờ có trùng?
      const myStart = parseTime(mine.startTime);
      const myEnd = parseTime(mine.endTime);
      const theirStart = parseTime(theirs.startTime);
      const theirEnd = parseTime(theirs.endTime);

      // Kiểm tra nếu ranges trùng: (StartA < EndB) AND (StartB < EndA)
      if (myStart < theirEnd && theirStart < myEnd) {
        // Tìm thấy overlap! Trả về cái đầu tiên
        const overlapStart = Math.max(myStart, theirStart);
        const overlapEnd = Math.min(myEnd, theirEnd);

        return {
          date: mine.date,
          time: `${formatTime(overlapStart)}-${formatTime(overlapEnd)}`,
        };
      }
    }
  }
  return null; // Không tìm thấy overlap
}
```

**Giải thích thuật toán**:

1. Lưu các availability slots của user vào database
2. Lấy availabilities của cả 2 users cho match này
3. So sánh từng slot: cùng ngày + giờ có trùng không?
4. Trả về slot trùng **đầu tiên** (ngày sớm nhất trước)
5. Cập nhật match với `hasScheduledDate = true`

**Edge Cases được xử lý**:

- ✅ Ngày quá khứ bị reject (validation trong DTO)
- ✅ Ngày sau 3 tuần bị reject
- ✅ Giờ kết thúc phải sau giờ bắt đầu
- ✅ Độ dài slot tối thiểu: 1 giờ
- ✅ User có thể set nhiều slots
- ✅ Phòng chống slots trùng nhau của cùng user

### 3. Lưu trữ dữ liệu

**Database**: PostgreSQL (host trên Render/Neon)

- Profiles: ~50 bytes mỗi record
- Likes: ~32 bytes mỗi record (sender + receiver IDs)
- Matches: ~64 bytes mỗi record
- Availability: ~80 bytes mỗi slot

**Tại sao PostgreSQL?**

- ✅ ACID transactions (tạo match là atomic)
- ✅ Foreign key constraints đảm bảo data integrity
- ✅ Indexing hiệu quả cho queries (userId, matchId)
- ✅ Hỗ trợ date/time native
- ✅ Dễ scale cho production

**Không dùng local storage** - Tất cả dữ liệu lưu trong database qua Prisma ORM.

## 📋 API Endpoints

### Profiles

```
POST   /api/profiles           # Tạo profile
GET    /api/profiles           # List tất cả (pagination)
GET    /api/profiles/:id       # Lấy theo ID
PUT    /api/profiles/:id       # Cập nhật
DELETE /api/profiles/:id       # Xóa
```

### Likes

```
POST   /api/likes              # Gửi like (trả về isMatch)
GET    /api/likes/sent/:userId        # Lấy likes đã gửi
GET    /api/likes/received/:userId    # Lấy likes đã nhận
```

### Matches

```
GET    /api/matches?userId=:id  # Lấy matches của user
GET    /api/matches/:id         # Lấy chi tiết match
```

### Availability

```
POST   /api/availability       # Đặt availability
GET    /api/availability?matchId=:id  # Lấy tất cả slots cho match
DELETE /api/availability/:id   # Xóa slot
```

## 🎯 Tính năng bổ sung

- ✅ **Swagger Documentation**: API docs tự động
- ✅ **Validation**: Zod schemas với error messages chi tiết
- ✅ **Error Handling**: Global exception filter
- ✅ **CORS**: Cấu hình cho frontend domains
- ✅ **Pagination**: Profile listing với page/limit
- ✅ **Search**: Filter profiles theo giới tính, độ tuổi
- ✅ **Repository Pattern**: Tách biệt concerns rõ ràng

## 🚀 Cải thiện trong tương lai

Nếu có thêm thời gian, em sẽ thêm:

- **Authentication**: JWT-based auth với bcrypt password hashing
- **WebSocket**: Thông báo real-time cho likes/matches
- **Redis Cache**: Cache profile lists và match results
- **Rate Limiting**: Ngăn spam likes
- **File Upload**: Ảnh profile với S3/Cloudinary
- **Email Service**: Gửi thông báo match qua SendGrid
- **Unit Tests**: Jest tests cho services và repositories
- **E2E Tests**: Integration tests cho critical flows
- **Database Optimization**: Thêm indexes, sử dụng database views
- **Monitoring**: Thêm logging với Winston, metrics với Prometheus

## 🛡️ Đề xuất tính năng cho sản phẩm

### 1. **Video giới thiệu (30-60s)**

**Lý do**: Text và ảnh có thể lừa dối. Video thể hiện tính cách thật, giọng nói, body language và năng lượng. Tăng lòng tin và giảm đáng kể tình trạng giả mạo. Bumble đã chứng minh điều này hiệu quả - users có video nhận được gấp 2 lần matches.

**Triển khai**: Dùng Cloudinary Video API hoặc AWS S3 + CloudFront. Tối đa 60s, chất lượng 720p, tự động nén xuống <10MB.

### 2. **Interest Tags & Thuật toán Matching thông minh**

**Lý do**: Hệ thống hiện tại chỉ match dựa trên mutual likes. Thêm interest tags (âm nhạc, thể thao, ăn uống, du lịch, sở thích) cho phép matching tốt hơn. Hiển thị điểm tương thích (vd: "85% match") giúp users quyết định ai nên like.

**Triển khai**: Thêm `interests: String[]` vào Profile model. Dùng cosine similarity hoặc Jaccard index để tính điểm match. Có thể thêm yếu tố tuổi ưa thích, vị trí, v.v.

### 3. **Tính năng An toàn & Tin cậy (Report, Block, Xác minh Video)**

**Lý do**: An toàn người dùng là tối quan trọng cho dating apps. Không có các tính năng này, nền tảng có nguy cơ quấy rối, fake profiles và vấn đề pháp lý. Đây là **bắt buộc** cho bất kỳ dating app production nào.

**Tính năng**:

- **Report User**: Báo cáo hành vi không phù hợp → Queue review cho Admin
- **Block User**: Ẩn user khỏi feed, ngăn contact
- **Xác minh Video Selfie**: Upload video đọc mã ngẫu nhiên → AI check với ảnh
- **Background Checks**: Tùy chọn (chỉ US) qua Checkr API

**Triển khai**: Thêm models `Report` và `Block`. Dùng AWS Rekognition hoặc Face++ cho xác minh video. Thêm badge `verified: boolean` vào profiles.

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 📝 Ghi chú

- Render free tier: API có thể sleep sau 15 phút không hoạt động (cold start ~30s)
- Database migrations tự động khi deploy
- CORS được cấu hình cho Vercel frontend domain
- Không yêu cầu authentication (đơn giản hóa cho assessment)

## 🤝 Liên hệ

Nếu có câu hỏi về implementation details, vui lòng xem code comments hoặc liên hệ.

---

Built with ⚡ cho Clique83.com Technical Assessment
