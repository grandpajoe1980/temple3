'use client';

import React, { useMemo } from 'react';

type Tenant = {
  id: string;
  name?: string;
};

type User = {
  id?: string;
  isSuperAdmin?: boolean;
  roles?: string[];
};

type ControlPanelProps = {
  tenant: Tenant;
  currentUser?: User | null;
  onUpdate?: () => void;
  onImpersonate?: (userId: string) => void;
  onRefresh?: () => void;
};

const hasTenantAdminRole = (user: User | null | undefined, tenantId: string) => {
  if (!user?.roles) return false;
  return user.roles.includes(`tenant:${tenantId}:admin`) || user.roles.includes('admin');
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  tenant,
  currentUser,
  onUpdate,
  onImpersonate,
  onRefresh
}) => {
  const isAdmin = useMemo(() => {
    if (!tenant?.id) return false;
    const isSuperAdmin = Boolean(currentUser?.isSuperAdmin);
    const hasAdminRole = hasTenantAdminRole(currentUser, tenant.id);
    return isSuperAdmin || hasAdminRole;
  }, [currentUser, tenant?.id]);

  const heading = tenant?.name ? `${tenant.name} Control Panel` : 'Tenant Control Panel';

  if (!currentUser) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage this tenant. Administrative controls remain hidden until we can verify your role.
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <h2 className="text-lg font-semibold">Limited access</h2>
        <p className="mt-2 text-sm">
          You need tenant admin or super-admin privileges to configure settings. Ask an administrator to update your role.
        </p>
        <div className="mt-4 flex gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-amber-900 shadow-sm ring-1 ring-amber-200 hover:bg-white"
            >
              Refresh access
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tenant</p>
          <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
          <p className="text-sm text-slate-600">Configure membership, branding, and permissions for this tenant.</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200"
            >
              Refresh data
            </button>
          )}
          {onUpdate && (
            <button
              type="button"
              onClick={onUpdate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Save changes
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Membership</h3>
          <p className="mt-1 text-sm text-slate-600">Invite members, assign roles, and manage access.</p>
          {onImpersonate && (
            <button
              type="button"
              onClick={() => onImpersonate('')}
              className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Impersonate user
            </button>
          )}
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Branding</h3>
          <p className="mt-1 text-sm text-slate-600">Update tenant identity and appearance.</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
