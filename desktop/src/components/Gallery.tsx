import { useState } from 'react';
import { ArrowLeft, Expand, Image as ImageIcon, Info } from 'lucide-react';
import { assets } from '../data';

export function Gallery() {
  const [expanded, setExpanded] = useState(false);
  return <div className={`gallery-content${expanded ? ' gallery-expanded' : ''}`}><div className="gallery-tools"><button onClick={() => setExpanded(!expanded)} aria-label={expanded ? '返回相册' : '放大图片'}>{expanded ? <ArrowLeft size={16}/> : <Expand size={16}/>}<span>{expanded ? '返回相册' : '查看原图'}</span></button><span><ImageIcon size={14}/>图像收藏 · 01</span></div><button className="gallery-image-button" onClick={() => setExpanded(!expanded)} aria-label={expanded ? '收起日落与远山' : '打开日落与远山'}><img src={assets('sunset-watercolor.png')} alt="水彩日落，远山与草地环绕着一条映着晚霞的河流"/></button>{!expanded && <div className="gallery-caption"><div><span className="eyebrow">A QUIET MOMENT</span><h3>日落与远山</h3><p>为这个个人空间生成的一幅水彩风景，<br/>也为每天打开桌面的片刻，留一点安静。</p></div><span className="image-credit"><Info size={13}/>AI 生成插画</span></div>}</div>;
}
