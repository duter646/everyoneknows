# EveryoneKnows 部署指南 (Supabase 版)

本项目已从本地 Express 架构迁移至 **Supabase (PostgreSQL + Edge Functions)** 架构，以实现更好的伸缩性和更简单的部署。

## 1. 数据库设置

1. 在 [Supabase Console](https://app.supabase.com/) 创建新项目。
2. 进入 **SQL Editor**，运行项目中的 [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) 脚本。
   - 这将创建 `questions` 和 `leaderboard` 表。
   - 同时开启了行级安全性 (RLS) 并配置了基本的读写策略。

## 2. 后端部署 (Edge Functions)

确保本地已安装 [Supabase CLI](https://supabase.com/docs/guides/cli)。

1. 登录 Supabase：
   ```bash
   supabase login
   ```
2. 链接项目 (需 Project ID，在 Project Settings -> General 获取)：
   ```bash
   supabase link --project-ref your-project-id
   ```
3. 部署函数：
   ```bash
   supabase functions deploy --no-verify-jwt
   ```
   *注意：项目目前在逻辑层校验数据，因此使用 `--no-verify-jwt` 允许公开访问函数，内部通过 `_shared/cors.ts` 正确处理跨域。*

## 3. 前端部署 (Vite)

1. 进入 `web` 目录：
   ```bash
   cd web
   ```
2. 创建 `.env` 文件并填入你的 Supabase 信息 (从 Project Settings -> API 获取)：
   ```env
   VITE_SUPABASE_URL=你的_SUPABASE_PROJECT_URL
   VITE_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
   ```
3. 构建并发布：
   ```bash
   npm install
   npm run build
   ```
   你可以将 `dist` 文件夹部署到 Vercel, Netlify, Cloudflare Pages 或 GitHub Pages。

## 4. 题库导入

1. 启动本地前端：`npm run dev`。
2. 访问 `/admin` 页面。
3. 使用“初始化题库”功能。它会自动扫描 `data/*.json` 文件并将题目批量同步到 Supabase `questions` 表。

---

## 环境变量说明

- **VITE_SUPABASE_URL**: Supabase 项目 API 地址。
- **VITE_SUPABASE_ANON_KEY**: 匿名访问 Key。
- **SUPABASE_SERVICE_ROLE_KEY**: (仅用于 Admin 或本地迁移脚本) 具有绕过 RLS 权限的 Key。
