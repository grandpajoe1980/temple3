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
      accent: 'from-indigo-500 via-purple-500 to-blue-500',
    },
    {
      name: 'Unread Messages',
      value: stats.unreadMessages,
      icon: ChatBubbleLeftIcon,
      accent: 'from-emerald-400 via-teal-400 to-sky-400',
    },
    {
      name: 'Community Members',
      value: stats.communityMembers,
      icon: UserGroupIcon,
      accent: 'from-violet-500 via-indigo-500 to-purple-500',
    },
    {
      name: 'Active Reminders',
      value: stats.activeReminders,
      icon: BellAlertIcon,
      accent: 'from-amber-400 via-orange-400 to-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-100/70 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-br ${item.accent}`} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/70 to-white/30 shadow-inner shadow-indigo-200/60">
                <Icon className="h-6 w-6 text-indigo-500 transition-colors group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-white/80">{item.name}</p>
                <p className="text-3xl font-semibold text-slate-900 transition-colors group-hover:text-white">{item.value}</p>
              </div>
            </div>
            <div className="relative mt-4 text-xs text-slate-500 transition-colors group-hover:text-white/80">
              Harmonize your day with timely insights.
            </div>
          </div>
        );
      })}
    </div>
  );
}
