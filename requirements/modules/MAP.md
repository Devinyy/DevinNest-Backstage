# 模块地图

用户已确认以当前代码建立这些模块的行为基线；未定义的业务规则和实际运行结果仍需分别确认。总范围见 [overview.md](../overview.md)。

| 模块 | 行为、字段和边界 | 代码入口 |
| --- | --- | --- |
| 认证与导航 | [auth.md](auth.md) | Login、RequireAuth、authStore、MainLayout |
| 仪表盘 / 分类 / 标签 | [dashboard.md](dashboard.md) | Dashboard、dashboard API、taxonomy API |
| 博客 | [blogs.md](blogs.md) | Blogs/index、Blogs/Create、blogs API |
| 日常碎片 | [snippets.md](snippets.md) | Snippets/index、Snippets/Create、snippets API |

只读本次涉及模块。跨模块接口看 [联调说明](../../docs/api-integration.md)，验证看 [test-spec](../../harness/test-spec.md)。
