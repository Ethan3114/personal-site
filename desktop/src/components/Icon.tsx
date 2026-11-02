import { BookOpen, FolderOpen, Image, ContactRound, Terminal, Trash2, FileText } from 'lucide-react';
import type { AppId } from '../store';

const icons = { finder: FolderOpen, notes: BookOpen, gallery: Image, contact: ContactRound, terminal: Terminal, profile: FileText, archive: Trash2 };
export function AppIcon({ id, small = false }: { id: AppId | 'archive'; small?: boolean }) {
  const Icon = icons[id];
  return <span className={`app-icon app-icon-${id}${small ? ' app-icon-small' : ''}`} aria-hidden="true"><Icon strokeWidth={1.5}/></span>;
}

export function FolderIcon({ kind = 'ai' }: { kind?: string }) {
  return <svg className={`folder-icon folder-${kind}`} viewBox="0 0 88 72" fill="none" aria-hidden="true"><path d="M4 13a7 7 0 0 1 7-7h22l9 8h35a7 7 0 0 1 7 7v39a7 7 0 0 1-7 7H11a7 7 0 0 1-7-7V13Z" fill="currentColor" opacity=".7"/><path d="M4 25a7 7 0 0 1 7-7h66a7 7 0 0 1 7 7v35a7 7 0 0 1-7 7H11a7 7 0 0 1-7-7V25Z" fill="currentColor"/><path d="M11 20h66" stroke="white" strokeOpacity=".45" strokeWidth="2"/><path d="m37 41-6 6 6 6m14-12 6 6-6 6m-6-15-4 21" stroke="white" strokeOpacity=".85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
