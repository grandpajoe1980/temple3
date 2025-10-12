import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../contexts/TenantContext';
import FeatureCard from './FeatureCard';
import QuickStats from './QuickStats';
import RecentActivity from './RecentActivity';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  MicrophoneIcon,
  HeartIcon,
  BellIcon,
  UserGroupIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const { currentTenant, tenantData } = useTenant();

  // Define available features based on user permissions
  const features = [
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'View and manage temple events',
      icon: CalendarIcon,
      color: 'blue',
      permission: 'view_calendar',
    },
    {
      id: 'posts',
      name: 'Posts & Feed',
      description: 'Share and view community posts',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      permission: 'view_posts',
    },
    {
      id: 'texts',
      name: 'Religious Texts',
      description: 'Access sacred texts and teachings',
      icon: BookOpenIcon,
      color: 'purple',
      permission: 'view_texts',
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'Direct and group messaging',
      icon: ChatBubbleLeftRightIcon,
      color: 'indigo',
      permission: 'view_messages',
    },
    {
      id: 'media',
      name: 'Media Library',
      description: 'Podcasts, videos, and talks',
      icon: MicrophoneIcon,
      color: 'pink',
      permission: 'view_media',
    },
    {
      id: 'donations',
      name: 'Donations',
      description: 'Support our temple community',
      icon: HeartIcon,
      color: 'red',
      permission: 'view_donations',
    },
    {
      id: 'bells',
      name: 'Reminder Bells',
      description: 'Mindfulness reminders',
      icon: BellIcon,
      color: 'amber',
      permission: 'view_bells',
    },
    {
      id: 'members',
      name: 'Members',
      description: 'View temple community members',
      icon: UserGroupIcon,
      color: 'cyan',
      permission: 'view_members',
    },
  ];

  // Add admin panel if user has admin permissions
  if (
    user?.role === 'admin' ||
    user?.permissions?.includes('manage_settings') ||
    user?.permissions?.includes('all')
  ) {
    features.push({
      id: 'admin',
      name: 'Admin Control Panel',
      description: 'Curate tenant sections, members, and moderation from one hub.',
      icon: CogIcon,
      color: 'gray',
      permission: 'manage_settings',
    });
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-100/60 via-transparent to-transparent" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">
                {tenantData?.name || currentTenant || 'Temple constellation'}
              </p>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, {user?.firstName || user?.email}.
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl">
                We’ve readied your rituals, highlighted communal rhythms, and surfaced what needs gentle attention today.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-white/20 blur-2xl" />
              <div className="relative rounded-3xl border border-white/40 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
                <h2 className="text-lg font-semibold text-white">Today’s Alignment</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/80">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-widest text-white/60">Upcoming</p>
                    <p className="mt-1 text-2xl font-semibold">3</p>
                    <p className="text-xs text-white/70">Community ceremonies</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-widest text-white/60">Connections</p>
                    <p className="mt-1 text-2xl font-semibold">5</p>
                    <p className="text-xs text-white/70">Messages awaiting</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-widest text-white/60">Rhythms</p>
                    <p className="mt-1 text-2xl font-semibold">127</p>
                    <p className="text-xs text-white/70">Active members</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-widest text-white/60">Reminders</p>
                    <p className="mt-1 text-2xl font-semibold">2</p>
                    <p className="text-xs text-white/70">Mindful bells</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Stats */}
        <QuickStats />

        {/* Feature Cards Grid */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Your luminous toolkit</h2>
              <p className="text-sm text-slate-500">Access curated modules and tenant-specific flows from one shimmering grid.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <RecentActivity />
        </section>
      </div>
    </div>
  );
}
