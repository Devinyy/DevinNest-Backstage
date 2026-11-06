# 前端接口联调说明

本页以调用代码为依据补充现有 [API_DOCS.md](../API_DOCS.md)。只描述前端约定，未与在线后端逐项验收。

## 地址与响应

- 开发 baseURL 来自 `.env.development` 的 `/api`，Vite 代理到 127.0.0.1:8000，保留 /api 前缀。
- 生产 baseURL 及 Cloudflare 覆盖情况见 [README](../README.md#-部署指南)；调用方法路径以 `/v1/...` 开头。完整路径不能再重复拼接 API_DOCS 中的 `/api/v1` 前缀。
- 默认 JSON Content-Type；FormData 不手动指定 Content-Type。每次请求附带 Cache-Control，超时 10000ms，Alova cacheFor 为 null。
- 除路径含 `/auth/login` 的请求外，只要本地存在 token 就附带 Authorization Bearer；公钥请求也可能携带现有 token。
- 成功处理统一 response.json()，业务 code 严格等于数字 200 才返回 data；其他值抛错。无内容响应、二进制响应不适合直接走这条 JSON 处理链。
- 返回 data 被递归处理：数组 / 对象中的字符串仅当以小写 `http://` 开头时替换为 `https://`。正文内嵌 URL 不保证被替换；也不验证目标服务是否支持 HTTPS。
- 重试默认关闭；可通过 enableRetry 启用。当前业务调用未显式启用；不宣称写入操作自动重试。

## API 路径地图

以下路径均相对 baseURL；准确字段按 src/api 对应类型和调用页面核对。

| 模块 / 代码 | 方法与路径 | 当前使用 |
| --- | --- | --- |
| [auth](../src/api/auth.ts) | GET /v1/backstage/auth/public-key；POST .../login；GET .../me；POST .../logout | 页面调用公钥和 login；me / logout 仅封装 |
| [dashboard](../src/api/dashboard.ts) | GET /v1/backstage/dashboard/stats | 首页 |
| [blogs](../src/api/blogs.ts) | GET /v1/backstage/blogs 与 /blogs/:id；POST /blogs/create、/blogs/update、/blogs/delete（均位于 /v1/backstage） | 博客列表 / 编辑 |
| [snippets](../src/api/snippets.ts) | GET /v1/backstage/snippets 与 /snippets/:id；POST /snippets/create、/snippets/update、/snippets/delete（均位于 /v1/backstage） | 碎片列表 / 编辑 |
| [taxonomy](../src/api/taxonomy.ts) | GET /v1/backstage/categories、/v1/backstage/tags；各自 POST /create、/update、/delete | 首页及编辑器选择项 |
| [common](../src/api/common.ts) | POST /v1/backstage/upload，FormData 的 file 字段 | 封面和正文图片，返回 url、filename |
| [ai](../src/api/ai.ts) | POST /v1/ai/chat | 仅 API 封装，无当前页面调用 |
| [projects](../src/api/projects.ts) | GET / POST /v1/nest/projects/ | 仅 API 封装，无当前页面调用 |

博客 / 碎片的删除均为 POST 并携带 `{ id }`，不能按 REST 常见习惯擅自换成 DELETE。博客提交 tagIds，碎片提交标签名数组 tags，不混用。

## 已知边界

- request.download 虽创建 Blob 下载链接，但共享成功处理仍走 JSON，不能宣称下载已可用。
- 未实现统一 Token 过期跳转、Token 刷新或启动 me 校验。
- API 文档未描述公钥接口，而登录页实际依赖它。新增接口变更须核对调用、类型、文档和后端证据。
- 任何线上写入、删除或测试数据操作均需在当前任务授权范围内；文档核对本身不触发接口。

## 已确认业务约束与源码差距

[已确认业务规则](../requirements/confirmed-rules.md) 中 SN-001 / SN-002、TX-001 / TX-002 已明确：禁止碎片空块、新标签归入碎片公共标签库、有引用禁止删除，以及各自库内按去空格和忽略英文大小写比较名称。

已对本地后端做局部源码核对：新碎片标签自动进入全局 tags 表，没有标签业务域；名称原值比较；分类 / 标签删除无业务引用保护；未见逐类型空块校验。统计口径及更多字段差异详见 [backend-evidence.md](backend-evidence.md)。

上述规则尚未完整实现。后续联调需验证数据库约束、错误响应、字段保存回读与迁移 / 解绑能力；没有运行接口或数据库验证，不能将本地源码结论视为生产环境证据。
