# frontgui

Vue 3 + TypeScript + Tailwind CSS 4 + Element Plus 项目。

## 开始

使用 Node 24.13.0 或更高版本和 npm。模板已通过 `allowScripts` 允许 MSW、vue-demi、esbuild 的安装脚本，无需额外手动审批。

为保持 Node 24.13.0 兼容，`overrides` 仅将 `js-beautify` 下的 `nopt` 固定为 9.0.0；更新此约束时需重新验证依赖链和测试工具的 HTML 格式化。

```sh
npm install
npm run dev
```

`dev` 启动 Mock 模式，启动前自动生成与已安装 MSW 版本匹配的 worker。`src/mocks/handlers.ts` 提供可删除的 `/api/example` 示例，未匹配请求正常发出。

连接测试服务器：

```sh
npm run dev:backend
```

此模式读取 `.env.backend`，默认将 `/api` 代理到 `http://192.168.1.165`（HTTP 80），保留请求路径，不加载 Mock。首页 `/example` 是示例，真实后端使用时请替换为已有接口。

## 环境配置

| 文件                | 用途                              |
| ------------------- | --------------------------------- |
| `.env`              | 所有模式的公共配置                |
| `.env.backend`      | `npm run dev:backend`：测试服务器 |
| `.env.[mode].local` | 本机覆盖，Git 忽略                |

- `VITE_APP_TITLE`：页面标题。
- `VITE_API_BASE_URL`：请求前缀，默认 `/api`。
- `VITE_BASE_URL`：部署路径，默认 `/`，子目录示例 `/my-app/`。
- `DEV_PORT`：开发端口，生成时为 18888，允许 1024–65535。
- `API_PROXY_TARGET`：开发代理目标，留空不启用；不重写 `/api` 前缀。

Mock 由启动模式控制：仅 `npm run dev` 启用，`dev:backend` 与生产构建自动禁用，不需要额外开关文件。

修改环境文件后重启开发服务器。`VITE_*` 只存放公开配置，它们会在构建时写入浏览器产物；修改生产配置后需重新打包。

生产部署使用 Nginx 转发 `/api`，后端地址只配置在 Nginx。Vite 的开发代理不会进入生产产物；无需维护单独的 `.env.production`。保持 `/api` 即可发送同源请求。生产构建不加载 Mock；worker 是开发生成文件，不应作为生产服务使用。

请求实例保留后端约定：标准响应 `{ code, data, message }` 中 `code` 为 `200` 或 `1` 表示成功，提取 `data`；其他业务码拒绝。直接数据响应保持原样。

## 先设计，再实现

1. 填写 `DESIGN.md`，明确项目设计决策。
2. 替换 `src/styles/tokens.css` 中的浅色示例 token。
3. 同步 `src/styles/element-plus.css` 的控件映射。
4. 替换首页示例。它们不是项目品牌规范，也不会自动从 Markdown 生成 CSS。

入口为 `src/styles/index.css`。使用 `bg-surface`、`text-foreground` 等语义类；布局使用 Tailwind，复杂动画可使用原生 CSS。模板只演示浅色主题，支持减少动态效果。

## 命令

| 命令                    | 用途                                        |
| ----------------------- | ------------------------------------------- |
| `npm run check`         | 类型、只读 lint、格式、单次测试，不修改源码 |
| `npm run fix`           | 修复 lint、格式，再检查类型和测试           |
| `npm run build`         | 类型检查与生产构建                          |
| `npm run preview`       | 预览生产产物                                |
| `npm run test`          | 单次运行测试                                |
| `npm run test:watch`    | 交互测试                                    |
| `npm run test:coverage` | 覆盖率报告                                  |

首次安装后保留 `package-lock.json`，后续可使用 `npm ci`。VS Code 会推荐 Vue、Tailwind、ESLint、Prettier 插件，安装后应用项目级保存格式化和 ESLint 修复设置。
