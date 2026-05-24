# 医院门诊挂号诊断系统

## 下载与运行

```bash
git clone https://github.com/你的用户名/仓库名.git
cd hospital

# 安装依赖
cd server; npm install; cd ..
cd client; npm install; cd ..

# 配置数据库
copy server\.env.example server\.env
# 编辑 server\.env，修改 DATABASE_URL 中的密码

# 创建数据库
mysql -u root -p -e "CREATE DATABASE hospital;"

# 建表并填充数据
cd server
npx prisma migrate dev
npx prisma db seed
```

## 启动

终端 1（后端）：
```bash
cd server; npm run dev
```

终端 2（前端）：
```bash
cd client; npm run dev
```

浏览器打开 `http://localhost:5173`
