'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getPostsForTenant, Post } from '../../../lib/data';

interface PostsPageProps {
  tenantId: string;
}

const PostsPage: React.FC<PostsPageProps> = ({ tenantId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPostsForTenant(tenantId);
        if (mounted) {
          setPosts(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Unable to load posts for this tenant.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (tenantId) {
      load();
    }

    return () => {
      mounted = false;
    };
  }, [tenantId]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [posts]);

  if (loading) {
    return <div className="p-6">Loading posts…</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900">
        <p className="font-semibold">Unable to load posts</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (sortedPosts.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white/80 p-6 text-slate-700">
        <p className="font-semibold">No posts available</p>
        <p className="text-sm mt-1">Published posts will appear here once they exist for this tenant.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedPosts.map((post) => (
        <article key={post.id} className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <header className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>{post.author ?? 'Unknown author'}</span>
            {post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleString()}</time>}
          </header>
          <h3 className="text-lg font-semibold text-slate-900">{post.title || 'Untitled post'}</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{post.content}</p>
        </article>
      ))}
    </div>
  );
};

export default PostsPage;
