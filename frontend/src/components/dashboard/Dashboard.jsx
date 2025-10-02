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
  const { currentTenant } = useTenant();

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
  if (user?.role === 'admin' || user?.permissions?.includes('admin')) {
    features.push({
      id: 'admin',
      name: 'Admin Panel',
      description: 'Manage temple settings',
      icon: CogIcon,
      color: 'gray',
      permission: 'admin',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.firstName || user?.email}!
            </h1>
            <p className="text-xl text-blue-100">
              {currentTenant?.name || 'Your Temple Community'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <QuickStats />

        {/* Feature Cards Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
