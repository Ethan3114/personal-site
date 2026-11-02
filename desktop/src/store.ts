import { create } from 'zustand';
import type { Category } from './data';

export type AppId = 'finder' | 'notes' | 'gallery' | 'contact' | 'terminal' | 'profile';
type WindowState = { open: boolean; z: number };
const closed = () => ({ open: false, z: 10 });

type DesktopState = {
  windows: Record<AppId, WindowState>;
  front: number;
  category: Category;
  selectedProject: string | null;
  search: string;
  searchFocus: number;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  showCategory: (category: Category) => void;
  selectProject: (id: string | null) => void;
  setSearch: (value: string) => void;
  openSearch: () => void;
};

export const useDesktop = create<DesktopState>((set) => ({
  windows: { finder: closed(), notes: closed(), gallery: closed(), contact: closed(), terminal: closed(), profile: closed() },
  front: 1000,
  category: 'all',
  selectedProject: null,
  search: '',
  searchFocus: 0,
  openApp: (id) => set((state) => ({ front: state.front + 1, windows: { ...state.windows, [id]: { open: true, z: state.front + 1 } } })),
  closeApp: (id) => set((state) => ({ windows: { ...state.windows, [id]: { ...state.windows[id], open: false } } })),
  focusApp: (id) => set((state) => state.windows[id].z === state.front ? state : ({ front: state.front + 1, windows: { ...state.windows, [id]: { ...state.windows[id], z: state.front + 1 } } })),
  showCategory: (category) => set((state) => ({ category, selectedProject: null, search: '', front: state.front + 1, windows: { ...state.windows, finder: { open: true, z: state.front + 1 } } })),
  selectProject: (selectedProject) => set({ selectedProject }),
  setSearch: (search) => set({ search, selectedProject: null }),
  openSearch: () => set((state) => ({ category: 'all', selectedProject: null, searchFocus: state.searchFocus + 1, front: state.front + 1, windows: { ...state.windows, finder: { open: true, z: state.front + 1 } } })),
}));
