import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

export default function FeatureCard({ feature }) {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Check if user has permission to view this feature
  const hasAccess = hasPermission(feature.permission);

  const gradientMap = {
    blue: 'from-indigo-500 via-purple-500 to-blue-500',
    green: 'from-emerald-400 via-teal-400 to-cyan-400',
    purple: 'from-violet-500 via-fuchsia-500 to-indigo-500',
    indigo: 'from-blue-500 via-indigo-500 to-purple-500',
    pink: 'from-rose-400 via-pink-500 to-fuchsia-500',
    red: 'from-red-400 via-rose-500 to-orange-500',
    amber: 'from-amber-400 via-orange-400 to-rose-400',
    cyan: 'from-sky-400 via-cyan-400 to-indigo-400',
    gray: 'from-slate-500 via-slate-400 to-slate-300',
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
  const gradient = gradientMap[feature.color] || gradientMap.blue;

  return (
    <button
      onClick={handleClick}
      className="group relative h-full overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 text-left shadow-xl shadow-indigo-100/70 backdrop-blur transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 bg-gradient-to-br ${gradient}`} />
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/70 to-white/30 shadow-inner shadow-indigo-200/60">
            <Icon className="h-6 w-6 text-indigo-500 transition-colors group-hover:text-white" />
          </div>
          <span className="rounded-full border border-indigo-100/70 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-500 shadow-sm shadow-indigo-100/60">
            Explore
          </span>
        </div>
        <h3 className="relative text-lg font-semibold text-slate-900 group-hover:text-white transition-colors">{feature.name}</h3>
        <p className="relative mt-2 text-sm text-slate-500 group-hover:text-white/80 transition-colors">
          {feature.description}
        </p>
        <div className="relative mt-auto pt-6 text-sm font-medium text-indigo-500 group-hover:text-white">
          Enter space →
        </div>
      </div>
    </button>
  );
}
