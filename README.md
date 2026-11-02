# Personal Notes

个人网站，包含个人介绍、兴趣方向、随笔和联系区域，支持手机与桌面浏览。

网站源文件位于 `dist/index.html`，使用 HTML、CSS 和 JavaScript，无需安装依赖。

## 本地预览

在仓库目录执行：

```sh
python3 -m http.server 8000 --directory dist
```

浏览器访问 `http://localhost:8000`。

## 发布

GitHub Pages 使用 `gh-pages` 分支的根目录。修改网站后执行：

```sh
git add dist/index.html
git commit -m "Update personal website"
git push github main
git subtree push --prefix dist github gh-pages
```

个人介绍、示例随笔和联系方式可以直接在 `dist/index.html` 中修改。
