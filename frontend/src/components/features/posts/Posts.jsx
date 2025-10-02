import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Button from '../../shared/Button';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';

export default function Posts() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Rev. John Smith',
        role: 'Clergy',
        avatar: null
      },
      content: 'Welcome to our new community platform! We\'re excited to share this space with all of you. Please feel free to share your thoughts, prayers, and community updates here.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      likes: 12,
      comments: 3,
      liked: false,
      image: null
    },
    {
      id: 2,
      author: {
        name: 'Mary Johnson',
        role: 'Member',
        avatar: null
      },
      content: 'Looking forward to Sunday\'s service! Has anyone heard if we\'ll have the children\'s choir performing?',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      likes: 5,
      comments: 2,
      liked: false,
      image: null
    }
  ]);

  const handleCreatePost = (postData) => {
    const newPost = {
      id: posts.length + 1,
      author: {
        name: 'Current User',
        role: 'Member',
        avatar: null
      },
      content: postData.content,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      liked: false,
      image: postData.image
    };
    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="h-8 w-8" />
              Community Feed
            </h1>
            <p className="text-gray-600 mt-1">
              Share and view community posts and updates
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Post
          </Button>
        </div>

        {/* Create Post Card */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            What's on your mind?
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share something with your community!
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create First Post
            </Button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
