# 后端源码核对记录

## 范围与来源

- 用户于 2026-11-06 提供目录：`/Users/zhangxiang/my_project/DevinNest-Backend`。
- 核对时分支：`feature/backend-v2.0`；HEAD：`33f612b`，工作区干净。
- 仅静态阅读以下文件；未导入或运行后端、未连接数据库、未调用线上接口，未修改后端文件。该提交是否等同生产部署版本尚未核实。
- 下表路径均相对后端根目录，方便另一工作区定位；需求目标仍以 [已确认规则](../requirements/confirmed-rules.md) 为准。

## 已确认代码事实

| 范围 | 当前实现 | 证据位置 |
| --- | --- | --- |
| 标签归属 | 单一 Tag 模型 / tags 表同时关联博客和碎片，name 全表 unique=True，没有业务域字段；标签列表查询全部 Tag | app/models.py:45；app/backstage/api/taxonomy.py:87 |
| 新碎片标签 | 新建与更新均按原始名称查找，不存在则创建默认 blue 的 Tag，再关联碎片 | app/backstage/api/snippets.py:156、229 |
| 重名检查 | 分类 / 标签创建和更新均按原始 name 等值查询；没有显式 trim / lower。模型 name 有唯一约束；数据库实际排序规则未核验 | app/backstage/api/taxonomy.py:28、44、102、117；app/models.py:35、45 |
| 删除保护 | 分类和标签查存在后直接 db.delete / commit，未检查引用数量；不能由此保证业务层“有引用禁止删除” | app/backstage/api/taxonomy.py:70、141 |
| 空块校验 | SnippetBlock 的 type 为 str，内容及图片字段为可选，未见按类型非空验证；创建 / 更新将 block.dict() 写入 JSON | app/backstage/schemas.py:102；app/backstage/api/snippets.py:180、242 |
| 碎片列表 | page 默认 1、pageSize 默认 10，offset / limit 后返回数组，不返回 total；未显式排序 | app/backstage/api/snippets.py:122 |
| 公钥 | 后端存在 GET /public-key，登录前端确实依赖它，旧 API_DOCS 未描述 | app/backstage/api/auth.py:12 |

## 统计口径与最新动态

证据：`app/backstage/api/dashboard.py:12`，`app/backstage/api/taxonomy.py:12、87`。

- 总数直接 count Blog、Snippet、Category、Tag，不按博客发布状态过滤。
- 本月新增以服务器 date.today() 所在月的月初为下界，统计 created_at >= 月初；没有额外的当月末上界或状态过滤，实际时区依赖运行环境。
- 分类 count 为引用该分类的博客数量；标签 count 为 len(tag.blogs)，不计碎片引用。因此 count=0 不足以证明标签没有被碎片使用。
- 最新动态各取按 created_at 降序的 5 篇博客与 5 条碎片，再合并按创建时间降序取 5 条；不是按更新时间。
- 碎片动态 cover 从内容中首个 image 块提取，不使用顶层 cover；title 优先顶层 title，其次摘要回退。
- 这些是当前计算行为，尚不等于用户另行确认了所有统计口径；后续无新要求时按代码基线维护。

## 已知契约差异与风险

1. **SN-002 / TX-002**：当前全局 tags 表无法表达已确认的碎片专属公共库和跨库同名目标；需要另行设计迁移及接口，不能仅改前端展示。
2. **TX-001**：删除没有显式业务引用保护；数据库 / ORM 是否清除关联、置空或拒绝需运行验证，不能按注释宣称安全。源码未配置删除博客 / 碎片内容的 cascade。
3. **SN-001**：前后端均未见完整空块验证。仅补前端不能保证接口调用也遵守规则。
4. **碎片分页**：前端不传页码也无翻页入口，对应本地后端默认只取第一页 10 条；超过该数量的管理可达性存在缺口，尚未运行验证。
5. **碎片字段**：后端 SnippetBlock 未声明前端使用的 id、layout、exif；SnippetMetadata 未声明 camera；Snippet 响应未声明 createdAt / updatedAt。通过 schema 读写存在字段丢失或契约不一致风险，需进一步运行验证。日期为 datetime，前端提交 YYYY-MM-DD 的兼容性也未运行验证。

完整 API 合同尚未逐项核验。后续只读相关模块，若修复需另行确定前后端范围、数据迁移与验证环境。
