import { useEffect, useRef, useState } from 'react';
import { Check, Eye, EyeOff, Moon, MousePointer2, X } from 'lucide-react';
import { assets } from '../data';

const frames: Record<string, number[][]> = {
  idle: [[-3,-3]], alert: [[-7,-3]], tired: [[-3,-2]], sleeping: [[-2,0],[-2,-1]], scratch: [[-5,0],[-6,0],[-7,0]],
  N: [[-1,-2],[-1,-3]], NE: [[0,-2],[0,-3]], E: [[-3,0],[-3,-1]], SE: [[-5,-1],[-5,-2]],
  S: [[-6,-3],[-7,-2]], SW: [[-5,-3],[-6,-1]], W: [[-4,-2],[-4,-3]], NW: [[-1,0],[-1,-1]],
};
const coats = [
  { name: '原色', filter: 'none', color: '#f4f1e8' },
  { name: '墨色', filter: 'invert(1)', color: '#292421' },
  { name: '暖棕', filter: 'sepia(1) saturate(1.5)', color: '#b99a72' },
  { name: '雾蓝', filter: 'sepia(1) saturate(2) hue-rotate(155deg)', color: '#98b6c7' },
  { name: '浅紫', filter: 'sepia(1) saturate(2) hue-rotate(225deg)', color: '#bb9fc1' },
];
type Settings = { visible: boolean; coat: number };
export function Pet({ panelOpen, closePanel }: { panelOpen: boolean; closePanel: () => void }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('ethan-pet-v1');
    return saved ? JSON.parse(saved) : { visible: true, coat: 0 };
  });
  const [sleeping, setSleeping] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const sleepingRef = useRef(false);
  const drag = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const position = useRef({ x: 60, y: 85 });
  const pointer = useRef({ x: 60, y: 85 });
  const longPress = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { sleepingRef.current = sleeping; }, [sleeping]);
  useEffect(() => { localStorage.setItem('ethan-pet-v1', JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    if (!settings.visible) return;
    let frame = 0;
    let idle = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const move = (event: PointerEvent) => {
      if (drag.current) {
        position.current = { x: event.clientX - drag.current.offsetX, y: event.clientY - drag.current.offsetY };
        pointer.current = { ...position.current };
        if (Math.abs(event.movementX) + Math.abs(event.movementY) > 3) clearTimeout(longPress.current);
      } else pointer.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointermove', move, { passive: true });
    const interval = setInterval(() => {
      const element = ref.current;
      if (!element) return;
      frame++;
      const { x, y } = position.current;
      const dx = x - pointer.current.x, dy = y - pointer.current.y;
      const distance = Math.hypot(dx, dy);
      let name = 'idle';
      if (drag.current) name = 'alert';
      else if (sleepingRef.current) name = 'sleeping';
      else if (distance > 48 && !reduced) {
        idle = 0;
        name = `${dy / distance > .5 ? 'N' : dy / distance < -.5 ? 'S' : ''}${dx / distance > .5 ? 'W' : dx / distance < -.5 ? 'E' : ''}`;
        position.current = { x: x - dx / distance * 10, y: y - dy / distance * 10 };
      } else { idle++; if (idle > 100) name = 'sleeping'; else if (idle > 40 && idle % 60 < 12) name = 'scratch'; }
      position.current.x = Math.min(Math.max(16, position.current.x), innerWidth - 16);
      position.current.y = Math.min(Math.max(55, position.current.y), innerHeight - 90);
      const sprite = frames[name][(name === 'sleeping' ? Math.floor(frame / 4) : frame) % frames[name].length];
      element.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
      element.style.transform = `translate3d(${position.current.x - 16}px, ${position.current.y - 16}px, 0)`;
    }, 100);
    return () => { clearInterval(interval); clearTimeout(longPress.current); window.removeEventListener('pointermove', move); };
  }, [settings.visible]);
  const toggleColor = () => setSettings((value) => ({ ...value, coat: (value.coat + 1) % coats.length }));
  return <>
    {settings.visible && <button
      ref={ref} id="oneko" className="pixel-pet"
      aria-label="桌面小猫，双击切换睡眠，拖动移动"
      title="双击睡觉 · 拖动移动 · 右键换色"
      style={{ backgroundImage: `url(${assets('oneko.gif')})`, filter: coats[settings.coat].filter, transform: `translate3d(${position.current.x - 16}px,${position.current.y - 16}px,0)` }}
      onDoubleClick={() => setSleeping((value) => !value)}
      onContextMenu={(event) => { event.preventDefault(); toggleColor(); }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { offsetX: event.clientX - position.current.x, offsetY: event.clientY - position.current.y };
        longPress.current = setTimeout(toggleColor, 500);
      }}
      onPointerUp={() => { drag.current = null; clearTimeout(longPress.current); }}
      onLostPointerCapture={() => { drag.current = null; clearTimeout(longPress.current); }}
    />}
    {panelOpen && <div className="pet-panel" role="dialog" aria-label="桌面小猫设置"><button className="pet-panel-close" aria-label="关闭小猫设置" onClick={closePanel}><X size={16}/></button><span className="eyebrow">A LITTLE COMPANY</span><h3>桌面有只小猫。</h3><p>它会跟着鼠标散步，也喜欢发呆。<br/>拖动它，或双击让它睡一会儿。</p><div className="pet-coats">{coats.map((coat, index) => <button key={coat.name} title={coat.name} aria-label={`选择${coat.name}小猫`} aria-pressed={settings.coat === index} style={{ background: coat.color }} onClick={() => setSettings((value) => ({ ...value, coat: index }))}>{settings.coat === index && <Check size={13}/>}</button>)}</div><div className="pet-options"><button onClick={() => setSleeping((value) => !value)}><Moon size={15}/>{sleeping ? '叫醒小猫' : '让它睡一会儿'}</button><button onClick={() => setSettings((value) => ({ ...value, visible: !value.visible }))}>{settings.visible ? <EyeOff size={15}/> : <Eye size={15}/>} {settings.visible ? '隐藏小猫' : '显示小猫'}</button></div><small><MousePointer2 size={12}/>右键或长按，可以换个颜色。</small><a href={assets('oneko-LICENSE.txt')} target="_blank" rel="noopener noreferrer">oneko · MIT License</a></div>}
  </>;
}
