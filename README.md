# Devin's Nest - Backstage

> 🚀 Built with `https://react.dev/` & `https://tailwindcss.com/`

**Devin's Nest** 的后台管理系统，旨在为个人主页提供强大的内容管理能力。基于 React + Ant Design 构建，追求极致的性能、优雅的 UI 设计和优秀的用户体验。支持博客文章管理、日常碎片记录、数据统计与分析等功能。

## ✨ 功能特性

- 🌐 **响应式设计**: 部分页面使用响应式网格，完整移动端适配仍需验证。
- 🎨 **现代化 UI**: 采用 Ant Design 结合 Tailwind CSS，打造精致的暗色/深色主题。
- 📝 **Markdown 编辑器**: 内置双栏 Markdown 编辑器，支持实时预览、图片粘贴上传、自定义样式。
- 🧱 **碎片化记录**: 提供结构化的日常碎片 (Snippet) 编辑器，支持文本、图片、图集、引用四种 Block 类型。
- 📊 **数据可视化**: 集成仪表盘 (Dashboard)，直观展示博客、碎片、分类、标签等统计数据。
- 🔐 **安全认证**: 简单的登录认证机制，保护后台数据安全。
- 🚀 **自动部署**: 通过 Cloudflare Pages 关联 GitHub 自动发布，保留 Docker 备用部署方案。

## 🗺️ 文档导航

- Agent 协作入口：[AGENTS.md](AGENTS.md)
- 实现与执行地图：[harness/MAP.md](harness/MAP.md)
- 需求入口：[requirements/MAP.md](requirements/MAP.md)
- 设计入口：[design/MAP.md](design/MAP.md)
- 发布与接口资料：[docs/MAP.md](docs/MAP.md)

按任务逐层读取相关文档，无需一次加载全部资料。

## 🛠️ 技术栈

- **Core**: `https://react.dev/` (v19)
- **Language**: `https://www.typescriptlang.org/`
- **Build Tools**: Vite
- **UI Framework**: `https://ant.design/` (v6)
- **Styling**: `https://tailwindcss.com/`
- **State Management**: `https://github.com/pmndrs/zustand`
- **Data Fetching**: `https://alova.js.org/`
- **Charts**: `https://ant-design-charts.antgroup.com/`
- **Editor**: `https://github.com/HarryChen0506/react-markdown-editor-lite` + `https://github.com/markdown-it/markdown-it`

## 📦 开发

```bash
# 1. 克隆项目
git clone https://github.com/Devinyy/devinnest-backstage.git

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 构建与部署

```bash
# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

## 📄 目录结构

```
├── public/                 # 静态资源 (favicon, robots.txt)
├── src/
│   ├── assets/             # 项目静态资源 (图片, SVG)
│   ├── components/         # 公共组件
│   │   └── RequireAuth.tsx # 登录路由保护
│   ├── pages/              # 页面组件
│   │   ├── Dashboard/      # 仪表盘首页
│   │   ├── Blogs/          # 博客管理 (列表, 新增/编辑)
│   │   ├── Snippets/       # 碎片管理 (列表, 新增/编辑)
│   │   ├── Login/          # 登录页
│   │   └── NotFound/       # 404 页面
│   ├── layouts/            # 主布局与导航
│   ├── api/                # 按业务封装接口
│   ├── stores/             # Zustand 状态管理
│   ├── utils/              # 工具函数
│   │   ├── request.ts      # alova 请求封装
│   │   └── ...
│   ├── App.tsx             # 根组件 (路由配置)
│   └── main.tsx            # 入口文件
├── AGENTS.md               # 协作规则与场景入口
├── harness/                # 实现、决策、验证与场景地图
├── requirements/           # 需求地图
├── design/                 # 设计资料地图
├── docs/                   # 发布与接口资料地图
├── docker-compose.yml      # 备用 Docker 编排配置
├── Dockerfile              # Docker 构建文件
├── deploy.sh               # 备用服务器部署脚本
├── nginx.conf              # Nginx 配置文件
├── postcss.config.js       # Tailwind CSS / PostCSS 配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖配置
```

## ⚠️ 注意事项

1.  **Node 版本**: 使用 Node.js 20（与 `.nvmrc` 一致，`package.json` 要求 ≥20）。
2.  **环境变量**: 发布前核对 `.env.production` 与 Cloudflare Pages 的生产环境变量。
3.  **备用服务器部署**: 仅使用 Docker 方案时，才需要检查 `deploy.sh` 的服务器配置及服务器上的 Docker / Compose 环境。

## 📅 后续规划 (Roadmap)

- [x] **基础架构搭建**: React + Vite + TypeScript + Tailwind CSS 环境配置。
- [x] **UI 框架集成**: Ant Design v6 + 暗色主题适配。
- [x] **核心页面开发**: 仪表盘、博客列表/详情、碎片列表/详情、登录页、404 页。
- [x] **Markdown 编辑器**: 集成双栏预览、图片粘贴上传、自定义渲染插件。
- [x] **碎片编辑器**: 实现基于 Block 的结构化数据编辑 (文本/图片/图集/引用)。
- [x] **数据请求封装**: 集成 alova，实现统一的请求拦截和错误处理。
- [x] **Docker 部署**: 编写 Dockerfile 和 docker-compose.yml，支持一键部署。
- [ ] **富文本支持**: 探索更丰富的 Markdown 渲染插件 (如数学公式、图表)。
- [ ] **多用户支持**: (远期规划) 支持多用户管理和权限控制。

## 🚀 部署指南

### 当前发布方式：Cloudflare Pages 自动部署

以下配置根据 2026-11-06 的 Cloudflare 控制台截图及用户补充确认。配置保存在 Cloudflare 控制台，仓库中的 Docker 文件不参与此发布流程。

| 配置项 | 当前值 |
| --- | --- |
| Pages 项目 | `devinnest-backstage` |
| GitHub 仓库 | `Devinyy/DevinNest-Backstage` |
| 生产分支 | `main` |
| 自动部署 | 生产分支为 `main`；当前功能分支已观察到自动预览部署 |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| 根目录 | 未单独指定（项目根目录） |
| 构建监视包含路径 | `*` |
| 构建缓存 | 已禁用 |
| 构建系统 | 版本 3 |
| 构建注释 | 已启用 |
| 部署挂钩 | 未定义 |
| 正式访问地址（主要入口） | https://devinnest-backstage.top |
| Pages 默认地址 | https://devinnest-backstage.pages.dev |
| 生产 API 变量来源 | 仓库 `.env.production`，Cloudflare 未配置 `VITE_API_BASE_URL` 覆盖值 |

用户已确认绑定的正式域名为 `https://devinnest-backstage.top`，生产 API 使用仓库 `.env.production`。此前用户认为仅部署 `main`；2026-11-06 PR #11 的 Cloudflare 检查实际成功创建了 `codex/harness-progressive-docs` 分支预览。因此生产发布仍以 `main` 为准，但至少当前功能分支支持自动预览；其他分支的具体匹配规则需以控制台配置为准。

**发布步骤**：

1. 本地使用 Node.js 20 安装依赖，完成修改后执行检查：
   ```bash
   npm ci
   npm run lint
   npm run build
   ```
   `build` 会先执行 `tsc -b`，再执行 `vite build`，输出到 `dist/`。本地 lint 是发布前检查，不在当前 Cloudflare 构建命令中。
2. 提交代码并通过 PR 合并到 `main`，或推送到 `main`，触发生产自动部署。
3. Cloudflare 拉取代码、安装依赖，执行 `npm run build`，构建成功后发布 `dist/` 到 Pages 默认域名及绑定域名。
4. 进入 Cloudflare → Workers 和 Pages → `devinnest-backstage` → 部署，确认本次提交对应的构建和部署成功；失败时查看构建日志。
5. 访问线上站点，验证登录、博客与碎片列表、新建/编辑保存、图片上传，以及深层路由刷新。

**生产 API 配置**：

- 仓库 `.env.production` 中的 `VITE_API_BASE_URL` 为 `https://devinnest-api.top:8443/api/`。
- API 地址在构建时写入前端产物；修改后需要重新构建部署。用户已确认 Cloudflare 未配置 `VITE_API_BASE_URL`，当前使用仓库 `.env.production`。
- 生产前端直接访问上述后端地址，需确保后端 HTTPS、证书及跨域配置正常；本地 Vite 的 `/api` 代理只用于开发环境。

日常 Cloudflare 发布无需运行 `deploy.sh`，也无需在服务器上构建 Docker 镜像。

### 旧服务器部署：使用 Shell 脚本

用户于 2026-11-06 确认 `http://47.103.9.13:8080` 仍在使用，但可能已停止更新。具体运行版本、最后更新时间与在线健康状态未核实；Cloudflare 自动发布不会同步更新此实例。以下保留其手动更新方式，不将其视为已验证的备用环境。

项目内置了 `deploy.sh` 脚本，可将本地代码一键同步并部署到服务器。

**步骤**:

1.  修改 `deploy.sh` 中的服务器配置信息：
    ```bash
    SERVER_IP="47.103.9.13"           # 您的服务器公网 IP
    SERVER_USER="root"                # 服务器用户名
    PROJECT_DIR="/opt/devinnestback" # 服务器上存放项目的路径
    ```
2.  在终端运行脚本：
    ```bash
    bash deploy.sh
    ```

**脚本功能**:

*   本地构建项目 (`npm run build`)。
*   通过 rsync 同步项目（包含 `dist/`、源码和 Docker 配置，排除项以脚本为准），并使用 `--delete` 清理远端对应文件。
*   在服务器上自动重启 Docker 容器。

注意：当前脚本的本地构建失败退出逻辑被注释，使用前应先确认本地构建成功；此备用流程没有自动健康检查和版本回滚。

### 备用方式二：手动 Docker 部署

```bash
# 1. 先生成 dist（Dockerfile 不负责前端构建）
npm run build

# 2. 构建镜像
docker build -t devinnestback:latest .

# 3. 运行容器
docker run -d -p 8080:80 --name devinnestback devinnestback:latest
```

## 📃 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

-   `https://github.com/idealclover/homepage` - 灵感来源
-   `https://react.dev/` - 构建用户界面的库
-   `https://ant.design/` - 企业级 UI 设计语言和 React 组件库
-   `https://tailwindcss.com/` - 实用优先的 CSS 框架

## 👨‍💻 二创 Devin

-   正式后台地址： https://devinnest-backstage.top
-   Pages 默认地址： https://devinnest-backstage.pages.dev
-   旧服务器地址： `http://47.103.9.13:8080`（用户确认仍使用，可能停止更新；版本与健康状态未核实）
-   GitHub： `https://github.com/Devinyy`
-   1010732441@qq.com

欢迎访问我的个人主页了解更多信息~

如果你喜欢这个项目，别忘了给个 Star ⭐️
