import { ArrowLeft, ArrowUpRight, Search, Grid2X2, FolderOpen, Sparkles, Wrench, Shapes, ChevronRight, FileUser } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { categories, projects } from '../data';
import { useDesktop } from '../store';
import { FolderIcon } from './Icon';

const categoryIcons = { all: Grid2X2, ai: Sparkles, tools: Wrench, creative: Shapes };

export function Finder() {
  const category = useDesktop((state) => state.category);
  const selected = useDesktop((state) => state.selectedProject);
  const search = useDesktop((state) => state.search);
  const searchFocus = useDesktop((state) => state.searchFocus);
  const showCategory = useDesktop((state) => state.showCategory);
  const select = useDesktop((state) => state.selectProject);
  const setSearch = useDesktop((state) => state.setSearch);
  const open = useDesktop((state) => state.openApp);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchFocus > 0) searchRef.current?.focus(); }, [searchFocus]);
  const location = categories.find((entry) => entry.id === category)!;
  const project = projects.find((entry) => entry.id === selected);
  const visible = projects.filter((entry) => (category === 'all' || entry.category === category) && `${entry.name} ${entry.description} ${entry.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="finder-layout">
    <aside className="finder-sidebar"><span className="sidebar-label">我的空间</span>{categories.map((entry) => { const Icon = categoryIcons[entry.id]; return <button key={entry.id} className={category === entry.id ? 'sidebar-item selected' : 'sidebar-item'} onClick={() => showCategory(entry.id)}><Icon size={16}/>{entry.label}<small>{entry.id === 'all' ? projects.length : projects.filter((project) => project.category === entry.id).length}</small></button>; })}<span className="sidebar-label sidebar-label-second">个人</span><button className="sidebar-item" onClick={() => open('profile')}><FileUser size={16}/>个人资料</button><div className="sidebar-footer"><span className="status-dot"/>持续学习，动手创造。</div></aside>
    <div className="finder-main">
      <div className="finder-tools"><div className="finder-path"><button aria-label="返回作品列表" disabled={!project} onClick={() => select(null)}><ArrowLeft size={17}/></button><FolderOpen size={15}/><span>{location.label}</span>{project && <><ChevronRight size={13}/><strong>{project.shortName}</strong></>}</div><label className="project-search"><Search size={14}/><input ref={searchRef} aria-label="搜索作品" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索作品"/></label></div>
      <div className="finder-scroll">
        {project ? <article className="project-detail"><span className="eyebrow">{project.year}</span><FolderIcon kind={project.category}/><h3>{project.name}</h3><p>{project.description}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links"><a className="pill-button" href={project.url} target="_blank" rel="noopener noreferrer">查看 GitHub 仓库 <ArrowUpRight size={16}/></a>{project.live && <a className="quiet-link" href={project.live} target="_blank" rel="noopener noreferrer">体验项目 <ArrowUpRight size={14}/></a>}</div></article> : <><div className="finder-intro"><span className="eyebrow">SELECTED WORK</span><h3>{location.label}</h3><p>{location.subtitle}</p></div><div className="project-grid">{visible.map((entry) => <button className="project-file" key={entry.id} onClick={() => select(entry.id)}><FolderIcon kind={entry.category}/><strong>{entry.shortName}</strong><span>{entry.tags.slice(0, 2).join(' · ')}</span></button>)}</div>{visible.length === 0 && <p className="empty-search">没有找到“{search}”相关的作品。</p>}</>}
      </div>
      <footer className="finder-status"><span>{project ? project.tags.join(' · ') : `${visible.length} 个项目`}</span><span>ETHAN / SELECTED WORK</span></footer>
    </div>
  </div>;
}
