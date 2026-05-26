# 医院门诊挂号诊断系统 — 技术方案

> 对应需求规格：`spec.md`  
> 本文档可直接用于任务拆分、接口与页面设计、测试设计及代码实现。

---

## 1. 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript | 组件化开发，类型安全 |
| 构建工具 | Vite | 快速 HMR，生产构建 |
| UI 组件库 | Ant Design 5 | 丰富的中后台组件，开箱即用 |
| 状态管理 | Zustand | 轻量、简洁、无样板代码 |
| HTTP 客户端 | Axios | 请求/拦截器统一管理 |
| 路由 | React Router v6 | 声明式路由，支持嵌套布局 |
| 后端框架 | Node.js + Express + TypeScript | 轻量、灵活 |
| ORM | Prisma | 类型安全、自动迁移、查询构建器 |
| 数据库 | MySQL 8 | 关系型数据库，广泛使用 |
| 认证 | JWT (jsonwebtoken) | 无状态 token |
| API 文档 | Swagger / OpenAPI 3.0 | 接口可视化与协作 |

---

## 2. 项目目录结构

```
hospital/
├── specs/
│   ├── spec.md                  # 需求规格
│   └── plan.md                  # 本文件
├── server/                      # 后端
│   ├── prisma/
│   │   └── schema.prisma        # 数据库模型定义
│   ├── src/
│   │   ├── index.ts             # 入口：启动服务器
│   │   ├── app.ts               # Express 应用配置（中间件、路由挂载）
│   │   ├── config/
│   │   │   └── index.ts         # 环境变量与配置
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT 认证中间件
│   │   │   ├── roleGuard.ts     # 角色鉴权中间件
│   │   │   └── errorHandler.ts  # 全局错误处理
│   │   ├── routes/
│   │   │   ├── auth.ts          # 认证相关路由
│   │   │   ├── profile.ts       # 个人资料编辑（患者/医生通用）
│   │   │   ├── departments.ts   # 科室路由（患者端）
│   │   │   ├── doctors.ts       # 医生路由（患者端）
│   │   │   ├── schedules.ts     # 排班查询路由（患者端）
│   │   │   ├── appointments.ts  # 预约路由（患者端）
│   │   │   ├── doctor/
│   │   │   │   ├── appointments.ts  # 医生端预约管理
│   │   │   │   ├── profile.ts      # 医生个人资料编辑
│   │   │   │   └── patients.ts     # 医生端患者历史查询
│   │   │   └── admin/
│   │   │       ├── departments.ts   # 管理员：科室管理
│   │   │       ├── doctors.ts       # 管理员：医生管理
│   │   │       ├── schedules.ts     # 管理员：排班管理
│   │   │       └── statistics.ts    # 管理员：数据统计
│   │   ├── controllers/         # 各路由对应的控制器函数
│   │   ├── services/            # 业务逻辑层
│   │   ├── validators/          # 请求参数校验（zod 或 express-validator）
│   │   ├── types/               # TypeScript 类型定义
│   │   └── utils/
│   │       └── jwt.ts           # JWT 工具函数
│   ├── package.json
│   └── tsconfig.json
├── client/                      # 前端
│   ├── src/
│   │   ├── main.tsx             # 入口
│   │   ├── App.tsx              # 根组件 + 路由定义
│   │   ├── api/
│   │   │   ├── client.ts        # Axios 实例（baseURL、拦截器）
│   │   │   ├── auth.ts          # 认证相关 API
│   │   │   ├── departments.ts   # 科室 API
│   │   │   ├── doctors.ts       # 医生 API
│   │   │   ├── schedules.ts     # 排班 API
│   │   │   ├── appointments.ts  # 预约 API
│   │   │   └── admin.ts         # 管理后台 API
│   │   ├── store/
│   │   │   └── authStore.ts     # 认证状态（Zustand）
│   │   ├── hooks/               # 自定义 hooks
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── patient/
│   │   │   │   ├── DepartmentListPage.tsx
│   │   │   │   ├── DoctorListPage.tsx
│   │   │   │   ├── BookingPage.tsx          # 含出诊日历视图 + 时段选择
│   │   │   │   ├── BookingConfirmPage.tsx
│   │   │   │   ├── MyAppointmentsPage.tsx
│   │   │   │   ├── ExaminationPage.tsx      # 检查报告查看
│   │   │   │   └── ProfilePage.tsx          # 患者编辑个人信息
│   │   │   ├── doctor/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── AppointmentListPage.tsx
│   │   │   │   ├── ProfilePage.tsx          # 医生编辑个人资料
│   │   │   │   ├── PatientHistoryPage.tsx   # 查看患者就诊历史
│   │   │   │   ├── ExaminationPage.tsx      # 开检查单
│   │   │   │   ├── WardManagePage.tsx       # 住院管理
│   │   │   │   └── AdmissionDetailPage.tsx  # 住院患者详情
│   │   │   └── admin/
│   │   │       ├── DepartmentManagePage.tsx
│   │   │       ├── DoctorManagePage.tsx
│   │   │       ├── ScheduleManagePage.tsx
│   │   │       ├── ExaminationItemManagePage.tsx  # 检查项目管理
│   │   │       ├── WardManagePage.tsx             # 病房床位管理
│   │   │       ├── AdmissionManagePage.tsx        # 入院审批出院结算
│   │   │       └── StatisticsPage.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── PatientLayout.tsx
│   │   │   │   ├── DoctorLayout.tsx
│   │   │   │   └── AdminLayout.tsx
│   │   │   ├── notification/
│   │   │   │   ├── NotificationBell.tsx    # 通知铃铛图标 + 未读小红点
│   │   │   │   └── NotificationList.tsx    # 通知列表弹窗
│   │   │   ├── common/
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── RoleGuard.tsx
│   │   │   └── appointment/
│   │   │       ├── AppointmentCard.tsx
│   │   │       └── AppointmentStatusTag.tsx
│   │   ├── router/
│   │   │   └── index.tsx        # 路由表配置
│   │   ├── types/               # TypeScript 类型定义
│   │   └── utils/
│   │       ├── constants.ts
│   │       └── format.ts        # 日期/状态格式化工具
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .env.example
└── README.md
```

---

## 3. 数据库设计

### 3.1 ER 图（文本描述）

```
User 1──N Appointment N──1 Doctor N──1 Department
User 1──N ExaminationOrder
User 1──N Admission

Schedule 1──N Appointment

ExaminationItem N──1 Department
ExaminationOrder 1──N ExaminationOrderItem N──1 ExaminationItem
ExaminationOrder 1──N ExaminationReport

Ward N──1 Department
Ward 1──N Bed 1──1 Admission
Admission 1──N MedicalOrder
Admission 1──N MedicalRecord
Admission 1──N DailyChart
```

### 3.2 数据表定义（Prisma Schema）

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  PATIENT
  DOCTOR
  ADMIN
}

enum UserStatus {
  ACTIVE
  DISABLED
}

enum DeptStatus {
  ACTIVE
  INACTIVE
}

enum AppointmentStatus {
  PENDING     // 待就诊
  VISITED     // 已就诊
  NO_SHOW     // 未到
  CANCELLED   // 已取消
}

model User {
  id        Int       @id @default(autoincrement())
  phone     String    @unique
  password  String
  name      String
  role      Role      @default(PATIENT)
  status    UserStatus @default(ACTIVE)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  doctor    Doctor?
  appointments Appointment[] @relation("PatientAppointments")
}

model Doctor {
  id           Int        @id                              // 与 User.id 1:1
  userId       Int        @unique
  departmentId Int
  title        String     // 职称，如"主任医师"
  description  String?    @default("")
  photo        String?    // 头像照片 URL
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  user         User        @relation(fields: [userId], references: [id])
  department   Department  @relation(fields: [departmentId], references: [id])
  schedules    Schedule[]
  appointments Appointment[]
}

model Department {
  id          Int        @id @default(autoincrement())
  name        String
  description String?    @default("")
  status      DeptStatus @default(ACTIVE)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  doctors   Doctor[]
  appointments Appointment[]
}

model Schedule {
  id        Int      @id @default(autoincrement())
  doctorId  Int
  date      DateTime @db.Date     // 仅日期部分（如 2026-05-25）
  hour      Int                   // 0-23，表示时段的起始小时
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  doctor Doctor @relation(fields: [doctorId], references: [id])

  @@unique([doctorId, date, hour])  // 同一医生同一日同一时段不重复
  @@index([doctorId, date])
}

model Appointment {
  id           Int               @id @default(autoincrement())
  patientId    Int
  doctorId     Int
  departmentId Int
  scheduleId   Int
  date         DateTime          @db.Date
  hour         Int               // 0-23
  status       AppointmentStatus @default(PENDING)
  symptom      String?           // 病情描述（患者选填）
  diagnosis    String?           // 诊断结果（医生填写）
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  patient      User          @relation("PatientAppointments", fields: [patientId], references: [id])
  doctor       Doctor        @relation(fields: [doctorId], references: [id])
  department   Department    @relation(fields: [departmentId], references: [id])
  schedule     Schedule      @relation(fields: [scheduleId], references: [id])
  prescriptions Prescription[]

  @@index([patientId, status])
  @@index([doctorId, date])
  @@index([doctorId, status])
}

model Prescription {
  id            Int      @id @default(autoincrement())
  appointmentId Int
  medicineName  String   // 药品名称
  dosage        String   // 用量，如"每次1片"
  method        String   // 用法，如"每日3次"
  days          Int      // 天数
  createdAt     DateTime @default(now())

  appointment Appointment @relation(fields: [appointmentId], references: [id])

  @@index([appointmentId])
}

model ExaminationItem {
  id          Int      @id @default(autoincrement())
  name        String                    // 项目名称，如"血常规"
  category    String                    // 分类：检验 / 影像
  departmentId Int                     // 所属科室
  price       Decimal  @db.Decimal(10,2) // 价格
  refRange    String?                   // 参考值范围
  unit        String?                   // 单位
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  department  Department @relation(fields: [departmentId], references: [id])
  items       ExaminationOrderItem[]

  @@index([departmentId])
}

model ExaminationOrder {
  id            Int      @id @default(autoincrement())
  appointmentId Int?
  patientId     Int
  doctorId      Int
  status        String   @default("PENDING") // PENDING / PAID / IN_PROGRESS / COMPLETED
  clinicalDiag  String?                     // 临床诊断
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  appointment Appointment? @relation(fields: [appointmentId], references: [id])
  patient     User         @relation(fields: [patientId], references: [id])
  doctor      Doctor       @relation(fields: [doctorId], references: [id])
  items       ExaminationOrderItem[]
  reports     ExaminationReport[]

  @@index([patientId])
  @@index([appointmentId])
}

model ExaminationOrderItem {
  id              Int      @id @default(autoincrement())
  orderId         Int
  examinationItemId Int
  result          String?  // 检验结果数值或文本
  refRange        String?  // 当前参考值
  unit            String?  // 单位
  createdAt       DateTime @default(now())

  order           ExaminationOrder   @relation(fields: [orderId], references: [id])
  examinationItem ExaminationItem    @relation(fields: [examinationItemId], references: [id])

  @@unique([orderId, examinationItemId])
}

model ExaminationReport {
  id        Int      @id @default(autoincrement())
  orderId   Int
  content   String?  // 报告文本
  images    String?  // 图片附件 JSON 数组
  createdAt DateTime @default(now())

  order     ExaminationOrder @relation(fields: [orderId], references: [id])
}

model Ward {
  id           Int      @id @default(autoincrement())
  name         String   // 病房名，如"内科一病区"
  departmentId Int
  description  String?
  createdAt    DateTime @default(now())

  department   Department @relation(fields: [departmentId], references: [id])
  beds         Bed[]

  @@index([departmentId])
}

model Bed {
  id       Int    @id @default(autoincrement())
  wardId   Int
  bedNumber String // 床位号，如"101-1"
  status   String @default("AVAILABLE") // AVAILABLE / OCCUPIED

  ward     Ward   @relation(fields: [wardId], references: [id])
  admission Admissions?

  @@unique([wardId, bedNumber])
}

model Admission {
  id            Int      @id @default(autoincrement())
  patientId     Int
  doctorId      Int
  bedId         Int      @unique
  diagnosis     String   // 入院诊断
  status        String   @default("ADMITTED") // ADMITTED / DISCHARGED
  admittedAt    DateTime @default(now())
  dischargedAt  DateTime?

  patient       User     @relation(fields: [patientId], references: [id])
  doctor        Doctor   @relation(fields: [doctorId], references: [id])
  bed           Bed      @relation(fields: [bedId], references: [id])
  orders        MedicalOrder[]
  records       MedicalRecord[]
  dailyCharts   DailyChart[]

  @@index([patientId])
  @@index([status])
}

model MedicalOrder {
  id          Int      @id @default(autoincrement())
  admissionId Int
  type        String   // LONG_TERM / TEMPORARY
  content     String   // 医嘱内容
  status      String   @default("ACTIVE") // ACTIVE / STOPPED
  createdAt   DateTime @default(now())
  stoppedAt   DateTime?

  admission   Admission @relation(fields: [admissionId], references: [id])

  @@index([admissionId])
}

model MedicalRecord {
  id          Int      @id @default(autoincrement())
  admissionId Int
  content     String   // 病程记录内容
  recordDate  DateTime @db.Date
  createdAt   DateTime @default(now())

  admission   Admission @relation(fields: [admissionId], references: [id])

  @@index([admissionId])
  @@index([recordDate])
}

model DailyChart {
  id          Int      @id @default(autoincrement())
  admissionId Int
  recordDate  DateTime @db.Date
  temperature Decimal? @db.Decimal(4,1) // 体温
  pulse       Int?     // 脉搏
  breath      Int?     // 呼吸
  bloodPressure String? // 血压，如"120/80"
  createdAt   DateTime @default(now())

  admission   Admission @relation(fields: [admissionId], references: [id])

  @@unique([admissionId, recordDate])
}

model MedicineCategory {
  id        Int      @id @default(autoincrement())
  name      String   @unique               // 分类名称，如"抗生素类"
  createdAt DateTime @default(now())

  medicines Medicine[]
}

model Medicine {
  id           Int      @id @default(autoincrement())
  categoryId   Int
  name         String                       // 药品名称
  commonDosage String                      // 常用用量，如"每次1粒"
  commonMethod String                      // 常用用法，如"每日3次"
  createdAt    DateTime @default(now())

  category MedicineCategory @relation(fields: [categoryId], references: [id])

  @@unique([categoryId, name])
  @@index([categoryId])
}

model Notification {
  id         Int      @id @default(autoincrement())
  userId     Int                              // 接收通知的用户
  title      String                           // 通知标题
  content    String                           // 通知内容
  relatedUrl String?                          // 相关链接（可选，点击跳转）
  isRead     Boolean  @default(false)         // 是否已读
  createdAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, isRead])
  @@index([userId, createdAt])
}
```

### 3.3 业务规则映射

| spec 规则 | 数据库层保障 |
|-----------|-------------|
| 不设号源上限 | Appointment 不做数量校验，Schedule 只定义可行时段 |
| 单个医生同一天同一时段不重复 | Schedule 的 `@@unique([doctorId, date, hour])` |
| 同一患者同一天可挂不同科室 | 业务层校验：查同一 patient_id 同一天是否存在同 department 的 PENDING 预约 |
| 不限号，无并发冲突 | Appointment 无限制插入，不涉及抢号 |

---

## 4. API 设计

### 4.1 通用约定

- 基础路径：`/api`
- 认证方式：`Authorization: Bearer <token>`
- 请求体/响应体：JSON
- 统一响应格式：

```typescript
// 成功
{ "code": 0, "data": T, "message": "ok" }

// 失败
{ "code": 40001, "data": null, "message": "参数错误" }
```

### 4.2 端点列表

#### Auth（无需认证）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| POST | `/api/auth/register` | 患者注册（phone + password + name） | 3.1 |
| POST | `/api/auth/login` | 登录（phone + password），返回 JWT | 3.1 |
| GET  | `/api/auth/me` | 获取当前用户信息（需认证） | — |

**POST /api/auth/register**
```json
// Request
{ "phone": "13800138000", "password": "abc123", "name": "张三" }
// Response
{ "code": 0, "data": { "id": 1, "phone": "13800138000", "name": "张三", "role": "PATIENT" }, "message": "ok" }
```

**POST /api/auth/login**
```json
// Request
{ "phone": "13800138000", "password": "abc123" }
// Response
{ "code": 0, "data": { "token": "eyJ...", "user": { "id": 1, "phone": "13800138000", "name": "张三", "role": "PATIENT" } }, "message": "ok" }
```

#### 个人资料（需认证，PATIENT 或 DOCTOR 角色）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/profile` | 获取当前用户完整个人信息 | 3.10 |
| PATCH| `/api/profile` | 修改姓名、密码（需验证原密码） | 3.10 |
| GET  | `/api/doctor/profile` | 获取医生个人资料（含职称、简介、照片） | 3.10 |
| PATCH| `/api/doctor/profile` | 编辑医生个人资料（职称、简介、照片 URL） | 3.10 |

**PATCH /api/profile**
```json
// Request
{ "name": "新名字", "oldPassword": "abc123", "newPassword": "new456" }
// Response
{ "code": 0, "data": { "id": 1, "name": "新名字", "phone": "13800138000" }, "message": "ok" }
```

#### 患者端（需 PATIENT 角色）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/departments` | 获取活跃科室列表 | 3.2-① |
| GET  | `/api/departments/:id/doctors` | 获取科室下活跃医生列表 | 3.2-②③ |
| GET  | `/api/doctors/:id/schedules?date=YYYY-MM-DD` | 获取医生某日可预约时段 | 3.2-④⑤ |
| POST | `/api/appointments` | 创建预约 | 3.2-⑥⑦ |
| GET  | `/api/appointments` | 查询本人的预约列表（支持 status 过滤） | 3.3 |
| GET  | `/api/appointments/:id` | 获取预约详情 | 3.3 |
| PATCH| `/api/appointments/:id/cancel` | 取消预约（患者操作） | 3.4 |

**POST /api/appointments**
```json
// Request
{ "doctorId": 1, "scheduleId": 5, "date": "2026-06-01", "hour": 9, "symptom": "头痛发热3天" }
// Response
{ "code": 0, "data": { "id": 10, "doctorName": "李医生", "departmentName": "内科", "date": "2026-06-01", "hour": 9, "status": "PENDING", "symptom": "头痛发热3天" }, "message": "ok" }
```

**预约创建校验（service 层）：**
1. Schedule 存在且属于该医生、该日期、该 hour
2. 该日期同科室无其他 PENDING 预约（同天同科室只允许一个）
3. 创建 Appointment，status = PENDING

#### 通知（需认证，通用）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/notifications` | 获取当前用户的通知列表（支持 isRead 过滤，分页） | 3.11 |
| PATCH| `/api/notifications/:id/read` | 标记单条通知为已读 | 3.11 |
| POST | `/api/notifications/read-all` | 一键全部已读 | 3.11 |
| GET  | `/api/notifications/unread-count` | 获取未读数（用于小红点） | 3.11 |

**GET /api/notifications**
```json
// Response
{ "code": 0, "data": { "list": [
  { "id": 1, "title": "新预约提醒", "content": "患者张三预约了您 2026-06-01 09:00 的号", "relatedUrl": "/doctor/dashboard", "isRead": false, "createdAt": "2026-05-24T10:00:00Z" }
], "total": 10, "unreadCount": 3 }, "message": "ok" }
```

**通知触发集成（在现有 Use Case 中注入 NotificationService）：**
- `CreateAppointmentUseCase` → 通知医生（新预约）
- `CancelAppointmentUseCase` → 通知医生（取消提醒）
- `UpdateAppointmentStatusUseCase` (VISITED) → 通知患者（就诊完成）
- `UpdateDiagnosisUseCase` → 通知患者（诊断已更新）
- `AddPrescriptionUseCase` → 通知患者（处方已开）

#### 医生端（需 DOCTOR 角色）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/doctor/appointments?date=YYYY-MM-DD` | 查看本人的预约列表 | 3.5 |
| PATCH| `/api/doctor/appointments/:id/status` | 标记预约状态（visited / noShow） | 3.5 |
| PATCH| `/api/doctor/appointments/:id/diagnosis` | 填写诊断结果 | 3.5 |
| GET  | `/api/doctor/appointments/:id/prescriptions` | 获取处方列表 | 3.5 |
| POST | `/api/doctor/appointments/:id/prescriptions` | 添加处方药品 | 3.5 |
| DELETE | `/api/doctor/appointments/:id/prescriptions/:prescriptionId` | 删除处方药品 | 3.5 |
| GET  | `/api/doctor/patients/:patientId/history` | 获取患者就诊历史（预约+诊断+处方） | 3.5 |

**PATCH /api/doctor/appointments/:id/status**
```json
// Request
{ "status": "VISITED" }
// Response
{ "code": 0, "data": { "id": 10, "status": "VISITED" }, "message": "ok" }
```

**PATCH /api/doctor/appointments/:id/diagnosis**
```json
// Request
{ "diagnosis": "上呼吸道感染" }
// Response
{ "code": 0, "data": { "id": 10, "diagnosis": "上呼吸道感染" }, "message": "ok" }
```

**POST /api/doctor/appointments/:id/prescriptions**
```json
// Request
{ "medicineName": "阿莫西林", "dosage": "每次1粒", "method": "每日3次", "days": 5 }
// Response
{ "code": 0, "data": { "id": 1, "medicineName": "阿莫西林", "dosage": "每次1粒", "method": "每日3次", "days": 5 }, "message": "ok" }
```

**GET /api/doctor/patients/:patientId/history**
```json
// Response
{ "code": 0, "data": {
  "patient": { "id": 1, "name": "张三", "phone": "13800138000" },
  "appointments": [
    { "id": 10, "date": "2026-06-01", "departmentName": "内科", "doctorName": "李医生",
      "status": "VISITED", "diagnosis": "上呼吸道感染",
      "prescriptions": [
        { "medicineName": "阿莫西林", "dosage": "每次1粒", "method": "每日3次", "days": 5 }
      ]
    }
  ]
}, "message": "ok" }
```

**权限校验：** 医生端操作中，该预约的 doctorId 必须等于当前登录医生的 id。

#### 药品数据（无需认证）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/medicine-categories` | 获取所有药品分类 | 3.12 |
| GET  | `/api/medicines?categoryId=` | 获取药品列表，可按分类筛选 | 3.12 |

**GET /api/medicine-categories**
```json
// Response
{ "code": 0, "data": [
  { "id": 1, "name": "抗生素类" },
  { "id": 2, "name": "感冒用药类" }
], "message": "ok" }
```

**GET /api/medicines?categoryId=1**
```json
// Response
{ "code": 0, "data": [
  { "id": 1, "categoryId": 1, "name": "阿莫西林胶囊", "commonDosage": "每次1粒", "commonMethod": "每日3次" }
], "message": "ok" }
```

#### 检查检验（需认证）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/examination-items?departmentId=` | 获取检查项目列表 | 3.13 |
| POST | `/api/examination-orders` | 创建检查单（医生开单） | 3.13 |
| GET  | `/api/examination-orders?patientId=` | 查询患者的检查单列表 | 3.13 |
| GET  | `/api/examination-orders/:id` | 获取检查单详情（含项目结果） | 3.13 |
| PATCH| `/api/examination-orders/:id/status` | 更新检查单状态 | 3.13 |
| POST | `/api/examination-orders/:id/report` | 录入检查报告（含图片） | 3.13 |

#### 住院管理（需认证）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/wards?departmentId=` | 获取病房列表 | 3.14 |
| POST | `/api/wards` | 新增病房（管理员） | 3.14 |
| GET  | `/api/beds?wardId=` | 获取床位列表 | 3.14 |
| POST | `/api/beds` | 新增床位（管理员） | 3.14 |
| POST | `/api/admissions` | 入院申请 | 3.14 |
| GET  | `/api/admissions?status=` | 查询住院记录 | 3.14 |
| PATCH| `/api/admissions/:id/discharge` | 出院结算 | 3.14 |
| POST | `/api/admissions/:id/orders` | 添加医嘱 | 3.14 |
| GET  | `/api/admissions/:id/orders` | 查看医嘱列表 | 3.14 |
| POST | `/api/admissions/:id/records` | 添加病程记录 | 3.14 |
| GET  | `/api/admissions/:id/records` | 查看病程记录 | 3.14 |
| POST | `/api/admissions/:id/daily-chart` | 添加每日体征 | 3.14 |
| GET  | `/api/admissions/:id/daily-chart` | 查看每日体征 | 3.14 |

#### 管理员端（需 ADMIN 角色）

| 方法 | 路径 | 说明 | spec 追踪 |
|------|------|------|-----------|
| GET  | `/api/admin/departments` | 科室列表（含停用） | 3.6 |
| POST | `/api/admin/departments` | 新增科室 | 3.6 |
| PUT  | `/api/admin/departments/:id` | 编辑科室 | 3.6 |
| DELETE | `/api/admin/departments/:id` | 删除科室 | 3.6 |
| PATCH | `/api/admin/departments/:id/status` | 启用/停用科室 | 3.6 |
| GET  | `/api/admin/doctors` | 医生列表 | 3.7 |
| POST | `/api/admin/doctors` | 新增医生（同时创建 User 和 Doctor 记录） | 3.7 |
| PUT  | `/api/admin/doctors/:id` | 编辑医生 | 3.7 |
| PATCH | `/api/admin/doctors/:id/status` | 启用/停用医生 | 3.7 |
| GET  | `/api/admin/schedules?doctorId=[&month=]` | 查询排班（仅 doctorId 返回全部排班，支持 month 按月份） | 3.8 |
| POST | `/api/admin/schedules` | 新增一条排班记录 | 3.8 |
| DELETE | `/api/admin/schedules/:id` | 删除排班 | 3.8 |
| POST | `/api/admin/schedules/batch` | 批量创建排班（如周一至周五固定时段） | 3.8 |
| GET  | `/api/admin/statistics/appointments?start=&end=` | 预约量统计 | 3.9 |
| GET  | `/api/admin/statistics/departments?start=&end=` | 科室预约统计 | 3.9 |
| GET  | `/api/admin/statistics/cancellation-rate?start=&end=` | 取消率统计 | 3.9 |

---

## 5. 前端路由与页面

### 5.1 路由表

```
/login                        → LoginPage            （公开）
/register                     → RegisterPage         （公开）

/patient                      → PatientLayout
  /patient/departments        → DepartmentListPage    （科室列表）
  /patient/departments/:id    → DoctorListPage        （医生列表）
  /patient/doctors/:id/book   → BookingPage           （出诊日历 + 时段选择）
  /patient/book/confirm       → BookingConfirmPage    （确认预约）
  /patient/appointments       → MyAppointmentsPage    （我的预约）
  /patient/profile            → ProfilePage           （编辑个人信息）

/doctor                       → DoctorLayout
  /doctor/dashboard           → DashboardPage         （今日待就诊）
  /doctor/appointments        → AppointmentListPage   （按日期查看）
  /doctor/profile             → ProfilePage           （编辑个人资料）
  /doctor/patients/:id/history → PatientHistoryPage   （患者就诊历史）
  /doctor/examination         → ExaminationPage       （开检查单）
  /doctor/wards               → WardManagePage        （住院患者列表）
  /doctor/wards/:id           → AdmissionDetailPage   （住院患者详情）

/admin                        → AdminLayout
  /admin/departments          → DepartmentManagePage  （科室管理）
  /admin/doctors              → DoctorManagePage      （医生管理）
  /admin/schedules            → ScheduleManagePage    （排班管理）
  /admin/examination-items    → ExaminationItemManagePage  （检查项目管理）
  /admin/wards                → WardManagePage        （病房床位管理）
  /admin/admissions           → AdmissionManagePage   （入院出院管理）
  /admin/statistics           → StatisticsPage        （数据统计）
```

### 5.2 页面与组件对应关系

| 页面 | 主要组件 | 数据来源 |
|------|----------|----------|
| LoginPage | Form (phone, password) | POST /auth/login |
| RegisterPage | Form (phone, password, name) | POST /auth/register |
| DepartmentListPage | Card / List，展示科室卡片 | GET /departments |
| DoctorListPage | Card / List，每个医生含职称、简介、照片 | GET /departments/:id/doctors |
| BookingPage | Month Calendar（出诊日高亮）+ TimeSlotGrid | GET /doctors/:id/schedules?month=YYYY-MM |
| BookingConfirmPage | 展示预约详情 + 病情描述 + 确认按钮 | POST /appointments |
| MyAppointmentsPage | Tabs（待就诊/历史）+ AppointmentCard | GET /appointments |
| DashboardPage | 当天预约列表 + 状态操作按钮 + 诊断/处方面板 | GET /doctor/appointments |
| AppointmentListPage | DatePicker + 预约列表 | GET /doctor/appointments |
| ProfilePage (patient) | Form（姓名、密码修改） | GET/PATCH /api/profile |
| ProfilePage (doctor) | Form（职称、简介、照片上传） | GET/PATCH /api/doctor/profile |
| PatientHistoryPage | 患者信息 + 历史预约时间线 + 诊断/处方详情 | GET /api/doctor/patients/:id/history |
| DepartmentManagePage | Table + Modal Form | GET/POST/PUT /admin/departments |
| DoctorManagePage | Table + Modal Form | GET/POST/PUT /admin/doctors |
| ScheduleManagePage | Calendar 视图 + 批量设置面板 + 近期/历史 Tab 分表 | CRUD /admin/schedules |
| StatisticsPage | 统计图表（Chart 库） | GET /admin/statistics/* |

### 5.3 核心状态（Zustand Store）

```typescript
// authStore.ts
interface AuthState {
  token: string | null;
  user: { id: number; phone: string; name: string; role: Role } | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterReq) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;   // 从 localStorage 恢复
}
```

token 持久化在 `localStorage`，页面刷新时通过 `loadFromStorage` 恢复。

---

## 6. 认证与鉴权流程

```
请求 → [auth middleware] → 解析 JWT → 挂载 req.user
     → [roleGuard('PATIENT')] → 比对角色 → 通过 → 进入 controller
         ↓ 失败
         401 / 403 响应
```

**auth middleware:**
1. 从 `Authorization: Bearer <token>` 提取 token
2. `jwt.verify(token, secret)` 解码
3. 从数据库查询用户是否存在、是否被禁用
4. 挂载 `req.user = { id, phone, role, name }`

**roleGuard:**
```typescript
roleGuard(...roles: Role[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json(...);
  next();
}
```

---

## 7. 关键业务逻辑（Service 层）

### 7.1 创建预约

```
function createAppointment(patientId, { doctorId, scheduleId, date, hour, symptom }) {
  1. 查 schedule 是否存在 (doctorId, date, hour)
     - 不存在 → 400 "该时段不可预约"
  2. 查同一 patient 在同一天同科室是否有 PENDING 预约
     - 有 → 400 "该科室当天已有预约，请先取消"
  3. 创建 appointment
     - status = PENDING
     - symptom = 传入值（选填）
  4. 返回完整预约信息
}
```

### 7.4 填写诊断

```
function updateDiagnosis(appointmentId, doctorId, diagnosis) {
  1. 查 appointment
     - 不存在 → 404
     - 非 VISITED 状态 → 400 "仅已就诊可填写诊断"
  2. 校验归属（appointment.doctorId === doctorId）
  3. 更新 diagnosis
}
```

### 7.5 处方管理

```
function addPrescription(appointmentId, doctorId, { medicineName, dosage, method, days }) {
  1. 查 appointment
     - 不存在 → 404
     - 非 VISITED 状态 → 400 "仅可对已就诊患者开药"
  2. 校验归属（appointment.doctorId === doctorId）
  3. 创建 prescription
}
```

### 7.2 取消预约

```
function cancelAppointment(appointmentId, userId) {
  1. 查 appointment
     - 不存在 → 404
     - status !== PENDING → 400 "仅可取消待就诊的预约"
  2. 校验归属（appointment.patientId === userId）
  3. status = CANCELLED
}
```

### 7.6 患者就诊历史查询

```
function getPatientHistory(doctorId, patientId) {
  1. 查 doctorId 名下是否有该 patient 的预约记录
     - 无 → 404 "该患者与您无就诊记录"
  2. 查询该 patient 的所有预约记录（含诊断、处方）
  3. 按日期倒序排列
  4. 返回患者信息 + 预约列表（每条含诊断、处方列表）
}
```

### 7.7 处方打印

```
处方打印为前端功能，不涉及后端 API。方案：
1. 使用 window.print() 或 react-to-print 库
2. 打印区域包含：医院名称、患者姓名、诊断结果、药品清单（名称、用量、用法、天数）、医生签名、日期
3. 打印 CSS @media print 优化纸张尺寸（A5 或 热敏纸规格）
```

### 7.8 个人资料编辑

```
function updateProfile(userId, { name?, oldPassword?, newPassword? }) {
  1. 查 user
     - 不存在 → 404
  2. 如果要修改密码
     - 校验 oldPassword 是否匹配
     - 不匹配 → 400 "原密码错误"
     - newPassword 非空校验
  3. 如果要修改姓名
     - name 非空校验
  4. 更新 User
}

function updateDoctorProfile(doctorId, { title?, description?, photo? }) {
  1. 查 doctor
     - 不存在 → 404
  2. 更新对应字段
}
```

### 7.3 批量创建排班

```
function batchCreateSchedules(doctorId, dateRange, hourRanges[]) {
  // hourRanges: [{ start: 8, end: 12 }, { start: 14, end: 17 }]
  // 展开为单个 hour 并批量插入（冲突跳过）
  1. 对 dateRange 中每个日期
  2.  对每个 hourRange，展开为 hour 列表
  3.  批量 createMany（skipDuplicates: true）
}
```

---

## 8. 错误码规范

| code | 含义 |
|------|------|
| 0 | 成功 |
| 40001 | 请求参数无效 |
| 40002 | 业务规则冲突（如当天同科室已有预约） |
| 40003 | 预约状态不允许操作 |
| 40101 | 未登录 / token 过期 |
| 40102 | token 无效 |
| 40301 | 无权限（角色不匹配） |
| 40401 | 资源不存在 |
| 50001 | 服务器内部错误 |

---

## 9. 测试策略

| 层级 | 工具 | 覆盖范围 |
|------|------|----------|
| 单元测试（后端） | Vitest / Jest | Service 层核心业务逻辑：创建预约、取消预约、校验规则 |
| 集成测试（后端） | Supertest | API 端点：认证流程、CRUD 操作、权限验证 |
| 单元测试（前端） | Vitest + React Testing Library | 组件渲染、状态展示、交互回调 |
| E2E 测试 | Playwright | 核心用户流程：注册→登录→选科室→选医生→预约→查看→取消 |

> 注意：当前阶段聚焦核心业务逻辑测试，管理端 CRUD 可后续补充。

### 测试用例示例（Service 层）

```typescript
// createAppointment.test.ts
describe('createAppointment', () => {
  it('should create appointment when schedule exists');
  it('should reject when schedule does not exist');
  it('should reject when patient already has PENDING appointment in same department on same day');
  it('should allow appointment in different department on same day');
});

// cancelAppointment.test.ts
describe('cancelAppointment', () => {
  it('should cancel a PENDING appointment');
  it('should reject cancelling a VISITED appointment');
  it('should reject cancelling another patient\'s appointment');
});
```

---

## 10. 实现顺序

| 阶段 | 任务 | 产出 |
|------|------|------|
| **Phase 0：基础搭建** | 初始化项目结构、配置 Prisma、数据库迁移、Express 骨架、Vite + React 脚手架 | 可运行的空项目 |
| **Phase 1：认证模块** | 后端：register / login API、JWT 中间件、roleGuard | 注册登录可用 |
| | 前端：LoginPage、RegisterPage、authStore、ProtectedRoute | |
| **Phase 2：管理员核心** | 后端：科室 CRUD、医生 CRUD、排班 CRUD、批量排班 | 后台可配置 |
| | 前端：DepartmentManagePage、DoctorManagePage、ScheduleManagePage | |
| **Phase 3：患者端核心** | 后端：科室列表、医生列表、排班查询、创建/取消预约 | 完整挂号流程 |
| | 前端：DepartmentListPage、DoctorListPage、BookingPage、BookingConfirmPage | |
| **Phase 4：我的预约** | 后端：预约列表查询（含筛选） | 预约历史可查 |
| | 前端：MyAppointmentsPage（待就诊 + 历史 Tab） | |
| **Phase 5：医生端** | 后端：医生预约列表、状态更新 | 医生可操作 |
| | 前端：DashboardPage、AppointmentListPage | |
| **Phase 6：数据统计** | 后端：预约量/科室/取消率统计查询 | 管理数据看板 |
| | 前端：StatisticsPage（图表展示） | |
| **Phase 7：测试** | 单元测试 + 集成测试 + E2E 核心流程 | 测试覆盖核心场景 |
| **Phase 8：病情描述与诊断开药** | 后端：Appointment 增加 symptom/diagnosis 字段、新增 Prescription 模型 | 患者可填病情，医生可诊断开药 |
| | 前端：BookingConfirmPage 增加症状输入、DashboardPage 增加诊断/处方面板、MyAppointmentsPage 显示诊断详情 | |
| **Phase 9：体验增强** | 后端：个人资料编辑 API、患者历史查询 API、Doctor 增加 photo 字段 | 医患资料可编辑，医生可查历史、打印处方 |
| | 前端：ProfilePage（患者/医生）、PatientHistoryPage、BookingPage 月历视图、处方打印 | |
| **Phase 10：消息通知** | 后端：Notification 模型、通知 CRUD API、在现有 Use Case 中注入通知 | 站内信通知覆盖关键操作 |
| | 前端：NotificationBell 组件、通知列表弹窗、各布局头部集成通知入口 | |
| **Phase 11：药品数据库** | 后端：MedicineCategory + Medicine 表、种子数据、药品查询 API | 医生开药可按分类选择 |
| | 前端：DashboardPage 处方面板改用按分类选择的 Select 组件 | |
| **Phase 12：检查检验模块** | 后端：ExaminationItem/Order/Report 表、检查开单/报告 API | 可开检查单、录报告、查看结果 |
| | 前端：医生开单页、检查报告查看页、项目管理页 | |
| **Phase 13：住院管理** | 后端：Ward/Bed/Admission/MedicalOrder/MedicalRecord/DailyChart 表、住院全流程 API | 住院全流程管理 |
| | 前端：病房床位管理、入院出院、医嘱病程体温单 | |
| **Phase 14：电子病历** | 后端：病历汇总查询 API，整合就诊/检查/住院数据 | 患者完整病历档案 |
| | 前端：病历时间线页面 | |

---

## 11. 关键设计决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 认证明文存 JWT | JWT | 无状态，适合小型系统，无需 Redis 维护 session |
| 短信验证码 | 暂用简单密码登录 | spec 3.1 提到验证码，但 MVP 阶段先简化；可后续接入 |
| 不限号 | 不做号源扣减校验 | spec 4 明确 "不限号" |
| 同天同科室限一个预约 | Service 层校验 | 业务合理性：避免患者同一科室重复挂号 |
| 数据库选用 MySQL | MySQL 8 | 用户明确指定 |
| 密码存储 | 明文存储 | 用户明确指定，不进行 bcrypt 等加密 |
| 前后端分离 | 独立 server/ 和 client/ | 职责清晰，独立部署和扩展 |
| 病情描述选填 | Appointment.symptom 可为空 | 尊重用户习惯，不强制填病状 |
| 诊断与处方分离 | 诊断存 Appointment.diagnosis，处方独立 Prescription 表 | 一对多关系，支持多个药品 |
| 诊断开药不改变状态 | VISITED 后单独 API 操作诊断/处方 | 解耦，医生可随时追加编辑 |
| 处方打印纯前端 | 使用 window.print() 或 react-to-print | 不涉及后端生成 PDF，简化实现 |
| 出诊日历月视图 | BookingPage 使用 Calendar 组件高亮排班日期 | 提升患者选日体验，一目了然 |
| 医生照片存 URL | Doctor.photo 存图片 URL，前端用 img 标签展示 | 文件上传暂用 URL 输入或 base64，后续可接对象存储 |
| 密码修改需验原密码 | oldPassword + newPassword 双字段 | 安全考虑，防止未授权修改 |

---

## 12. 附录：TypeScript 类型定义（前后端共享参考）

```typescript
// === 枚举 ===
type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'DISABLED';
type DeptStatus = 'ACTIVE' | 'INACTIVE';
type AppointmentStatus = 'PENDING' | 'VISITED' | 'NO_SHOW' | 'CANCELLED';

// === 实体 ===
interface User {
  id: number;
  phone: string;
  name: string;
  role: Role;
  status: UserStatus;
}

interface Department {
  id: number;
  name: string;
  description: string;
  status: DeptStatus;
}

interface Doctor {
  id: number;
  userId: number;
  name: string;           // 关联 User.name
  departmentId: number;
  departmentName: string; // 关联 Department.name
  title: string;
  description: string;
  photo?: string;         // 头像 URL
  status: UserStatus;
}

interface Schedule {
  id: number;
  doctorId: number;
  date: string;           // YYYY-MM-DD
  hour: number;           // 0-23
}

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  departmentId: number;
  departmentName: string;
  date: string;
  hour: number;
  status: AppointmentStatus;
  symptom?: string;
  diagnosis?: string;
  createdAt: string;
}

interface MedicineCategory {
  id: number;
  name: string;
}

interface Medicine {
  id: number;
  categoryId: number;
  name: string;
  commonDosage: string;
  commonMethod: string;
}

interface Prescription {
  id: number;
  appointmentId: number;
  medicineName: string;
  dosage: string;
  method: string;
  days: number;
  createdAt: string;
}

// === API 请求/响应 ===
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

interface LoginRequest {
  phone: string;
  password: string;
}

interface RegisterRequest {
  phone: string;
  password: string;
  name: string;
}

interface CreateAppointmentRequest {
  doctorId: number;
  scheduleId: number;
  date: string;
  hour: number;
  symptom?: string;
}

interface BatchScheduleRequest {
  doctorId: number;
  dateRange: { start: string; end: string };  // YYYY-MM-DD
  hourRanges: { start: number; end: number }[];
}

interface UpdateProfileRequest {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}

interface UpdateDoctorProfileRequest {
  title?: string;
  description?: string;
  photo?: string;
}

interface PatientHistoryResponse {
  patient: { id: number; name: string; phone: string };
  appointments: {
    id: number;
    date: string;
    departmentName: string;
    doctorName: string;
    status: string;
    diagnosis?: string;
    prescriptions: Prescription[];
  }[];
}

interface Notification {
  id: number;
  userId: number;
  title: string;
  content: string;
  relatedUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface ExaminationItem {
  id: number;
  name: string;
  category: string;
  departmentId: number;
  departmentName: string;
  price: number;
  refRange?: string;
  unit?: string;
}

interface ExaminationOrder {
  id: number;
  appointmentId?: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  status: string;
  clinicalDiag?: string;
  items: ExaminationOrderItem[];
  report?: ExaminationReport;
  createdAt: string;
}

interface ExaminationOrderItem {
  id: number;
  examinationItemId: number;
  itemName: string;
  result?: string;
  refRange?: string;
  unit?: string;
}

interface ExaminationReport {
  id: number;
  orderId: number;
  content?: string;
  images?: string;
  createdAt: string;
}

interface Ward {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
  description?: string;
}

interface Bed {
  id: number;
  wardId: number;
  bedNumber: string;
  status: string;
}

interface Admission {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  bedId: number;
  wardName: string;
  bedNumber: string;
  diagnosis: string;
  status: string;
  admittedAt: string;
  dischargedAt?: string;
}

interface MedicalOrder {
  id: number;
  admissionId: number;
  type: string;
  content: string;
  status: string;
  createdAt: string;
}

interface MedicalRecord {
  id: number;
  admissionId: number;
  content: string;
  recordDate: string;
  createdAt: string;
}

interface DailyChart {
  id: number;
  admissionId: number;
  recordDate: string;
  temperature?: number;
  pulse?: number;
  breath?: number;
  bloodPressure?: string;
}

interface NotificationListResponse {
  list: Notification[];
  total: number;
  unreadCount: number;
}
```
