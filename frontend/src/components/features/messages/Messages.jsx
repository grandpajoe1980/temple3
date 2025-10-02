import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function Messages() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ChatBubbleLeftIcon className="h-8 w-8" />
            Messages
          </h1>
          <p className="text-gray-600 mt-2">
            Direct and group messaging with community members
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ChatBubbleLeftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Messages Feature Coming Soon
          </h3>
          <p className="text-gray-600">
            Messaging system will be available in Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
