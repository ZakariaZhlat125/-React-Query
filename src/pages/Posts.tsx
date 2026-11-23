import CreatePostForm from '../components/posts/CreatePostForm';
import PagedPosts from '../components/posts/PagedPosts';
import PostsList from '../components/posts/PostsList';
import PostViewer from '../components/posts/PostViewer';
import { useUIStore, type PostsTab } from '../store/uiStore';

const TABS: { id: PostsTab; label: string }[] = [
  { id: 'list', label: '1. List + Refresh' },
  { id: 'viewer', label: '2. Viewer (enabled)' },
  { id: 'create', label: '3. Create (mutation)' },
  { id: 'paged', label: '★ Pagination' },
];

// The selected tab is CLIENT state → Zustand (it survives navigating away and back).
export default function Posts() {
  const selectedTab = useUIStore((s) => s.selectedTab);
  const setSelectedTab = useUIStore((s) => s.setSelectedTab);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Posts</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              selectedTab === t.id ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {selectedTab === 'list' && <PostsList />}
      {selectedTab === 'viewer' && <PostViewer />}
      {selectedTab === 'create' && <CreatePostForm />}
      {selectedTab === 'paged' && <PagedPosts />}
    </div>
  );
}
