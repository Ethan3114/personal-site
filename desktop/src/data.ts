export const assets = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

export const profile = {
  name: '耿江山',
  englishName: 'Ethan',
  username: 'Ethan3114',
  role: 'AI 产品经理',
  github: 'https://github.com/Ethan3114',
  publication: '江上算峰',
  bio: '把想法做成可以使用的工具。',
  description: '我关注 AI 如何融入具体的工作与生活场景，让整理资料、处理数据和表达想法变得更方便。从知识库应用到 Dify 插件、Codex Skills，我习惯把想法做成可以体验的作品。工作之外，我喜欢摄影，也在公众号「江上算峰」记录技术探索与自己的思考。',
};

export type Category = 'all' | 'ai' | 'tools' | 'creative';
export const categories: { id: Category; label: string; subtitle: string }[] = [
  { id: 'all', label: '全部作品', subtitle: '把好奇变成可以使用的东西。' },
  { id: 'ai', label: 'AI 与知识库', subtitle: '让模型能力连接具体场景。' },
  { id: 'tools', label: '工具与 Skills', subtitle: '为日常工作，做一点有用的工具。' },
  { id: 'creative', label: '交互与表达', subtitle: '用网页、图像和文字呈现想法。' },
];
export const projects: { id: string; name: string; shortName: string; category: Category; description: string; tags: string[]; url: string; live?: string; year: string }[] = [
  { id: 'knowledge', name: '企业知识库中台', shortName: '知识库中台', category: 'ai', description: '导入文档、构建知识库、进行多知识库对话，提供写文章、写周报应用与调用日志。让资料整理、知识检索与内容生成连接起来。', tags: ['TypeScript', 'Python', '知识检索'], url: 'https://github.com/Ethan3114/enterprise-knowledge-hub', year: 'AI APPLICATION' },
  { id: 'health', name: 'Apple Health Review', shortName: '健康数据核对', category: 'tools', description: '规范化苹果健康导出数据，生成每日汇总，核对健康 App 数值并辅助生成中文报告。', tags: ['Python', 'Codex Skill', '数据核对'], url: 'https://github.com/Ethan3114/apple-health-review', live: 'https://ethan3114.github.io/apple-health-review/', year: 'LOCAL DATA' },
  { id: 'wechat', name: '微信会话导出 Skill', shortName: '微信会话导出', category: 'tools', description: '导出 macOS 微信指定会话，读取 WAL，生成可搜索的 HTML、文本和 JSON，并保存可关联附件。', tags: ['Python', 'SQLite', 'Codex Skill'], url: 'https://github.com/Ethan3114/wechat-chat-export-skill', year: 'AGENT TOOL' },
  { id: 'crop', name: 'Center Crop', shortName: '图片裁剪插件', category: 'ai', description: 'Dify 图片中心裁剪工具，接收图片 URL 或上传文件，输出 PNG 与裁剪信息，供 Agent 调用。', tags: ['Python', 'Dify Plugin', '图片处理'], url: 'https://github.com/Ethan3114/dify-center-crop', year: 'DIFY PLUGIN' },
  { id: 'cyberpunk', name: 'Cyberpunk Memory Stream', shortName: '赛博朋克交互', category: 'creative', description: '《赛博朋克 2077》主题桌面端交互作品，通过滚动串联 3D 字标、粒子、折射效果和角色视频。', tags: ['React', 'Three.js', 'GLSL'], url: 'https://github.com/Ethan3114/cyberpunk-memory-stream', live: 'https://ethan3114.github.io/cyberpunk-memory-stream/', year: 'INTERACTIVE WEB' },
  { id: 'personal', name: 'Personal Notes', shortName: '个人网站', category: 'creative', description: '一个属于自己的互联网角落。用水彩日落、交互桌面与可打开的窗口，收藏项目、文字和生活里的发现。', tags: ['React', 'TypeScript', 'GSAP'], url: 'https://github.com/Ethan3114/personal-site', year: 'PERSONAL SPACE' },
];

export const notes = [
  { id: 'curiosity', category: '思考', label: 'ON CURIOSITY', title: '为好奇心留一扇门', introduction: '一个新的问题，就是一个新的开始。', paragraphs: ['一个新的问题，往往比一个熟悉的答案更有吸引力。试着把每天遇到的疑问记录下来，再选择一个值得追究的问题，认真寻找答案。', '允许自己暂时没有答案，也愿意多问一句“为什么”。那些看似微小的疑惑，可能把我们带到从未想过的地方。'] },
  { id: 'creating', category: '创造', label: 'ON MAKING THINGS', title: '从一个小小的想法开始', introduction: '让灵感，拥有一个具体的形状。', paragraphs: ['写下想法，让它有一个具体的形状。可以是一段文字、一张草图，或一个可以点击的页面。创造的乐趣，藏在想法逐渐清晰的过程中。', '亲手完成一件事，会让我们更清楚地理解它。每一个具体的选择，也都在帮助那个想法长出自己的样子。'] },
  { id: 'everyday', category: '日常', label: 'ON EVERYDAY LIFE', title: '留意那些容易错过的瞬间', introduction: '寻常的一天，也有值得收藏的细节。', paragraphs: ['窗边的光线、路上的树影、一段意外的对话。记录这些片刻，让寻常的一天拥有可供回看的细节。', '偶尔慢下来，看看身边的变化。同一条路，在不同的时间走过，也会有不同的发现。'] },
];

export const skills = [
  ['AI 工具', 'Dify 插件、Codex Skills、模型 API'],
  ['数据处理', 'Python、JSON、SQLite、数据规范化与核对'],
  ['网页开发', 'TypeScript、JavaScript、React、HTML、CSS'],
  ['实时 3D', 'Three.js、GLSL、粒子效果与滚动交互'],
  ['工程验证', 'pytest、Playwright、GitHub Actions、GitHub Pages'],
];
