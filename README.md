# 医院门诊挂号诊断系统 (Hospital Outpatient Registration & Diagnosis System)

基于 React + Express + Prisma + MySQL 的医院门诊管理系统，支持患者在线挂号、医生工作站、管理员后台三大核心模块。

## 目录

- [项目结构](#项目结构)
- [核心特性](#核心特性)
- [安装指南](#安装指南)
- [使用方法](#使用方法)
- [构建方法](#构建方法)
- [API 概览](#api-概览)

## 项目结构

```
hospital/
├── client/                # React 前端 (Vite 6 + Ant Design 5)
├── server/                # Express 后端 (TypeScript + Prisma)
│   ├── src/
│   │   ├── app.ts                 # Express 应用入口
│   │   ├── index.ts               # 服务器启动
│   │   ├── container.ts           # DI 容器
│   │   ├── config/                # 环境配置
│   │   ├── middleware/            # auth, roleGuard, errorHandler
│   │   ├── routes/                # API 路由 (auth, admin, doctor, patient)
│   │   ├── validators/            # 请求校验
│   │   ├── utils/                 # JWT 工具
│   │   ├── domain/                # 领域层 (entities, enums, services, repository interfaces)
│   │   ├── application/           # 应用层 (use-cases, dtos, services)
│   │   └── infrastructure/        # 基础设施 (Prisma repositories, database)
│   ├── prisma/
│   │   ├── schema.prisma          # 数据模型 (12 个模型)
│   │   ├── migrations/            # 数据库迁移
│   │   └── seed.ts                # 种子数据
│   └── tests/                     # 30 个测试文件
├── specs/                # 系统规格文档
└── README.md
```

## 核心特性

### 患者端
- **在线挂号**：按科室→医生→日期→时段完成预约
- **就诊管理**：查看预约列表、取消预约（仅待就诊状态）
- **检查报告**：在线查看检查检验报告
- **个人中心**：修改姓名、密码
- **消息通知**：预约确认、取消等系统通知

### 医生端
- **工作台**：当日待诊患者列表、接诊/完成/爽约操作
- **诊断管理**：填写诊断、开具处方（带常用药品库）、打印处方
- **开检查单**：选择检查项目、打印检查单
- **患者历史**：查看患者历史就诊记录
- **个人资料**：修改职称、简介、照片

### 管理员端
- **科室管理**：CRUD + 启用/停用
- **医生管理**：CRUD + 创建账号
- **排班管理**：日历视图 + 批量创建、近期待办/历史排班
- **数据统计**：预约量统计、科室统计、取消率统计
- **患者管理**：查看患者列表

### 技术栈

| 层面 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite 6 |
| UI | Ant Design 5 + @ant-design/icons |
| 状态管理 | Zustand 5 |
| 后端 | Express 4 + TypeScript |
| 数据库 ORM | Prisma 5 + MySQL 8 |
| 认证 | JWT (7天有效期) + bcryptjs |
| 文件上传 | multer (5MB, image/*) |
| 测试 | Vitest + Supertest (30 文件) |
| Node | >= 18 |

## 安装指南

### 前置要求

- Node.js >= 18
- MySQL 8.0+
- npm

### 步骤

```bash
# 1. 克隆项目
git clone <repo-url>
cd hospital

# 2. 安装后端依赖
cd server
npm install

# 3. 安装前端依赖
cd ../client
npm install
cd ..

# 4. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env，修改数据库连接信息:
#   DATABASE_URL="mysql://root:yourpassword@localhost:3306/hospital"
#   JWT_SECRET="your-jwt-secret"
#   PORT=3001

# 5. 创建数据库
mysql -u root -p -e "CREATE DATABASE hospital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 6. 运行数据库迁移
cd server
npx prisma migrate deploy

# 7. 生成 Prisma 客户端
npx prisma generate

# 8. 导入种子数据
npm run prisma:seed
```

### 种子账号

| 角色 | 手机号 | 密码 |
|------|--------|------|
| 管理员 | 13800000000 | admin123 |
| 医生(李文) | 13800000001 | 123456 |
| 医生(王芳) | 13800000002 | 123456 |
| 医生(张强) | 13800000003 | 123456 |
| 医生(刘洋) | 13800000004 | 123456 |
| 医生(陈静) | 13800000005 | 123456 |
| 患者(赵明) | 13900000001 | 123456 |

种子数据包含：8 个科室、5 名医生、5 名患者、7 天排班、10 个药品分类 + 44 种药品、14 个检查项目。

## 使用方法

### 启动开发服务器

需要同时启动后端和前端。

#### 终端 1 — 后端 (端口 3001)

```bash
cd server
npm run dev
```

启动后自动监听文件变更并重启，日志输出到控制台。

#### 终端 2 — 前端 (端口 5173)

```bash
cd client
npm run dev
```

Vite 开发服务器自带热更新，API 请求 `/api/*` 自动代理到 `localhost:3001`。

浏览器打开 `http://localhost:5173` 即可使用。

### 命令行脚本

#### 后端 (server/)

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（ts-node-dev，热重载） |
| `npm run build` | TypeScript 编译到 `dist/` |
| `npm start` | 运行编译后的 `dist/index.js` |
| `npm test` | 运行全部测试（Vitest） |
| `npm run test:watch` | 监听模式运行测试 |
| `npm run prisma:generate` | 生成 Prisma Client |
| `npm run prisma:migrate` | 创建新的迁移（开发用） |
| `npm run prisma:seed` | 导入种子数据 |

#### 前端 (client/)

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 (端口 5173) |
| `npm run build` | TypeScript 检查 + Vite 构建到 `dist/` |
| `npm run preview` | 预览生产构建 |

### 数据库迁移管理

```bash
# 开发环境 — 创建新迁移（修改 schema.prisma 后运行）
cd server
npx prisma migrate dev --name 迁移描述

# 生产环境 — 应用已有迁移
npx prisma migrate deploy

# 重置数据库（清空数据 + 重新迁移 + 种子）
npx prisma migrate reset

# 直接同步 Schema（不创建迁移）
npx prisma db push
```

### 环境变量 (`server/.env`)

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `DATABASE_URL` | 是 | — | MySQL 连接字符串 |
| `JWT_SECRET` | 是 | — | JWT 签名密钥 |
| `PORT` | 否 | 3001 | 后端监听端口 |

## 构建方法

### 生产构建

```bash
# 构建后端
cd server
npm run build

# 构建前端
cd ../client
npm run build
```

### 生产运行

```bash
# 方式一：后端独立运行
cd server
npm start

# 方式二：前端预览（需先 build）
cd client
npm run preview
```

生产部署时，需将 `client/dist/` 目录通过反向代理（如 Nginx）提供服务，或将静态文件交由后端 Express 托管。开发模式下 Vite 自动处理代理转发。

## API 概览

全部 API 统一响应格式：`{ code: number, data: any, message: string }`

| 路径 | 方法 | 说明 | 鉴权 |
|------|------|------|------|
| `/api/auth/register` | POST | 患者注册 | 否 |
| `/api/auth/login` | POST | 登录 | 否 |
| `/api/auth/me` | GET | 当前用户信息 | 是 |
| `/api/departments` | GET | 科室列表 | 否 |
| `/api/departments/:id/doctors` | GET | 科室下医生列表 | 否 |
| `/api/doctors/:id/schedules` | GET | 医生排班 | 否 |
| `/api/appointments` | POST/GET | 创建/查询预约 | 患者 |
| `/api/appointments/:id/cancel` | PATCH | 取消预约 | 患者 |
| `/api/doctor/appointments` | GET | 医生预约列表 | 医生 |
| `/api/doctor/appointments/:id/status` | PATCH | 更新就诊状态 | 医生 |
| `/api/doctor/appointments/:id/diagnosis` | PATCH | 填写诊断 | 医生 |
| `/api/doctor/appointments/:id/prescriptions` | POST/DELETE | 处方管理 | 医生 |
| `/api/doctor/patients/:id/history` | GET | 患者历史就诊 | 医生 |
| `/api/upload` | POST | 上传图片 | 是 |
| `/api/notifications` | GET/PATCH | 通知管理 | 是 |
| `/api/notifications/unread-count` | GET | 未读通知数 | 是 |
| `/api/notifications/read-all` | POST | 全部已读 | 是 |
| `/api/examination-items` | GET | 检查项目列表 | 是 |
| `/api/examination-orders` | POST/GET | 检查单管理 | 是 |
| `/api/examination-orders/:id/report` | POST | 录入报告 | 管理员 |
| `/api/medicine-categories` | GET | 药品分类 | 否 |
| `/api/medicines` | GET | 药品列表 | 否 |
| `/api/admin/departments` | CRUD | 科室管理 | 管理员 |
| `/api/admin/doctors` | CRUD | 医生管理 | 管理员 |
| `/api/admin/schedules` | CRUD | 排班管理 | 管理员 |
| `/api/admin/statistics` | GET | 数据统计 | 管理员 |
| `/api/admin/patients` | GET | 患者列表 | 管理员 |
| `/api/profile` | GET/PATCH | 个人资料 | 是 |

完整 API 文档见 `specs/plan.md`。
