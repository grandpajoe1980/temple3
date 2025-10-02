import { MicrophoneIcon } from '@heroicons/react/24/outline';

export default function Media() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MicrophoneIcon className="h-8 w-8" />
            Media Library
          </h1>
          <p className="text-gray-600 mt-2">
            Podcasts, videos, and spiritual talks
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MicrophoneIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Media Library Coming Soon
          </h3>
          <p className="text-gray-600">
            Podcast and video library will be available in Phase 5
          </p>
        </div>
      </div>
    </div>
  );
}
