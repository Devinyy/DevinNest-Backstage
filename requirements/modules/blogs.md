# 博客行为基线

证据：[列表](../../src/pages/Blogs/index.tsx)、[编辑页](../../src/pages/Blogs/Create.tsx)、[API 与类型](../../src/api/blogs.ts)。

## 列表

- `/blogs` 首次请求 page=1、pageSize=10；支持切页、调整页容量和总条数显示。
- 展示标题、分类、标签、创建时间、编辑与删除。分类兼容对象 / 字符串；标签兼容 tags 对象列表和 tagIds。
- 列表响应兼容数组或 `{ list, total }`；加载显示 Spin，空列表显示“暂无博客”。
- 删除有二次确认；当前页最后一条且非首页时，成功后退回前一页。
- API 类型支持 status、keyword、categoryId，但当前列表没有相应筛选控件。

## 新建与编辑

- `/blogs/create` 与 `/blogs/edit/:id` 复用 Create.tsx；编辑读取详情，分类、标签均从接口加载。
- 标题、副标题、正文、分类和至少一个标签齐全后允许发布；标题、副标题和正文会以 trim 判断发布按钮状态。封面可选。
- 表单字段 category 映射到 categoryId，tags 映射到 tagIds；提交标题、副标题、正文、封面及固定 `status: 'published'`。更新额外携带 id。
- 正文是 Markdown 文本，使用 react-markdown-editor-lite 双栏编辑预览；启用 HTML、typographer、上下标及 kbd 插件。
- 图片上传返回 URL；自定义插件识别图片 URL 尾部 `=宽x高` 或 `#宽x高`，移除尺寸后缀并设置渲染宽高。
- 封面可上传 / 移除，正文图片通过编辑器上传回调处理。成功后回博客列表；详情失败提示并返回列表。
- “存草稿”仅提示暂未开放；状态类型注释中的 draft / archived 不代表界面已支持这些工作流。

## 验证关注

必填项与空格、标签 / 分类回显、无封面发布、正文上传失败、编辑保存、删除末页最后一条。代码未提供离页未保存提示；用户已确认需要，目标见 [ED-001](../confirmed-rules.md#ed-001仅有未保存改动时提醒离开)，当前待实现。

## 当前范围补充

[SC-001](../confirmed-rules.md#sc-001当前不需要草稿功能)：用户确认目前不需要草稿功能，保留占位按钮的现状描述，不列为当前开发需求。[UI-001](../confirmed-rules.md#ui-001电脑为主手机能完成主要操作)：电脑为主，手机需支持主要操作，手机仅要求登录、查看、编辑已有内容并保存。
