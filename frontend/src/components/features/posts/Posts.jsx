import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Button from '../../shared/Button';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { postService } from '../../../services/posts';
import { useNotification } from '../../../contexts/NotificationContext';
import { useTenant } from '../../../contexts/TenantContext';
import { useAuth } from '../../../hooks/useAuth';

const mapPost = (post, currentUser) => {
  const attachmentsRaw = post.attachments;
  let attachments = [];
  if (attachmentsRaw) {
    try {
      const parsed = typeof attachmentsRaw === 'string' ? JSON.parse(attachmentsRaw) : attachmentsRaw;
      attachments = Array.isArray(parsed)
        ? parsed.map((item, index) => ({
            name: item.name || `attachment-${index + 1}`,
            data: item.data || item.url || '',
            type: item.type || 'image/png'
          })).filter(item => item.data)
        : [];
    } catch (error) {
      console.warn('Failed to parse attachments for post', post.id, error);
    }
  }

  const authorName = `${post.first_name ?? ''} ${post.last_name ?? ''}`.trim() || 'Community Member';

  return {
    id: post.id,
    content: post.content,
    createdAt: post.created_at || new Date().toISOString(),
    author: {
      name: authorName,
      role: post.author_role || (post.author_id === currentUser?.id ? 'You' : ''),
      avatar: null
    },
    attachments,
    likes: post.likes || 0,
    liked: false,
    commentCount: post.comment_count || 0
  };
};

export default function Posts() {
  const { showError, showSuccess } = useNotification();
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadPosts = useCallback(async () => {
    if (!currentTenant) {
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      const response = await postService.list({ limit: 50, isPublished: true });
      const mapped = (response.posts || []).map(post => mapPost(post, user));
      setPosts(mapped);
    } catch (error) {
      console.error('Failed to load posts', error);
      showError('Unable to load community posts right now.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant, showError, user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async ({ content, attachments }) => {
    setCreating(true);
    try {
      await postService.create({
        content,
        attachments,
        isPublished: true
      });
      showSuccess('Post shared with your community.');
      setShowCreateModal(false);
      await loadPosts();
    } catch (error) {
      console.error('Failed to create post', error);
      showError(error.response?.data?.error || 'Unable to create post.');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1)
        };
      }
      return post;
    }));
  };

  const handleCommentAdded = (postId) => {
    setPosts(prev => prev.map(post => (
      post.id === postId
        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
        : post
    )));
  };

  const gradientBackground = useMemo(() => (
    'from-blue-600 via-indigo-600 to-purple-600'
  ), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${gradientBackground} text-white shadow-2xl`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_55%)]" />
          <div className="relative p-8 sm:p-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider backdrop-blur">
                  Tenant feed
                </div>
                <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
                  <ChatBubbleLeftRightIcon className="h-9 w-9" />
                  Community Feed
                </h1>
                <p className="mt-2 text-white/80 max-w-2xl">
                  Celebrate milestones, share reflections, and keep your tenant connected. Posts live inside your tenant boundary so every story reaches the right community.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="bg-white/90 text-blue-600 hover:bg-white"
              >
                <PlusIcon className="h-5 w-5" />
                Create Post
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-sm">
                <p className="text-white/90 font-semibold">Tenant-only visibility</p>
                <p className="text-white/70 mt-1">Members, clergy, and staff see posts scoped to their tenant.</p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-sm">
                <p className="text-white/90 font-semibold">Rich storytelling</p>
                <p className="text-white/70 mt-1">Attach imagery and spark conversation instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {loading ? (
            <div className="bg-white/70 backdrop-blur rounded-3xl border border-slate-100 p-12 flex justify-center">
              <LoadingSpinner size="lg" label="Loading tenant posts" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <ChatBubbleLeftRightIcon className="h-14 w-14 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">No posts yet</h3>
              <p className="text-slate-500 mt-2 mb-6">Start the conversation for your community.</p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Share Something
              </Button>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onCommentAdded={handleCommentAdded}
              />
            ))
          )}
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />

      {creating && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur flex items-center justify-center z-50">
          <LoadingSpinner label="Publishing your post" />
        </div>
      )}
    </div>
  );
}
