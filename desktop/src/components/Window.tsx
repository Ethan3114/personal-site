import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useDesktop, type AppId } from '../store';

gsap.registerPlugin(Draggable);

export function Window({ id, title, children, toolbar }: { id: AppId; title: string; children: ReactNode; toolbar?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const z = useDesktop((state) => state.windows[id].z);
  const close = useDesktop((state) => state.closeApp);
  const focus = useDesktop((state) => state.focusApp);

  useLayoutEffect(() => {
    const element = ref.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = gsap.fromTo(element.querySelector('.window-panel'), { opacity: reduced ? 1 : 0, scale: reduced ? 1 : .8, y: reduced ? 0 : 40 }, { opacity: 1, scale: 1, y: 0, duration: reduced ? 0 : .4, ease: 'power3.out' });
    const media = gsap.matchMedia();
    media.add('(min-width: 640px)', () => {
      const [drag] = Draggable.create(element, { type: 'x,y', trigger: element.querySelector('.window-header')!, bounds: '#desktop', allowEventDefault: true, onPress: () => focus(id), dragClickables: false });
      return () => { drag.kill(); gsap.set(element, { x: 0, y: 0 }); };
    });
    element.focus({ preventScroll: true });
    return () => { tween.kill(); media.revert(); };
  }, [id, focus]);

  return <section ref={ref} id={id} className="window-shell" style={{ zIndex: z }} role="dialog" aria-labelledby={`${id}-title`} tabIndex={-1} onPointerDown={() => focus(id)}>
    <div className="window-panel">
      <header className="window-header">
        <div className="traffic-lights"><button className="window-close" aria-label={`关闭${title}窗口`} onClick={() => close(id)}><span>×</span></button><span className="window-yellow" aria-hidden="true"/><span className="window-green" aria-hidden="true"/></div>
        <h2 id={`${id}-title`}>{title}</h2>
        <div className="window-toolbar">{toolbar}</div>
      </header>
      <div className="window-body">{children}</div>
    </div>
  </section>;
}
