import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Cat, Search, Command, Wifi, ArrowUpRight, Github, Sun, FileText, FolderOpen } from 'lucide-react';
import { useDesktop, type AppId } from './store';
import { assets, categories, profile } from './data';
import { Window } from './components/Window';
import { AppIcon, FolderIcon } from './components/Icon';
import { Finder } from './components/Finder';
import { Notes } from './components/Notes';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Terminal } from './components/Terminal';
import { Pet } from './components/Pet';
const Profile = lazy(() => import('./components/Profile'));

const apps: { id: AppId; title: string }[] = [
  { id: 'finder', title: '作品' }, { id: 'notes', title: '随笔' }, { id: 'gallery', title: '相册' },
  { id: 'contact', title: '联系' }, { id: 'terminal', title: '技能' }, { id: 'profile', title: '个人资料' },
];
const appContent = { finder: <Finder/>, notes: <Notes/>, gallery: <Gallery/>, contact: <Contact/>, terminal: <Terminal/>, profile: <Suspense fallback={<p className="loading-message">正在打开个人资料…</p>}><Profile/></Suspense> };

function VariableText({ text, title = false }: { text: string; title?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current!;
    if (matchMedia('(max-width:639px)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const letters = element.querySelectorAll('span');
    const min = title ? 400 : 300, max = title ? 900 : 600;
    const move = (event: PointerEvent) => {
      const boxes = [...letters].map((letter) => letter.getBoundingClientRect());
      letters.forEach((letter, index) => {
        const d = event.clientX - (boxes[index].left + boxes[index].width / 2);
        gsap.to(letter, { fontVariationSettings: `"wght" ${min + (max - min) * Math.exp(-(d * d) / 20000)}`, duration: .25, ease: 'power2.out', overwrite: true });
      });
    };
    const leave = () => gsap.to(letters, { fontVariationSettings: `"wght" ${min}`, duration: .3, ease: 'power2.out', overwrite: true });
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); gsap.killTweensOf(letters); };
  }, [title]);
  return <span ref={ref} className={title ? 'variable-title' : 'variable-subtitle'} aria-label={text}>{[...text].map((letter, index) => <span aria-hidden="true" key={index} style={{ fontVariationSettings: `"wght" ${title ? 400 : 300}` }}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>;
}

function Clock() {
  const [date, setDate] = useState(() => new Date());
  useEffect(() => { const interval = setInterval(() => setDate(new Date()), 1000); return () => clearInterval(interval); }, []);
  return <time dateTime={date.toISOString()}>{new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)}</time>;
}

function Dock() {
  const open = useDesktop((state) => state.openApp);
  const windows = useDesktop((state) => state.windows);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const icons = element.querySelectorAll<HTMLButtonElement>('.dock-button');
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const boxes = [...icons].map((icon) => icon.getBoundingClientRect());
      icons.forEach((icon, index) => { const d = Math.abs(event.clientX - boxes[index].left - boxes[index].width / 2); const weight = Math.exp(-(d ** 2.5) / 20000); gsap.to(icon, { scale: 1 + .25 * weight, y: -15 * weight, duration: .2, ease: 'power1.out', overwrite: true }); });
    };
    const leave = () => gsap.to(icons, { scale: 1, y: 0, duration: .3, ease: 'power1.out', overwrite: true });
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); gsap.killTweensOf(icons); };
  }, []);
  return <nav id="dock" aria-label="应用程序"><div ref={ref} className="dock-container">{apps.slice(0, 5).map((app) => <div className="dock-item" key={app.id}><button className="dock-button" data-app={app.id} aria-label={`打开${app.title}`} onClick={() => open(app.id)}><AppIcon id={app.id}/><span className="dock-tooltip">{app.title}</span></button><span className={windows[app.id].open ? 'dock-indicator is-open' : 'dock-indicator'}/></div>)}<span className="dock-separator"/><div className="dock-item"><button className="dock-button" data-app="profile" aria-label="打开个人资料" onClick={() => open('profile')}><AppIcon id="profile"/><span className="dock-tooltip">个人资料</span></button><span className={windows.profile.open ? 'dock-indicator is-open' : 'dock-indicator'}/></div></div></nav>;
}

export default function App() {
  const windows = useDesktop((state) => state.windows);
  const open = useDesktop((state) => state.openApp);
  const showCategory = useDesktop((state) => state.showCategory);
  const openSearch = useDesktop((state) => state.openSearch);
  const [petPanel, setPetPanel] = useState(false);
  const typed = useRef('');
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 640px)', () => {
      const folders = Draggable.create('.desktop-folder', { type: 'x,y', bounds: '#desktop', dragClickables: true });
      return () => { folders.forEach((folder) => folder.kill()); gsap.set('.desktop-folder', { x: 0, y: 0 }); };
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
      if (!(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        typed.current = (typed.current + event.key.toLowerCase()).slice(-5);
        if (typed.current === 'oneko') setPetPanel(true);
      }
      if (event.key === 'Escape') {
        if (petPanel) { setPetPanel(false); return; }
        const state = useDesktop.getState();
        const top = apps.filter((app) => state.windows[app.id].open).sort((a, b) => state.windows[b.id].z - state.windows[a.id].z)[0];
        if (top) { state.closeApp(top.id); document.querySelector<HTMLButtonElement>(`.dock-button[data-app="${top.id}"]`)?.focus(); }
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [openSearch, petPanel]);

  return <main id="desktop" aria-label="Ethan 的个人桌面">
    <div className="wallpaper" style={{ backgroundImage: `url(${assets('sunset-watercolor.png')})` }}/>
    <header className="menu-bar"><div className="menu-left"><button className="desktop-brand" onClick={() => open('profile')} aria-label="关于耿江山 Ethan"><span>✳</span><strong>Ethan 的桌面</strong></button><nav className="menu-links" aria-label="桌面菜单"><button onClick={() => showCategory('all')}>作品</button><button onClick={() => open('notes')}>随笔</button><button onClick={() => open('contact')}>联系</button><button onClick={() => open('profile')}>关于我</button></nav></div><div className="menu-right"><button className={petPanel ? 'menu-icon active' : 'menu-icon'} aria-label="桌面小猫设置" aria-expanded={petPanel} onClick={() => setPetPanel(!petPanel)}><Cat size={17}/></button><button className="menu-icon search-trigger" aria-label="搜索作品" onClick={openSearch}><Search size={16}/></button><Wifi size={16} className="status-wifi"/><span className="menu-divider"/><Clock/></div></header>
    <section id="welcome" aria-label="欢迎来到 Ethan 的个人网站"><div className="welcome-kicker"><span/>AI PRODUCT MANAGER & CREATOR</div><p><VariableText text="Hey I'm Ethan. Welcome to my"/></p><h1><VariableText text="portfolio" title/></h1><p className="welcome-bio">耿江山 · AI 应用与 Agent 工具 · 技术写作</p><div className="welcome-caption">保持好奇，动手创造，记录发现。</div></section>
    <nav className="desktop-folders" aria-label="作品分类">{categories.slice(1).map((category, index) => <button key={category.id} className="desktop-folder" onClick={() => showCategory(category.id)}><FolderIcon kind={category.id}/><span>{category.label}</span><small>0{index + 1}</small></button>)}</nav>
    <div className="desktop-note"><Sun size={15}/><span>为想法，留一扇门。</span><small>PERSONAL SPACE / EST. 2026</small></div>
    <div className="desktop-footer"><span><Command size={12}/>K 搜索作品</span><a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={13}/>@Ethan3114<ArrowUpRight size={12}/></a></div>
    {apps.map((app) => windows[app.id].open ? <Window key={app.id} id={app.id} title={app.title} toolbar={app.id === 'finder' ? <FolderOpen size={15}/> : app.id === 'profile' ? <FileText size={15}/> : undefined}>{appContent[app.id]}</Window> : null)}
    <Dock/>
    <Pet panelOpen={petPanel} closePanel={() => setPetPanel(false)}/>
  </main>;
}
