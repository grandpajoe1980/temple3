export type Post = {
  id: string;
  title?: string;
  content: string;
  publishedAt?: string;
  author?: string;
};

const resolveApiBase = () => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.API_URL || 'http://localhost:3000';
};

export async function getPostsForTenant(tenantId: string): Promise<Post[]> {
  const apiBase = resolveApiBase();
  const url = `${apiBase}/api/tenants/${encodeURIComponent(tenantId)}/posts`;
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to load posts for tenant');
  }

  const data = await response.json();
  const posts = Array.isArray(data?.posts) ? data.posts : data;
  return posts.map((post: any) => ({
    id: String(post.id ?? crypto.randomUUID()),
    title: post.title ?? post.heading ?? '',
    content: post.content ?? '',
    publishedAt: post.publishedAt ?? post.published_at ?? null,
    author: post.author ?? post.authorName ?? 'Unknown'
  }));
}
