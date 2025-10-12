import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // TODO: Fetch real activities from API
    // For now, using placeholder data
    setActivities([
      {
        id: 1,
        type: 'event',
        title: 'Meditation Session Added',
        description: 'New morning meditation session scheduled for Friday',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: CalendarIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        id: 2,
        type: 'post',
        title: 'New Community Post',
        description: 'Weekly teachings from our spiritual leader',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        icon: ChatBubbleLeftIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      {
        id: 3,
        type: 'text',
        title: 'Sacred Text Updated',
        description: 'New commentary added to weekly readings',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        icon: BookOpenIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
      },
      {
        id: 4,
        type: 'member',
        title: 'New Member Joined',
        description: '3 new members joined the community',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        icon: UserPlusIcon,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
      },
    ]);
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-indigo-100/60 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/60 bg-white/80">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
          <p className="text-xs uppercase tracking-widest text-slate-400">Community pulse</p>
        </div>
        <span className="rounded-full border border-indigo-100/70 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-600">
          Live feed
        </span>
      </div>
      <div className="divide-y divide-white/50">
        {activities.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No recent activity to display
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="group relative px-6 py-5 transition-colors hover:bg-white/80"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/70 to-white/30 shadow-inner shadow-indigo-200/60">
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {activity.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <div className="self-center text-xs font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
                    View →
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {activities.length > 0 && (
        <div className="px-6 py-5 border-t border-white/60 text-center">
          <button className="text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-600">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
}
