# Lumturo · 灯塔

中文逻辑科普与谬误学习手册，教学试行版 0.1。Astro + TypeScript 静态网站，无后端、账户、分析脚本或外部字体。保留首批 12 条：定义、论证骨架、成立条件、原创虚构例子、边界反例、避免方式与公开参考。AI 辅助初稿，尚未经过独立逻辑学专家审校或教学效果验证。

## 运行与部署路径

需要 Node.js 22 与 npm。首次运行：

```bash
npm ci
npm run dev
```

默认访问 `http://127.0.0.1:4311/Lumturo/`。端口占用时不要停止无关服务，可用 `npm run dev -- --port 4313`。

```bash
npm run build
npm run preview -- --port 4313
```

默认部署位置为 `https://dwdb-221e.github.io/Lumturo/`，对应精确仓库名 `DWDB-221E/Lumturo`。这是构建目标，不表示已经发布。部署 base 和 origin 仅在配置入口设置：

```bash
LUMTURO_BASE=/Lumturo/ LUMTURO_SITE=https://dwdb-221e.github.io npm run build
# 独立根域名部署示例
LUMTURO_BASE=/ LUMTURO_SITE=https://example.org npm run build
```

页面、静态资源、404、manifest、SW scope/id/start_url 均从同一 base 派生。修改 base 后重新构建，并使用同一 `LUMTURO_BASE` 运行 `npm test`。`dist/` 支持目录 URL，含 `404.html` 与 `.nojekyll`。GitHub Pages Actions 工作流按仓库名设置 base，构建和浏览器验收通过后才上传部署产物；须在仓库 Pages 设置中选择 GitHub Actions。自定义域名或用户站仓库需相应调整 workflow 的环境值。

## 页面与内容

以下路径相对于部署 base：

- `/`：教材入口、论证观察室、四类方向与推荐条目。
- `library/`：12 条索引、关键词与分类组合搜索，查询写入 URL。无 JavaScript 时完整内容和分类仍可用。
- `categories/{category}/`：静态分类。
- `entries/{slug}/`：条目、页内目录、来源、相关条目与学习链路。
- `learn/`：三个阶段，每阶段四条与练习。
- `method/`：事实/推理/价值区分、分类限制、检查清单、来源及编辑边界。
- `offline/`：离线未知路径的恢复提示；不存在的联网路径保留真实 HTTP 404。

内容入口为 `src/data/entries.ts`，路径助手为 `src/utils/paths.ts`，视觉样式为 `src/styles/global.css`。参考资料采用 IEP 与斯坦福哲学百科公开条目，正文为中文教学改写，例子不是来源引文。当前完整内容为中文；世界语名称和短标签不表示已提供世界语全文。

## 安装与离线阅读

生产构建在 HTTPS 或 localhost 上注册 SW；开发模式不注册。manifest 提供中文名称、描述、standalone 显示、主题与背景色、真实的 192/512 PNG 灯塔图标。支持安装提示的浏览器可显示“安装灯塔”；其他浏览器使用自身菜单“安装”或“添加到主屏幕”。iOS 的具体入口与独立窗口行为需在真实设备手动核验。

首次联网打开生产站点并等待“本版内容已准备好离线阅读”，便可在离线时阅读本版全部 12 条、索引与方法。未知离线路径显示恢复页；外部参考需要联网。联网导航优先服务器响应，保留真实 404；离线时回退到同一路径缓存，不把其他路径伪装成首页。

构建插件 `scripts/pwa.mjs` 仅预缓存本次构建确定的 HTML/CSS/JS/SVG/PNG/manifest，单文件限 512 KiB、总量限 5 MiB，超限构建失败。不动态存储搜索查询、外部站点、运行时返回的数据或用户输入。缓存名包含 `lumturo:` 和部署 base，激活只清理这一命名空间；保留同源其他项目缓存。资源内容哈希决定版本。新版本等待页面显示“更新并重新加载”，用户触发后切换并刷新。首次全新安装可以直接控制当前页面。

无 localStorage、Cookie、账户和私有数据采集。浏览器会本地保存公开内容缓存；可从浏览器站点设置清除。图标可通过 `npm run icons` 无额外依赖地重建。

## 可复跑验收

```bash
npm ci
npx playwright install chromium
npm run build
npm test
npm run test:references
```

`npm test` 自管一个随机空闲端口的静态测试宿主，结束自动关闭，不占用现有 4311/4312。测试包含 22 条内部路由及片段、12 条内容、深链接刷新、搜索/分类/空状态/重置与 URL 状态、无 JS、键盘、390×844 移动布局、axe 审计，以及 manifest/图标 HTTP 与实际尺寸、SW 控制与精确 scope、真实离线导航与回退、受控更新与外来缓存保留、无意外 console/pageerror。独立既有预览可用 `LUMTURO_URL=http://127.0.0.1:4313/Lumturo/ npm run test:site` 测试基本界面。

验收 JSON 和截图输出到 `review/`（本地资料，不公开）。`test:references` 请求两份参考 HTML 的真实锚点。自动化不能证明所有平台的手动安装体验，不能替代独立内容审校、读屏软件人工测试、真实移动设备或正式 Pages 上线验证。

发布源文件允许范围：`src/`、`public/`、`scripts/`、`tests/`、`.github/`、配置文件、锁文件与这份说明。不要上传 `review/`、`node_modules/`、`.astro/` 或本地运行记录；只向 Pages 上传 `dist/`。远程 push 和 Pages 启用由发布角色单独处理。
