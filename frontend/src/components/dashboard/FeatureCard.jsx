import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

export default function FeatureCard({ feature }) {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Check if user has permission to view this feature
  const hasAccess = hasPermission(feature.permission);

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
    cyan: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
    gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  };

  const handleClick = () => {
    if (hasAccess) {
      navigate(`/${feature.id}`);
    }
  };

  if (!hasAccess) {
    return null; // Hide features user doesn't have access to
  }

  const Icon = feature.icon;
  const colorClass = colorClasses[feature.color] || colorClasses.blue;

  return (
    <button
      onClick={handleClick}
      className={`${colorClass} rounded-lg p-6 text-left transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
      <p className="text-sm opacity-80">{feature.description}</p>
    </button>
  );
}
