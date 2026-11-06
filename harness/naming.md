# 命名与引用

沿用现有模块的局部惯例，避免为了统一风格批量改名。

- 页面目录使用 PascalCase（如 `Blogs`），列表入口 `index.tsx`，复用的新建 / 编辑页 `Create.tsx`。
- 独立 React 组件使用 PascalCase；Hook 和工具函数使用 camelCase；自定义 Hook 使用 `use` 前缀。
- API 文件按业务小写命名（如 `blogs.ts`）；状态文件延续 `authStore.ts` 的命名方式。
- 文档目录入口统一为 `MAP.md`；代理入口为根目录 `AGENTS.md`，不另建 `agent.md` 副本。
- 新分支默认 `codex/<任务名>`；本任务分支为 `codex/harness-progressive-docs`。

改名时依次更新导入、路由 / 调用、测试或验证说明、文档链接及所属 MAP；搜索旧名称检查遗漏。公共接口字段改名属于契约变更，先核对接口证据。

## 当前接口与领域名称

- Blog：新建类型 CreateBlogParams，更新类型 UpdateBlogParams；查询类型 BlogQueryParams，分页结构 BlogListResult。
- Snippet：内容联合类型 SnippetBlock，元数据 SnippetMetadata；块通过 type 区分 text / image / gallery / quote，不任意新增字符串类型。
- 分类 / 标签：Category、Tag 及 CreateCategoryParams、CreateTagParams；页面导入 Tag 组件时可用类型别名避免冲突，首页现用 TagInterface。
- 登录：LoginParams、LoginResult、UserInfo。API login 与 store login 在页面通过 loginApi 别名区分。
- 数据字段沿用后端协议：博客 categoryId / tagIds，碎片 metadata / tags。统一命名风格不能成为未经授权修改协议的理由。
- 全项目相对路径导入，未在 Vite 中配置 @ 别名；新增文件先沿用局部风格。
