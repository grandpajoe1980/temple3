import { HeartIcon } from '@heroicons/react/24/outline';

export default function Donations() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HeartIcon className="h-8 w-8" />
            Donations
          </h1>
          <p className="text-gray-600 mt-2">
            Support our temple community
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Donations Feature Coming Soon
          </h3>
          <p className="text-gray-600">
            Donation system with Venmo/Zelle integration will be available in Phase 5
          </p>
        </div>
      </div>
    </div>
  );
}
