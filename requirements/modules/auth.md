# 认证与导航行为基线

证据：[Login](../../src/pages/Login/index.tsx)、[auth API](../../src/api/auth.ts)、[认证状态](../../src/stores/authStore.ts)、[路由保护](../../src/components/RequireAuth.tsx)、[主布局](../../src/layouts/MainLayout.tsx)。

## 登录流程

1. `/login` 提供用户名和密码输入；两项非空时允许提交，表单均为必填。
2. 每次提交先 GET `/v1/backstage/auth/public-key`，通过 JSEncrypt 使用返回 `publicKey` 加密密码。
3. 加密失败提示“加密失败”，不发登录请求；成功后 POST `/v1/backstage/auth/login`，发送用户名和加密后的密码。
4. 成功读取 `userInfo` 和 `token`，写入 Zustand 状态；提示成功，约 1 秒后跳回来源 pathname，没有来源则进入首页。
5. 登录失败保留在登录页；代码没有提交期间的 loading / 防重复提交状态。

## 状态与路由

- `auth-storage` 是 Zustand persist 的本地存储键；保存 `isAuthenticated`、`token`、`user`。user 含 username 及可选 avatar、id。
- RequireAuth 仅根据本地 `isAuthenticated` 决定是否跳往登录页，并通过路由 state 保留来源。不能把它视为服务端鉴权。
- getUserInfo 与后端 logout 有接口封装，但当前页面没有调用；请求层未见 401 自动清理登录或刷新 Token 的实现。
- 主布局提供首页、博客、日常碎片导航和手动折叠侧栏。菜单选中使用完整 pathname，新建 / 编辑路径不等同列表菜单 key。
- 退出只执行本地 store 的 logout，随后导航 `/login`；不请求后端注销接口。

## 验证关注

未登录访问受保护页应跳转；登录成功应返回来源；刷新后状态可恢复；退出后本地状态被清空。另需检查过期 Token、连续提交、返回路径含查询参数等场景，不能将当前未实现的行为写成通过。
