# Personal Notes

个人网站，包含个人介绍、兴趣方向、随笔和联系区域，支持手机与桌面浏览。

网站使用 HTML、CSS 和 JavaScript。暖白背景、居中标题、胶囊按钮与水彩日落首屏构成页面设计。

- `dist/index.html`：页面内容。
- `dist/styles.css`：颜色、排版与响应式布局。
- `dist/app.js`：手机导航和随笔链接交互。
- `dist/assets/`：首屏插画与网站图标。

运行网站无需安装依赖。

## 本地预览

在仓库目录执行：

```sh
python3 -m http.server 8000 --directory dist
```

浏览器访问 `http://localhost:8000`。

## 发布

GitHub Pages 使用 `gh-pages` 分支的根目录。修改网站后执行：

```sh
git add dist
git commit -m "Update personal website"
git push github main
git subtree push --prefix dist github gh-pages
```

个人介绍、随笔和 GitHub 链接可以直接在 `dist/index.html` 中修改。

## 浏览器检查

安装开发依赖并启动本地预览后，执行 `npm test`。检查使用本机 Google Chrome，覆盖桌面与手机宽度、页面资源、导航、键盘操作和随笔展开。可以通过 `SITE_URL` 指定线上网站地址。
