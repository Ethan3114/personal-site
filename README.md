# Ethan 的个人桌面

耿江山 Ethan 的个人网站，以桌面、Dock 和可拖动窗口呈现作品、随笔、图像收藏、联系方式、技能与个人资料。背景使用为网站生成的水彩日落插画。

线上网站：https://ethan3114.github.io/personal-site/

## 本地开发

```sh
npm install
npm run dev
```

默认访问地址为 `http://127.0.0.1:5173`。

## 构建与检查

```sh
npm run build
npm run preview -- --port 8000
```

在另一个终端执行：

```sh
npm test
```

检查使用本机 Google Chrome，覆盖五种桌面与手机宽度、六个应用窗口、真实拖动、搜索、键盘操作、剪贴板、PDF 下载与缩放、变量字体与宠物行为。通过 `SITE_URL` 可以指定其他访问地址。

## 目录

- `desktop/src/`：React、TypeScript 源码与页面样式。
- `desktop/src/data.ts`：公开个人资料、六个项目、随笔和技能内容。
- `desktop/src/store.ts`：应用窗口状态、焦点与搜索状态。
- `desktop/public/assets/`：自有插画、公开头像、本地字体、个人资料 PDF 和开源宠物素材。
- `dist/`：可直接部署的生产构建。
- `tests/site.test.mjs`：真实浏览器检查。
- `scripts/generate-profile.py`：个人资料 PDF 的生成与文字边界检查，依赖见同目录的 `requirements-pdf.txt`。
- `docs/reference-interactions.json`：参考页的交互测量记录。
- `.artifacts/desktop-qa/compare-report.json`：运行检查后生成的布局与交互报告。

资料来自本人公开的 [GitHub 主页](https://github.com/Ethan3114) 与 [个人介绍](https://github.com/Ethan3114/Ethan3114)。项目展示使用公开仓库信息。

## 使用方式

点击桌面分类或 Dock 打开窗口；拖动窗口标题栏可以移动窗口。红色按钮关闭窗口，Escape 关闭当前窗口；Command/Ctrl + K 打开作品搜索。

小猫支持跟随鼠标、拖动、双击睡眠、右键或长按换色。右上角的小猫按钮打开设置；在输入框以外键入 `oneko` 也可以打开设置。设置保存在当前浏览器。

## 发布

GitHub Pages 使用 `gh-pages` 分支的根目录。完成构建后执行：

```sh
git add desktop dist docs package.json package-lock.json tsconfig.json tests README.md
git commit -m "Update personal desktop website"
git push github main
git subtree push --prefix dist github gh-pages
```

## 素材与许可

水彩插画使用内置 imagegen 生成，提示词保存在 [插画说明](docs/illustration.md)。头像来自本人的 GitHub 公开资料。应用图标由 SVG 与 CSS 编写，通用图形使用 lucide-react。

Georama 由 Google Fonts 提供，采用 SIL Open Font License，许可随字体保存在 `desktop/public/assets/Georama-OFL.txt`。

小猫精灵来自 [adryd325/oneko.js](https://github.com/adryd325/oneko.js)，采用 MIT License，许可保存在 `desktop/public/assets/oneko-LICENSE.txt`。运动行为由本站 React 组件管理。

布局与交互研究参考 [bysagar.vercel.app](https://bysagar.vercel.app/)。本站使用 Ethan 的真实公开资料、自有背景和自制图标。检查记录包含 DOM、布局尺寸与实际交互；截图与像素比对未执行。
