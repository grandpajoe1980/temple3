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
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No recent activity to display
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start">
                  <div className={`${activity.bgColor} rounded-lg p-2 mr-4 flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {activities.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}
