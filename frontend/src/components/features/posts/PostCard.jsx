import { useEffect, useState } from 'react';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../shared/Button';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { postService } from '../../../services/posts';
import { useNotification } from '../../../contexts/NotificationContext';

export default function PostCard({ post, onLike, onCommentAdded }) {
  const { showError, showSuccess } = useNotification();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    if (!showComments || loadedOnce) {
      return;
    }

    let isMounted = true;
    setLoadingComments(true);
    postService
      .getComments(post.id)
      .then((response) => {
        if (!isMounted) return;
        const mapped = (response.comments || []).map((comment) => ({
          id: comment.id,
          author: `${comment.first_name ?? ''} ${comment.last_name ?? ''}`.trim() || 'Community Member',
          content: comment.content,
          timestamp: new Date(comment.created_at || comment.createdAt)
        }));
        setComments(mapped);
        setLoadedOnce(true);
      })
      .catch((error) => {
        console.error('Failed to load comments', error);
        showError('Unable to load comments for this post.');
      })
      .finally(() => {
        if (isMounted) {
          setLoadingComments(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showComments, loadedOnce, post.id, showError]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentSubmitting(true);
    try {
      const response = await postService.addComment(post.id, { content: commentText.trim() });
      const newComment = {
        id: response.comment?.id || Date.now(),
        author: 'You',
        content: commentText.trim(),
        timestamp: new Date(response.comment?.created_at || new Date())
      };
      setComments(prev => [...prev, newComment]);
      setLoadedOnce(true);
      setCommentText('');
      onCommentAdded(post.id);
      showSuccess('Comment added to the conversation.');
    } catch (error) {
      console.error('Failed to add comment', error);
      showError(error.response?.data?.error || 'Unable to add comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <UserCircleIcon className="h-12 w-12 text-slate-300" />
          )}
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">{post.author.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {post.author.role && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                  {post.author.role}
                </span>
              )}
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="px-6 pb-4">
        <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.attachments.length > 0 && (
        <div className="px-6 pb-4">
          {post.attachments.map((attachment, index) => (
            <div key={`${attachment.name}-${index}`} className="overflow-hidden rounded-2xl border border-slate-100">
              <img src={attachment.data} alt={attachment.name} className="w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="px-6 py-3 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100">
        <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
        <button onClick={() => setShowComments(!showComments)} className="hover:text-slate-700">
          {loadedOnce ? comments.length : post.commentCount}{' '}
          {(loadedOnce ? comments.length : post.commentCount) === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      <div className="px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            post.liked
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-slate-50 text-slate-600 border border-transparent hover:border-slate-200'
          }`}
        >
          {post.liked ? <HeartIconSolid className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
          <span className="font-semibold">Appreciate</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 hover:border-slate-200 border border-transparent"
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span className="font-semibold">Discuss</span>
        </button>
      </div>

      {showComments && (
        <div className="px-6 pb-6 border-t border-slate-100">
          {loadingComments ? (
            <div className="py-6 flex justify-center">
              <LoadingSpinner label="Loading conversation" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <UserCircleIcon className="h-9 w-9 text-slate-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-2xl px-4 py-3">
                      <h4 className="text-sm font-semibold text-slate-800">{comment.author}</h4>
                      <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 px-2">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-sm text-slate-500">No comments yet. Start the conversation below.</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="mt-4 flex gap-3">
            <UserCircleIcon className="h-9 w-9 text-slate-300 flex-shrink-0" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a thoughtful response…"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" variant="primary" size="sm" disabled={commentSubmitting}>
                {commentSubmitting ? 'Posting…' : 'Post'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
