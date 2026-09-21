# 项目开发约定

这是脚手架提供的可修改约定；用户要求和项目后续明确的约定优先。

## 开始开发

- 使用 npm，不使用 pnpm。首次执行 `npm install`，保留生成的 `package-lock.json`；之后可使用 `npm ci`。
- 页面开发前阅读 `DESIGN.md`。待填写项不是已确认的设计决策，示例配色和 token 不是最终品牌规范。
- 先确定设计，再修改 `src/styles/tokens.css`，同步 Element Plus 映射和页面。
- 同类样式统一引用 token；布局优先使用 Tailwind，必要动画使用原生 CSS。

## 目录

- `src/views`：路由页面；`src/components`：可复用组件。
- `src/api/modules`：业务接口；`src/api/index.ts`：共享请求实例。
- `src/stores`：Pinia 状态；`src/composables`：组合逻辑。
- `src/styles`：CSS 入口、示例 token、Element Plus 映射。
- `src/tests`：测试和清理；`config`：开发服务器配置辅助函数。

## 接口与环境

- 默认请求前缀 `/api`；标准响应 `{ code, data, message }` 中 `200` 或 `1` 表示成功，成功时提取 `data`，其他业务码拒绝。
- 未经项目明确要求，不改变上述后端约定。
- `.env` 为公共配置，`.env.backend` 只覆盖测试服务器目标；本机覆盖写入 Git 忽略的 `.env.local` 或 `.env.[mode].local`。
- `VITE_*` 会暴露给浏览器，只能包含公开配置。`DEV_PORT`、`API_PROXY_TARGET` 仅用于开发服务器。
- 开发代理不去掉 `/api` 前缀；生产沿用公共 `/api`，由 Nginx 转发，无需独立生产环境文件。

## 命令和验证

- `npm run dev`：Mock 模式，自动生成匹配已安装 MSW 版本的 worker；示例位于 `src/mocks`。
- `npm run dev:backend`：测试服务器模式，默认代理到 `http://192.168.1.165`，不加载 Mock。
- `npm run build`：类型检查与生产构建，不加载 Mock。
- `npm run check`：不修改源码的类型、lint、格式和测试检查。
- `npm run fix`：自动修复 lint 和格式，再检查类型并运行测试。
- `npm run test` / `npm run test:watch`：单次 / 交互测试。
- 修改后运行相关测试，交付前运行 `npm run check` 和 `npm run build`；页面修改还需验证窄屏、键盘操作和控制台。
- 不以跳过测试、放宽规则或隐瞒失败的方式通过校验。
