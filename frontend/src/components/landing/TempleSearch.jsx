import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { tenantService } from '../../services/tenant';
import { useTenant } from '../../contexts/TenantContext';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from '../shared/LoadingSpinner';

const TempleSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const { switchTenant } = useTenant();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTemples = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const results = await tenantService.list({ search: searchTerm, limit: 5 });
        setSuggestions(Array.isArray(results) ? results : []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTemples, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelectTemple = async (temple) => {
    try {
      await switchTenant(temple.subdomain);
      showSuccess(`Switched to ${temple.name}`);
      setSearchTerm('');
      setShowDropdown(false);
    } catch (error) {
      showError('Failed to switch temple');
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          placeholder="Search for your temple..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto">
          {suggestions.map((temple) => (
            <button
              key={temple.id}
              onClick={() => handleSelectTemple(temple)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{temple.name}</div>
              {temple.subdomain && (
                <div className="text-sm text-gray-500">@{temple.subdomain}</div>
              )}
              {temple.address && (
                <div className="text-xs text-gray-400 mt-1">{temple.address}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {showDropdown && searchTerm.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <p className="text-gray-600">No temples found matching "{searchTerm}"</p>
          <p className="text-sm text-gray-500 mt-2">Try a different search term or create a new temple</p>
        </div>
      )}
    </div>
  );
};

export default TempleSearch;
