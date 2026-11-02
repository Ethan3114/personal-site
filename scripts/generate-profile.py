from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader
import pdfplumber

pdfmetrics.registerFont(TTFont("ProfileFont", "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"))
output = "desktop/public/assets/ethan-profile.pdf"
document = SimpleDocTemplate(output, pagesize=A4, rightMargin=48, leftMargin=48, topMargin=44, bottomMargin=40, title="耿江山 Ethan - 个人资料", author="Ethan")
styles = {
    "label": ParagraphStyle("label", fontName="Helvetica", fontSize=9, textColor=HexColor("#766a7c"), leading=14, spaceAfter=14),
    "title": ParagraphStyle("title", fontName="ProfileFont", fontSize=28, textColor=HexColor("#1b0624"), leading=38, spaceAfter=12),
    "heading": ParagraphStyle("heading", fontName="ProfileFont", fontSize=14, textColor=HexColor("#1b0624"), leading=22, spaceBefore=17, spaceAfter=8),
    "body": ParagraphStyle("body", fontName="ProfileFont", fontSize=10, textColor=HexColor("#444444"), leading=17, spaceAfter=7),
    "small": ParagraphStyle("small", fontName="ProfileFont", fontSize=8, textColor=HexColor("#766a7c"), leading=13, spaceBefore=12),
}
story = []

def text(value, style="body"):
    story.append(Paragraph(value, styles[style]))

text("PERSONAL PROFILE / ETHAN", "label")
text("耿江山 · Ethan", "title")
text("AI 产品经理｜AI 应用与 Agent 工具｜技术写作")
text("把想法做成可以使用的工具。")
text("关于我", "heading")
text("我关注 AI 如何融入具体的工作与生活场景，让整理资料、处理数据和表达想法变得更方便。从知识库应用到 Dify 插件、Codex Skills，我习惯把想法做成可以体验的作品。工作之外，我喜欢摄影，也在公众号「江上算峰」记录技术探索与自己的思考。")
text("公开项目", "heading")
for title, description in [
    ("企业知识库中台", "导入文档、构建知识库、多知识库对话与内容生成。"),
    ("Apple Health Review", "规范化苹果健康导出数据，核对数值并生成中文报告。"),
    ("微信会话导出 Skill", "导出 macOS 微信指定会话，保存可搜索记录与附件。"),
    ("Center Crop", "供 Agent 调用的 Dify 图片中心裁剪插件。"),
    ("Cyberpunk Memory Stream", "结合 Three.js、GLSL 与滚动交互的网页作品。"),
    ("Personal Notes", "以水彩日落和交互桌面呈现项目、随笔与个人资料。"),
]:
    text(f"{title}：{description}")
text("技能与实践", "heading")
text("AI 工具：Dify 插件、Codex Skills、模型 API 接入。<br/>数据处理：Python、JSON、SQLite、数据规范化与指标核对。<br/>网页开发：TypeScript、JavaScript、React、HTML、CSS。<br/>实时 3D：Three.js、GLSL、粒子效果与滚动交互。<br/>工程验证：pytest、Playwright、GitHub Actions、GitHub Pages。")
text("交流与写作", "heading")
text('<link href="https://github.com/Ethan3114" color="#1b0624">GitHub：github.com/Ethan3114</link><br/>微信公众号：江上算峰')
text("资料来源：本人 GitHub 公开资料与个人主页。整理日期：2026-11-02。", "small")
document.build(story)
reader = PdfReader(output)
assert len(reader.pages) == 1
content = reader.pages[0].extract_text()
assert "耿江山" in content and "Ethan3114" in content
with pdfplumber.open(output) as pdf:
    for character in pdf.pages[0].chars:
        assert character["x0"] >= 35 and character["x1"] <= A4[0] - 35
        assert character["top"] >= 25 and character["bottom"] < A4[1] - 25
print("个人资料 PDF：单页、文字内容和页面边界检查通过")
