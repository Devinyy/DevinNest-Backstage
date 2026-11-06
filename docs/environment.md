# 开发环境与排查入口

来源：package.json、.nvmrc、vite.config.ts、环境文件及已有部署配置；没有执行线上探测。

## 本地启动

1. 使用 Node.js 20；`npm ci` 按 package-lock.json 安装依赖。
2. 本地后端需在 `http://127.0.0.1:8000` 提供带 `/api` 前缀的接口，本仓库不含后端实现；用户提供的后端目录为 `/Users/zhangxiang/my_project/DevinNest-Backend`，本地代码核对见 [记录](backend-evidence.md)。
3. 执行 `npm run dev`，访问终端输出的地址；不要把 Vite 默认端口写成环境保证，端口可能被占用。
4. 联调登录需后端公钥与有效账号；不要使用仓库中的 PEM 文件替代登录接口返回的公钥。

## 构建与预览

`npm run build` 使用生产构建环境并输出 dist；`npm run preview` 服务已构建产物，不运行开发代理。VITE_ 变量会进入浏览器产物，不放密码或私钥。

发布步骤和 Cloudflare 配置仅维护在 [README 发布指南](../README.md#-部署指南)。仓库未发现 .github 工作流或 Wrangler 配置；截图确认的 Pages 设置存在控制台。

## 常见问题定位

| 现象 | 先检查 |
| --- | --- |
| 本地 API 失败 | 后端是否启动、请求前缀、Vite 代理、浏览器网络记录 |
| 登录失败 | 公钥接口、RSA 加密返回值、登录响应 code / data、Token；不输出密码和 Token |
| 刷新后登录状态异常 | auth-storage 持久化值、后端 Token 有效性；当前未自动校验 me |
| 线上 API / 图片失败 | 构建 API 地址、Cloudflare 覆盖变量、后端 HTTPS / CORS、URL 标准化 |
| 深层路由刷新失败 | Pages 产物中的 _redirects；备用 Nginx 的 try_files |
| 页面未更新 | 部署对应提交是否成功、当前访问域名、浏览器缓存；不要仅凭脚本提示认定发布成功 |

故障资料只记录脱敏后的状态、错误与必要路径，不复制密钥、完整认证头或用户密码。
