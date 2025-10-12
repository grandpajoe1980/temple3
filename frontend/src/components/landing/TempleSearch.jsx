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
        setSuggestions(Array.isArray(results?.tenants) ? results.tenants : []);
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
    } catch {
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
          className="block w-full rounded-full border border-transparent bg-white px-10 py-4 text-lg leading-5 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.6)] placeholder-gray-400 focus:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 mt-3 w-full overflow-auto rounded-2xl border border-slate-100 bg-white/95 shadow-2xl shadow-slate-200/70 backdrop-blur max-h-96">
          {suggestions.map((temple) => (
            <button
              key={temple.id}
              onClick={() => handleSelectTemple(temple)}
              className="w-full px-5 py-3 text-left transition hover:bg-indigo-50/70 focus:bg-indigo-50/70 focus:outline-none border-b border-slate-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{temple.name}</div>
              {temple.subdomain && (
                <div className="text-sm text-slate-500">@{temple.subdomain}</div>
              )}
              {temple.address && (
                <div className="mt-1 text-xs text-slate-400">{temple.address}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {showDropdown && searchTerm.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 mt-3 w-full rounded-2xl border border-slate-100 bg-white/95 p-5 text-center shadow-2xl shadow-slate-200/70 backdrop-blur">
          <p className="text-sm font-medium text-slate-700">No temples found matching "{searchTerm}"</p>
          <p className="mt-2 text-sm text-slate-500">Try a different search term or create a new temple</p>
        </div>
      )}
    </div>
  );
};

export default TempleSearch;
