# 现有样式数值

状态：从代码提取的样式清单，非新增设计系统。修改时同步代码及此处相关行，不建立第三份 token 实现。

## 全局颜色

| 用途 | 当前值 | 来源 |
| --- | --- | --- |
| CSS primary | #ffffff | index.css 的 @theme |
| 页面底色 | #000000 | index.css、App token / Layout |
| 卡片底色 | #121212 | index.css、App token / Card |
| 卡片悬浮 / 表格行悬浮 | #1e1e1e | index.css、App Table |
| Ant 主色 / 信息色 | #ffffff | App token |
| Ant 基础文字 | #e5e5e5 | App token |
| Ant 边框 | #262626 | App token |
| 菜单普通文字 | #a1a1aa | App Menu |
| 主操作按钮 | 页面覆盖为 blue-600、悬浮 blue-500 | Login、Blogs/Create、Snippets/Create |

CSS @theme 仅有 primary、dark-bg、card-bg、card-hover 四个自定义色；页面还有 Tailwind 类和直接色值，尚未统一绑定。

## 圆角与动效

- Ant 基础圆角 12，LG 16；neo-card 圆角 16px。
- neo-card 悬浮上移 2px，过渡 0.3s，背景切换 card-hover，边框透明白从 0.03 到 0.08。
- 菜单高度 50、圆角和条目水平 margin 为 0；选中指示线宽 3px；悬浮文字右移 4px。
- 滚动条宽 / 高 6px，滑块 #3f3f46，悬浮 #52525b，圆角 3px。
- glass-card：rgba(24,24,27,0.6) 底色、12px 模糊、0.05 透明白边框。

## 字体与布局

- 全局为系统 sans-serif 字体栈；App token 与 body 字体列表略有差异，不宣称完全统一。
- 主布局侧栏展开宽 240px；头部使用 h-20，内容区独立纵向滚动；新建 / 编辑页移除内容顶部 padding 配合 sticky 工具栏。
- 页面中存在局部字号、间距和圆角覆盖，修改前须读目标页面，不能只依赖本清单。

代码来源：[App.tsx](../src/App.tsx)、[index.css](../src/index.css)、[MainLayout.tsx](../src/layouts/MainLayout.tsx)。
