# 项目资料地图

| 任务 | 入口 | 来源与边界 |
| --- | --- | --- |
| 开发启动、生产构建 | [README.md](../README.md) | Node 和脚本以 package.json、.nvmrc 为准 |
| Cloudflare 发布 | [README 发布指南](../README.md#-部署指南) | 2026-11-06 控制台截图及用户补充确认；用户确认仅部署 main，其他分支无自动预览 |
| 旧 Docker 服务 / 手动部署 | README 同节、deploy.sh、Dockerfile、docker-compose.yml、nginx.conf | 用户确认仍在使用，可能停止更新；不参与 Cloudflare 自动发布 |
| 开发环境 / 问题定位 | [environment.md](environment.md) | 本地配置与排查入口，不含在线验证 |
| API 调用约定与边界 | [api-integration.md](api-integration.md) | 从 request 与各业务 API 提取 |
| 后端代码事实与差距 | [backend-evidence.md](backend-evidence.md) | 本地后端 feature/backend-v2.0 / 33f612b，只读核对，非线上验证 |
| API 联调 | [API_DOCS.md](../API_DOCS.md) | 按标题定位单个模块，结合 src/api 对应文件核对 |
| Agent 协作与项目事实 | [harness/MAP.md](../harness/MAP.md) | 按场景逐层读取 |

发布信息只在 README 维护详细配置，本目录和 harness 使用链接，不复制整份配置表。新增专项资料时登记入口；移动既有文档必须同步所有引用。
