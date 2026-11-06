# 当前实现地图

以下是代码事实摘要，不是未来需求。依赖版本以 `package.json` 为准。

## 应用与页面

- 入口：[main.tsx](../src/main.tsx)；路由和 Ant Design 暗色主题：[App.tsx](../src/App.tsx)。
- 框架：React 19、TypeScript、Vite 6、Ant Design 6、Tailwind CSS 4。
- 布局：[MainLayout.tsx](../src/layouts/MainLayout.tsx)。
- 页面：`src/pages/Login/`、`Dashboard/`、`Blogs/`、`Snippets/`、`NotFound/`；博客与碎片的 `Create.tsx` 分别复用新建和编辑逻辑。
- 路由：`/login`、`/`、`/blogs`、`/blogs/create`、`/blogs/edit/:id`、`/snippets`、`/snippets/create`、`/snippets/edit/:id` 及通配 404。

## 请求与认证

- 请求：[request.ts](../src/utils/request.ts)，Alova + Fetch，注入 Bearer Token，统一处理业务响应与错误。
- 认证状态：[authStore.ts](../src/stores/authStore.ts)，Zustand persist；路由保护：[RequireAuth.tsx](../src/components/RequireAuth.tsx)。
- 接口封装：`src/api/`，包含 auth、dashboard、blogs、snippets、taxonomy、common、ai、projects。接口模块存在不代表有对应管理页面。
- URL 标准化：[normalizeHttpsUrls.ts](../src/utils/normalizeHttpsUrls.ts)。接口约定按 [API 文档](../API_DOCS.md) 的相关模块读取，并与调用代码核对。

## 样式与资源

- 全局样式：[index.css](../src/index.css)；组件主题位于 App.tsx；静态资源位于 `public/` 和 `src/assets/`。
- `src/web-design-pattern.md` 是 Markdown 示例资料，不是已确认的项目视觉规范。

## 环境与发布

- Node 20：`.nvmrc`；检查与构建命令见 [验证规范](test-spec.md)。
- 开发 `/api` 由 [vite.config.ts](../vite.config.ts) 代理到本地后端；生产 API 值来自构建环境。
- 当前生产走 Cloudflare Pages，`main` 自动部署；详细配置只维护于 [README 发布指南](../README.md#-部署指南)。
- [public/_redirects](../public/_redirects) 提供 Pages 的 SPA 回退。
- `deploy.sh`、Dockerfile、docker-compose.yml、nginx.conf 属旧服务器的手动部署方案；用户确认旧服务仍在使用，但可能已停止更新，不与 Cloudflare 同步发布。

## 模块与数据流

| 模块 | 阅读入口 | 数据流 / 依赖 |
| --- | --- | --- |
| 登录 | [认证基线](../requirements/modules/auth.md) | 公钥 → JSEncrypt → login → authStore → 路由跳转 |
| 首页 | [首页基线](../requirements/modules/dashboard.md) | 并发 stats / categories / tags → 卡片、动态、词云、管理弹窗 |
| 博客 | [博客基线](../requirements/modules/blogs.md) | 列表分页 → 详情 / 编辑 → categoryId / tagIds → create 或 update |
| 碎片 | [碎片基线](../requirements/modules/snippets.md) | 列表 → 详情 → 本地块数组与元数据 → create 或 update |

页面一般以 useState / useEffect 管理本地请求和编辑状态；未发现统一的实体缓存层。只有认证放在 Zustand 中。博客编辑器和碎片块编辑器是各自 Create.tsx 内的局部组件，尚未拆为共享组件。

## 请求处理边界

具体调用和错误处理见 [联调说明](../docs/api-integration.md)。成功链统一按 JSON envelope 解包，递归改写以 http:// 开头的字符串。401 没有统一登出；布局退出仅本地操作。下载辅助方法不能按其注释认定支持 Blob。

## 编译与工程配置

- tsconfig.app.json 启用 strict、noUnusedLocals、noUnusedParameters 和 bundler 模块解析；前端范围为 src。
- eslint.config.js 使用 TypeScript、React Hooks 和 React Refresh 规则，忽略 dist。
- postcss.config.js 接入 @tailwindcss/postcss 和 autoprefixer；没有 tailwind.config.js。
- 仓库不包含后端工程，空的本地 tests 目录未提供测试能力；Cloudflare 控制台配置未作为 IaC 纳入仓库。
