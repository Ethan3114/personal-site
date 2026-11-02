import { useState, useRef, useEffect, type FormEvent } from 'react';
import { profile, skills, projects } from '../data';
import { useDesktop } from '../store';

export function Terminal() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{command: string; output: string}[]>([]);
  const [showSkills, setShowSkills] = useState(true);
  const bottom = useRef<HTMLDivElement>(null);
  const open = useDesktop((state) => state.openApp);
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'nearest' }); }, [history]);
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;
    if (value === 'clear') { setHistory([]); setShowSkills(false); setCommand(''); return; }
    let output: string;
    if (value === 'help') output = 'about       个人介绍\nprojects    打开作品窗口\nskills      技能与实践\nclear       清空终端\nhelp        查看可用命令';
    else if (value === 'about') output = `${profile.name} / Ethan\n${profile.role}\n${profile.bio}\n${profile.github}`;
    else if (value === 'projects') { open('finder'); output = `已打开作品窗口，共 ${projects.length} 个公开项目。`; }
    else if (value === 'skills') output = skills.map(([name, description]) => `${name}  ${description}`).join('\n');
    else output = `未识别的命令：${value}\n输入 help 查看可用命令。`;
    setHistory((entries) => [...entries, { command: value, output }]); setCommand('');
  }
  return <div className="terminal-content"><p className="terminal-welcome">Ethan’s workspace <span>个人技能与实践</span></p>{showSkills && <><p className="terminal-command"><b>@ethan</b> % skills</p><div className="terminal-table"><div className="terminal-labels"><span>分类</span><span>技术与工具</span></div>{skills.map(([name, description]) => <div className="skill-row" key={name}><strong>{name}</strong><p>{description}</p></div>)}</div><p className="terminal-footnote">{skills.length} 个实践方向 · 持续学习中</p></>}{history.map((entry, index) => <div className="terminal-entry" key={index}><p><b>@ethan</b> % {entry.command}</p><pre>{entry.output}</pre></div>)}<form onSubmit={submit} className="terminal-input"><label htmlFor="terminal-command">@ethan %</label><input id="terminal-command" autoComplete="off" spellCheck={false} value={command} onChange={(event) => setCommand(event.target.value)} placeholder="输入 help，按回车" aria-label="终端命令"/></form><div ref={bottom}/></div>;
}
