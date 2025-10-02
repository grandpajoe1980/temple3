import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function ReligiousTexts() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpenIcon className="h-8 w-8" />
            Religious Texts
          </h1>
          <p className="text-gray-600 mt-2">
            Access sacred texts and spiritual teachings
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Religious Texts Feature Coming Soon
          </h3>
          <p className="text-gray-600">
            Text library and reading interface will be available in Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
