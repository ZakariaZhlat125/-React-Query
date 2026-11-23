import { create } from 'zustand';

// UI-only client state. No API data here — that belongs to React Query.
export type PostsTab = 'list' | 'viewer' | 'create' | 'paged';

interface UIStore {
  sidebarOpen: boolean;
  selectedTab: PostsTab;
  toggleSidebar: () => void;
  setSelectedTab: (tab: PostsTab) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  selectedTab: 'list',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));
