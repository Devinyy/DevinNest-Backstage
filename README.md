# Devin's Nest - Backstage

> 🚀 Built with `https://react.dev/` & `https://tailwindcss.com/`

**Devin's Nest** 的后台管理系统，旨在为个人主页提供强大的内容管理能力。基于 React + Ant Design 构建，追求极致的性能、优雅的 UI 设计和优秀的用户体验。支持博客文章管理、日常碎片记录、数据统计与分析等功能。

## ✨ 功能特性

- 🌐 **响应式设计**: 适配手机/平板/电脑不同设备，Mobile-First 策略。
- 🎨 **现代化 UI**: 采用 Ant Design 结合 Tailwind CSS，打造精致的暗色/深色主题。
- 📝 **Markdown 编辑器**: 内置双栏 Markdown 编辑器，支持实时预览、图片粘贴上传、自定义样式。
- 🧱 **碎片化记录**: 提供结构化的日常碎片 (Snippet) 编辑器，支持文本、图片、引用等多种 Block 类型。
- 📊 **数据可视化**: 集成仪表盘 (Dashboard)，直观展示博客、碎片、分类、标签等统计数据。
- 🔐 **安全认证**: 简单的登录认证机制，保护后台数据安全。
- 🚀 **Docker 部署**: 支持 Docker 一键部署，开箱即用。

## 🛠️ 技术栈

- **Core**: `https://react.dev/` (v18)
- **Language**: `https://www.typescriptlang.org/`
- **Build Tools**: Vite
- **UI Framework**: `https://ant.design/` (v5)
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
│   │   ├── Layout/         # 布局组件 (Sidebar, Header)
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── Dashboard/      # 仪表盘首页
│   │   ├── Blogs/          # 博客管理 (列表, 新增/编辑)
│   │   ├── Snippets/       # 碎片管理 (列表, 新增/编辑)
│   │   ├── Login/          # 登录页
│   │   └── NotFound/       # 404 页面
│   ├── store/              # Zustand 状态管理
│   ├── utils/              # 工具函数
│   │   ├── request.ts      # alova 请求封装
│   │   └── ...
│   ├── App.tsx             # 根组件 (路由配置)
│   └── main.tsx            # 入口文件
├── docker-compose.yml      # Docker 编排配置
├── Dockerfile              # Docker 构建文件
├── deploy.sh               # 自动部署脚本
├── nginx.conf              # Nginx 配置文件
├── tailwind.config.js      # Tailwind CSS 配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖配置
```

## ⚠️ 注意事项

1.  **Node 版本**: 建议使用 Node.js v18+。
2.  **环境变量**: 生产环境部署时，请检查 `deploy.sh` 中的服务器 IP 和路径配置。
3.  **Docker**: 确保服务器已安装 Docker 和 Docker Compose。

## 📅 后续规划 (Roadmap)

- [x] **基础架构搭建**: React + Vite + TypeScript + Tailwind CSS 环境配置。
- [x] **UI 框架集成**: Ant Design v5 + 暗色主题适配。
- [x] **核心页面开发**: 仪表盘、博客列表/详情、碎片列表/详情、登录页、404 页。
- [x] **Markdown 编辑器**: 集成双栏预览、图片粘贴上传、自定义渲染插件。
- [x] **碎片编辑器**: 实现基于 Block 的结构化数据编辑 (文本/图片/引用/代码)。
- [x] **数据请求封装**: 集成 alova，实现统一的请求拦截和错误处理。
- [x] **Docker 部署**: 编写 Dockerfile 和 docker-compose.yml，支持一键部署。
- [ ] **富文本支持**: 探索更丰富的 Markdown 渲染插件 (如数学公式、图表)。
- [ ] **多用户支持**: (远期规划) 支持多用户管理和权限控制。

## 🐳 部署指南

### 方式一：使用 Shell 脚本一键部署 (推荐)

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
    sh deploy.sh
    ```

**脚本功能**:

*   本地构建项目 (`npm run build`)。
*   将构建产物 (`dist/`) 和 Docker 配置同步到服务器。
*   在服务器上自动重启 Docker 容器。

### 方式二：手动 Docker 部署

```bash
# 1. 构建镜像
docker build -t devinnestback:latest .

# 2. 运行容器
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

-   网站： `http://47.103.9.13:8080` (当前部署地址)
-   GitHub： `https://github.com/Devinyy`
-   1010732441@qq.com

欢迎访问我的个人主页了解更多信息~

如果你喜欢这个项目，别忘了给个 Star ⭐️
