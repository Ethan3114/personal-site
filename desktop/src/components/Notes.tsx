import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Copy, ChevronRight, PenLine } from 'lucide-react';
import { notes, profile } from '../data';

export function Notes() {
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const note = notes.find((entry) => entry.id === active);
  async function copyName() { await navigator.clipboard.writeText(profile.publication); setCopied(true); }
  return <div className="notes-app"><div className="browser-address"><span/><span>ethan / notes</span><PenLine size={13}/></div><div className="notes-scroll">{note ? <article className="note-article"><button className="back-link" onClick={() => setActive(null)}><ArrowLeft size={15}/>全部随笔</button><span className="eyebrow">{note.label}</span><h3>{note.title}</h3><p className="note-lead">{note.introduction}</p>{note.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="note-signature">Ethan<span>保持好奇，慢慢生长。</span></div></article> : <><div className="notes-heading"><span className="eyebrow">A FEW THOUGHTS ALONG THE WAY</span><h3>把想法，留在这里。</h3><p>关于好奇、创造与日常。</p></div><div className="note-list">{notes.map((entry, index) => <button key={entry.id} className="note-row" onClick={() => setActive(entry.id)}><span className="note-index">0{index + 1}</span><span><small>{entry.category}</small><strong>{entry.title}</strong><span>{entry.introduction}</span></span><ChevronRight size={18}/></button>)}</div><div className="publication"><div><span className="eyebrow">WECHAT PUBLICATION</span><h4>江上算峰 <ArrowUpRight size={15}/></h4><p>记录技术探索，也记录自己的思考。</p></div><button onClick={copyName}>{copied ? <Check size={15}/> : <Copy size={15}/>}<span>{copied ? '已复制公众号名称' : '复制公众号名称'}</span></button></div></>}</div></div>;
}
