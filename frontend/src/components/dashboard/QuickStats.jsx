import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

export default function QuickStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    unreadMessages: 0,
    communityMembers: 0,
    activeReminders: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now, using placeholder data
    setStats({
      upcomingEvents: 3,
      unreadMessages: 5,
      communityMembers: 127,
      activeReminders: 2,
    });
  }, [user]);

  const statItems = [
    {
      name: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Unread Messages',
      value: stats.unreadMessages,
      icon: ChatBubbleLeftIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Community Members',
      value: stats.communityMembers,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Reminders',
      value: stats.activeReminders,
      icon: BellAlertIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${item.bgColor} rounded-lg p-3 mr-4`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.name}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
