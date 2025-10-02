import ApiTest from '../shared/ApiTest';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Temple3
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your spiritual community platform for modern times
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Find Your Temple
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Create a Temple
            </button>
          </div>
        </div>
        
        {/* API Test Component for Phase 1 validation */}
        <div className="flex justify-center mt-12">
          <ApiTest />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
