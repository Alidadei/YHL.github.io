import { useState, useMemo, useEffect } from 'react';

interface SearchBarProps {
  lang: 'zh' | 'en';
}

const labels = {
  zh: { placeholder: '搜索文章...', noResults: '没有找到匹配的文章' },
  en: { placeholder: 'Search posts...', noResults: 'No matching posts found' },
};

interface Post {
  id: string;
  data: {
    title: string;
    description?: string;
    tags: string[];
    date: string;
  };
}

export default function SearchBar({ lang }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const t = labels[lang];

  useEffect(() => {
    const el = document.getElementById('search-posts-data');
    if (el) {
      try { setPosts(JSON.parse(el.textContent || '[]')); } catch { /* empty */ }
    }
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter((p) =>
      p.data.title.toLowerCase().includes(q) ||
      p.data.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (p.data.description && p.data.description.toLowerCase().includes(q))
    );
  }, [query, posts]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
      />
      {query.trim() && (
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          {results.length > 0
            ? `${results.length} ${lang === 'zh' ? '条结果' : 'results'}`
            : t.noResults}
        </p>
      )}
    </div>
  );
}
