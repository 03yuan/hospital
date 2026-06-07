# 医院门诊挂号诊断系统 — 任务分解

> 本文件由 plan.md 推导生成，遵循 TDD 原则（测试先于实现）。
> 标记 `[P]` 表示该任务与同阶段其他 `[P]` 任务可并行执行。
> 每个任务 = 一个主要文件的创建或修改。

---

## Phase 1: Foundation & Skeleton

> 解决方案骨架、项目结构、基础配置、依赖注入、日志、环境配置、前端基础工程初始化
> 不实现任何具体业务功能

### 1.1 后端基础工程

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 1 | 初始化 server 目录并创建 package.json | `server/package.json` | 添加 Express、TypeScript、Prisma、JWT 等依赖 |
| 2 | [P] 创建 server tsconfig | `server/tsconfig.json` | TypeScript 编译配置 |
| 3 | [P] 创建 .env 与 .env.example | `server/.env` + `server/.env.example` | 数据库连接串、JWT Secret、端口等 |
| 4 | [P] 创建 Prisma schema | `server/prisma/schema.prisma` | MySQL provider + 5 张表定义（User/Doctor/Department/Schedule/Appointment） |
| 5 | 创建配置模块 | `server/src/config/index.ts` | 读取环境变量并导出配置对象 |
| 6 | 创建全局错误处理中间件 | `server/src/middleware/errorHandler.ts` | 统一捕获异常，返回 `{ code, data, message }` 格式 |
| 7 | 创建 Express app 骨架 | `server/src/app.ts` | 挂载 JSON 解析、CORS、错误处理中间件，预留路由挂载点 |
| 8 | 创建服务入口 | `server/src/index.ts` | 启动服务器，监听端口 |

### 1.2 前端基础工程

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 9 | [P] 初始化 client 目录并创建 package.json | `client/package.json` | React 18、Vite、Ant Design、Zustand、Axios、React Router |
| 10 | [P] 创建 client tsconfig | `client/tsconfig.json` | TypeScript 编译配置 |
| 11 | [P] 创建 Vite 配置 | `client/vite.config.ts` | 代理 `/api` 到后端，端口配置 |
| 12 | [P] 创建 index.html | `client/index.html` | HTML 入口 |
| 13 | 创建 React 入口 | `client/src/main.tsx` | ReactDOM.createRoot 渲染 App |
| 14 | 创建根 App 组件 | `client/src/App.tsx` | 仅渲染占位文本，后续挂载路由 |
| 15 | [P] 创建前端类型定义 | `client/src/types/index.ts` | 共享类型：User, Department, Doctor, Schedule, Appointment, ApiResponse |
| 16 | [P] 创建常量文件 | `client/src/utils/constants.ts` | API 基础路径、状态映射表等 |

---

## Phase 2: Domain Model & Domain Tests (TDD)

> 领域实体、枚举、领域服务、仓储抽象接口、领域规则测试
> **必须先创建测试文件，再创建实现文件**

### 2.1 领域层 — 枚举与类型

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 17 | [P] 创建 Role 枚举测试 | `server/tests/domain/enums/Role.test.ts` | 验证枚举值包含 PATIENT/DOCTOR/ADMIN |
| 18 | [P] 创建 AppointmentStatus 枚举测试 | `server/tests/domain/enums/AppointmentStatus.test.ts` | 验证枚举值包含 PENDING/VISITED/NO_SHOW/CANCELLED |
| 19 | [P] 创建 UserStatus 枚举测试 | `server/tests/domain/enums/UserStatus.test.ts` | 验证枚举值包含 ACTIVE/DISABLED |
| 20 | [P] 创建 DeptStatus 枚举测试 | `server/tests/domain/enums/DeptStatus.test.ts` | 验证枚举值包含 ACTIVE/INACTIVE |
| 21 | [P] 实现领域枚举 | `server/src/domain/enums/index.ts` | 定义 Role, AppointmentStatus, UserStatus, DeptStatus |

### 2.2 领域层 — 实体

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 22 | [P] 创建 Department 实体测试 | `server/tests/domain/entities/Department.test.ts` | 验证构造、setStatus 状态切换 |
| 23 | [P] 创建 User 实体测试 | `server/tests/domain/entities/User.test.ts` | 验证构造、字段赋值 |
| 24 | [P] 创建 Doctor 实体测试 | `server/tests/domain/entities/Doctor.test.ts` | 验证构造、关联 Department |
| 25 | [P] 创建 Schedule 实体测试 | `server/tests/domain/entities/Schedule.test.ts` | 验证构造、唯一约束逻辑 |
| 26 | [P] 创建 Appointment 实体测试 | `server/tests/domain/entities/Appointment.test.ts` | 验证构造、状态变更合法性 |
| 27 | [P] 实现 Department 实体 | `server/src/domain/entities/Department.ts` | id, name, description, status |
| 28 | [P] 实现 User 实体 | `server/src/domain/entities/User.ts` | id, phone, password, name, role, status |
| 29 | [P] 实现 Doctor 实体 | `server/src/domain/entities/Doctor.ts` | id, userId, departmentId, title, description |
| 30 | [P] 实现 Schedule 实体 | `server/src/domain/entities/Schedule.ts` | id, doctorId, date, hour |
| 31 | [P] 实现 Appointment 实体 | `server/src/domain/entities/Appointment.ts` | id, patientId, doctorId, departmentId, scheduleId, date, hour, status；含 cancel() visited() noShow() 状态方法 |

### 2.3 领域层 — 领域服务

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 32 | 创建预约领域服务测试 | `server/tests/domain/services/AppointmentDomainService.test.ts` | 测试创建预约规则、取消规则、状态变更规则 | spec: 3.2, 3.4, 5 |
| 33 | 实现预约领域服务 | `server/src/domain/services/AppointmentDomainService.ts` | `canCreateAppointment()` `canCancelAppointment()` 等规则校验方法 | spec: 7.1, 7.2 |

### 2.4 领域层 — 仓储接口

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 34 | [P] 创建 IUserRepository 接口 | `server/src/domain/repositories/IUserRepository.ts` | findByPhone, findById, create |
| 35 | [P] 创建 IDepartmentRepository 接口 | `server/src/domain/repositories/IDepartmentRepository.ts` | findAll, findById, create, update, delete, updateStatus |
| 36 | [P] 创建 IDoctorRepository 接口 | `server/src/domain/repositories/IDoctorRepository.ts` | findAll, findById, findByDepartmentId, create, update, updateStatus |
| 37 | [P] 创建 IScheduleRepository 接口 | `server/src/domain/repositories/IScheduleRepository.ts` | findByDoctorIdAndDate, findById, create, createMany, delete |
| 38 | [P] 创建 IAppointmentRepository 接口 | `server/src/domain/repositories/IAppointmentRepository.ts` | findById, findByPatientId, findByDoctorIdAndDate, create, updateStatus, findPendingByPatientAndDepartment |

---

## Phase 3: Application Use Cases & Application Tests (TDD)

> 应用层 Use Case、DTO、业务编排、事务边界抽象
> **必须先创建测试文件，再创建实现文件**

### 3.1 应用层 — DTO

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 39 | [P] 创建认证 DTO 测试 | `server/tests/application/dtos/AuthDto.test.ts` | 验证 RegisterRequest/LoginRequest 字段 | spec: 3.1 |
| 40 | [P] 创建预约 DTO 测试 | `server/tests/application/dtos/AppointmentDto.test.ts` | 验证 CreateAppointmentRequest 字段 | spec: 3.2 |
| 41 | [P] 实现认证 DTO | `server/src/application/dtos/auth.dto.ts` | RegisterRequest, LoginRequest, AuthResponse, UserInfo |
| 42 | [P] 实现预约 DTO | `server/src/application/dtos/appointment.dto.ts` | CreateAppointmentRequest, CancelAppointmentRequest, AppointmentResponse |
| 43 | [P] 实现医生 DTO | `server/src/application/dtos/doctor.dto.ts` | DoctorResponse, UpdateStatusRequest |
| 44 | [P] 实现排班 DTO | `server/src/application/dtos/schedule.dto.ts` | BatchScheduleRequest, ScheduleResponse |
| 45 | [P] 实现管理 DTO | `server/src/application/dtos/admin.dto.ts` | DepartmentDto, DoctorManageDto, StatisticsResponse |
| 46 | [P] 实现通用响应 DTO | `server/src/application/dtos/response.dto.ts` | ApiResponse<T> 泛型包装 |

### 3.2 应用层 — Use Case（认证）

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 47 | 创建 RegisterUseCase 测试 | `server/tests/application/use-cases/RegisterUseCase.test.ts` | 测试注册成功、手机号已注册、密码为空等场景 | spec: 3.1 |
| 48 | 创建 LoginUseCase 测试 | `server/tests/application/use-cases/LoginUseCase.test.ts` | 测试登录成功、手机号不存在、密码错误等场景 | spec: 3.1 |
| 49 | [P] 实现 RegisterUseCase | `server/src/application/use-cases/auth/RegisterUseCase.ts` | 接收 RegisterRequest，校验 → 创建 User → 返回 AuthResponse |
| 50 | [P] 实现 LoginUseCase | `server/src/application/use-cases/auth/LoginUseCase.ts` | 接收 LoginRequest，校验 → 验证密码 → 生成 JWT → 返回 AuthResponse |

### 3.3 应用层 — Use Case（患者预约）

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 51 | 创建 CreateAppointmentUseCase 测试 | `server/tests/application/use-cases/CreateAppointmentUseCase.test.ts` | 成功创建、时段不可用、同科室重复预约、不同科室可多约 | spec: 3.2, 4 |
| 52 | 创建 CancelAppointmentUseCase 测试 | `server/tests/application/use-cases/CancelAppointmentUseCase.test.ts` | 取消成功、非 PENDING 状态拒绝、非本人预约拒绝 | spec: 3.4, 5 |
| 53 | 创建 ListPatientAppointmentsUseCase 测试 | `server/tests/application/use-cases/ListPatientAppointmentsUseCase.test.ts` | 分状态过滤、按日期排序 | spec: 3.3 |
| 54 | 创建 ListDoctorAppointmentsUseCase 测试 | `server/tests/application/use-cases/ListDoctorAppointmentsUseCase.test.ts` | 按医生 + 日期查询、状态过滤 | spec: 3.5 |
| 55 | 创建 UpdateAppointmentStatusUseCase 测试 | `server/tests/application/use-cases/UpdateAppointmentStatusUseCase.test.ts` | 标记已就诊、标记未到、非本医生拒绝 | spec: 3.5, 5 |
| 56 | [P] 实现 CreateAppointmentUseCase | `server/src/application/use-cases/patient/CreateAppointmentUseCase.ts` | 校验 schedule → 校验同科室冲突 → 创建 Appointment | spec: 7.1 |
| 57 | [P] 实现 CancelAppointmentUseCase | `server/src/application/use-cases/patient/CancelAppointmentUseCase.ts` | 校验归属 → 校验状态 → 更新为 CANCELLED | spec: 7.2 |
| 58 | [P] 实现 ListPatientAppointmentsUseCase | `server/src/application/use-cases/patient/ListPatientAppointmentsUseCase.ts` | 按 patientId 查询，支持 status 筛选，关联医生/科室名 |
| 59 | [P] 实现 ListDoctorAppointmentsUseCase | `server/src/application/use-cases/doctor/ListDoctorAppointmentsUseCase.ts` | 按 doctorId + date 查询，关联患者名 |
| 60 | [P] 实现 UpdateAppointmentStatusUseCase | `server/src/application/use-cases/doctor/UpdateAppointmentStatusUseCase.ts` | 校验医生归属 → 更新 status（VISITED / NO_SHOW） |

### 3.4 应用层 — Use Case（管理员）

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 61 | [P] 实现 DepartmentManageUseCase | `server/src/application/use-cases/admin/DepartmentManageUseCase.ts` | 科室 CRUD + 状态切换 |
| 62 | [P] 实现 DoctorManageUseCase | `server/src/application/use-cases/admin/DoctorManageUseCase.ts` | 医生 CRUD（含 User 联合创建）+ 状态切换 |
| 63 | [P] 实现 ScheduleManageUseCase | `server/src/application/use-cases/admin/ScheduleManageUseCase.ts` | 排班新增/查询/删除/批量创建 |
| 64 | [P] 实现 StatisticsUseCase | `server/src/application/use-cases/admin/StatisticsUseCase.ts` | 预约量统计、科室统计、取消率统计 |

---

## Phase 4: API Contracts & Web API (TDD)

> API DTO、错误响应模型、Controller / Router、请求校验、DTO 映射、接口测试
> **必须先创建测试文件，再创建实现文件**

### 4.1 中间件

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 65 | 创建 auth middleware 测试 | `server/tests/api/middleware/auth.test.ts` | 模拟请求，测试 Token 解析、无效 Token、过期 Token | spec: 6 |
| 66 | 创建 roleGuard middleware 测试 | `server/tests/api/middleware/roleGuard.test.ts` | 测试角色匹配、角色不匹配 | spec: 6 |
| 67 | 实现 auth middleware | `server/src/middleware/auth.ts` | 从 Authorization 头提取 JWT，解析后挂载 req.user |
| 68 | 实现 roleGuard middleware | `server/src/middleware/roleGuard.ts` | 比对 req.user.role 是否在允许角色列表中 |

### 4.2 API — Auth

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 69 | 创建 Auth 路由测试 | `server/tests/api/routes/auth.test.ts` | 测试 POST /api/auth/register、POST /api/auth/login、GET /api/auth/me | spec: 3.1 |
| 70 | 实现 Auth 路由 | `server/src/routes/auth.ts` | 注册、登录、当前用户信息三个端点 |
| 71 | 实现 Auth 请求校验器 | `server/src/validators/auth.validator.ts` | phone 格式、password 非空、name 非空 |

### 4.3 API — 患者端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 72 | 创建科室/医生查询路由测试 | `server/tests/api/routes/patient-departments.test.ts` | GET /api/departments、GET /api/departments/:id/doctors | spec: 3.2-①②③ |
| 73 | 创建排班查询路由测试 | `server/tests/api/routes/patient-schedules.test.ts` | GET /api/doctors/:id/schedules?date= | spec: 3.2-④⑤ |
| 74 | 创建预约操作路由测试 | `server/tests/api/routes/patient-appointments.test.ts` | POST /api/appointments、PATCH /api/appointments/:id/cancel、GET /api/appointments | spec: 3.2-⑥⑦, 3.3, 3.4 |
| 75 | [P] 实现科室查询路由 | `server/src/routes/departments.ts` | 获取活跃科室列表 |
| 76 | [P] 实现医生查询路由 | `server/src/routes/doctors.ts` | 获取科室下活跃医生列表 |
| 77 | [P] 实现排班查询路由 | `server/src/routes/schedules.ts` | 获取医生某日可预约时段 |
| 78 | [P] 实现预约操作路由 | `server/src/routes/appointments.ts` | 创建预约、取消预约、查询本人预约列表 |
| 79 | [P] 实现患者端请求校验器 | `server/src/validators/patient.validator.ts` | createAppointment、cancelAppointment 参数校验 |

### 4.4 API — 医生端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 80 | 创建医生端路由测试 | `server/tests/api/routes/doctor-appointments.test.ts` | GET /api/doctor/appointments、PATCH /api/doctor/appointments/:id/status | spec: 3.5 |
| 81 | 实现医生端预约管理路由 | `server/src/routes/doctor/appointments.ts` | 查看预约列表、标记就诊状态 |
| 82 | 实现医生端请求校验器 | `server/src/validators/doctor.validator.ts` | updateStatus 参数校验 |

### 4.5 API — 管理员端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 83 | 创建管理员科室路由测试 | `server/tests/api/routes/admin-departments.test.ts` | 科室 CRUD + 状态切换 | spec: 3.6 |
| 84 | 创建管理员医生路由测试 | `server/tests/api/routes/admin-doctors.test.ts` | 医生 CRUD + 状态切换 | spec: 3.7 |
| 85 | 创建管理员排班路由测试 | `server/tests/api/routes/admin-schedules.test.ts` | 排班 CRUD + 批量创建 | spec: 3.8 |
| 86 | 创建管理员统计路由测试 | `server/tests/api/routes/admin-statistics.test.ts` | 预约量/科室/取消率统计 | spec: 3.9 |
| 87 | [P] 实现管理员科室管理路由 | `server/src/routes/admin/departments.ts` | 科室 CRUD + status 切换 |
| 88 | [P] 实现管理员医生管理路由 | `server/src/routes/admin/doctors.ts` | 医生 CRUD + status 切换 |
| 89 | [P] 实现管理员排班管理路由 | `server/src/routes/admin/schedules.ts` | 排班 CRUD + 批量创建 |
| 90 | [P] 实现管理员数据统计路由 | `server/src/routes/admin/statistics.ts` | 预约量/科室/取消率统计 |

### 4.6 API 路由挂载

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 92 | 更新 app.ts 挂载所有路由 | `server/src/app.ts` | 挂载 auth, departments, doctors, schedules, appointments, doctor/appointments, admin/* 路由 |

### 4.7 排班历史记录

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 92b | 新增 IScheduleRepository.findByDoctorId | `server/src/domain/repositories/IScheduleRepository.ts` | 查询医生全部排班 | 3.8 |
| 92c | 实现 PrismaScheduleRepository.findByDoctorId | `server/src/infrastructure/repositories/PrismaScheduleRepository.ts` | 按医生查询所有排班（降序） | 3.8 |
| 92d | 新增 ScheduleManageUseCase.getByDoctorId | `server/src/application/use-cases/admin/ScheduleManageUseCase.ts` | 获取医生全部排班 | 3.8 |
| 92e | 更新 admin/schedules GET 路由 | `server/src/routes/admin/schedules.ts` | 仅传 doctorId 时返回全部排班 | 3.8 |
| 92f | 更新 ScheduleManagePage 分近期/历史 | `client/src/pages/admin/ScheduleManagePage.tsx` | 两 Tab 分开展示，历史排班只读 | 3.8 |

---

## Phase 5: Infrastructure & Integration

> 仓储实现、数据库映射、外部服务适配、JWT 认证落地、集成测试支撑
> 此阶段按 "测试 → 实现" 的顺序，但可跨仓储并行

### 5.1 数据库基础设施

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 93 | [P] 运行 Prisma 迁移 | `server/prisma/migrations/` | `npx prisma migrate dev` 生成初始迁移 |
| 94 | [P] 创建 Prisma 客户端单例 | `server/src/infrastructure/database/prisma.ts` | 导出单例 PrismaClient 实例 |

### 5.2 仓储实现

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 96 | [P] 实现 PrismaUserRepository | `server/src/infrastructure/repositories/PrismaUserRepository.ts` | ✅ 已实现 |
| 98 | [P] 实现 PrismaDepartmentRepository | `server/src/infrastructure/repositories/PrismaDepartmentRepository.ts` | ✅ 已实现 |
| 100 | [P] 实现 PrismaDoctorRepository | `server/src/infrastructure/repositories/PrismaDoctorRepository.ts` | ✅ 已实现 |
| 102 | [P] 实现 PrismaScheduleRepository | `server/src/infrastructure/repositories/PrismaScheduleRepository.ts` | ✅ 已实现 |
| 104 | [P] 实现 PrismaAppointmentRepository | `server/src/infrastructure/repositories/PrismaAppointmentRepository.ts` | ✅ 已实现 |

### 5.3 依赖注入容器

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 107 | 创建依赖注册文件 | `server/src/container.ts` | 手动 DI：new 仓储 → new UseCase → 导出供路由使用 |

---

## Phase 6: Frontend UI & Interaction

> 路由、页面、组件、布局、API Service、表单处理、页面状态、鉴权态、前后端联调
> 无严格 TDD，但核心组件应有渲染测试

### 6.1 前端基础设施

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 108 | 创建 Axios 实例 | `client/src/api/client.ts` | baseURL、拦截器（自动附加 token）、统一错误处理 |
| 109 | [P] 创建认证状态管理 | `client/src/store/authStore.ts` | Zustand store：token/user 状态、login/register/logout/loadFromStorage |
| 110 | [P] 创建路由配置 | `client/src/router/index.tsx` | 定义所有路由路径与页面组件映射 |
| 111 | [P] 创建日期/状态格式化工具 | `client/src/utils/format.ts` | formatDate, formatHour, formatStatus 等 |

### 6.2 通用组件

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 112 | [P] 创建 ProtectedRoute 组件 | `client/src/components/common/ProtectedRoute.tsx` | 未登录 → 重定向 /login |
| 113 | [P] 创建 RoleGuard 组件 | `client/src/components/common/RoleGuard.tsx` | 角色不匹配 → 403 提示页 |
| 114 | [P] 创建 AppointmentStatusTag 组件 | `client/src/components/appointment/AppointmentStatusTag.tsx` | 根据 status 渲染不同颜色的 Ant Design Tag |
| 115 | [P] 创建 AppointmentCard 组件 | `client/src/components/appointment/AppointmentCard.tsx` | 展示预约卡片（科室、医生、时间、状态、取消按钮） |

### 6.3 布局组件

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 116 | [P] 创建 PatientLayout | `client/src/components/layout/PatientLayout.tsx` | 患者端布局：顶部导航（科室列表、我的预约、退出登录） |
| 117 | [P] 创建 DoctorLayout | `client/src/components/layout/DoctorLayout.tsx` | 医生端布局：侧边栏（今日、按日期、退出） |
| 118 | [P] 创建 AdminLayout | `client/src/components/layout/AdminLayout.tsx` | 管理端布局：侧边栏（科室管理、医生管理、排班管理、统计） |
| 119 | 更新 App.tsx 集成路由与布局 | `client/src/App.tsx` | 挂载 BrowserRouter + 路由表 |

### 6.4 API Service 层

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 120 | [P] 创建认证 API service | `client/src/api/auth.ts` | login, register, getMe |
| 121 | [P] 创建科室 API service | `client/src/api/departments.ts` | getDepartments |
| 122 | [P] 创建医生 API service | `client/src/api/doctors.ts` | getDoctorsByDepartment |
| 123 | [P] 创建排班 API service | `client/src/api/schedules.ts` | getSchedules |
| 124 | [P] 创建预约 API service | `client/src/api/appointments.ts` | createAppointment, cancelAppointment, getAppointments, getAppointment |
| 125 | [P] 创建管理后台 API service | `client/src/api/admin.ts` | department/doctor/schedule/statistics CRUD 方法 |

### 6.5 认证页面

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 126 | [P] 创建 LoginPage | `client/src/pages/auth/LoginPage.tsx` | 手机号 + 密码表单，登录成功跳转对应角色首页 |
| 127 | [P] 创建 RegisterPage | `client/src/pages/auth/RegisterPage.tsx` | 手机号 + 密码 + 姓名表单，注册成功自动登录 |

### 6.6 患者端页面

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 128 | [P] 创建 DepartmentListPage | `client/src/pages/patient/DepartmentListPage.tsx` | 展示活跃科室卡片列表 | spec: 3.2-① |
| 129 | [P] 创建 DoctorListPage | `client/src/pages/patient/DoctorListPage.tsx` | 科室下医生列表，含职称、简介 | spec: 3.2-②③ |
| 130 | [P] 创建 BookingPage | `client/src/pages/patient/BookingPage.tsx` | 日期选择器 + 时段网格（展示可约/不可约状态） | spec: 3.2-④⑤ |
| 131 | [P] 创建 BookingConfirmPage | `client/src/pages/patient/BookingConfirmPage.tsx` | 确认预约信息 + 确认按钮，成功后跳转我的预约 | spec: 3.2-⑥⑦ |
| 132 | [P] 创建 MyAppointmentsPage | `client/src/pages/patient/MyAppointmentsPage.tsx` | Tabs：待就诊 / 历史记录，使用 AppointmentCard，支持取消操作 | spec: 3.3, 3.4 |

### 6.7 医生端页面

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 133 | [P] 创建 DashboardPage | `client/src/pages/doctor/DashboardPage.tsx` | 当天待就诊患者列表，含姓名、时段、电话，操作按钮（已就诊/未到） | spec: 3.5 |
| 134 | [P] 创建 AppointmentListPage | `client/src/pages/doctor/AppointmentListPage.tsx` | 日期选择 + 该日预约列表，含所有状态筛选 | spec: 3.5 |

### 6.8 管理端页面

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 135 | [P] 创建 DepartmentManagePage | `client/src/pages/admin/DepartmentManagePage.tsx` | Table + Modal 表单，科室 CRUD + 启用/停用按钮 | spec: 3.6 |
| 136 | [P] 创建 DoctorManagePage | `client/src/pages/admin/DoctorManagePage.tsx` | Table + Modal 表单，医生 CRUD + 启用/停用 + 所属科室下拉 | spec: 3.7 |
| 137 | [P] 创建 ScheduleManagePage | `client/src/pages/admin/ScheduleManagePage.tsx` | 医生选择 + 日期范围 + 时段设置，排班列表 + 批量创建面板 + 历史排班记录 Tab | spec: 3.8 |
| 138 | [P] 创建 StatisticsPage | `client/src/pages/admin/StatisticsPage.tsx` | 日期范围 + 预约量图表 + 科室分布 + 取消率（可用简单 Chart 库或 Ant Design Progress） | spec: 3.9 |

---

## Phase 8: 病情描述与诊断开药

> 患者预约时可填写病情描述，医生就诊后可写诊断和开具处方

### 8.1 数据库 & 领域层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 139 | Prisma Schema: Appointment 增加 symptom/diagnosis, 新增 Prescription 表 | `server/prisma/schema.prisma` | 含字段、索引、关系 | 3.2, 3.5 |
| 140 | 运行 Prisma 迁移 | `server/prisma/migrations/` | `npx prisma migrate dev` | — |
| 141 | 更新 Appointment 实体 | `server/src/domain/entities/Appointment.ts` | 增加 symptom/diagnosis 属性 | 3.2, 3.5 |
| 142 | [P] 创建 Prescription 实体 | `server/src/domain/entities/Prescription.ts` | medicineName, dosage, method, days | 3.5 |
| 143 | [P] 创建 IPrescriptionRepository 接口 | `server/src/domain/repositories/IPrescriptionRepository.ts` | CRUD 方法 | 3.5 |
| 144 | 更新 IAppointmentRepository 接口 | `server/src/domain/repositories/IAppointmentRepository.ts` | 增加 updateDiagnosis 方法 | 3.5 |

### 8.2 应用层 — Use Case & DTO

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 145 | [P] 更新 Appointment DTO | `server/src/application/dtos/appointment.dto.ts` | symptom/diagnosis 字段 | 3.2, 3.5 |
| 146 | [P] 创建 Prescription DTO | `server/src/application/dtos/prescription.dto.ts` | PrescriptionRequest/Response | 3.5 |
| 147 | 更新 CreateAppointmentUseCase | `server/src/application/use-cases/patient/CreateAppointmentUseCase.ts` | 支持 symptom 输入 | 3.2 |
| 148 | [P] 实现 UpdateDiagnosisUseCase | `server/src/application/use-cases/doctor/UpdateDiagnosisUseCase.ts` | 医生更新诊断 | 3.5 |
| 149 | [P] 实现 PrescriptionUseCase | `server/src/application/use-cases/doctor/PrescriptionUseCase.ts` | 添加/查询/删除处方 | 3.5 |

### 8.3 API 层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 150 | 更新预约路由 | `server/src/routes/appointments.ts` | POST 接受 symptom | 3.2 |
| 151 | 更新医生端路由 | `server/src/routes/doctor/appointments.ts` | 新增 diagnosis/prescription 端点 | 3.5 |
| 152 | [P] 实现诊断请求校验器 | `server/src/validators/doctor.validator.ts` | validateDiagnosis, validatePrescription | 3.5 |

### 8.4 基础设施

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 153 | 更新 PrismaAppointmentRepository | `server/src/infrastructure/repositories/PrismaAppointmentRepository.ts` | 支持 symptom/diagnosis |
| 154 | [P] 实现 PrismaPrescriptionRepository | `server/src/infrastructure/repositories/PrismaPrescriptionRepository.ts` | 实现 IPrescriptionRepository |
| 155 | 更新容器 | `server/src/container.ts` | 注册 PrescriptionRepository |

### 8.5 前端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 156 | [P] 更新前端类型 | `client/src/types/index.ts` | symptom/diagnosis, Prescription 类型 | — |
| 157 | [P] 更新预约 API | `client/src/api/appointments.ts` | createAppointment 支持 symptom | 3.2 |
| 158 | [P] 创建医生端诊断/处方 API | `client/src/api/doctor.ts` | updateDiagnosis, managePrescriptions | 3.5 |
| 159 | 更新 BookingConfirmPage | `client/src/pages/patient/BookingConfirmPage.tsx` | 添加 symptom 输入框 | 3.2 |
| 160 | 更新 DashboardPage | `client/src/pages/doctor/DashboardPage.tsx` | 诊断/处方编辑面板 | 3.5 |
| 161 | 更新 MyAppointmentsPage / AppointmentCard | `client/src/pages/patient/MyAppointmentsPage.tsx` + `client/src/components/appointment/AppointmentCard.tsx` | 显示诊断/处方详情 | 3.3 |

---

## Phase 9: 体验增强（排班日历、就诊历史、资料编辑、处方打印）

> 患者选择医生后可查看月历视图；医生可查看患者历史、编辑个人资料、打印处方；患者可编辑个人信息。

### 9.1 数据库 & 领域层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 162 | Prisma Schema: Doctor 增加 photo 字段 | `server/prisma/schema.prisma` | String? 存储头像 URL | 3.10 |
| 163 | 运行 Prisma 迁移 | `server/prisma/migrations/` | `npx prisma migrate dev` | — |
| 164 | 更新 Doctor 实体 | `server/src/domain/entities/Doctor.ts` | 增加 photo 属性 | 3.10 |
| 165 | [P] 更新 IUserRepository 接口 | `server/src/domain/repositories/IUserRepository.ts` | 增加 update 方法 | 3.10 |

### 9.2 应用层 — Use Case & DTO

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 166 | [P] 创建 Profile DTO | `server/src/application/dtos/profile.dto.ts` | UpdateProfileRequest, UpdateDoctorProfileRequest, PatientHistoryResponse | 3.10 |
| 167 | [P] 实现 UpdateProfileUseCase | `server/src/application/use-cases/auth/UpdateProfileUseCase.ts` | 患者修改姓名/密码，需验原密码 | 3.10 |
| 168 | [P] 实现 UpdateDoctorProfileUseCase | `server/src/application/use-cases/doctor/UpdateDoctorProfileUseCase.ts` | 医生修改职称/简介/照片 | 3.10 |
| 169 | [P] 实现 GetPatientHistoryUseCase | `server/src/application/use-cases/doctor/GetPatientHistoryUseCase.ts` | 查询患者历史预约、诊断、处方 | 3.5 |

### 9.3 API 层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 170 | [P] 实现个人资料路由 | `server/src/routes/profile.ts` | GET/PATCH /api/profile（通用） | 3.10 |
| 171 | [P] 实现医生资料路由 | `server/src/routes/doctor/profile.ts` | GET/PATCH /api/doctor/profile | 3.10 |
| 172 | [P] 实现患者历史路由 | `server/src/routes/doctor/patients.ts` | GET /api/doctor/patients/:id/history | 3.5 |
| 173 | 更新 app.ts 挂载新路由 | `server/src/app.ts` | 挂载 profile, doctor/profile, doctor/patients | — |

### 9.4 前端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 174 | [P] 更新前端类型 | `client/src/types/index.ts` | 增加 UpdateProfileRequest, PatientHistoryResponse 等 | — |
| 175 | [P] 创建用户资料 API | `client/src/api/profile.ts` | updateProfile, updateDoctorProfile | 3.10 |
| 176 | [P] 创建患者 ProfilePage | `client/src/pages/patient/ProfilePage.tsx` | 姓名/密码修改表单 | 3.10 |
| 177 | [P] 创建医生 ProfilePage | `client/src/pages/doctor/ProfilePage.tsx` | 职称/简介/照片编辑 | 3.10 |
| 178 | [P] 创建 PatientHistoryPage | `client/src/pages/doctor/PatientHistoryPage.tsx` | 患者历史时间线 + 诊断/处方 | 3.5 |
| 179 | 更新 BookingPage 添加月视图日历 | `client/src/pages/patient/BookingPage.tsx` | 选择医生后显示月历，高亮排班日 | 3.2-④ |
| 180 | 更新 DashboardPage 添加处方打印 | `client/src/pages/doctor/DashboardPage.tsx` | 处方 Modal 增加打印按钮 | 3.5 |
| 181 | 更新 PatientLayout 添加个人中心入口 | `client/src/components/layout/PatientLayout.tsx` | 导航增加"个人中心" | — |

---

## Phase 10: 消息通知（站内信）

> 系统在关键操作后自动生成站内通知，支持已读/未读管理、未读计数

### 10.1 数据库 & 领域层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 184 | Prisma Schema: 新增 Notification 表 | `server/prisma/schema.prisma` | userId, title, content, relatedUrl?, isRead, createdAt + 索引 | 3.11 |
| 185 | 运行 Prisma 迁移 | `server/prisma/migrations/` | `npx prisma migrate dev` | — |
| 186 | [P] 创建 Notification 实体 | `server/src/domain/entities/Notification.ts` | 含 markAsRead 方法 | 3.11 |
| 187 | [P] 创建 INotificationRepository 接口 | `server/src/domain/repositories/INotificationRepository.ts` | findByUserId（分页、isRead 过滤）、create、markRead、markAllRead、countUnread | 3.11 |

### 10.2 应用层 — Use Case & DTO

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 188 | [P] 创建 Notification DTO | `server/src/application/dtos/notification.dto.ts` | NotificationResponse, NotificationListResponse | 3.11 |
| 189 | [P] 实现 CreateNotificationUseCase | `server/src/application/use-cases/notification/CreateNotificationUseCase.ts` | 创建通知（内部调用） | 3.11 |
| 190 | [P] 实现 ListNotificationsUseCase | `server/src/application/use-cases/notification/ListNotificationsUseCase.ts` | 查询用户通知列表（分页、isRead 过滤） | 3.11 |
| 191 | [P] 实现 MarkNotificationReadUseCase | `server/src/application/use-cases/notification/MarkNotificationReadUseCase.ts` | 单条标记已读 + 全部已读 | 3.11 |
| 192 | [P] 实现 NotificationService | `server/src/application/services/NotificationService.ts` | 封装通知触发方法：onAppointmentCreated, onAppointmentCancelled, onStatusChanged, onDiagnosisUpdated, onPrescriptionAdded | 3.11 |

### 10.3 集成到现有 Use Case

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 193 | 更新 CreateAppointmentUseCase | `server/src/application/use-cases/patient/CreateAppointmentUseCase.ts` | 预约成功后注入通知（通知医生） | 3.11 |
| 194 | 更新 CancelAppointmentUseCase | `server/src/application/use-cases/patient/CancelAppointmentUseCase.ts` | 取消后通知医生 | 3.11 |
| 195 | 更新 UpdateAppointmentStatusUseCase | `server/src/application/use-cases/doctor/UpdateAppointmentStatusUseCase.ts` | 标记已就诊后通知患者 | 3.11 |
| 196 | 更新 UpdateDiagnosisUseCase | `server/src/application/use-cases/doctor/UpdateDiagnosisUseCase.ts` | 更新诊断后通知患者 | 3.11 |
| 197 | 更新 PrescriptionUseCase | `server/src/application/use-cases/doctor/PrescriptionUseCase.ts` | 开药后通知患者 | 3.11 |

### 10.4 API 层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 198 | [P] 实现通知路由 | `server/src/routes/notifications.ts` | GET /api/notifications, PATCH /api/notifications/:id/read, POST /api/notifications/read-all, GET /api/notifications/unread-count | 3.11 |
| 199 | 更新 app.ts 挂载通知路由 | `server/src/app.ts` | 挂载 /api/notifications | — |

### 10.5 基础设施

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 200 | [P] 实现 PrismaNotificationRepository | `server/src/infrastructure/repositories/PrismaNotificationRepository.ts` | 实现 INotificationRepository |
| 201 | 更新容器 | `server/src/container.ts` | 注册 NotificationRepository + NotificationService |

### 10.6 前端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 202 | [P] 更新前端类型 | `client/src/types/index.ts` | 增加 Notification, NotificationListResponse 类型 | — |
| 203 | [P] 创建通知 API service | `client/src/api/notifications.ts` | getNotifications, markRead, markAllRead, getUnreadCount | 3.11 |
| 204 | [P] 创建 NotificationBell 组件 | `client/src/components/notification/NotificationBell.tsx` | 铃铛图标 + Badge 显示未读数 + 下拉通知列表 | 3.11 |
| 205 | [P] 创建通知列表 | `client/src/components/notification/NotificationBell.tsx` | 通知列表集成在 NotificationBell Popover 内（标题、内容、时间、已读/未读、点击跳转） | 3.11 |
| 206 | 更新 PatientLayout | `client/src/components/layout/PatientLayout.tsx` | 导航栏集成 NotificationBell | 3.11 |
| 207 | 更新 DoctorLayout | `client/src/components/layout/DoctorLayout.tsx` | 侧边栏/顶部集成 NotificationBell | 3.11 |
| 208 | 更新 AdminLayout | `client/src/components/layout/AdminLayout.tsx` | 顶部集成 NotificationBell | 3.11 |

## Phase 11: 药品数据库

> 系统预置常用药品数据库，医生开处方时可按分类选择药品，自动填入常用用量和用法。

### 11.1 数据库 & 领域层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 209 | Prisma Schema: 新增 MedicineCategory + Medicine 表 | `server/prisma/schema.prisma` | MedicineCategory(id, name), Medicine(id, categoryId, name, commonDosage, commonMethod) | 3.12 |
| 210 | 运行 Prisma 迁移 | `server/prisma/migrations/` | `npx prisma migrate dev` | — |
| 211 | [P] 创建 MedicineCategory 实体 | `server/src/domain/entities/MedicineCategory.ts` | id, name | 3.12 |
| 212 | [P] 创建 Medicine 实体 | `server/src/domain/entities/Medicine.ts` | id, categoryId, name, commonDosage, commonMethod | 3.12 |
| 213 | [P] 创建 IMedicineCategoryRepository 接口 | `server/src/domain/repositories/IMedicineCategoryRepository.ts` | findAll | 3.12 |
| 214 | [P] 创建 IMedicineRepository 接口 | `server/src/domain/repositories/IMedicineRepository.ts` | findByCategoryId, findAll | 3.12 |

### 11.2 基础设施

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 215 | [P] 实现 PrismaMedicineCategoryRepository | `server/src/infrastructure/repositories/PrismaMedicineCategoryRepository.ts` | 实现 IMedicineCategoryRepository |
| 216 | [P] 实现 PrismaMedicineRepository | `server/src/infrastructure/repositories/PrismaMedicineRepository.ts` | 实现 IMedicineRepository |
| 217 | 更新种子数据 | `server/prisma/seed.ts` | 添加 10 个药品分类和 45 种常用药品 |

### 11.3 API 层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 218 | [P] 实现药品查询路由 | `server/src/routes/medicines.ts` | GET /api/medicine-categories, GET /api/medicines?categoryId= | 3.12 |
| 219 | 更新 app.ts 挂载药品路由 | `server/src/app.ts` | 挂载 /api 下药品路由 | — |

### 11.4 前端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 220 | [P] 更新前端类型 | `client/src/types/index.ts` | 增加 MedicineCategory, Medicine 类型 | — |
| 221 | [P] 创建药品 API service | `client/src/api/medicines.ts` | getMedicineCategories, getMedicines | 3.12 |
| 222 | 更新 DashboardPage | `client/src/pages/doctor/DashboardPage.tsx` | 药品名称输入改为按分类 Select，选择后自动填入用量和用法 | 3.12 |

### 11.5 文档

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 223 | 更新 spec.md | `specs/spec.md` | 添加 3.12 药品管理章节和术语 |
| 224 | 更新 plan.md | `specs/plan.md` | 添加 MedicineCategory/Medicine 表、API 端点、类型、实现顺序 |
| 225 | 更新 tasks.md | `specs/tasks.md` | 添加 Phase 11 全部任务 |

## Phase 12: 检查检验模块

> 医生可开具检查检验单，检验科/管理员录入结果，患者可查看报告。

### 12.1 数据库 & 领域层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 226 | Prisma Schema: 新增 ExaminationItem/Order/OrderItem/Report 表 | `server/prisma/schema.prisma` | 含项目、订单、明细、报告四张表 | 3.13 |
| 227 | 运行 Prisma 迁移 | `server/prisma/migrations/` | `npx prisma migrate dev` | — |
| 228 | [P] 创建 ExaminationItem 实体 | `server/src/domain/entities/ExaminationItem.ts` | id, name, category, departmentId, price, refRange, unit | 3.13 |
| 229 | [P] 创建 ExaminationOrder 实体 | `server/src/domain/entities/ExaminationOrder.ts` | id, appointmentId, patientId, doctorId, status, clinicalDiag | 3.13 |
| 230 | [P] 创建 IExaminationItemRepository 接口 | `server/src/domain/repositories/IExaminationItemRepository.ts` | findAll, findByDepartmentId, findById | 3.13 |
| 231 | [P] 创建 IExaminationOrderRepository 接口 | `server/src/domain/repositories/IExaminationOrderRepository.ts` | create, findById, findByPatientId, updateStatus | 3.13 |
| 232 | [P] 创建 IExaminationReportRepository 接口 | `server/src/domain/repositories/IExaminationReportRepository.ts` | findByOrderId, create | 3.13 |

### 12.2 应用层 & 基础设施

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 233 | [P] 实现 PrismaExaminationItemRepository | `server/src/infrastructure/repositories/PrismaExaminationItemRepository.ts` | 实现 IExaminationItemRepository |
| 234 | [P] 实现 PrismaExaminationOrderRepository | `server/src/infrastructure/repositories/PrismaExaminationOrderRepository.ts` | 实现 IExaminationOrderRepository |
| 235 | [P] 实现 PrismaExaminationReportRepository | `server/src/infrastructure/repositories/PrismaExaminationReportRepository.ts` | 实现 IExaminationReportRepository |
| 236 | [P] 实现 ExaminationUseCase | `server/src/application/use-cases/doctor/ExaminationUseCase.ts` | 开单、查询、录入结果 |

### 12.3 API 层

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 237 | [P] 实现检查检验路由 | `server/src/routes/examinations.ts` | 检查项目查询、开单、报告录入 | 3.13 |
| 238 | 更新 app.ts 挂载检查路由 | `server/src/app.ts` | 挂载 /api/examination* | — |

### 12.4 前端

| # | 任务 | 文件 | 说明 | spec 追踪 |
|---|------|------|------|-----------|
| 239 | [D] 更新前端类型 | `client/src/types/index.ts` | 增加 ExaminationItem, ExaminationOrder 等类型 | — |
| 240 | [D] 创建检查 API service | `client/src/api/examinations.ts` | getItems, createOrder, getOrders, submitReport | 3.13 |
| 241 | [D] 医生开检查单（嵌入 DashboardPage 弹窗） | `client/src/pages/doctor/DashboardPage.tsx` | ✅ 已实现（弹窗形式） | 3.13 |
| 242 | [P] 创建患者查看检查报告页 | `client/src/pages/patient/ExaminationPage.tsx` | 查看报告详情 | 3.13 |

### 12.5 种子数据

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 246 | 更新种子数据 | `server/prisma/seed.ts` | 添加常用检查项目（血常规、尿常规、肝功能、CT、X光等） |

### 补充: 代码实现但未在原始任务中记录的附加功能

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| S1 | 实现文件上传端点 | `server/src/routes/upload.ts` | POST /api/upload，支持医生头像上传，multer 存储 + MIME 校验 |
| S2 | 实现管理端患者列表 | `server/src/routes/admin/patients.ts` | GET /api/admin/patients，管理员/医生可查看所有患者 |
| S3 | 增加检查单通知触发 | `server/src/application/services/NotificationService.ts` | onExaminationOrderCreated，开检查单时通知患者 |
| S4 | Prisma Schema 增加软删除字段 | `server/prisma/schema.prisma` | Department.deletedAt, Schedule.deletedAt, Prescription.deletedAt |
| S5 | Prisma Schema 增加遗漏关联 | `server/prisma/schema.prisma` | User.notifications, Department.examinationItems, Appointment.examinationOrders |

### 阶段间并行说明

| 并行组 | 可同时进行 |
|--------|-----------|
| Group A | Phase 1 后端 + 前端基础工程（#1-#16，完全并行） |
| Group B | Phase 2 全部枚举/实体/仓储接口（#17-#38，大部分并行） |
| Group C | Phase 3 DTO + Use Case 测试/实现 + Phase 5 仓储实现（#39-#64, #95-#107，仓储接口已知即可并行） |
| Group D | Phase 4 API 测试 + 实现（#65-#92，依赖 Phase 3 Use Case 完成） |
| Group E | Phase 6 全部前端页面（#108-#138，依赖 API 契约但可 mock 先行） |

---

## 任务统计

| 阶段 | 测试任务数 | 已实现 | 实现任务数 | 已实现 |
|------|-----------|--------|-----------|--------|
| Phase 1: Foundation & Skeleton | 0 | — | 16 | 16 |
| Phase 2: Domain Model & Domain Tests | 11 | 11 | 12 | 12 |
| Phase 3: Application Use Cases & Tests | 9 | 9 | 10 | 10 |
| Phase 4: API Contracts & Web API | 10 | 10 | 18 | 17 |
| Phase 5: Infrastructure & Integration | 6 | 0 | 7 | 6 |
| Phase 6: Frontend UI & Interaction | 0 | — | 31 | 31 |
| Phase 8: 病情描述与诊断开药 | 0 | — | 19 | 19 |
| Phase 9: 体验增强 | 2 | 0 | 20 | 20 |
| Phase 10: 消息通知 | 0 | — | 21 | 21 |
| Phase 11: 药品数据库 | 0 | — | 17 | 17 |
| Phase 12: 检查检验模块 | 0 | — | 21 | 17 |
| 补充: 代码附加功能 | 0 | — | 5 | 5 |
| **总计** | **38** | **30** | **197** | **191** |
