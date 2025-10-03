import { useState } from 'react';
import { 
  HeartIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../shared/Button';

export default function PostCard({ post, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: 'Current User',
        content: commentText,
        timestamp: new Date()
      };
      setComments([...comments, newComment]);
      setCommentText('');
      onComment(post.id, commentText);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {post.author.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`${
                post.author.role === 'Clergy' ? 'text-blue-600 font-medium' :
                post.author.role === 'Admin' ? 'text-purple-600 font-medium' :
                ''
              }`}>
                {post.author.role}
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img 
            src={post.image} 
            alt="Post content"
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-b">
        <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="hover:text-gray-700"
        >
          {post.comments + comments.length} {post.comments + comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex items-center gap-4">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
            post.liked ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {post.liked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="font-medium">Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span className="font-medium">Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t">
          {/* Existing Comments */}
          {comments.map(comment => (
            <div key={comment.id} className="py-3 flex gap-3">
              <UserCircleIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <h4 className="font-semibold text-sm text-gray-900">{comment.author}</h4>
                  <p className="text-sm text-gray-800">{comment.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-3">
                  {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="mt-3 flex gap-3">
            <UserCircleIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" variant="primary" size="sm">
                Post
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
