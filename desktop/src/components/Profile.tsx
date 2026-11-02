import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Minus, Plus } from 'lucide-react';
import { assets } from '../data';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export default function Profile() {
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(640);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.min(640, entry.contentRect.width - 32)));
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  return <div className="profile-app"><div className="pdf-tools"><span>个人资料.pdf</span><div><button aria-label="缩小文档" disabled={scale <= .5} onClick={() => setScale((value) => value - .25)}><Minus size={15}/></button><span aria-live="polite">{Math.round(scale * 100)}%</span><button aria-label="放大文档" disabled={scale >= 3} onClick={() => setScale((value) => value + .25)}><Plus size={15}/></button><a href={assets('ethan-profile.pdf')} download="耿江山-Ethan-个人资料.pdf" aria-label="下载个人资料 PDF"><Download size={16}/></a></div></div><div className="pdf-scroll" ref={ref}><Document file={assets('ethan-profile.pdf')} loading={<p className="loading-message">正在读取个人资料…</p>}><Page pageNumber={1} width={width} scale={scale} loading={<p className="loading-message">正在排版文档…</p>}/></Document></div></div>;
}
