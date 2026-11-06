# 日常碎片行为基线

证据：[列表](../../src/pages/Snippets/index.tsx)、[编辑页](../../src/pages/Snippets/Create.tsx)、[API 与块类型](../../src/api/snippets.ts)。

## 列表

- `/snippets` 调用 getSnippets()，当前不传分页参数且没有分页 / 时间筛选控件；兼容数组或 `{ list }`。
- 卡片显示封面（无封面使用占位）、标题、摘要、日期和最多三个标签。
- 摘要优先 subtitle，否则取首个 text 块；无内容时有相应占位文案。日期优先 metadata.date，其次 createdAt，格式 YYYY.MM.DD。
- 提供编辑及带确认的删除，删除成功重新取列表；有加载和空状态。

## 编辑字段与提交

- 新建与编辑复用 Create.tsx；标题为必填。发布按钮要求 trim 后标题非空且至少有一个块，**不校验每个块内部是否有文字或图片**。
- 顶层字段：title、subtitle、cover、content、metadata、tags；副标题、封面可选。
- metadata：date、weather、mood、location、camera；保存日期为 YYYY-MM-DD，未填写时使用客户端当天日期。
- tags 使用 Select 的 tags 模式，可从接口标签中选择，也可输入新名称；提交的是名称字符串数组，与博客 tagIds 不同。
- 成功后回碎片列表；编辑详情失败提示但留在当前页。
- “存草稿”仅提示暂未开放。没有独立状态字段或草稿保存调用。

## 内容块

| 类型 | 数据 | 编辑能力 |
| --- | --- | --- |
| text | id、type、content | 多行文本 |
| image | id、type、src、caption?、exif?、layout? | 上传 / 更换图片，normal / bleed / portrait 布局 |
| gallery | id、type、images、layout、caption? | URL 字符串数组；添加 / 删除图片，grid-2 / grid-3 |
| quote | id、type、content、author? | 引用文字和出处 |

块可新增、删除、上下移动；首尾移动有边界检查。id 由客户端随机字符串生成。当前仅支持四类块，不含独立代码块；README 的旧描述已修正。

## 验证关注

标题与块数量、空块发布边界、顺序往返保存、图集增删、日期格式、标签名称回显、封面 / 图片上传失败。禁止空块和新标签归属已由用户确认，本地后端现状已核对，详见下方来源；线上行为未验证。

## 已确认的目标行为（2026-11-06）

- [SN-001](../confirmed-rules.md#sn-001碎片禁止发布空内容块)：文本 / 引用须有内容、图片须有图、图集至少一张，任何空块都不允许发布；当前前后端均待补逐块校验。
- [SN-002](../confirmed-rules.md#sn-002新标签进入碎片公共标签库)：新标签进入碎片公共标签库供其他碎片复用，不推定自动共享到博客。当前两个编辑器使用相同 getTags，本地后端确认自动创建但共用全局 tags 表，没有隔离。

- [ED-001](../confirmed-rules.md#ed-001仅有未保存改动时提醒离开)：仅有未保存改动时提醒离开，涵盖表单、封面和块内容 / 顺序；当前待实现。

上文描述代码现状，本节描述已确认目标；本轮只更新文档，没有实现这些规则。

## 当前范围补充

[SC-001](../confirmed-rules.md#sc-001当前不需要草稿功能)：用户确认目前不需要草稿功能，保留占位按钮的现状描述，不列为当前开发需求。[UI-001](../confirmed-rules.md#ui-001电脑为主手机能完成主要操作)：电脑为主，手机需支持主要操作，手机仅要求登录、查看、编辑已有内容并保存。

## 后端核对补充

[后端记录](../../docs/backend-evidence.md) 确认列表默认返回第 1 页 10 条且无 total，当前前端没有后续页入口；schema 还存在块字段与 metadata.camera 未声明等契约风险。以上仅为本地源码结论，没有执行保存或数据验证。
