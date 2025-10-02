import { useState } from 'react';
import api from '../../services/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const ApiTest = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await api.get('/health', {
        baseURL: 'http://localhost:3000'
      });
      setStatus(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend API Test</h3>
      
      <Button onClick={testConnection} disabled={loading}>
        Test Backend Connection
      </Button>

      {loading && (
        <div className="mt-4">
          <LoadingSpinner />
        </div>
      )}

      {status && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 font-medium">✓ Backend Connected!</p>
          <p className="text-sm text-green-700 mt-1">Status: {status.status}</p>
          <p className="text-xs text-green-600 mt-1">Time: {status.timestamp}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-medium">✗ Connection Failed</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
