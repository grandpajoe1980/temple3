import { useEffect, useMemo, useState } from 'react';
import { Switch, Tab } from '@headlessui/react';
import {
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  PlusIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  MegaphoneIcon,
  SparklesIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useTenant } from '../../contexts/TenantContext';
import { useNotification } from '../../contexts/NotificationContext';
import usePermissions from '../../hooks/usePermissions';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const SECTION_CATALOG = [
  {
    id: 'dashboard',
    name: 'Community Dashboard',
    description: 'Overview cards, quick stats, and activity feed for members.',
    locked: true
  },
  {
    id: 'calendar',
    name: 'Events & Calendar',
    description: 'Schedule gatherings, services, and special programming.',
    locked: false
  },
  {
    id: 'posts',
    name: 'Community Posts',
    description: 'Feed of reflections, announcements, and celebrations.',
    locked: false
  },
  {
    id: 'texts',
    name: 'Living Library',
    description: 'Host sacred texts, teachings, and study guides.',
    locked: false
  },
  {
    id: 'messages',
    name: 'Messaging Suite',
    description: 'Direct messages, circles, and broadcast updates.',
    locked: false
  },
  {
    id: 'media',
    name: 'Media Library',
    description: 'Podcasts, livestream archives, and video lessons.',
    locked: false
  },
  {
    id: 'donations',
    name: 'Donations & Giving',
    description: 'Support campaigns, pledges, and generosity tracking.',
    locked: false
  },
  {
    id: 'bells',
    name: 'Mindfulness Bells',
    description: 'Moments of pause delivered to your community.',
    locked: false
  },
  {
    id: 'admin',
    name: 'Control Panel',
    description: 'Govern every aspect of your tenant experience.',
    locked: true
  }
];

const FUTURE_FEATURE_CONTROLS = [
  {
    id: 'volunteer-matching',
    name: 'Volunteer Matching Hub',
    description: 'Coordinate teams, service opportunities, and skill tracking.'
  },
  {
    id: 'ai-companion',
    name: 'AI Reflection Companion',
    description: 'Offer guided meditations and sermon drafting assistance.'
  },
  {
    id: 'live-streaming',
    name: 'Live Streaming Studio',
    description: 'Broadcast services with multi-camera support and chat.'
  },
  {
    id: 'analytics',
    name: 'Deep Insights Analytics',
    description: 'Tenant health, engagement funnels, and custom KPIs.'
  },
  {
    id: 'marketplace',
    name: 'Community Marketplace',
    description: 'Enable artisanal storefronts and fundraising pop-ups.'
  }
];

const DEFAULT_USER_DIRECTORY = [
  {
    id: 'u-1',
    name: 'Amelia Rivers',
    email: 'amelia@temple3.org',
    role: 'clergy',
    status: 'active',
    lastActive: '2 hours ago'
  },
  {
    id: 'u-2',
    name: 'Jamal Ortiz',
    email: 'jamal@temple3.org',
    role: 'member',
    status: 'active',
    lastActive: '16 minutes ago'
  },
  {
    id: 'u-3',
    name: 'Priya Kannan',
    email: 'priya@temple3.org',
    role: 'admin',
    status: 'active',
    lastActive: 'online now'
  },
  {
    id: 'u-4',
    name: 'Theo Marshall',
    email: 'theo@temple3.org',
    role: 'member',
    status: 'invited',
    lastActive: 'pending acceptance'
  }
];

const DEFAULT_MODERATION_SETTINGS = {
  autoFlagging: true,
  approvalRequired: false,
  profanityFilter: true,
  photoReview: false,
  escalationEmails: true,
  slowMode: false
};

function ToggleRow({ title, description, enabled, onChange, disabled = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className={classNames(
          enabled ? 'bg-blue-600' : 'bg-slate-200',
          'relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-6' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </div>
  );
}

export default function AdminControlPanel() {
  const { tenantData, currentTenant, loading } = useTenant();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const { isAdmin, hasPermission, user } = usePermissions();

  const canManageTenant = useMemo(() => isAdmin() || hasPermission('manage_settings'), [hasPermission, isAdmin]);

  const [tenantForm, setTenantForm] = useState({
    name: tenantData?.name || '',
    tagline: tenantData?.tagline || '',
    description: tenantData?.description || '',
    contactEmail: tenantData?.contactEmail || tenantData?.contact_email || '',
    website: tenantData?.website || ''
  });

  useEffect(() => {
    setTenantForm({
      name: tenantData?.name || '',
      tagline: tenantData?.tagline || '',
      description: tenantData?.description || '',
      contactEmail: tenantData?.contactEmail || tenantData?.contact_email || '',
      website: tenantData?.website || ''
    });
  }, [tenantData]);

  const [sections, setSections] = useState(() =>
    SECTION_CATALOG.map((section) => ({
      ...section,
      enabled: !section.locked || section.id === 'dashboard' || section.id === 'admin'
    }))
  );

  const [newSection, setNewSection] = useState({ name: '', description: '' });
  const [userDirectory, setUserDirectory] = useState(DEFAULT_USER_DIRECTORY);
  const [moderationSettings, setModerationSettings] = useState(DEFAULT_MODERATION_SETTINGS);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [futureFeatures, setFutureFeatures] = useState(() =>
    FUTURE_FEATURE_CONTROLS.map((feature) => ({ ...feature, enabled: false }))
  );

  const tenantName = tenantForm.name || tenantData?.name || currentTenant || 'Your Tenant';

  const handleTenantFormChange = (field, value) => {
    setTenantForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTenantSettings = (event) => {
    event.preventDefault();
    showSuccess('Tenant profile updated. Changes will sync across the tenant moments from now.');
  };

  const handleToggleSection = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: section.locked ? true : !section.enabled }
          : section
      )
    );
  };

  const handleRemoveSection = (sectionId) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
    showInfo('Section removed. You can add it back anytime.');
  };

  const handleAddSection = () => {
    const trimmedName = newSection.name.trim();
    if (!trimmedName) {
      showError('Name your section before adding it to the tenant.');
      return;
    }

    const id = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (sections.some((section) => section.id === id)) {
      showError('That section already exists on your tenant.');
      return;
    }

    setSections((prev) => [
      ...prev,
      {
        id,
        name: trimmedName,
        description: newSection.description.trim() || 'Custom tenant experience block.',
        locked: false,
        enabled: true
      }
    ]);
    setNewSection({ name: '', description: '' });
    showSuccess('New section activated for your tenant experience.');
  };

  const handleRoleChange = (userId, role) => {
    setUserDirectory((prev) =>
      prev.map((member) => (member.id === userId ? { ...member, role } : member))
    );
    showSuccess('User permissions updated for this tenant.');
  };

  const handleToggleUserStatus = (userId) => {
    setUserDirectory((prev) =>
      prev.map((member) =>
        member.id === userId
          ? {
              ...member,
              status: member.status === 'active' ? 'suspended' : 'active'
            }
          : member
      )
    );
  };

  const handleBanUser = (userId) => {
    const userRecord = userDirectory.find((member) => member.id === userId);
    if (!userRecord) return;

    setBannedUsers((prev) => [{ ...userRecord, bannedAt: new Date().toISOString() }, ...prev]);
    setUserDirectory((prev) => prev.filter((member) => member.id !== userId));
    showWarning('User banned from this tenant. They will lose access immediately.');
  };

  const handleReinstateUser = (userId) => {
    const bannedRecord = bannedUsers.find((member) => member.id === userId);
    if (!bannedRecord) return;

    setUserDirectory((prev) => [
      { ...bannedRecord, status: 'active', lastActive: 'just now' },
      ...prev
    ]);
    setBannedUsers((prev) => prev.filter((member) => member.id !== userId));
    showSuccess('User reinstated with active access.');
  };

  const handleToggleModeration = (settingKey) => {
    setModerationSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey]
    }));
  };

  const handleToggleFutureFeature = (featureId) => {
    setFutureFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  if (!canManageTenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur shadow-xl p-10 text-center">
            <ShieldCheckIcon className="h-12 w-12 mx-auto text-blue-500" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Administrator access required</h1>
            <p className="mt-2 text-slate-500">
              The control panel is reserved for tenant administrators. If you believe this is an error,
              reach out to the leadership team for access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_55%)]" />
          <div className="relative px-8 py-12 sm:px-12 sm:py-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs uppercase tracking-wider backdrop-blur">
                  <CogBadge /> Control Center
                </span>
                <h1 className="text-4xl font-bold tracking-tight">
                  {tenantName} · Administrative Control Panel
                </h1>
                <p className="text-white/80 text-lg">
                  Orchestrate every feature, member, and policy for this tenant. Updates apply instantly across the experience, ensuring your community stays aligned.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-white/80">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <ShieldCheckIcon className="h-4 w-4" /> Role: {user?.role || 'admin'}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <BuildingOffice2Icon className="h-4 w-4" /> Tenant: {currentTenant || tenantData?.subdomain || 'Not selected'}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <SparklesIcon className="h-4 w-4" /> Future ready by design
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-[260px]">
                <div className="rounded-2xl bg-white/15 backdrop-blur p-6 shadow-xl border border-white/30">
                  <p className="text-sm uppercase tracking-wider text-white/70">Control Snapshot</p>
                  <dl className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-white/80">Enabled sections</dt>
                      <dd className="text-xl font-semibold">{sections.filter((section) => section.enabled).length}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-white/80">Active members</dt>
                      <dd className="text-xl font-semibold">{userDirectory.filter((member) => member.status === 'active').length}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-white/80">Moderation rules</dt>
                      <dd className="text-xl font-semibold">{Object.values(moderationSettings).filter(Boolean).length}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-white/80">Future toggles</dt>
                      <dd className="text-xl font-semibold">{futureFeatures.filter((feature) => feature.enabled).length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70">
            <header className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Tenant identity</h2>
                <p className="text-sm text-slate-500">Refresh branding, messaging, and public details for this tenant.</p>
              </div>
              <BuildingOffice2Icon className="h-8 w-8 text-blue-500" />
            </header>
            <form className="px-8 py-6 space-y-6" onSubmit={handleSaveTenantSettings}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Tenant name"
                  name="name"
                  required
                  value={tenantForm.name}
                  onChange={(event) => handleTenantFormChange('name', event.target.value)}
                  placeholder="Temple of Radiant Light"
                />
                <Input
                  label="Public contact email"
                  name="contactEmail"
                  type="email"
                  value={tenantForm.contactEmail}
                  onChange={(event) => handleTenantFormChange('contactEmail', event.target.value)}
                  placeholder="hello@temple3.org"
                />
              </div>
              <Input
                label="Tagline"
                name="tagline"
                value={tenantForm.tagline}
                onChange={(event) => handleTenantFormChange('tagline', event.target.value)}
                placeholder="Where mindfulness meets community."
              />
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  Tenant story
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={tenantForm.description}
                  onChange={(event) => handleTenantFormChange('description', event.target.value)}
                  placeholder="Share the heart of this tenant experience..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Input
                label="Website"
                name="website"
                value={tenantForm.website}
                onChange={(event) => handleTenantFormChange('website', event.target.value)}
                placeholder="https://temple3.org"
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Last synced moments ago. These details power landing pages, invites, and email templates.
                </div>
                <Button type="submit" variant="primary" className="shadow-lg shadow-blue-500/20">
                  Save updates
                </Button>
              </div>
            </form>
          </section>

          <section className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70">
            <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Moderation rules</h2>
                <p className="text-sm text-slate-500">Keep your tenant safe and aligned with community guidelines.</p>
              </div>
              <ShieldCheckIcon className="h-7 w-7 text-blue-500" />
            </header>
            <div className="px-6 py-5 divide-y divide-slate-200">
              <ToggleRow
                title="Auto-flag suspicious content"
                description="Leverages AI heuristics and tenant-specific keywords to pause risky submissions."
                enabled={moderationSettings.autoFlagging}
                onChange={() => handleToggleModeration('autoFlagging')}
              />
              <ToggleRow
                title="Require approval before publishing"
                description="Every post and upload is routed through your moderation queue."
                enabled={moderationSettings.approvalRequired}
                onChange={() => handleToggleModeration('approvalRequired')}
              />
              <ToggleRow
                title="Profanity and toxicity filter"
                description="Blocks offensive language across messages, posts, and media captions."
                enabled={moderationSettings.profanityFilter}
                onChange={() => handleToggleModeration('profanityFilter')}
              />
              <ToggleRow
                title="Manual review for media uploads"
                description="Uploads wait for human sign-off before reaching members."
                enabled={moderationSettings.photoReview}
                onChange={() => handleToggleModeration('photoReview')}
              />
              <ToggleRow
                title="Escalation email alerts"
                description="Send instant notifications to the admin cohort when something is flagged."
                enabled={moderationSettings.escalationEmails}
                onChange={() => handleToggleModeration('escalationEmails')}
              />
              <ToggleRow
                title="Slow mode for heated threads"
                description="Limit how frequently members can reply during high-volume discussions."
                enabled={moderationSettings.slowMode}
                onChange={() => handleToggleModeration('slowMode')}
              />
            </div>
          </section>
        </div>

        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 px-8 py-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Tenant sections & feature layout</h2>
              <p className="text-sm text-slate-500">Enable, disable, and curate the experiences surfaced to your members.</p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-500" />
          </header>
          <div className="px-8 py-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{section.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                    </div>
                    {!section.locked && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(section.id)}
                        className="text-slate-400 hover:text-red-500"
                        aria-label={`Remove ${section.name}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="mt-4">
                    <ToggleRow
                      title={section.enabled ? 'Section live' : 'Section hidden'}
                      description={section.locked ? 'Core infrastructure cannot be disabled.' : 'Toggle visibility for members instantly.'}
                      enabled={section.enabled}
                      onChange={() => handleToggleSection(section.id)}
                      disabled={section.locked}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-6">
              <h3 className="text-lg font-semibold text-blue-900">Add a new section</h3>
              <p className="mt-1 text-sm text-blue-800/80">Prototype new experiences with a single click. Sections can be reordered and customized later.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Section name"
                  name="sectionName"
                  value={newSection.name}
                  onChange={(event) => setNewSection((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Retreat Planning"
                  className="md:col-span-1"
                />
                <div className="md:col-span-2">
                  <label htmlFor="sectionDescription" className="block text-sm font-medium text-blue-900 mb-1">Description</label>
                  <textarea
                    id="sectionDescription"
                    value={newSection.description}
                    onChange={(event) => setNewSection((prev) => ({ ...prev, description: event.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-blue-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Offer curated journeys, resource packs, or campaigns."
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-blue-800/80">Members only see enabled sections. Drafts stay hidden until you toggle them on.</p>
                <Button type="button" onClick={handleAddSection} variant="primary" className="bg-blue-600/90 hover:bg-blue-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Launch section
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 px-8 py-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">User access, roles & bans</h2>
              <p className="text-sm text-slate-500">Invite, empower, or restrict members while keeping governance transparent.</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </header>
          <div className="px-8 py-6 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Member</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Last active</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {userDirectory.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-slate-900">{member.name}</div>
                        <div className="text-sm text-slate-500">{member.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={member.role}
                          onChange={(event) => handleRoleChange(member.id, event.target.value)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="clergy">Clergy</option>
                          <option value="member">Member</option>
                          <option value="guest">Guest</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={classNames(
                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                            member.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : member.status === 'invited'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          )}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{member.lastActive}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={member.status === 'active' ? 'outline' : 'success'}
                            onClick={() => {
                              handleToggleUserStatus(member.id);
                              showInfo(`User ${member.status === 'active' ? 'suspended' : 'reactivated'} for this tenant.`);
                            }}
                          >
                            {member.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => handleBanUser(member.id)}
                          >
                            Ban
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {userDirectory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                        Everyone here is currently banned. Reinstate a member below to bring them back.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <MegaphoneIcon className="h-5 w-5 text-blue-500" /> Broadcast permissions memo
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Send a snapshot of role changes and new privileges to your leaders. This keeps your governance transparent.
                </p>
                <Button
                  type="button"
                  onClick={() => showSuccess('A permissions summary will be emailed to tenant leads.')}
                  className="mt-4"
                >
                  Email summary
                </Button>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6">
                <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" /> Ban list
                </h3>
                {bannedUsers.length === 0 ? (
                  <p className="mt-2 text-sm text-red-800/80">No one is currently banned. Keep an eye on moderation alerts for potential escalations.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {bannedUsers.map((member) => (
                      <li key={member.id} className="flex flex-col rounded-xl bg-white/70 px-4 py-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-red-900">{member.name}</p>
                            <p className="text-xs text-red-700">{member.email}</p>
                          </div>
                          <span className="text-xs text-red-600">
                            Banned {new Date(member.bannedAt).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="mt-3"
                          onClick={() => handleReinstateUser(member.id)}
                        >
                          <ArrowUturnLeftIcon className="h-4 w-4 mr-1" /> Reinstate access
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 px-8 py-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Experience toggles & future features</h2>
              <p className="text-sm text-slate-500">Curate optional enhancements, experiments, and upcoming capabilities.</p>
            </div>
            <AdjustmentsHorizontalIcon className="h-8 w-8 text-blue-500" />
          </header>
          <Tab.Group>
            <Tab.List className="flex space-x-2 px-8 pt-6">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    selected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )
                }
              >
                Feature toggles
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    selected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )
                }
              >
                Future roadmap
              </Tab>
            </Tab.List>
            <Tab.Panels className="px-8 py-6">
              <Tab.Panel className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections
                    .filter((section) => !section.locked)
                    .map((section) => (
                      <div key={section.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                        <h3 className="text-lg font-semibold text-slate-900">{section.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">Configure advanced options for this feature.</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-500">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" defaultChecked />
                            Enable analytics overlay
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" defaultChecked={section.id !== 'messages'} />
                            Allow member contributions
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                            Gate with premium tier
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
              </Tab.Panel>
              <Tab.Panel className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {futureFeatures.map((feature) => (
                    <div key={feature.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{feature.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
                        </div>
                        <ToggleRow
                          title={feature.enabled ? 'Planned' : 'Backlog'}
                          description=""
                          enabled={feature.enabled}
                          onChange={() => handleToggleFutureFeature(feature.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-sm text-blue-900">
                  Future features live in a single roadmap so you can activate them the moment they ship. Toggle now to reserve early access for this tenant.
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </section>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500 shadow-inner">
            Refreshing tenant data…
          </div>
        )}
      </div>
    </div>
  );
}

function CogBadge() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
      <CogIcon />
    </span>
  );
}

function CogIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.75h4.5l.52 2.077a1.5 1.5 0 001.033 1.09l1.998.57-1.045 3.093a1.5 1.5 0 000 .93l1.045 3.093-1.998.57a1.5 1.5 0 00-1.033 1.09L14.25 20.25h-4.5l-.52-2.077a1.5 1.5 0 00-1.033-1.09l-1.998-.57 1.045-3.093a1.5 1.5 0 000-.93L6.699 7.487l1.998-.57a1.5 1.5 0 001.033-1.09L9.75 3.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
