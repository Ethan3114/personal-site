import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Github, MessageSquare } from 'lucide-react';
import { assets, profile } from '../data';

export function Contact() {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(profile.username); setCopied(true); }
  return <div className="contact-content"><img className="contact-avatar" src={assets('ethan-avatar.png')} alt="耿江山 Ethan 的 GitHub 头像"/><span className="eyebrow">LET’S MAKE SOMETHING USEFUL</span><h3>你好，我是耿江山。</h3><p className="contact-role">Ethan · AI 产品经理</p><p>关于 AI 应用、Agent 工具，<br/>或任何有趣的发现，欢迎交流。</p><a className="pill-button" href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={16}/>在 GitHub 找到我<ArrowUpRight size={15}/></a><div className="contact-bottom"><a href={`${profile.github}/personal-site/issues`} target="_blank" rel="noopener noreferrer"><MessageSquare size={15}/>通过项目 Issues 交流</a><button onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? '已复制' : '@Ethan3114'}</button></div></div>;
}
